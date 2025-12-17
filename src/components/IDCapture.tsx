import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import {
  BrowserMultiFormatReader,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
  MultiFormatReader,
} from "@zxing/library";

type ScanResult = {
  text: string;
  format?: string;
  parsed?: Record<string, string> | null;
};

type IDCaptureProps = {
  side?: "front" | "back";
  preferredFacingMode?: "environment" | "user";
  enableAutoScan?: boolean;
  liveScan?: boolean; // scan continuously while streaming
  liveScanInterval?: number; // ms between live scan attempts
  liveScanUntilDetected?: boolean; // stop live scanning after a code is detected
  instructions?: string;
  onCapture?: (dataUrl: string, scanResult?: ScanResult | null) => void;
};

// AAMVA/PDF417 parser (lightweight, tolerant)
export function parseAAMVA(raw: string): Record<string, string> | null {
  if (!raw || typeof raw !== "string") return null;
  // Try to find header indicative of AAMVA/ANSI payload
  const headerIndex = raw.search(/(ANSI |AAMVA|DL|ID)/);
  if (headerIndex === -1) return null;
  const payload = raw.substring(headerIndex);
  // Match 3-letter element IDs followed by any chars until next 3-letter ID
  const regex = /([A-Z]{3})([^A-Z]*)/g;
  const out: Record<string, string> = {};
  let m: RegExpExecArray | null;
  while ((m = regex.exec(payload))) {
    const key = m[1];
    const val = (m[2] || "").trim();
    if (key) out[key] = val;
  }
  // Map common fields into readable names if present
  if (Object.keys(out).length === 0) return null;
  if (out["DCS"] || out["DAC"] || out["DAA"]) {
    out["fullName"] = out["DAA"] || `${out["DAC"] || ""} ${out["DCS"] || ""}`.trim();
  }
  if (out["DBB"]) out["dob"] = out["DBB"];
  if (out["DAQ"]) out["licenseNumber"] = out["DAQ"];
  return out;
}

export default function IDCapture({
  side = "front",
  preferredFacingMode = "environment",
  enableAutoScan = true,
  liveScan = false,
  liveScanInterval = 800,
  liveScanUntilDetected = true,
  instructions,
  onCapture,
}: IDCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanningAvailable, setScanningAvailable] = useState<boolean | null>(null);
  const liveScanTimerRef = useRef<number | null>(null);
  const scanningInProgress = useRef(false);

  useEffect(() => {
    startCamera();
    return stopCamera;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manage live scanning while streaming
  useEffect(() => {
    if (!liveScan) return;
    if (!streaming) return;

    startLiveScanning();
    return stopLiveScanning;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveScan, streaming]);

  function startLiveScanning() {
    stopLiveScanning();
    liveScanTimerRef.current = window.setInterval(async () => {
      if (scanningInProgress.current) return;
      scanningInProgress.current = true;
      try {
        const video = videoRef.current;
        if (!video) return;
        const w = video.videoWidth || 1280;
        const h = video.videoHeight || 720;
        let canvas = canvasRef.current;
        if (!canvas) {
          canvas = document.createElement("canvas");
          canvasRef.current = canvas;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, w, h);
        const res = await tryScanFromCanvas(canvas, ctx);
        if (res) {
          setScanResult(res);
          onCapture?.(canvas.toDataURL("image/jpeg", 0.9), res);
          if (liveScanUntilDetected) stopLiveScanning();
        }
      } catch (err) {
        console.warn("live scan error", err);
      } finally {
        scanningInProgress.current = false;
      }
    }, liveScanInterval);
  }

  function stopLiveScanning() {
    if (liveScanTimerRef.current) {
      window.clearInterval(liveScanTimerRef.current);
      liveScanTimerRef.current = null;
    }
  }

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: preferredFacingMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (err: any) {
      setError(err?.message || "Unable to access camera");
      setStreaming(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreaming(false);
  }

  async function captureFrame() {
    setError(null);
    setScanResult(null);
    const video = videoRef.current;
    if (!video) return;

    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvasRef.current = canvas;
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCaptured(dataUrl);

    let result = null;
    if (enableAutoScan) {
      result = await tryScanFromCanvas(canvas, ctx);
      if (result) setScanResult(result);
    }

    // stop camera to save battery / privacy after capture
    stopCamera();
    onCapture?.(dataUrl, result ?? null);
  }

  async function tryScanFromCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    try {
      // First try jsQR (QR codes)
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          setScanningAvailable(true);
          const parsed = parseAAMVA(code.data);
          return { text: code.data, format: "QR", parsed };
        }
      } catch (e) {
        // jsQR failed — continue to ZXing
      }

      // Then try ZXing for broader barcode formats (PDF417, Code128, etc.)
      try {
        // Try the convenience canvas decoder first
        const reader = new BrowserMultiFormatReader();
        try {
          const res = await reader.decodeFromCanvas(canvas);
          if (res) {
            const text = res.getText ? res.getText() : (res as any).text;
            const format = (res as any).getBarcodeFormat ? (res as any).getBarcodeFormat().toString() : (res as any).format;
            setScanningAvailable(true);
            const parsed = parseAAMVA(text);
            return { text, format, parsed };
          }
        } catch (inner) {
          // decodeFromCanvas can fail silently — fall through to manual decode
          console.debug("ZXing decodeFromCanvas failed, falling back to manual decode", inner);
        }

        // Manual decode path using luminance source -> binarizer -> reader
        try {
          const imageData = (canvas.getContext("2d") as CanvasRenderingContext2D).getImageData(0, 0, canvas.width, canvas.height);
          const luminance = new RGBLuminanceSource(imageData.data, imageData.width, imageData.height);
          const bitmap = new BinaryBitmap(new HybridBinarizer(luminance));
          const mfReader = new MultiFormatReader();
          const result = mfReader.decode(bitmap);
          if (result) {
            const text = result.getText ? result.getText() : (result as any).text;
            const format = (result as any).getBarcodeFormat ? (result as any).getBarcodeFormat().toString() : (result as any).format;
            setScanningAvailable(true);
            const parsed = parseAAMVA(text);
            return { text, format, parsed };
          }
        } catch (manualErr) {
          console.debug("ZXing manual decode failed", manualErr);
        }
      } catch (e) {
        // ZXing top-level fail
        console.warn("ZXing path failed", e);
      }
    } catch (err) {
      console.warn("scan error", err);
    }

    setScanningAvailable(false);
    return null;
  }

  function retake() {
    setCaptured(null);
    setScanResult(null);
    startCamera();
  }

  

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Capture ID ({side})</strong>
      </div>
      {instructions ? <div style={{ marginBottom: 8 }}>{instructions}</div> : null}

      {error ? (
        <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>
      ) : null}

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          {!captured ? (
            <div>
              <video
                ref={videoRef}
                style={{ width: "100%", background: "#000" }}
                playsInline
                muted
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={captureFrame} disabled={!streaming}>
                  Capture
                </button>
                <button onClick={stopCamera} disabled={!streaming}>
                  Stop
                </button>
                <button onClick={startCamera} disabled={streaming}>
                  Start
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 8 }}>
                <img src={captured} alt="Captured" style={{ width: "100%" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onCapture?.(captured, scanResult)}>
                  Accept
                </button>
                <button onClick={retake}>Retake</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ width: 260 }}>
          <div style={{ marginBottom: 12 }}>
            <strong>Scan status</strong>
          </div>
          <div style={{ fontSize: 14, color: "#444" }}>
            {scanningAvailable === null && (
              <div>Scanner not checked yet — capture an image to attempt scan.</div>
            )}
            {scanningAvailable === false && (
              <div>
                No barcode/QR scanner libraries detected. To enable scanning, install
                <div style={{ marginTop: 8 }}>
                  <code>npm install jsqr @zxing/library</code>
                </div>
              </div>
            )}
            {scanResult ? (
              <div>
                <div style={{ fontWeight: 600 }}>Result</div>
                <div style={{ wordBreak: "break-all" }}>{scanResult.text}</div>
                <div style={{ color: "#666", marginTop: 6 }}>
                  Format: {scanResult.format ?? "unknown"}
                </div>
              </div>
            ) : (
              <div>No code found yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Meta, Story } from "@storybook/react";
import IDCapture from "./IDCapture";
import { parseAAMVA } from "./IDCapture";

export default {
  title: "Components/IDCapture",
  component: IDCapture,
  parameters: { layout: "padded" },
} as Meta;

const Template: Story<any> = (args) => <IDCapture {...args} />;

export const LiveCapture = Template.bind({});
LiveCapture.args = {
  side: "front",
  instructions:
    "Allow camera access and position the ID inside the frame. Tap Capture when ready.",
  enableAutoScan: true,
};

export const BackSide = Template.bind({});
BackSide.args = {
  side: "back",
  instructions: "Capture the back side. This may contain a barcode to scan.",
  enableAutoScan: true,
};

export const LiveContinuous = Template.bind({});
LiveContinuous.args = {
  side: "back",
  instructions: "Live scanning enabled: the component will attempt to decode barcodes while previewing.",
  liveScan: true,
  liveScanInterval: 700,
  enableAutoScan: true,
};

// A simple preview + simulated captured image story
export const PreviewCaptured: Story = () => {
  const sample =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='380'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='%23666'>Sample ID Preview</text></svg>";

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Captured Preview (example)</strong>
      </div>
      <img src={sample} alt="sample" style={{ width: "100%", border: "1px solid #ddd" }} />
    </div>
  );
};

export const NoScannerInstalled: Story = () => (
  <IDCapture
    side="back"
    instructions={
      "This render demonstrates a state where scanning libraries aren't installed. Capture an image to see the suggestion to install them."
    }
    enableAutoScan={true}
  />
);

export const ParserDemo: Story = () => {
  // A small, simplified sample of an AAMVA payload (illustrative only)
  const sample =
    "@\nANSI 636026080102DL00410286ZA03290015DLDAANAME,JOHN\nDACJOHN\nDCSDOE\nDBB19900101\nDAQ123456789012\n";
  const parsed = parseAAMVA(sample);
  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>AAMVA Parser Demo</strong>
      </div>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f7f7f7", padding: 12 }}>{JSON.stringify(parsed, null, 2)}</pre>
    </div>
  );
};

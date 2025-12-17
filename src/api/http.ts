type JsonObject = Record<string, unknown>;

function isObject(v: unknown): v is JsonObject {
  return typeof v === 'object' && v !== null;
}

export type ApiSuccess<T> = { success: true; data: T } & Record<string, unknown>;
export type ApiFailure =
  | ({ success: false; error?: string; message?: string } & Record<string, unknown>)
  | ({ success?: false; error?: string; message?: string } & Record<string, unknown>);
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.REACT_APP_API_BASE ||
    'http://localhost:3001'
  ).replace(/\/$/, '');
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init });
  const json: unknown = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, body: json };
  if (isObject(json) && json.success === false) throw { status: 200, body: json };
  return json as T;
}

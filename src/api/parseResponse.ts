import { clearLocalSession } from '../lib/session';

export function extractErr(data: Record<string, unknown>): string {
  const msg = data.message;
  if (typeof msg === 'string') return msg;
  if (Array.isArray(msg)) return msg.filter((x) => typeof x === 'string').join(', ');
  const errors = data.errors;
  if (errors && typeof errors === 'object') {
    const flat = Object.values(errors as Record<string, unknown>).flatMap((v) =>
      Array.isArray(v) ? v : [v],
    );
    const first = flat.find((x) => typeof x === 'string') as string | undefined;
    if (first) return first;
  }
  return '';
}

export async function parseJsonResponse<T>(
  res: Response,
): Promise<{ ok: true; data: T } | { ok: false; message: string; unauthorized?: boolean }> {
  let raw: Record<string, unknown> = {};
  try {
    const text = await res.text();
    if (text) raw = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* ignore */
  }

  if (res.status === 401 || res.status === 403) {
    clearLocalSession();
    return { ok: false, message: extractErr(raw) || 'Unauthorized', unauthorized: true };
  }

  if (!res.ok) {
    return { ok: false, message: extractErr(raw) || `HTTP ${res.status}` };
  }

  return { ok: true, data: raw as T };
}

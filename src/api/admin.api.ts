import { getApiBase } from '../config/api.config';
import type {
  ChangePasswordPayload,
  FetchCurrentAdminResult,
  LoginResult,
  StoredAdmin,
} from '../types/admin.types';
import {
  AUTH_ADMIN_KEY,
  AUTH_TOKEN_KEY,
  clearLocalSession,
  getAccessToken,
} from '../lib/session';
import { apiFetch } from './client';

function extractToken(data: Record<string, unknown>): string | null {
  if (typeof data.token === 'string') return data.token;
  if (typeof data.access_token === 'string') return data.access_token;
  const d = data.data as Record<string, unknown> | undefined;
  if (d && typeof d === 'object') {
    if (typeof d.token === 'string') return d.token;
    if (typeof d.access_token === 'string') return d.access_token;
  }
  return null;
}

function extractErrorMessage(data: Record<string, unknown>): string {
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

export async function loginAdmin(email: string, password: string): Promise<LoginResult> {
  const base = getApiBase();
  const res = await fetch(`${base}/admin/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  let data: Record<string, unknown> = {};
  try {
    const text = await res.text();
    if (text) data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const msg = extractErrorMessage(data) || `HTTP ${res.status}`;
    return { ok: false, message: msg };
  }

  const token = extractToken(data);
  if (!token) {
    return { ok: false, message: extractErrorMessage(data) || 'Invalid response: no token' };
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);

  const nested = data.data as Record<string, unknown> | undefined;
  const profile =
    (data.admin as Record<string, unknown> | undefined) ??
    (data.user as Record<string, unknown> | undefined) ??
    nested?.admin ??
    nested?.user;
  if (profile && typeof profile === 'object') {
    localStorage.setItem(AUTH_ADMIN_KEY, JSON.stringify(profile));
  } else {
    localStorage.removeItem(AUTH_ADMIN_KEY);
  }

  return { ok: true };
}

export async function logout(): Promise<void> {
  const token = getAccessToken();
  if (token) {
    try {
      await fetch(`${getApiBase()}/admin/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
    } catch {
      /* network failure — still clear client session */
    }
  }
  clearLocalSession();
}

export async function fetchCurrentAdmin(): Promise<FetchCurrentAdminResult> {
  const token = getAccessToken();
  if (!token) {
    return { ok: false, unauthorized: true };
  }

  const res = await apiFetch('/admin/me', { method: 'GET' });

  let data: Record<string, unknown> = {};
  try {
    const text = await res.text();
    if (text) data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* ignore */
  }

  if (res.status === 401 || res.status === 403) {
    clearLocalSession();
    return { ok: false, unauthorized: true };
  }

  if (!res.ok) {
    return { ok: false };
  }

  const adminRaw = data.admin;
  if (!adminRaw || typeof adminRaw !== 'object') {
    return { ok: false };
  }

  const admin = adminRaw as StoredAdmin;
  localStorage.setItem(AUTH_ADMIN_KEY, JSON.stringify(admin));
  return { ok: true, admin };
}

export async function changeAdminPassword(
  payload: ChangePasswordPayload,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const token = getAccessToken();
  if (!token) {
    return { ok: false, message: '', unauthorized: true };
  }

  const base = getApiBase();
  const res = await fetch(`${base}/admin/change-password`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let data: Record<string, unknown> = {};
  try {
    const text = await res.text();
    if (text) data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* ignore */
  }

  if (res.status === 401 || res.status === 403) {
    clearLocalSession();
    return {
      ok: false,
      message: extractErrorMessage(data) || `HTTP ${res.status}`,
      unauthorized: true,
    };
  }

  if (!res.ok) {
    return { ok: false, message: extractErrorMessage(data) || `HTTP ${res.status}` };
  }

  return { ok: true };
}

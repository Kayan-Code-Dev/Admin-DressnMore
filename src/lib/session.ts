import type { StoredAdmin } from '../types/admin.types';

export const AUTH_TOKEN_KEY = 'dressnmore_admin_token';

/** JSON of `StoredAdmin` from login / `/admin/me` */
export const AUTH_ADMIN_KEY = 'dressnmore_admin_profile';

export function getAccessToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function clearLocalSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ADMIN_KEY);
  localStorage.removeItem('dressnmore_admin_user');
  localStorage.removeItem('dressnmore_admin_auth');
}

export function getStoredAdmin(): StoredAdmin | null {
  const raw = localStorage.getItem(AUTH_ADMIN_KEY);
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as unknown;
    if (o && typeof o === 'object' && 'email' in o && 'id' in o) {
      return o as StoredAdmin;
    }
  } catch {
    /* ignore */
  }
  return null;
}

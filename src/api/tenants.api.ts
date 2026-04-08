import type {
  CreateTenantPayload,
  Tenant,
  TenantsListResponse,
  UpdateTenantPayload,
} from '../types/tenant.types';
import { apiFetch } from './client';
import { parseJsonResponse } from './parseResponse';

export async function fetchTenantsList(
  page: number,
  perPage = 15,
): Promise<
  | { ok: true; list: TenantsListResponse }
  | { ok: false; message: string; unauthorized?: boolean }
> {
  const res = await apiFetch(`/tenants?per_page=${perPage}&page=${page}`);
  const out = await parseJsonResponse<TenantsListResponse>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true, list: out.data };
}

export async function fetchTenant(
  tenantId: string,
): Promise<
  | { ok: true; tenant: Tenant }
  | { ok: false; message: string; unauthorized?: boolean }
> {
  const res = await apiFetch(`/tenants/${encodeURIComponent(tenantId)}`);
  const out = await parseJsonResponse<Tenant>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true, tenant: out.data };
}

export async function createTenant(
  payload: CreateTenantPayload,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch('/tenants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

export async function updateTenant(
  tenantId: string,
  payload: UpdateTenantPayload,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/tenants/${encodeURIComponent(tenantId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

export async function toggleTenantActive(
  tenantId: string,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/tenants/${encodeURIComponent(tenantId)}/toggle-active`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

export async function addTenantDomain(
  tenantId: string,
  domain: string,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/tenants/${encodeURIComponent(tenantId)}/domains`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: domain.trim() }),
  });
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

export async function deleteTenantDomain(
  tenantId: string,
  domainId: number,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(
    `/tenants/${encodeURIComponent(tenantId)}/domains/${encodeURIComponent(String(domainId))}`,
    { method: 'DELETE' },
  );
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

export async function migrateTenant(
  tenantId: string,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/tenants/${encodeURIComponent(tenantId)}/migrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

export async function seedTenant(
  tenantId: string,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/tenants/${encodeURIComponent(tenantId)}/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

export async function deleteTenant(
  tenantId: string,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/tenants/${encodeURIComponent(tenantId)}`, {
    method: 'DELETE',
  });
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

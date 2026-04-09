import type {
  AdminPlan,
  AdminPlansListResponse,
  CreatePlanPayload,
  UpdatePlanPayload,
} from '../types/plan.types';
import { apiFetch } from './client';
import { parseJsonResponse } from './parseResponse';

function unwrapPlanResource(body: unknown): AdminPlan {
  if (body && typeof body === 'object' && body !== null) {
    const o = body as Record<string, unknown>;
    const inner = o.data;
    if (
      inner &&
      typeof inner === 'object' &&
      !Array.isArray(inner) &&
      ('id' in inner || 'title' in inner)
    ) {
      return inner as AdminPlan;
    }
  }
  return body as AdminPlan;
}

export async function fetchPlansList(
  page: number,
  perPage = 15,
): Promise<
  | { ok: true; list: AdminPlansListResponse }
  | { ok: false; message: string; unauthorized?: boolean }
> {
  const res = await apiFetch(`/admin/plans?per_page=${perPage}&page=${page}`);
  const out = await parseJsonResponse<AdminPlansListResponse>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true, list: out.data };
}

export async function fetchPlan(
  planId: number,
): Promise<
  | { ok: true; plan: AdminPlan }
  | { ok: false; message: string; unauthorized?: boolean }
> {
  const res = await apiFetch(`/admin/plans/${encodeURIComponent(String(planId))}`);
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true, plan: unwrapPlanResource(out.data) };
}

export async function createPlan(
  payload: CreatePlanPayload,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch('/admin/plans', {
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

export async function updatePlan(
  planId: number,
  payload: UpdatePlanPayload,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/admin/plans/${encodeURIComponent(String(planId))}`, {
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

export async function deletePlan(
  planId: number,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/admin/plans/${encodeURIComponent(String(planId))}`, {
    method: 'DELETE',
  });
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

import type {
  AdminOrderPlanDetail,
  AdminOrderPlansListResponse,
  PatchOrderPlanStatusPayload,
} from '../types/orderPlan.types';
import { apiFetch } from './client';
import { parseJsonResponse } from './parseResponse';

function unwrapOrderPlanResource(body: unknown): AdminOrderPlanDetail {
  if (body && typeof body === 'object' && body !== null) {
    const o = body as Record<string, unknown>;
    const inner = o.data;
    if (
      inner &&
      typeof inner === 'object' &&
      !Array.isArray(inner) &&
      ('id' in inner || 'tenant_id' in inner)
    ) {
      return inner as AdminOrderPlanDetail;
    }
  }
  return body as AdminOrderPlanDetail;
}

export async function fetchOrderPlansList(
  page: number,
  perPage = 15,
  opts?: { status?: string },
): Promise<
  | { ok: true; list: AdminOrderPlansListResponse }
  | { ok: false; message: string; unauthorized?: boolean }
> {
  const qs = new URLSearchParams({ per_page: String(perPage), page: String(page) });
  if (opts?.status) qs.set('status', opts.status);
  const res = await apiFetch(`/admin/order-plans?${qs.toString()}`);
  const out = await parseJsonResponse<AdminOrderPlansListResponse>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true, list: out.data };
}

export async function fetchOrderPlan(
  orderPlanId: number,
): Promise<
  | { ok: true; orderPlan: AdminOrderPlanDetail }
  | { ok: false; message: string; unauthorized?: boolean }
> {
  const res = await apiFetch(`/admin/order-plans/${encodeURIComponent(String(orderPlanId))}`);
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true, orderPlan: unwrapOrderPlanResource(out.data) };
}

export async function patchOrderPlanStatus(
  orderPlanId: number,
  payload: PatchOrderPlanStatusPayload,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/admin/order-plans/${encodeURIComponent(String(orderPlanId))}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true };
}

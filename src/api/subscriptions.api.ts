import type {
  AdminSubscriptionDetail,
  AdminSubscriptionsListResponse,
  PatchSubscriptionStatusPayload,
} from '../types/subscription.types';
import { apiFetch } from './client';
import { parseJsonResponse } from './parseResponse';

function unwrapSubscriptionDetail(body: unknown): AdminSubscriptionDetail {
  if (body && typeof body === 'object' && body !== null) {
    const o = body as Record<string, unknown>;
    const inner = o.data;
    if (
      inner &&
      typeof inner === 'object' &&
      !Array.isArray(inner) &&
      ('id' in inner || 'tenant_id' in inner)
    ) {
      return inner as AdminSubscriptionDetail;
    }
  }
  return body as AdminSubscriptionDetail;
}

export async function fetchSubscriptionsList(
  page: number,
  perPage = 15,
  opts?: { status?: string },
): Promise<
  | { ok: true; list: AdminSubscriptionsListResponse }
  | { ok: false; message: string; unauthorized?: boolean }
> {
  const qs = new URLSearchParams({
    per_page: String(perPage),
    page: String(page),
  });
  if (opts?.status) qs.set('status', opts.status);
  const res = await apiFetch(`/admin/subscriptions?${qs.toString()}`);
  const out = await parseJsonResponse<AdminSubscriptionsListResponse>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true, list: out.data };
}

export async function fetchSubscription(
  subscriptionId: number,
): Promise<
  | { ok: true; subscription: AdminSubscriptionDetail }
  | { ok: false; message: string; unauthorized?: boolean }
> {
  const res = await apiFetch(`/admin/subscriptions/${encodeURIComponent(String(subscriptionId))}`);
  const out = await parseJsonResponse<Record<string, unknown>>(res);
  if (out.ok === false) {
    return { ok: false, message: out.message, unauthorized: out.unauthorized };
  }
  return { ok: true, subscription: unwrapSubscriptionDetail(out.data) };
}

export async function patchSubscriptionStatus(
  subscriptionId: number,
  payload: PatchSubscriptionStatusPayload,
): Promise<{ ok: true } | { ok: false; message: string; unauthorized?: boolean }> {
  const res = await apiFetch(`/admin/subscriptions/${encodeURIComponent(String(subscriptionId))}`, {
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

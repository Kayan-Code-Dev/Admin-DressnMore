import type { AdminPlan } from './plan.types';

export type OrderPlanStatusValue = 'approved' | 'rejected';

/** Row from GET /admin/order-plans */
export type AdminOrderPlan = {
  id: number;
  name: string;
  phone: string;
  email: string;
  plan_id: number;
  status: OrderPlanStatusValue | string;
  tenant_id: string;
  subscription_id: number;
  created_at: string;
  updated_at: string;
  plan: AdminPlan;
};

export type AdminOrderPlansListResponse = {
  current_page: number;
  data: AdminOrderPlan[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

/** GET /admin/order-plans/:id */
export type AdminOrderPlanDetail = AdminOrderPlan;

export type PatchOrderPlanStatusPayload = {
  status: OrderPlanStatusValue | string;
};

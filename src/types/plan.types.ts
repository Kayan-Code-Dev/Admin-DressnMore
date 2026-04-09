/** Matches GET /admin/plans and GET /admin/plans/:id plan resource. */
export type AdminPlan = {
  id: number;
  title: string;
  description: string;
  days: number;
  price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminPlansListResponse = {
  current_page: number;
  data: AdminPlan[];
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

/** POST /admin/plans — backend accepts string fields per API examples. */
export type CreatePlanPayload = {
  title: string;
  description: string;
  days: string;
  price: string;
};

/** PUT /admin/plans/:id */
export type UpdatePlanPayload = {
  title: string;
  description: string;
  days: string;
  price: string;
  is_active: boolean;
};

export type TenantDomain = {
  id: number;
  domain: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
};

/** Matches GET /tenants and GET /tenants/:id tenant resource. */
export type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  domains: TenantDomain[];
  /** Present only on some API versions / legacy payloads */
  trial_ends_at?: string | null;
  admin_name?: string;
  admin_email?: string;
  tenancy_db_name?: string;
  data?: unknown;
};

export type TenantsListResponse = {
  current_page: number;
  data: Tenant[];
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

export type CreateTenantPayload = {
  name: string;
  email: string;
  domain: string;
  password: string;
  phone: string;
};

export type UpdateTenantPayload = {
  name: string;
};

export type AddDomainPayload = {
  domain: string;
};

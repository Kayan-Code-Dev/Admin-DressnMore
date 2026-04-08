export type TenantDomain = {
  id: number;
  domain: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
};

export type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  plan: string;
  is_active: boolean;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
  data: unknown;
  admin_name: string;
  admin_email: string;
  admin_password?: string;
  tenancy_db_name?: string;
  domains: TenantDomain[];
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
  admin_name: string;
  admin_email: string;
  admin_password: string;
  plan: string;
  trial_days: number;
};

export type UpdateTenantPayload = {
  name: string;
  plan: string;
};

export type AddDomainPayload = {
  domain: string;
};

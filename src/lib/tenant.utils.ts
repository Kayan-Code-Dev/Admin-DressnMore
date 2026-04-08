import type { Tenant } from '../types/tenant.types';

export function tenantRowStatus(tenant: Tenant): 'active' | 'suspended' | 'trial' {
  if (!tenant.is_active) return 'suspended';
  if (tenant.trial_ends_at) {
    const end = new Date(tenant.trial_ends_at).getTime();
    if (!Number.isNaN(end) && end > Date.now()) return 'trial';
  }
  return 'active';
}

export function primaryDomain(tenant: Tenant): string {
  return tenant.domains?.[0]?.domain ?? '—';
}

export function formatTenantDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

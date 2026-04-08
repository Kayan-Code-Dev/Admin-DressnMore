/**
 * Host used to build tenant storefront URLs: `https://{slug}.{host}`
 * Override with `VITE_TENANT_PORTAL_HOST` (e.g. dressnmore.it.com).
 */
export function getTenantPortalBaseHost(): string {
  const raw = import.meta.env.VITE_TENANT_PORTAL_HOST as string | undefined;
  return (raw?.trim() || 'dressnmore.it.com').replace(/^\.+/, '');
}

/** e.g. `ahmad` → `https://ahmad.dressnmore.it.com` */
export function buildTenantPortalUrl(domainSlug: string): string | null {
  const slug = domainSlug.trim();
  if (!slug) return null;
  const host = getTenantPortalBaseHost();
  return `https://${slug}.${host}`;
}

/** API may store a slug or an absolute URL. */
export function resolveTenantPortalUrl(domain: string): string | null {
  const d = domain.trim();
  if (!d) return null;
  if (/^https?:\/\//i.test(d)) return d;
  return buildTenantPortalUrl(d);
}

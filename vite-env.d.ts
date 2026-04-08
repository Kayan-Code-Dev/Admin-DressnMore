/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  /** Tenant storefront host (e.g. dressnmore.it.com). URLs: https://{slug}.{host} */
  readonly VITE_TENANT_PORTAL_HOST?: string;
}

declare const __BASE_PATH__: string;
declare const __IS_PREVIEW__: boolean;
declare const __READDY_PROJECT_ID__: string;
declare const __READDY_VERSION_ID__: string;
declare const __READDY_AI_DOMAIN__: string;
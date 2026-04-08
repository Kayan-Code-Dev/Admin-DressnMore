const DEFAULT_API_BASE = 'https://alhatoum.dressnmore.it.com/api/v1';

export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (raw?.replace(/\/$/, '') || DEFAULT_API_BASE).replace(/\/$/, '');
}

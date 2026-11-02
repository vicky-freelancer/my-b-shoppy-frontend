// Base URL for the Express backend (Razorpay orders + verification).
// - Dev: leave VITE_API_URL unset → calls go to the Vite proxy (localhost:5000).
// - Prod: set VITE_API_URL=https://api.mybshoppy.com at build time.
const env = (import.meta.env ?? {}) as Record<string, string | undefined>;
const apiBase = (env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ?? (import.meta.env?.PROD ? 'https://api.mybshoppy.com' : '');


export function apiUrl(path: string): string {
  return `${apiBase}${path}`;
}

export function mediaUrl(path?: string | null): string {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (!apiBase) return path;
  return `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;
}
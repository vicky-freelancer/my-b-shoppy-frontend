// Base URL for the Express backend (Razorpay orders + verification).
// - Dev: leave VITE_API_URL unset → calls go to the Vite proxy (localhost:5000).
// - Prod: set VITE_API_URL=https://api.mybshoppy.com at build time.
const env = (import.meta.env ?? {}) as Record<string, string | undefined>;
const apiBase = (env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ?? (typeof window !== 'undefined' && window.location.hostname === 'mybshoppy.com' ? 'https://api.mybshoppy.com' : '');

// Optional origin for admin-uploaded media (e.g. https://admin.mybshoppy.com).
// Falls back to the API origin, then to the current site for relative paths.
const mediaBase =
  (env.VITE_MEDIA_URL as string | undefined)?.replace(/\/+$/, '') ?? apiBase;

export function apiUrl(path: string): string {
  return `${apiBase}${path}`;
}

export function mediaUrl(path?: string | null): string {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (!mediaBase) return path;
  return `${mediaBase}${path.startsWith('/') ? '' : '/'}${path}`;
}
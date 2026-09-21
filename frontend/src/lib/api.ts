// Base URL for the Express backend (Razorpay orders + verification).
// - Dev: leave VITE_API_URL unset → calls go to the Vite proxy (localhost:5000).
// - Prod: set VITE_API_URL=https://api.mybshoppy.com at build time.
const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

export function apiUrl(path: string): string {
  return `${apiBase}${path}`;
}
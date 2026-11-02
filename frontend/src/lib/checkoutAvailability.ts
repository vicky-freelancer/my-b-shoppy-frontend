import { apiUrl } from './api';

export const CHECKOUT_UNAVAILABLE_MESSAGE = 'Online checkout is temporarily unavailable. Your cart and entered details have not been cleared. If you already paid, keep your payment reference and contact support; do not pay again.';

export class CheckoutUnavailableError extends Error {
  readonly code = 'CHECKOUT_TEMPORARILY_UNAVAILABLE';
  constructor() { super(CHECKOUT_UNAVAILABLE_MESSAGE); this.name = 'CheckoutUnavailableError'; }
}

// Public availability only. No backend flag, private key, or environment value
// is imported into Vite. Unknown, malformed, failed and timed-out reads disable.
export async function getCheckoutAvailability(signal?: AbortSignal): Promise<{ enabled: boolean }> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, 5000);
  try {
    const response = await fetch(apiUrl('/api/checkout/status'), {
      method: 'GET', cache: 'no-store', signal: controller.signal, headers: { Accept: 'application/json' },
    });
    if (!response.ok) return { enabled: false };
    const body = await response.json();
    return { enabled: !!body && !Array.isArray(body) && body.enabled === true };
  } catch { return { enabled: false }; }
  finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}

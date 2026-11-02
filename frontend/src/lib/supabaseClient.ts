import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { STORE_CONFIG } from '../storeConfig';
import { OrderFormData } from '../types';

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = STORE_CONFIG.supabase.url;
  const key = STORE_CONFIG.supabase.publishableKey;

  if (!url || !key || url.trim() === '' || key.trim() === '' || url.includes('placeholder')) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          fetch: (input: RequestInfo | URL, init?: RequestInit) => window.fetch(input, init),
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return clientInstance;
}

/**
 * Legacy browser order writes are disabled independently of availability.
 * Never restore direct inserts when reopening checkout: Step 2B must persist
 * orders and finalization through the trusted transactional backend instead.
 * Existing in-memory paid-order details remain with the caller for support.
 */
export async function submitOrder(_orderData: OrderFormData): Promise<{ success: boolean; error?: string; orderId?: string; code?: string }> {
  return {
    success: false,
    code: 'CLIENT_ORDER_WRITES_DISABLED',
    error: 'Orders must be recorded by the secure payment service. If you already paid, retain your payment reference and contact support; do not pay again.',
  };
}

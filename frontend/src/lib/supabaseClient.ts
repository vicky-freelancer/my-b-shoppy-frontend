import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { STORE_CONFIG } from '../storeConfig';
import { OrderFormData, ProductItem } from '../types';

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
 * Slugify a display category name to a storefront category id.
 * e.g. "Hair Accessories" -> "hair-accessories" (matches CATEGORIES_CATALOG ids).
 */
function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse a variants column into a string array (supports JSONB arrays, JSON
 * strings, comma-separated strings, and Postgres text arrays).
 */
function parseVariants(raw: any): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return ['Standard'];
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map((s) => s.replace(/^"|"$/g, '').trim())
        .filter(Boolean);
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // fall through
    }
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (raw && typeof raw === 'object') {
    return Object.values(raw).map(String);
  }
  return ['Standard'];
}

const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';

/**
 * Fetch products directly from Supabase `products` table if available.
 * Works with BOTH the storefront column set (name/price/in_stock) and the
 * admin dashboard column set (title/sale_price/cover_image/quantity/stock).
 */
export async function fetchSupabaseProducts(): Promise<{ data: ProductItem[] | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: 'Supabase client not initialized' };
    }

    const { data, error } = await supabase
      .from(STORE_CONFIG.supabase.productsTableName || 'products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.info('Notice from Supabase fetch products:', error.message);
      return { data: null, error: error.message };
    }

    if (data && data.length > 0) {
      const mapped: ProductItem[] = data.map((row: any) => {
        const stockQty = Number(row.quantity ?? row.stock ?? 1);
        return {
          id: row.slug || String(row.id),
          name: row.name || row.title || 'Product',
          subtitle: row.subtitle || '',
          price: Number(row.price) || Number(row.sale_price) || 0,
          originalPrice: row.original_price
            ? Number(row.original_price)
            : row.mrp
            ? Number(row.mrp)
            : undefined,
          imageUrl: row.image_url || row.cover_image || row.imageUrl || DEFAULT_PRODUCT_IMAGE,
          category: row.category || 'Artificial Jewels',
          categoryId:
            row.category_id ||
            slugifyCategory(row.category || '') ||
            row.categoryId ||
            'artificial-jewels',
          badge: row.badge || undefined,
          rating: Number(row.rating) || 5,
          reviewsCount: Number(row.reviews_count || row.reviewsCount) || 12,
          material: row.material || undefined,
          stone: row.stone || undefined,
          variants: parseVariants(row.variants),
          description: row.description || '',
          inStock: row.in_stock !== false && stockQty > 0,
          isSupabaseSynced: true,
          created_at: row.created_at,
        };
      });
      return { data: mapped, error: null };
    }

    return { data: [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { data: null, error: message };
  }
}

/**
 * Push or seed products to Supabase `products` table.
 * Uses the shared `slug` column (unique index added by the unified SQL) as a
 * stable conflict key, and writes BOTH the storefront and admin column sets so
 * the admin dashboard always sees correct stock/prices.
 */
export async function seedProductsToSupabase(products: ProductItem[]): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: 'Supabase credentials missing or invalid in storeConfig.ts' };
    }

    const payload = products.map((p) => {
      const stockQty = p.inStock === false ? 0 : 50;
      return {
        slug: p.id,
        sku: p.id,
        title: p.name,
        name: p.name,
        subtitle: p.subtitle,
        price: p.price,
        sale_price: p.price,
        mrp: p.originalPrice || p.price,
        original_price: p.originalPrice || null,
        image_url: p.imageUrl,
        cover_image: p.imageUrl,
        category: p.category,
        category_id: p.categoryId,
        badge: p.badge || null,
        rating: p.rating,
        reviews_count: p.reviewsCount,
        material: p.material || null,
        stone: p.stone || null,
        variants: p.variants,
        description: p.description,
        quantity: stockQty,
        stock: stockQty,
        in_stock: p.inStock !== false,
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await supabase
      .from(STORE_CONFIG.supabase.productsTableName || 'products')
      .upsert(payload, { onConflict: 'slug' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, count: payload.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error syncing products to Supabase';
    return { success: false, error: message };
  }
}

/**
 * Inserts a new paid (online) order into the Supabase database.
 * Called only AFTER the Razorpay payment has been verified server-side.
 *
 * The insert is adaptive: it first tries the full payload (online-payment
 * columns), then the admin "core" price columns, then a minimal fallback.
 * Previously a single failed insert was swallowed and reported as success,
 * which silently dropped storefront orders from the dashboard. Now a real
 * failure returns `success:false` so the UI can surface it to the customer.
 */
export async function submitOrder(orderData: OrderFormData): Promise<{ success: boolean; error?: string; orderId?: string }> {
  // Fallback generated ID for immediate responsive client confirmation
  const generatedRef = `MBS-${Math.floor(100000 + Math.random() * 900000)}`;

  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('Supabase not configured, providing local order reference');
    return {
      success: true,
      orderId: generatedRef,
    };
  }

  try {
    const quantity = Math.max(1, Number(orderData.quantity) || 1);
    const totalAmount = Number(orderData.total_amount) || 0;
    const unitPrice = Math.round(totalAmount / quantity);
    const now = new Date().toISOString();

    const base = {
      customer_name: orderData.customer_name.trim(),
      phone: orderData.phone.trim(),
      email: orderData.email ? orderData.email.trim() : null,
      city: orderData.city.trim(),
      address: orderData.address.trim(),
      category: orderData.category || 'General',
      product_variant: orderData.product_variant,
      quantity,
      notes: orderData.notes ? orderData.notes.trim() : null,
      status: 'confirmed',
      payment_method: 'Online (Razorpay)',
      created_at: now,
    };

    // Tier 1: full payload including online-payment + storefront columns
    const fullPayload = {
      ...base,
      country: orderData.country.trim(),
      product_name: orderData.product_name,
      amount: totalAmount,
      total_amount: totalAmount,
      price_per_unit: unitPrice,
      sale_price: unitPrice,
      price: unitPrice,
      items_summary: orderData.items_summary || null,
      razorpay_order_id: orderData.razorpay_order_id || null,
      razorpay_payment_id: orderData.razorpay_payment_id || null,
      razorpay_signature: orderData.razorpay_signature || null,
    };

    // Tier 2: admin "core" pricing columns (no country/total_amount/razorpay)
    const corePayload = {
      ...base,
      product_name: orderData.product_name,
      amount: totalAmount,
      price_per_unit: unitPrice,
    };

    // Tier 3: minimal columns that exist in every old orders table
    const minimalPayload = { ...base };

    const attempts: { label: string; payload: Record<string, unknown> }[] = [
      { label: 'full', payload: fullPayload },
      { label: 'core', payload: corePayload },
      { label: 'minimal', payload: minimalPayload },
    ];

    let lastError: string | null = null;
    for (const attempt of attempts) {
      const { error } = await supabase
        .from(STORE_CONFIG.supabase.tableName)
        .insert([attempt.payload]);

      if (!error) {
        return { success: true, orderId: generatedRef };
      }
      lastError = error.message;
      console.warn(`Supabase order insert (${attempt.label}) failed:`, error.message);
    }

    console.error('Supabase order insert failed on all attempts:', lastError);
    return {
      success: false,
      error:
        lastError ||
        'Your payment was received but the order could not be saved. Please contact support with your order reference.',
      orderId: generatedRef,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error during order submission';
    console.error('Unexpected error during order submission:', err);
    return { success: false, error: message, orderId: generatedRef };
  }
}


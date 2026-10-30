import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { STORE_CONFIG, CATEGORIES_CATALOG } from '../storeConfig';
import { OrderFormData, ProductItem, SubcategoryItem } from '../types';

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

/** Keep products from legacy category ids mapped to the current catalogue. */
const CATEGORY_ID_ALIASES: Record<string, string> = {
  'artificial-jewels': 'ad-jewellery',
  'artificial-jewellery': 'ad-jewellery',
  necklaces: 'anti-tarnish-jewellery',
  'anti-tarnish': 'anti-tarnish-jewellery',
  rings: 'ad-jewellery',
  earrings: 'ear-rings',
  bracelets: 'ad-jewellery',
  'mobile-charm': 'mobile-charms',
  'key-chain': 'key-chains',
  'keychains': 'key-chains',
  'mens-collection': 'men-accessories',
  'mens-accessories': 'men-accessories',
  'men-s-accessories': 'men-accessories',
  'bow-and-scrunchies': 'bows-and-scrunchies',
  bows: 'bows-and-scrunchies',
  scrunchies: 'bows-and-scrunchies',
  handbags: 'bags',
  'hand-bags': 'bags',
  'stationery-gift-items': 'stationery-and-gifts',
};

const ALLOWED_CATEGORY_IDS = CATEGORIES_CATALOG.map((category) => category.id);

function resolveCategoryId(value: string): string {
  const normalized = value.trim();
  if (!normalized) return '';
  const slug = slugifyCategory(normalized);
  return CATEGORY_ID_ALIASES[normalized] || CATEGORY_ID_ALIASES[slug] || slug;
}

const CATEGORY_NAME_ALIASES: Record<string, string> = {
  'artificial jewels': 'AD Jewellery',
  'artificial jewellery': 'AD Jewellery',
  necklaces: 'Anti Tarnish Jewellery',
  'anti tarnish': 'Anti Tarnish Jewellery',
  rings: 'AD Jewellery',
  earrings: 'Ear Rings',
  bracelets: 'AD Jewellery',
  'mobile charms': 'Mobile charms',
  'mobile charm': 'Mobile charms',
  'key chains': 'Key chains',
  'mens collection': 'Men accessories',
  bows: 'Bows & Scrunchies',
  scrunchies: 'Bows & Scrunchies',
  handbags: 'Bags',
  'hand bags': 'Bags',
  'stationery gift items': 'Stationery and Gifts',
  'stationary and gifts': 'Stationery and Gifts',
};

function resolveCategoryName(value: string): string {
  return CATEGORIES_CATALOG.find((category) => category.id === resolveCategoryId(value))?.name ||
    CATEGORY_NAME_ALIASES[value.trim().toLowerCase()] || value;
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
        const stockQtyRaw = row.quantity ?? row.stock ?? row.qty ?? row.Quantity ?? row.Stock ?? row.Qty ?? row.IN_STOCK_QTY ?? row.inStockQty;
        const stockQty = stockQtyRaw === undefined || stockQtyRaw === null ? 1 : Number(stockQtyRaw);
        const inStockRaw = row.in_stock ?? row.inStock ?? row.IN_STOCK ?? row.stock_status ?? row.status;
        const inStockByFlag = inStockRaw === undefined || inStockRaw === null
          ? undefined
          : typeof inStockRaw === 'boolean'
            ? inStockRaw
            : typeof inStockRaw === 'string'
              ? !['false', '0', 'out of stock', 'sold out', 'unavailable'].includes(inStockRaw.toLowerCase().trim())
              : Number(inStockRaw) !== 0;
        const inStock = inStockByFlag === undefined ? stockQty > 0 : inStockByFlag && stockQty > 0;
        return {
          id: row.slug || row.Slug || String(row.id || row.ID),
          name: row.name || row.title || row.Name || row.Title || 'Product',
          subtitle: row.subtitle || row.Subtitle || '',
          price: Number(row.price) || Number(row.sale_price) || Number(row.Price) || Number(row.SalePrice) || 0,
          originalPrice: row.original_price
            ? Number(row.original_price)
            : row.mrp
            ? Number(row.mrp)
            : row.originalPrice
            ? Number(row.originalPrice)
            : row.MRP
            ? Number(row.MRP)
            : undefined,
          imageUrl: row.image_url || row.cover_image || row.imageUrl || row.ImageURL || row.image || DEFAULT_PRODUCT_IMAGE,
          category: resolveCategoryName(row.category_id || row.categoryId || row.category || row.Category || '') || 'AD Jewellery',
          categoryId: resolveCategoryId(
            row.category_id ||
              row.categoryId ||
              slugifyCategory(row.category || row.Category || '') ||
              'ad-jewellery'
          ),
          subcategory: row.subcategory || row.Subcategory || undefined,
          subcategoryId:
            row.subcategory_id !== undefined && row.subcategory_id !== null
              ? String(row.subcategory_id)
              : row.subcategoryId !== undefined && row.subcategoryId !== null
              ? String(row.subcategoryId)
              : undefined,
          badge: (() => {
            const b = row.badge ?? row.Badge ?? row.promotion_tag ?? row.promotionTag ?? row.tag ?? row.tags ?? row.PromotionTag ?? row.Badges ?? row.badges;
            if (Array.isArray(b)) return b[0] ? String(b[0]) : undefined;
            if (typeof b === 'string' && b.trim() === '') return undefined;
            if (b == null) return undefined;
            return String(b);
          })(),
          rating: Number(row.rating) || Number(row.Rating) || 5,
          reviewsCount: Number(row.reviews_count || row.reviewsCount || row.ReviewsCount) || 12,
          material: row.material || row.Material || undefined,
          stone: row.stone || row.Stone || undefined,
          variants: parseVariants(row.variants || row.Variants),
          description: row.description || row.Description || '',
          inStock,
          isSupabaseSynced: true,
          created_at: row.created_at || row.createdAt,
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
 * Fetch active subcategories from Supabase. Newly created admin subcategories
 * appear here immediately — no storefront rebuild is required.
 */
export async function fetchSupabaseSubcategories(): Promise<{
  data: SubcategoryItem[] | null;
  error: string | null;
}> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: null, error: 'Supabase client not initialized' };
    }

    const { data, error } = await supabase
      .from('subcategories')
      .select('id, category_id, name, slug, featured_image, is_active, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.info('Notice from Supabase fetch subcategories:', error.message);
      return { data: null, error: error.message };
    }

    const mapped: SubcategoryItem[] = (data || [])
      .map((row: any) => ({
        id: String(row.id),
        categoryId: resolveCategoryId(String(row.category_id || '')),
        name: row.name || '',
        slug: row.slug || '',
        featuredImage: row.featured_image || row.image_url || '',
        isActive: row.is_active !== false,
        sortOrder: Number(row.sort_order) || 0,
      }))
      .filter((subcategory) => ALLOWED_CATEGORY_IDS.includes(subcategory.categoryId));

    return { data: mapped, error: null };
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
    return {
      success: false,
      error: 'Order storage is not configured. Please contact the store.',
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


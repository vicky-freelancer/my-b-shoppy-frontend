export interface ProductItem {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  imageUrls?: string[];
  /** Database identity for separately cached image delivery. */
  imageProductId?: string;
  category: string;
  categoryId: string;
  subcategory?: string;
  subcategoryId?: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  material?: string;
  stone?: string;
  variants: string[];
  variantOptions?: { id: string; label: string }[];
  description: string;
  inStock?: boolean;
  isSupabaseSynced?: boolean;
  created_at?: string;
}

export interface SubcategoryItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  featuredImage: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge?: string;
  count?: number;
  startingPrice: number;
  imageUrl: string;
  items: ProductItem[];
}

export interface CartItem {
  product: ProductItem;
  variant: string;
  quantity: number;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  materials: string[];
  stones: string[];
  searchQuery: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
  inStockOnly: boolean;
}

export interface StoreConfig {
  storeName: string;
  storeTagline: string;
  logoText: string;
  currency: string;
  currencySymbol: string;
  defaultCountry: string;
  availableCountries: string[];
  categories: ProductCategory[];
  supabase: {
    url: string;
    publishableKey: string;
    tableName: string;
    productsTableName: string;
  };
  contact: {
    email: string;
    phone: string;
    supportHours: string;
    address: string;
  };
}

export interface OrderFormData {
  customer_name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  country: string;
  category?: string;
  product_name: string;
  product_variant: string;
  quantity: number;
  notes: string;
  status: string;
  total_amount?: number;
  items_summary?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_method?: string;
}

export interface FormErrors {
  customer_name?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  country?: string;
  product_variant?: string;
}


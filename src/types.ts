export interface ProductItem {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  categoryId: string;
  badge?: 'EXCLUSIVE' | 'NEW' | 'BESTSELLER' | 'SALE' | string;
  rating: number;
  reviewsCount: number;
  material?: string;
  stone?: string;
  variants: string[];
  description: string;
  inStock?: boolean;
  isSupabaseSynced?: boolean;
  created_at?: string;
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


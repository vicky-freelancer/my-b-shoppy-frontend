import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_PRODUCTS } from '../storeConfig';
import { CartItem, ProductItem, SubcategoryItem } from '../types';
import { fetchSupabaseProducts, fetchSupabaseSubcategories, getSupabaseClient } from '../lib/supabaseClient';

interface DirectCheckoutState {
  product: ProductItem;
  variant: string;
  quantity: number;
}

interface StoreContextValue {
  products: ProductItem[];
  subcategories: SubcategoryItem[];
  subcategoriesLoaded: boolean;
  subcategoriesError: string | null;
  refreshSubcategories: () => Promise<void>;
  isSupabaseLoading: boolean;
  supabaseConnected: boolean;
  cartItems: CartItem[];
  wishlistIds: string[];
  wishlistProducts: ProductItem[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isSupabaseModalOpen: boolean;
  isCheckoutOpen: boolean;
  quickViewProduct: ProductItem | null;
  directCheckoutProduct: DirectCheckoutState | null;
  setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  addToCart: (product: ProductItem, variant?: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, variant: string, newQuantity: number) => void;
  removeCartItem: (productId: string, variant: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: ProductItem) => void;
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openSupabaseSync: () => void;
  closeSupabaseSync: () => void;
  setQuickViewProduct: (product: ProductItem | null) => void;
  openDirectCheckout: (product: ProductItem, variant: string, quantity: number) => void;
  openCheckout: () => void;
  closeCheckout: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const useStore = (): StoreContextValue => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [subcategoriesLoaded, setSubcategoriesLoaded] = useState(false);
  const [subcategoriesError, setSubcategoriesError] = useState<string | null>(null);
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const productsLoaded = useRef(false);

  // Cart always starts empty on page load / reload
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Wishlist always starts empty on page load / reload
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [directCheckoutProduct, setDirectCheckoutProduct] = useState<DirectCheckoutState | null>(null);

  const refreshSubcategories = useCallback(async () => {
    setSubcategoriesError(null);
    const result = await fetchSupabaseSubcategories();
    if (result.data) {
      setSubcategories(result.data);
    } else if (result.error) {
      setSubcategoriesError(result.error);
    }
    setSubcategoriesLoaded(true);
  }, []);

  useEffect(() => {
    let disposed = false;
    let inFlight = false;
    let lastRefreshStarted = 0;
    async function loadSupabaseData() {
      // Focus and visibility events often arrive together. Share that refresh.
      if (disposed || inFlight || Date.now() - lastRefreshStarted < 3000) return;
      const client = getSupabaseClient();
      if (!client) {
        setSubcategoriesLoaded(true);
        return;
      }

      inFlight = true;
      lastRefreshStarted = Date.now();
      setSupabaseConnected(true);
      // Only the first product fetch blocks the grid. Subsequent refreshes
      // keep the current catalogue visible, including an empty live catalogue.
      if (!productsLoaded.current) setIsSupabaseLoading(true);
      const subcategoriesRequest = refreshSubcategories();
      try {
        const productsResult = await fetchSupabaseProducts();
        if (disposed) return;
        if (productsResult.data) {
          setProducts(productsResult.data);
          productsLoaded.current = true;
        }
      } finally {
        // Product rendering must not wait for the independent menu query.
        if (!disposed) setIsSupabaseLoading(false);
        await subcategoriesRequest;
        inFlight = false;
      }
    }

    loadSupabaseData();
    // Re-read when shoppers return from another tab, and while they browse.
    // Polling also covers databases where Realtime publication is not enabled.
    const refreshVisible = () => {
      if (document.visibilityState === 'visible') void loadSupabaseData();
    };
    const interval = window.setInterval(refreshVisible, 30000);
    window.addEventListener('focus', refreshVisible);
    document.addEventListener('visibilitychange', refreshVisible);
    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshVisible);
      document.removeEventListener('visibilitychange', refreshVisible);
    };
  }, [refreshSubcategories]);

  const addToCart = useCallback((product: ProductItem, variant?: string, quantity: number = 1) => {
    if (product.inStock === false) return;
    const chosenVariant = variant || product.variants[0] || 'Standard';
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.variant === chosenVariant
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.variant === chosenVariant
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, variant: chosenVariant, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const updateCartQuantity = useCallback((productId: string, variant: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variant === variant
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  const removeCartItem = useCallback((productId: string, variant: string) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.variant === variant))
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleWishlist = useCallback((product: ProductItem) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  }, []);

  const openDirectCheckout = useCallback((product: ProductItem, variant: string, quantity: number) => {
    if (product.inStock === false) return;
    setDirectCheckoutProduct({ product, variant, quantity });
    setIsCheckoutOpen(true);
  }, []);

  const openCheckout = useCallback(() => {
    setDirectCheckoutProduct(null);
    setIsCheckoutOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
    setDirectCheckoutProduct(null);
  }, []);

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  const value: StoreContextValue = {
    products,
    subcategories,
    subcategoriesLoaded,
    subcategoriesError,
    refreshSubcategories,
    isSupabaseLoading,
    supabaseConnected,
    cartItems,
    wishlistIds,
    wishlistProducts,
    isCartOpen,
    isWishlistOpen,
    isSearchOpen,
    isSupabaseModalOpen,
    isCheckoutOpen,
    quickViewProduct,
    directCheckoutProduct,
    setProducts,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    toggleWishlist,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    openWishlist: () => setIsWishlistOpen(true),
    closeWishlist: () => setIsWishlistOpen(false),
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
    openSupabaseSync: () => setIsSupabaseModalOpen(true),
    closeSupabaseSync: () => setIsSupabaseModalOpen(false),
    setQuickViewProduct,
    openDirectCheckout,
    openCheckout,
    closeCheckout,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

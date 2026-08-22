import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_PRODUCTS } from '../storeConfig';
import { CartItem, ProductItem } from '../types';
import { fetchSupabaseProducts, getSupabaseClient } from '../lib/supabaseClient';

interface DirectCheckoutState {
  product: ProductItem;
  variant: string;
  quantity: number;
}

interface StoreContextValue {
  products: ProductItem[];
  isSupabaseLoading: boolean;
  supabaseConnected: boolean;
  cartItems: CartItem[];
  wishlistIds: string[];
  wishlistProducts: ProductItem[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isSupabaseModalOpen: boolean;
  isCodModalOpen: boolean;
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
  openCodCheckout: () => void;
  closeCodCheckout: () => void;
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
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Cart always starts empty on page load / reload
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Wishlist always starts empty on page load / reload
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCodModalOpen, setIsCodModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [directCheckoutProduct, setDirectCheckoutProduct] = useState<DirectCheckoutState | null>(null);

  useEffect(() => {
    async function loadSupabaseData() {
      const client = getSupabaseClient();
      if (client) {
        setSupabaseConnected(true);
        setIsSupabaseLoading(true);
        const { data } = await fetchSupabaseProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
        setIsSupabaseLoading(false);
      }
    }

    loadSupabaseData();
  }, []);

  const addToCart = useCallback((product: ProductItem, variant?: string, quantity: number = 1) => {
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
    setDirectCheckoutProduct({ product, variant, quantity });
    setIsCodModalOpen(true);
  }, []);

  const openCodCheckout = useCallback(() => {
    setDirectCheckoutProduct(null);
    setIsCodModalOpen(true);
  }, []);

  const closeCodCheckout = useCallback(() => {
    setIsCodModalOpen(false);
    setDirectCheckoutProduct(null);
  }, []);

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  const value: StoreContextValue = {
    products,
    isSupabaseLoading,
    supabaseConnected,
    cartItems,
    wishlistIds,
    wishlistProducts,
    isCartOpen,
    isWishlistOpen,
    isSearchOpen,
    isSupabaseModalOpen,
    isCodModalOpen,
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
    openCodCheckout,
    closeCodCheckout,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

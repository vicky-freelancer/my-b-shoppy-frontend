import { useQuery } from '@tanstack/react-query';
import { getProductsByIds } from '../lib/productQueries';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CartItem, ProductItem, SubcategoryItem } from '../types';
import { apiSubcategories } from '../lib/catalogApi';

interface DirectCheckoutState {
  // Display snapshot, not a server-validated purchase quote or stock reservation.
  product: ProductItem;
  variant: string;
  quantity: number;
}

interface StoreContextValue {
  subcategories: SubcategoryItem[];
  subcategoriesLoaded: boolean;
  subcategoriesError: string | null;
  refreshSubcategories: () => Promise<void>;
  cartItems: CartItem[];
  wishlistIds: string[];
  wishlistProducts: ProductItem[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isCheckoutOpen: boolean;
  quickViewProduct: ProductItem | null;
  directCheckoutProduct: DirectCheckoutState | null;
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
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [subcategoriesLoaded, setSubcategoriesLoaded] = useState(false);
  const [subcategoriesError, setSubcategoriesError] = useState<string | null>(null);

  // Cart always starts empty on page load / reload. These are display snapshots;
  // query refresh/invalidation does not turn them into authoritative purchase
  // data. Server-side price, quantity and inventory validation is still required.
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Wishlist always starts empty on page load / reload
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistSnapshots, setWishlistSnapshots] = useState<ProductItem[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [directCheckoutProduct, setDirectCheckoutProduct] = useState<DirectCheckoutState | null>(null);

  const subcategoryQuery = useQuery({
    queryKey: ['subcategories'], staleTime: 30_000,
    queryFn: apiSubcategories,
  });
  useEffect(() => {
    if (subcategoryQuery.data) setSubcategories(subcategoryQuery.data);
    setSubcategoriesLoaded(!subcategoryQuery.isPending);
    setSubcategoriesError(subcategoryQuery.error?.message || null);
  }, [subcategoryQuery.data, subcategoryQuery.isPending, subcategoryQuery.error]);
  const refreshSubcategories = useCallback(async () => { await subcategoryQuery.refetch(); }, [subcategoryQuery.refetch]);

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
    setWishlistSnapshots(previous => [...previous.filter(item => item.id !== product.id), product]);
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

  const wishlistQuery = useQuery({
    queryKey: ['products', 'wishlist', wishlistIds],
    queryFn: ({ signal }) => getProductsByIds(wishlistIds, signal), enabled: wishlistIds.length > 0,
  });
  const wishlistProducts = wishlistIds.length ? (wishlistQuery.data || wishlistSnapshots.filter(p => wishlistIds.includes(p.id))) : [];

  const value: StoreContextValue = {
    subcategories,
    subcategoriesLoaded,
    subcategoriesError,
    refreshSubcategories,
    cartItems,
    wishlistIds,
    wishlistProducts,
    isCartOpen,
    isWishlistOpen,
    isSearchOpen,
    isCheckoutOpen,
    quickViewProduct,
    directCheckoutProduct,
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
    setQuickViewProduct,
    openDirectCheckout,
    openCheckout,
    closeCheckout,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

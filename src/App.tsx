import React, { useState, useEffect, useMemo } from 'react';
import { STORE_CONFIG, INITIAL_PRODUCTS, CATEGORIES_CATALOG } from './storeConfig';
import { ProductItem, CartItem, FilterState } from './types';
import { fetchSupabaseProducts, getSupabaseClient } from './lib/supabaseClient';
import { Header } from './components/Header';
import { ShopHero } from './components/ShopHero';
import { ShopSidebar } from './components/ShopSidebar';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';
import { CodCheckoutModal } from './components/CodCheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { WishlistModal } from './components/WishlistModal';
import { SearchModal } from './components/SearchModal';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { Footer } from './components/Footer';

export default function App() {
  // 1. Products State (seeded from INITIAL_PRODUCTS & fetched from Supabase)
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // 2. Active Filter State
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50000],
    materials: [],
    stones: [],
    searchQuery: '',
    sortBy: 'newest',
    inStockOnly: false,
  });

  // 3. Cart State (Initial sample item so cart badge shows count like in screenshot)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0], // The Solstice Ring
      variant: INITIAL_PRODUCTS[0]?.variants[0] || 'Size 7',
      quantity: 1,
    },
    {
      product: INITIAL_PRODUCTS[1], // Midnight Tear Necklace
      variant: INITIAL_PRODUCTS[1]?.variants[1] || '18-inch Classic',
      quantity: 1,
    },
  ]);

  // 4. Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'aura-gold-cuff',
    'starlight-drops',
  ]);

  // 5. Modals & Drawers Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [directCheckoutProduct, setDirectCheckoutProduct] = useState<{
    product: ProductItem;
    variant: string;
    quantity: number;
  } | null>(null);
  const [isCodModalOpen, setIsCodModalOpen] = useState(false);

  // 6. Navigation Tab State
  const [activeNavTab, setActiveNavTab] = useState('shop');

  // 7. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Supabase Initial Fetch
  useEffect(() => {
    async function loadSupabaseData() {
      const client = getSupabaseClient();
      if (client) {
        setSupabaseConnected(true);
        setIsSupabaseLoading(true);
        const { data } = await fetchSupabaseProducts();
        if (data && data.length > 0) {
          // Merge or replace products
          setProducts(data);
        }
        setIsSupabaseLoading(false);
      }
    }

    loadSupabaseData();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.categoryId) &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }

      // Price filter
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Material filter
      if (
        filters.materials.length > 0 &&
        (!product.material || !filters.materials.includes(product.material))
      ) {
        return false;
      }

      // Stone filter
      if (
        filters.stones.length > 0 &&
        (!product.stone || !filters.stones.includes(product.stone))
      ) {
        return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [products, filters]);

  // Sorted Products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (filters.sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'popular':
        return list.sort((a, b) => b.reviewsCount - a.reviewsCount);
      case 'newest':
      default:
        return list;
    }
  }, [filteredProducts, filters.sortBy]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));

  // Handlers for Cart
  const handleAddToCart = (product: ProductItem, variant?: string, quantity: number = 1) => {
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
  };

  const handleUpdateCartQuantity = (productId: string, variant: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variant === variant
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, variant: string) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.variant === variant))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handlers for Wishlist
  const handleToggleWishlist = (product: ProductItem) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Handlers for Filters
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50000],
      materials: [],
      stones: [],
      searchQuery: '',
      sortBy: 'newest',
      inStockOnly: false,
    });
    setCurrentPage(1);
  };

  // Handler for Direct Cash on Delivery Checkout
  const handleDirectOrder = (product: ProductItem, variant: string, quantity: number) => {
    setDirectCheckoutProduct({ product, variant, quantity });
    setIsCodModalOpen(true);
  };

  const handleProceedCartToCod = () => {
    setDirectCheckoutProduct(null);
    setIsCodModalOpen(true);
  };

  const currentCategoryName =
    filters.categories.length === 1
      ? CATEGORIES_CATALOG.find((c) => c.id === filters.categories[0])?.name
      : undefined;

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-[#f5f5f5] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#fae19c]">
      
      {/* 1. Header Navigation Bar (my B shoppy) */}
      <Header
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSupabaseSync={() => setIsSupabaseModalOpen(true)}
        supabaseConnected={supabaseConnected}
        activeNavTab={activeNavTab}
        onSelectNavTab={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'home' || tab === 'shop') {
            handleClearFilters();
          }
        }}
      />

      {/* 2. Shop Hero & Breadcrumb Banner ("All Products") */}
      <ShopHero
        currentCategoryName={currentCategoryName}
        totalProductsCount={sortedProducts.length}
      />

      {/* 3. Main Catalog Section (Sidebar Filters + Products Grid) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar Filter */}
          <ShopSidebar
            categories={CATEGORIES_CATALOG}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            totalProductsCount={sortedProducts.length}
            currencySymbol={STORE_CONFIG.currencySymbol}
          />

          {/* Right Product Catalog Grid */}
          <ProductGrid
            products={paginatedProducts}
            allFilteredProducts={sortedProducts}
            currencySymbol={STORE_CONFIG.currencySymbol}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(product) => handleAddToCart(product)}
            onQuickView={(product) => setQuickViewProduct(product)}
            sortBy={filters.sortBy}
            onSortChange={(sortBy) => setFilters({ ...filters, sortBy })}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 280, behavior: 'smooth' });
            }}
            itemsPerPage={itemsPerPage}
            totalFilteredCount={sortedProducts.length}
            isSupabaseLoading={isSupabaseLoading}
            isSupabaseSynced={supabaseConnected}
            onOpenSupabaseSync={() => setIsSupabaseModalOpen(true)}
          />

        </div>
      </main>

      {/* 4. Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCod={handleProceedCartToCod}
      />

      {/* 5. Cash on Delivery (COD) Checkout Modal with Supabase Integration */}
      <CodCheckoutModal
        isOpen={isCodModalOpen}
        onClose={() => {
          setIsCodModalOpen(false);
          setDirectCheckoutProduct(null);
        }}
        cartItems={cartItems}
        directProduct={directCheckoutProduct}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onClearCart={handleClearCart}
      />

      {/* 6. Product Quick View Detail Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currencySymbol={STORE_CONFIG.currencySymbol}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(prod, variant, qty) => handleAddToCart(prod, variant, qty)}
        onDirectOrder={handleDirectOrder}
      />

      {/* 7. Wishlist Drawer Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={(prod) => handleAddToCart(prod)}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* 8. Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onSelectProduct={(prod) => setQuickViewProduct(prod)}
      />

      {/* 9. Supabase Database Sync & SQL Setup Modal */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        products={products}
        onProductsUpdated={(newProducts) => setProducts(newProducts)}
        supabaseConnected={supabaseConnected}
      />

      {/* 10. Footer (Matching reference screenshot) */}
      <Footer
        onSelectCategory={(categoryId) => {
          if (categoryId === 'all') {
            handleClearFilters();
          } else {
            handleFilterChange({
              ...filters,
              categories: [categoryId],
            });
          }
          window.scrollTo({ top: 200, behavior: 'smooth' });
        }}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSupabaseSync={() => setIsSupabaseModalOpen(true)}
      />

    </div>
  );
}

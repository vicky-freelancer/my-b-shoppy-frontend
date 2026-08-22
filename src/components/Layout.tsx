import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { CodCheckoutModal } from './CodCheckoutModal';
import { QuickViewModal } from './QuickViewModal';
import { WishlistModal } from './WishlistModal';
import { SearchModal } from './SearchModal';
import { SupabaseSyncModal } from './SupabaseSyncModal';
import { useStore } from '../context/StoreContext';
import { STORE_CONFIG } from '../storeConfig';

export const Layout: React.FC = () => {
  const location = useLocation();
  const store = useStore();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-[#f5f5f5] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#fae19c]">
      {/* 1. Header Navigation Bar (my B shoppy) */}
      <Header />

      {/* 2. Routed Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 3. Common Footer — navigation, address, phone & social buttons on every page */}
      <Footer />

      {/* 4. Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={store.isCartOpen}
        onClose={store.closeCart}
        cartItems={store.cartItems}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onUpdateQuantity={store.updateCartQuantity}
        onRemoveItem={store.removeCartItem}
        onProceedToCod={store.openCodCheckout}
      />

      {/* 4. Cash on Delivery (COD) Checkout Modal with Supabase Integration */}
      <CodCheckoutModal
        isOpen={store.isCodModalOpen}
        onClose={store.closeCodCheckout}
        cartItems={store.cartItems}
        directProduct={store.directCheckoutProduct}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onClearCart={store.clearCart}
      />

      {/* 5. Product Quick View Detail Modal */}
      <QuickViewModal
        product={store.quickViewProduct}
        isOpen={!!store.quickViewProduct}
        onClose={() => store.setQuickViewProduct(null)}
        currencySymbol={STORE_CONFIG.currencySymbol}
        isWishlisted={
          store.quickViewProduct
            ? store.wishlistIds.includes(store.quickViewProduct.id)
            : false
        }
        onToggleWishlist={store.toggleWishlist}
        onAddToCart={(prod, variant, qty) => store.addToCart(prod, variant, qty)}
        onDirectOrder={store.openDirectCheckout}
      />

      {/* 6. Wishlist Drawer Modal */}
      <WishlistModal
        isOpen={store.isWishlistOpen}
        onClose={store.closeWishlist}
        wishlistProducts={store.wishlistProducts}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onRemoveWishlist={store.toggleWishlist}
        onAddToCart={(prod) => store.addToCart(prod)}
        onQuickView={(prod) => store.setQuickViewProduct(prod)}
      />

      {/* 7. Search Overlay Modal */}
      <SearchModal
        isOpen={store.isSearchOpen}
        onClose={store.closeSearch}
        products={store.products}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onSelectProduct={(prod) => store.setQuickViewProduct(prod)}
      />

      {/* 8. Supabase Database Sync & SQL Setup Modal */}
      <SupabaseSyncModal
        isOpen={store.isSupabaseModalOpen}
        onClose={store.closeSupabaseSync}
        products={store.products}
        onProductsUpdated={(newProducts) => store.setProducts(newProducts)}
        supabaseConnected={store.supabaseConnected}
      />
    </div>
  );
};

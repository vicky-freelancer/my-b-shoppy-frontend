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
    <div className="min-h-screen bg-[#d9a33f] text-[#241A12] flex flex-col texture-grain selection:bg-[#D8A83E]/30 selection:text-[#241A12]">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <CartDrawer
        isOpen={store.isCartOpen}
        onClose={store.closeCart}
        cartItems={store.cartItems}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onUpdateQuantity={store.updateCartQuantity}
        onRemoveItem={store.removeCartItem}
        onProceedToCod={store.openCodCheckout}
      />

      <CodCheckoutModal
        isOpen={store.isCodModalOpen}
        onClose={store.closeCodCheckout}
        cartItems={store.cartItems}
        directProduct={store.directCheckoutProduct}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onClearCart={store.clearCart}
      />

      <QuickViewModal
        product={store.quickViewProduct}
        isOpen={!!store.quickViewProduct}
        onClose={() => store.setQuickViewProduct(null)}
        currencySymbol={STORE_CONFIG.currencySymbol}
        isWishlisted={
          store.quickViewProduct ? store.wishlistIds.includes(store.quickViewProduct.id) : false
        }
        onToggleWishlist={store.toggleWishlist}
        onAddToCart={(prod, variant, qty) => store.addToCart(prod, variant, qty)}
        onDirectOrder={store.openDirectCheckout}
      />

      <WishlistModal
        isOpen={store.isWishlistOpen}
        onClose={store.closeWishlist}
        wishlistProducts={store.wishlistProducts}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onRemoveWishlist={store.toggleWishlist}
        onAddToCart={(prod) => store.addToCart(prod)}
        onQuickView={(prod) => store.setQuickViewProduct(prod)}
      />

      <SearchModal
        isOpen={store.isSearchOpen}
        onClose={store.closeSearch}
        products={store.products}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onSelectProduct={(prod) => store.setQuickViewProduct(prod)}
      />

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
import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { QuickViewModal } from './QuickViewModal';
import { WishlistModal } from './WishlistModal';
import { SearchModal } from './SearchModal';
import { useStore } from '../context/StoreContext';
import { STORE_CONFIG } from '../storeConfig';

export const Layout: React.FC = () => {
  const location = useLocation();
  const store = useStore();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 300);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

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

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#B8860B] bg-[#E8C875] text-[#241A12] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#D8A83E] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:bottom-6 sm:right-6"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      <CartDrawer
        isOpen={store.isCartOpen}
        onClose={store.closeCart}
        cartItems={store.cartItems}
        currencySymbol={STORE_CONFIG.currencySymbol}
        onUpdateQuantity={store.updateCartQuantity}
        onRemoveItem={store.removeCartItem}
        onProceedToCheckout={store.openCheckout}
      />

      <CheckoutModal
        isOpen={store.isCheckoutOpen}
        onClose={store.closeCheckout}
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
        currencySymbol={STORE_CONFIG.currencySymbol}
        onSelectProduct={(prod) => store.setQuickViewProduct(prod)}
      />


    </div>
  );
};

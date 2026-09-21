import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';
import { PageBanner } from '../components/PageBanner';
import { ProductCard } from '../components/ProductCard';
import { STORE_CONFIG } from '../storeConfig';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, toggleWishlist, addToCart } = useStore();

  useSeo({
    title: 'Your Wishlist',
    description: 'Your saved favourites at MY B SHOPPY — revisit the pieces you love.',
    path: '/wishlist',
  });

  return (
    <div>
      <PageBanner
        eyebrow="Saved With Love"
        title="My <em>Wishlist</em>"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Wishlist' },
        ]}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 space-y-5 bg-[#FFFDF6] border border-[#6B5945]/15 rounded-3xl">
            <span className="inline-flex w-16 h-16 rounded-full bg-[#FAF1DD] border border-[#D8A83E]/40 items-center justify-center text-[#B8860B]">
              <Heart className="w-7 h-7" />
            </span>
            <h2 className="font-display text-3xl text-[#241A12]">Nothing saved yet</h2>
            <p className="text-sm text-[#6B5945] max-w-sm mx-auto">
              Tap the heart on any piece you love and it will wait for you right here.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-[#111111] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.22em] hover:bg-[#241A12] transition-all hover:-translate-y-0.5"
            >
              Find Your Favourites
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currencySymbol={STORE_CONFIG.currencySymbol}
                isWishlisted
                onToggleWishlist={toggleWishlist}
                onAddToCart={(prod) => addToCart(prod)}
              />
            ))}
          </div>
        )}

        {wishlistProducts.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#111111] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.22em] hover:bg-[#241A12] transition-all hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
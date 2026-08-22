import React, { useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import { GoldHero } from '../components/GoldHero';
import { GoldBand } from '../components/GoldBand';
import { GoldFrame } from '../components/GoldFrame';
import { ProductGrid } from '../components/ProductGrid';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';
import { paginate, sortProducts, SortOption } from '../lib/catalogUtils';

const itemsPerPage = 12;

export const ShopPage: React.FC = () => {
  const {
    products,
    wishlistIds,
    toggleWishlist,
    addToCart,
    setQuickViewProduct,
    isSupabaseLoading,
    supabaseConnected,
    openSupabaseSync,
  } = useStore();

  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  useSeo({
    title: 'Shop All Products',
    description:
      'Browse the full my B shoppy catalogue — artificial jewels, hair accessories, bows, scrunchies, charms, bags & gifts. Sort by price, rating or popularity.',
    path: '/shop',
  });

  const sortedProducts = useMemo(() => sortProducts(products, sortBy), [products, sortBy]);
  const paginatedProducts = useMemo(
    () => paginate(sortedProducts, currentPage, itemsPerPage),
    [sortedProducts, currentPage]
  );
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));

  return (
    <div>
      <GoldHero
        title="All Products"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Shop' },
        ]}
        subtitle="Curated fine artificial jewelry, luxury hair adornments, accessories & gifts with Cash on Delivery"
        metaText={`${sortedProducts.length} Items Available`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Full-width catalog grid in a thick gold showcase frame */}
        <GoldFrame>
          <ProductGrid
            products={paginatedProducts}
            allFilteredProducts={sortedProducts}
            currencySymbol="₹"
            wishlistIds={wishlistIds}
            onToggleWishlist={toggleWishlist}
            onAddToCart={(product) => addToCart(product)}
            onQuickView={setQuickViewProduct}
            sortBy={sortBy}
            onSortChange={(sort) => {
              setSortBy(sort);
              setCurrentPage(1);
            }}
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
            onOpenSupabaseSync={openSupabaseSync}
          />
        </GoldFrame>

        {!isSupabaseLoading && products.length === 0 && (
          <div className="py-20 text-center space-y-4 bg-[#121110] rounded-2xl border border-[#272420] p-8">
            <SearchX className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Catalogue is being curated</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Our products are syncing. Please check back in a few moments.
            </p>
          </div>
        )}
      </div>

      {/* Closing gold band — alternates with the dark catalogue above */}
      <GoldBand
        eyebrow="Zero-Risk Shopping"
        title="Love It First, Pay at Your Door"
        text="Every my B shoppy order ships with Cash on Delivery — inspect your treasures before a single rupee leaves your pocket."
        primaryCta={{ label: 'Contact Support', path: '/contact' }}
        secondaryCta={{ label: 'Browse Categories', path: '/categories' }}
      />
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { SearchX } from 'lucide-react';
import { GoldHero } from '../components/GoldHero';
import { GoldBand } from '../components/GoldBand';
import { GoldFrame } from '../components/GoldFrame';
import { ProductGrid } from '../components/ProductGrid';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';
import { SortOption } from '../lib/catalogUtils';

import { useProductListing } from '../lib/useProducts';

const itemsPerPage = 20;

export const ShopPage: React.FC = () => {
  const {
    wishlistIds,
    toggleWishlist,
    addToCart,
    setQuickViewProduct,
  } = useStore();

  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  useSeo({
    title: 'Shop All Products',
    description:
      'Browse the full my B shoppy catalogue — artificial jewels, hair accessories, bows, scrunchies, charms, bags & gifts. Sort by price, rating or popularity.',
    path: '/shop',
  });

  const listing = useProductListing({ page: currentPage, sort: sortBy });
  const paginatedProducts = listing.data?.products || [];
  const totalCount = listing.data?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const isLoading = listing.isPending;
  useEffect(() => {
    if (listing.data && currentPage > totalPages) setCurrentPage(totalPages);
  }, [listing.data, currentPage, totalPages]);

  return (
    <div className="products-page">
      <GoldHero
        title="All Products"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Shop' },
        ]}
        subtitle="Curated fine artificial jewelry, luxury hair adornments, accessories & gifts with easy checkout"
        metaText={`${totalCount} Items Available`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {listing.error && <p role="alert" className="text-sm text-[#6B5945]">Products could not be loaded. <button onClick={() => listing.refetch()}>Try again</button></p>}
        {/* Full-width catalog grid in a thick gold showcase frame */}
        <GoldFrame>
          {(!listing.error || listing.data) && <ProductGrid
            products={paginatedProducts}
            currencySymbol="₹"
            wishlistIds={wishlistIds}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
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
            totalFilteredCount={totalCount}
            isLoading={isLoading}
          />}
        </GoldFrame>

        {!isLoading && !listing.error && totalCount === 0 && (
          <div className="py-20 text-center space-y-4 bg-[#FFFDF6] rounded-2xl border border-[#6B5945]/20 p-8">
            <SearchX className="w-12 h-12 text-[#B8860B]/50 mx-auto" />
            <h3 className="text-lg font-bold text-[#241A12]">Catalogue is being curated</h3>
            <p className="text-sm text-[#6B5945] max-w-md mx-auto">
              Our products are syncing. Please check back in a few moments.
            </p>
          </div>
        )}
      </div>

      {/* Closing gold band — alternates with the dark catalogue above */}
      <GoldBand
        eyebrow="Zero-Risk Shopping"
        title="Choose Your Style, Pay Securely Online"
        text="Browse your favourites and keep them in your cart. Secure online checkout will be available after release approval."
        primaryCta={{ label: 'Contact Support', path: '/contact' }}
        secondaryCta={{ label: 'Browse Categories', path: '/categories' }}
      />
    </div>
  );
};

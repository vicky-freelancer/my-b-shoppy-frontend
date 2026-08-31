import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, SearchX } from 'lucide-react';
import { GoldHero } from '../components/GoldHero';
import { GoldBand } from '../components/GoldBand';
import { GoldFrame } from '../components/GoldFrame';
import { ProductGrid } from '../components/ProductGrid';
import { CATEGORIES_CATALOG } from '../storeConfig';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';
import { paginate, sortProducts, SortOption } from '../lib/catalogUtils';

const itemsPerPage = 12;

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
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

  const categoryMeta = useMemo(
    () => CATEGORIES_CATALOG.find((c) => c.id === slug),
    [slug]
  );

  useSeo({
    title: categoryMeta ? categoryMeta.name : 'Category',
    description: categoryMeta?.description,
    path: `/categories/${slug || ''}`,
  });

  const categoryProducts = useMemo(
    () => sortProducts(
      products.filter((p) => p.categoryId === slug),
      sortBy
    ),
    [products, slug, sortBy]
  );

  const paginatedProducts = useMemo(
    () => paginate(categoryProducts, currentPage, itemsPerPage),
    [categoryProducts, currentPage]
  );
  const totalPages = Math.max(1, Math.ceil(categoryProducts.length / itemsPerPage));

  if (!categoryMeta) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-5">
        <SearchX className="w-12 h-12 text-slate-600 mx-auto" />
        <h1 className="font-display text-3xl font-bold text-white">Category Not Found</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          The category you're looking for doesn't exist or has been renamed.
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div>
      <GoldHero
        title={categoryMeta.name}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Categories', path: '/categories' },
          { label: categoryMeta.name },
        ]}
        subtitle={categoryMeta.tagline}
        metaText={`${categoryProducts.length} Items Available`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category description panel */}
        <div className="mb-8 bg-[#141312] border border-[#272420] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            {categoryMeta.description} Every piece in this edit ships with dust-proof protective
            packaging and easy, flexible payment.
          </p>
          <Link
            to="/shop"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] hover:text-[#fae19c] transition-colors"
          >
            View Full Catalogue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Full-width product grid — thick gold showcase frame */}
        <GoldFrame>
          <ProductGrid
            products={paginatedProducts}
            allFilteredProducts={categoryProducts}
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
            totalFilteredCount={categoryProducts.length}
            isSupabaseLoading={isSupabaseLoading}
            isSupabaseSynced={supabaseConnected}
            onOpenSupabaseSync={openSupabaseSync}
          />
        </GoldFrame>

        {!isSupabaseLoading && categoryProducts.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-[#121110] rounded-2xl border border-[#272420] p-8 mt-2">
            <SearchX className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No pieces here yet</h3>
            <p className="text-sm text-slate-400">
              This category is being restocked. Explore the full catalogue meanwhile.
            </p>
          </div>
        )}
      </div>

      {/* Closing gold band — alternates with the dark grid above */}
      <GoldBand
        eyebrow="Keep Exploring"
        title={`More From ${categoryMeta.name} Awaits`}
        text="New pieces land every week — each one wear-tested, gift-wrapped and checkout ready."
        primaryCta={{ label: 'View Full Catalogue', path: '/shop' }}
        secondaryCta={{ label: 'All Categories', path: '/categories' }}
      />
    </div>
  );
};

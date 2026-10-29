import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers, SearchX } from 'lucide-react';
import { GoldHero } from '../components/GoldHero';
import { GoldBand } from '../components/GoldBand';
import { GoldFrame } from '../components/GoldFrame';
import { ProductGrid } from '../components/ProductGrid';
import { SubcategoryListingPage } from './SubcategoryListingPage';
import { CATEGORIES_CATALOG } from '../storeConfig';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';
import { paginate, sortProducts, SortOption } from '../lib/catalogUtils';
import { ProductItem, SubcategoryItem } from '../types';

const itemsPerPage = 12;

const normalizeValue = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '');

function matchesSubcategory(product: ProductItem, subcategory: SubcategoryItem): boolean {
  if (product.subcategoryId && product.subcategoryId === subcategory.id) {
    return true;
  }

  if (!product.subcategory) return false;

  const productValue = product.subcategory.trim().toLowerCase();
  const productNormalized = normalizeValue(productValue);

  return (
    productValue === subcategory.id.toLowerCase() ||
    productValue === subcategory.name.trim().toLowerCase() ||
    productValue === subcategory.slug.trim().toLowerCase() ||
    productNormalized === normalizeValue(subcategory.id) ||
    productNormalized === normalizeValue(subcategory.name) ||
    productNormalized === normalizeValue(subcategory.slug)
  );
}

export const CategoryDetailPage: React.FC = () => {
  const { slug, subSlug } = useParams<{ slug: string; subSlug?: string }>();
  const [searchParams] = useSearchParams();
  const {
    products,
    subcategories,
    subcategoriesLoaded,
    subcategoriesError,
    refreshSubcategories,
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

  const forceProductView = searchParams.get('view') === 'products';

  const categoryMeta = useMemo(
    () => CATEGORIES_CATALOG.find((category) => category.id === slug),
    [slug]
  );

  const categorySubcategories = useMemo(
    () => subcategories.filter((subcategory) => subcategory.categoryId === slug),
    [subcategories, slug]
  );

  const selectedSubcategory = useMemo(() => {
    if (!subSlug) return undefined;
    return (
      categorySubcategories.find((subcategory) => subcategory.slug === subSlug) ||
      categorySubcategories.find((subcategory) => subcategory.id === subSlug)
    );
  }, [categorySubcategories, subSlug]);

  useEffect(() => {
    setCurrentPage(1);
  }, [slug, subSlug, forceProductView]);

  useSeo({
    title: selectedSubcategory
      ? `${selectedSubcategory.name} — ${categoryMeta?.name || 'Category'}`
      : categoryMeta
      ? categoryMeta.name
      : 'Category',
    description: categoryMeta?.description,
    path: selectedSubcategory
      ? `/categories/${slug || ''}/${selectedSubcategory.slug}`
      : `/categories/${slug || ''}`,
  });

  const categoryProducts = useMemo(() => {
    let items = products.filter((product) => product.categoryId === slug);
    if (selectedSubcategory) {
      items = items.filter((product) => matchesSubcategory(product, selectedSubcategory));
    }
    return sortProducts(items, sortBy);
  }, [products, slug, selectedSubcategory, sortBy]);

  const paginatedProducts = useMemo(
    () => paginate(categoryProducts, currentPage, itemsPerPage),
    [categoryProducts, currentPage]
  );
  const totalPages = Math.max(1, Math.ceil(categoryProducts.length / itemsPerPage));

  if (!categoryMeta) {
    return (
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-24 text-center space-y-5">
        <SearchX className="w-12 h-12 text-[#B8860B]/50 mx-auto" />
        <h1 className="font-display text-3xl font-medium text-[#241A12]">Category Not Found</h1>
        <p className="text-sm text-[#6B5945] max-w-md mx-auto">
          The category you're looking for doesn't exist or has been renamed.
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.22em] transition-all hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
      </div>
    );
  }

  // Direct deep link to a subcategory: wait for the API before declaring it missing.
  if (subSlug && !subcategoriesLoaded) {
    return (
      <div>
        <GoldHero
          title={categoryMeta.name}
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Categories', path: '/categories' },
            { label: categoryMeta.name, path: `/categories/${categoryMeta.id}` },
          ]}
          subtitle={`Explore Our ${categoryMeta.name} Collection`}
        />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-[4/4.6] rounded-3xl bg-[#EAD9B4] animate-pulse" />
                <div className="h-3 w-3/4 rounded-full bg-[#EAD9B4] animate-pulse" />
                <div className="h-3 w-1/3 rounded-full bg-[#EAD9B4] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (subSlug && !selectedSubcategory && subcategoriesError) {
    return <SubcategoryListingPage category={categoryMeta} subcategories={[]} error={subcategoriesError} onRetry={refreshSubcategories} />;
  }

  if (subSlug && !selectedSubcategory) {
    return (
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-24 text-center space-y-5">
        <SearchX className="w-12 h-12 text-[#B8860B]/50 mx-auto" />
        <h1 className="font-display text-3xl font-medium text-[#241A12]">Collection Not Found</h1>
        <p className="text-sm text-[#6B5945] max-w-md mx-auto">
          This collection may have been renamed or is currently hidden.
        </p>
        <Link
          to={`/categories/${categoryMeta.id}`}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.22em] transition-all hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {categoryMeta.name}
        </Link>
      </div>
    );
  }

  // Category landing: show the subcategory discovery grid while subcategories load,
  // then keep it only when the category actually has active collections.
  if (!subSlug && !forceProductView && (!subcategoriesLoaded || !!subcategoriesError || categorySubcategories.length > 0)) {
    return (
      <SubcategoryListingPage
        category={categoryMeta}
        subcategories={categorySubcategories}
        isLoading={!subcategoriesLoaded}
        error={subcategoriesError}
        onRetry={refreshSubcategories}
      />
    );
  }

  const pageTitle = selectedSubcategory ? selectedSubcategory.name : categoryMeta.name;
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    selectedSubcategory
      ? { label: categoryMeta.name, path: `/categories/${categoryMeta.id}` }
      : { label: categoryMeta.name },
    ...(selectedSubcategory ? [{ label: selectedSubcategory.name }] : []),
  ];

  const showCollectionsLink = categorySubcategories.length > 0 && !selectedSubcategory;

  return (
    <div>
      <GoldHero
        title={pageTitle}
        breadcrumbs={breadcrumbs}
        subtitle={
          selectedSubcategory
            ? `Explore our ${selectedSubcategory.name} collection from ${categoryMeta.name}`
            : categoryMeta.tagline
        }
        metaText={`${categoryProducts.length} Items Available`}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-8">
        {(selectedSubcategory || showCollectionsLink) && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              to={`/categories/${categoryMeta.id}`}
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8860B] hover:text-[#8A6A15] transition-colors"
            >
              <Layers className="w-4 h-4" />
              {selectedSubcategory ? `All ${categoryMeta.name} Collections` : 'Shop by Collection'}
            </Link>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B5945]/80">
              {selectedSubcategory ? selectedSubcategory.name : 'All Products'}
            </span>
          </div>
        )}

        {/* Category description panel */}
        <div className="mb-8 bg-[#FFFDF6] border border-[#6B5945]/15 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-[#3d2f1a]/90 leading-relaxed max-w-2xl">
            {categoryMeta.description} Every piece in this edit ships with dust-proof protective
            packaging and easy, flexible payment.
          </p>
          <Link
            to="/shop"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#B8860B] hover:text-[#8A6A15] transition-colors"
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
          <div className="py-16 text-center space-y-3 bg-[#FFFDF6] rounded-2xl border border-[#6B5945]/20 p-8 mt-2">
            <SearchX className="w-10 h-10 text-[#B8860B]/50 mx-auto" />
            <h3 className="text-base font-bold text-[#241A12]">No pieces here yet</h3>
            <p className="text-sm text-[#6B5945]">
              {selectedSubcategory
                ? 'This collection is being restocked. Explore the rest of the category meanwhile.'
                : 'This category is being restocked. Explore the full catalogue meanwhile.'}
            </p>
            {selectedSubcategory && (
              <Link
                to={`/categories/${categoryMeta.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#B8860B] hover:text-[#8A6A15] transition-colors"
              >
                View All {categoryMeta.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Closing gold band — alternates with the warm grid above */}
      <GoldBand
        eyebrow="Keep Exploring"
        title={`More From ${pageTitle} Awaits`}
        text="New pieces land every week — each one wear-tested, gift-wrapped and checkout ready."
        primaryCta={{ label: 'View Full Catalogue', path: '/shop' }}
        secondaryCta={{ label: 'All Categories', path: '/categories' }}
      />
    </div>
  );
};

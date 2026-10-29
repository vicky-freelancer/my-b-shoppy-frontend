import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, RefreshCw, SearchX } from 'lucide-react';
import { GoldBand } from '../components/GoldBand';
import { GoldHero } from '../components/GoldHero';
import { mediaUrl } from '../lib/api';
import { ProductCategory, SubcategoryItem } from '../types';

interface SubcategoryListingPageProps {
  category: ProductCategory;
  subcategories: SubcategoryItem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const SubcategoryListingPage: React.FC<SubcategoryListingPageProps> = ({
  category,
  subcategories,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const categoryPath = `/categories/${category.id}`;

  return (
    <div>
      <GoldHero
        title={category.name}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Categories', path: '/categories' },
          { label: category.name },
        ]}
        subtitle={`Explore Our ${category.name} Collection`}
        metaText={
          isLoading ? 'Loading collections' : `${subcategories.length} Collections`
        }
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        {error && subcategories.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#D8A83E]/40 bg-[#FAF1DD] px-4 py-3 text-sm text-[#6B5945]">
            <span>Some collections could not be refreshed. Showing the last available list.</span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8860B] hover:text-[#8A6A15] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div
            className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
            aria-busy="true"
            aria-label="Loading subcategories"
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="space-y-2.5">
                <div className="aspect-square rounded-2xl bg-[#EAD9B4] animate-pulse" />
                <div className="h-3 w-3/4 mx-auto rounded-full bg-[#EAD9B4] animate-pulse" />
              </div>
            ))}
          </div>
        ) : error && subcategories.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-[#FFFDF6] rounded-2xl border border-[#6B5945]/20 p-8">
            <SearchX className="w-12 h-12 text-[#B8860B]/50 mx-auto" />
            <h2 className="text-lg font-bold text-[#241A12]">
              Collections could not be loaded
            </h2>
            <p className="text-sm text-[#6B5945] max-w-md mx-auto">
              Please try again, or view all products in {category.name} meanwhile.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white font-semibold text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
              <Link
                to={`${categoryPath}?view=products`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[11px] uppercase tracking-[0.2em] transition-colors"
              >
                <Layers className="w-4 h-4" />
                View All Products
              </Link>
            </div>
          </div>
        ) : subcategories.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-[#FFFDF6] rounded-2xl border border-[#6B5945]/20 p-8">
            <Layers className="w-12 h-12 text-[#B8860B]/50 mx-auto" />
            <h2 className="text-lg font-bold text-[#241A12]">No collections yet</h2>
            <p className="text-sm text-[#6B5945] max-w-md mx-auto">
              New {category.name} collections are being curated. Browse all products meanwhile.
            </p>
            <Link
              to={`${categoryPath}?view=products`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[11px] uppercase tracking-[0.2em] transition-colors"
            >
              Shop All {category.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {subcategories.map((subcategory, index) => {
              const imageSrc = mediaUrl(subcategory.featuredImage);
              return (
                <Link
                  key={subcategory.id}
                  to={`${categoryPath}/${subcategory.slug}`}
                  className="group flex flex-col rounded-2xl border border-[#D8A83E]/45 bg-[#FFFDF6] overflow-hidden text-center shadow-[0_12px_28px_-24px_rgba(90,62,20,0.45)] transition-all duration-300 hover:border-[#B8860B] hover:shadow-[0_18px_36px_-24px_rgba(90,62,20,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8A83E]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#F8ECD0]">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={`${subcategory.name} — ${category.name}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F4D99B] to-[#D8A83E]">
                        <Layers className="w-8 h-8 sm:w-9 sm:h-9 text-[#FFF8E8]/80" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-[#111111]/75 text-[#E8C875] text-[9px] sm:text-[10px] font-bold tracking-[0.16em] backdrop-blur-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3 sm:px-4 sm:py-4">
                    <h2 className="font-display text-xs sm:text-base leading-snug text-[#241A12] group-hover:text-[#B8860B] transition-colors line-clamp-2">
                      {subcategory.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">
                      Shop now
                      <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <GoldBand
        eyebrow="Keep Exploring"
        title={`More From ${category.name} Awaits`}
        text="Discover every collection in one place — thoughtfully curated, gift-wrapped and checkout ready."
        primaryCta={{ label: 'View Full Catalogue', path: '/shop' }}
        secondaryCta={{ label: 'All Categories', path: '/categories' }}
      />
    </div>
  );
};

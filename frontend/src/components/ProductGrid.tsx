import React from 'react';
import { ProductItem } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, Database, SearchX, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: ProductItem[];
  currencySymbol: string;
  wishlistIds: string[];
  onToggleWishlist: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem, variant?: string) => void;
  onQuickView: (product: ProductItem) => void;
  sortBy: string;
  onSortChange: (sort: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular') => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalFilteredCount: number;
  isSupabaseLoading?: boolean;
  isSupabaseSynced?: boolean;
  onOpenSupabaseSync?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currencySymbol,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  sortBy,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalFilteredCount,
  isSupabaseLoading = false,
  isSupabaseSynced = false,
  onOpenSupabaseSync
}) => {
  const startIndex = totalFilteredCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalFilteredCount);

  // Generate pagination items
  const renderPaginationItems = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex-1 space-y-6">

      {/* Top Filter and Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8A83E]/30">

        {/* Left: Product Counts & Supabase Sync Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs sm:text-sm text-[#6B5945] font-medium">
            Showing <span className="text-[#241A12] font-bold">{startIndex}–{endIndex}</span> of{' '}
            <span className="text-[#B8860B] font-bold">{totalFilteredCount}</span> products
          </p>

          {/* Supabase status badge */}
          {onOpenSupabaseSync && (
            <button
              onClick={onOpenSupabaseSync}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#FAF1DD] text-[#8A6A15] border border-[#D8A83E]/60 hover:border-[#B8860B] transition cursor-pointer"
              title="Click to manage Supabase database"
            >
              <Database className="w-3 h-3" />
              <span>{isSupabaseLoading ? 'Connecting...' : (isSupabaseSynced ? 'Supabase Live DB' : 'Supabase Ready')}</span>
            </button>
          )}
        </div>

        {/* Right: Sort By Dropdown */}
        <div className="flex items-center space-x-4 self-end sm:self-auto">

          {/* SORT BY */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B5945]">
              SORT BY:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-[#FFFDF6] border border-[#6B5945]/30 text-[#241A12] text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#B8860B] cursor-pointer"
            >
              <option value="newest">New Arrivals</option>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state from Supabase */}
      {isSupabaseLoading && (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#B8860B] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#6B5945]">Synchronizing products with Supabase...</p>
        </div>
      )}

      {/* Empty State */}
      {!isSupabaseLoading && products.length === 0 && (
        <div className="py-20 text-center space-y-4 bg-[#FFFDF6] rounded-2xl border border-[#6B5945]/20 p-8">
          <SearchX className="w-12 h-12 text-[#B8860B]/50 mx-auto" />
          <h3 className="text-lg font-bold text-[#241A12]">No products found</h3>
          <p className="text-sm text-[#6B5945] max-w-md mx-auto">
            Try adjusting your category, price range, or material filters to view available items.
          </p>
        </div>
      )}

      {/* Product Cards Grid */}
      {!isSupabaseLoading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currencySymbol={currencySymbol}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="pt-8 pb-4 flex items-center justify-center space-x-2">
          {/* Previous Page */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className="p-2 rounded-lg border border-[#6B5945]/30 text-[#6B5945] hover:text-[#B8860B] hover:border-[#B8860B] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {renderPaginationItems().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-[#6B5945]/70 text-xs font-mono">
                  ...
                </span>
              );
            }

            const pageNumber = Number(page);
            const isCurrent = pageNumber === currentPage;

            return (
              <button
                key={`page-${pageNumber}`}
                onClick={() => onPageChange(pageNumber)}
                className={`min-w-[36px] h-9 px-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-transparent border border-[#B8860B] text-[#B8860B] shadow-[0_0_8px_rgba(184,134,11,0.25)]'
                    : 'border border-[#6B5945]/25 text-[#6B5945] hover:text-[#241A12] hover:border-[#B8860B]/60'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            className="p-2 rounded-lg border border-[#6B5945]/30 text-[#6B5945] hover:text-[#B8860B] hover:border-[#B8860B] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
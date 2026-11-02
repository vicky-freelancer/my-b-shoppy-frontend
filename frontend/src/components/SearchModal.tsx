import { useQuery } from '@tanstack/react-query';
import { searchProducts, productReadPolicy } from '../lib/productQueries';
import { ProductImage } from './ProductImage';
import React, { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../types';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  onSelectProduct: (product: ProductItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  currencySymbol,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);
  const search = useQuery({ ...productReadPolicy, queryKey: ['products', 'search', debouncedQuery],
    queryFn: ({ signal }) => searchProducts(debouncedQuery, signal),
    enabled: isOpen && !!debouncedQuery });
  const results = query.trim() === debouncedQuery ? search.data || [] : [];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/70 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="relative w-full max-w-2xl bg-[#FFFDF6] border border-[#D8A83E]/50 rounded-[24px] shadow-2xl overflow-hidden text-[#241A12]">

        {/* Search Input Bar */}
        <div className="bg-[#FAF1DD] p-4 sm:p-5 border-b border-[#D8A83E]/40 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#B8860B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hair accessories, AD jewellery, bags, anti tarnish jewellery, stationery..."
            className="w-full bg-transparent text-sm sm:text-base text-[#241A12] placeholder-[#6B5945]/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#6B5945] hover:text-[#241A12] cursor-pointer px-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B5945] hover:text-[#241A12] hover:bg-[#E8C875]/40 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#6B5945]">
              Type keywords above to search across our luxury artificial jewelry & accessory catalog.
            </div>
          ) : (query.trim() !== debouncedQuery || search.isPending) ? (<p role="status" className="py-8 text-center text-xs text-[#6B5945]">Searching...</p>) : search.error ? (<p role="alert" className="py-8 text-center text-xs text-[#6B5945]">Search could not be loaded. <button onClick={() => search.refetch()}>Try again</button></p>) : results.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-[#241A12]">No products matching "{query}"</p>
              <p className="text-xs text-[#6B5945]">Try searching for Gold, Platinum, Ring, Bow, or Bag</p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-[#FAF1DD] hover:bg-[#F4D99B]/50 border border-[#D8A83E]/30 hover:border-[#B8860B] flex items-center justify-between gap-3 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ProductImage
                    product={product}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-[#F8ECD0] shrink-0 border border-[#D8A83E]/40"
                  />
                  <div className="min-w-0 text-left">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#241A12] group-hover:text-[#B8860B] transition-colors truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#6B5945]">
                      {product.category} {product.material ? `• ${product.material}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-bold font-mono text-[#B8860B]">
                    {currencySymbol}{product.price.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#B8860B]/50 group-hover:text-[#B8860B] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

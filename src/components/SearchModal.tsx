import React, { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../types';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  currencySymbol: string;
  onSelectProduct: (product: ProductItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
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

  if (!isOpen) return null;

  const results = query.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          (p.material && p.material.toLowerCase().includes(query.toLowerCase())) ||
          (p.stone && p.stone.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="relative w-full max-w-2xl bg-[#141312] border border-[#38332c] rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#272420] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#d4af37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rings, necklaces, cuffs, claw clips, bags, silk scrunchies..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white cursor-pointer px-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#272420] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Type keywords above to search across our luxury artificial jewelry & accessory catalog.
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">No products matching "{query}"</p>
              <p className="text-xs text-slate-500">Try searching for Gold, Platinum, Ring, Bow, or Bag</p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-3 rounded-xl bg-[#181615] hover:bg-[#221f1c] border border-[#272420] hover:border-[#4d4437] flex items-center justify-between gap-3 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-black shrink-0 border border-[#38332c]"
                  />
                  <div className="min-w-0 text-left">
                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#d4af37] transition-colors truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {product.category} {product.material ? `• ${product.material}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-bold font-mono text-[#d4af37]">
                    {currencySymbol}{product.price.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

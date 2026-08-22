import React, { useState } from 'react';
import { FilterState, ProductCategory } from '../types';
import { Filter, X, Check, RefreshCw } from 'lucide-react';

interface ShopSidebarProps {
  categories: ProductCategory[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onClearFilters: () => void;
  totalProductsCount: number;
  currencySymbol?: string;
}

export const ShopSidebar: React.FC<ShopSidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
  totalProductsCount,
  currencySymbol = '₹'
}) => {
  const [localPriceMax, setLocalPriceMax] = useState<number>(filters.priceRange[1]);
  const [localPriceMin, setLocalPriceMin] = useState<number>(filters.priceRange[0]);

  // Materials list
  const materialsList = [
    { id: '18K Gold', label: '18K Gold' },
    { id: 'Platinum', label: 'Platinum' },
    { id: 'Rose Gold', label: 'Rose Gold' },
    { id: 'Silver', label: 'Silver' },
    { id: 'Stainless Steel', label: 'Stainless Steel' },
    { id: 'Silk / Satin', label: 'Silk / Satin' },
    { id: 'Leather', label: 'Leather' }
  ];

  // Stones list
  const stonesList = [
    { id: 'Diamond', label: 'Diamond' },
    { id: 'Emerald', label: 'Emerald' },
    { id: 'Sapphire', label: 'Sapphire' },
    { id: 'Ruby', label: 'Ruby' },
    { id: 'Pearl', label: 'Pearl' },
    { id: 'Cubic Zirconia', label: 'Cubic Zirconia' }
  ];

  // Category toggle handler
  const handleCategoryToggle = (categoryId: string) => {
    const exists = filters.categories.includes(categoryId);
    const newCategories = exists
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];

    onFilterChange({
      ...filters,
      categories: newCategories
    });
  };

  // Material toggle handler
  const handleMaterialToggle = (material: string) => {
    const exists = filters.materials.includes(material);
    const newMaterials = exists
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];

    onFilterChange({
      ...filters,
      materials: newMaterials
    });
  };

  // Stone toggle handler
  const handleStoneToggle = (stone: string) => {
    const exists = filters.stones.includes(stone);
    const newStones = exists
      ? filters.stones.filter((s) => s !== stone)
      : [...filters.stones, stone];

    onFilterChange({
      ...filters,
      stones: newStones
    });
  };

  const handleApplyFilters = () => {
    onFilterChange({
      ...filters,
      priceRange: [localPriceMin, localPriceMax]
    });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.materials.length + 
    filters.stones.length + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 space-y-8 bg-[#121110] p-5 sm:p-6 rounded-2xl border border-[#26231f] shadow-lg">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#26231f]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#d4af37]" />
          <h2 className="text-xs font-black uppercase tracking-widest text-[#f5f5f5]">
            Filter Catalog
          </h2>
        </div>
        {activeFiltersCount > 0 && (
          <span className="text-[11px] font-bold text-[#0f0e0d] bg-[#d4af37] px-2 py-0.5 rounded-full">
            {activeFiltersCount} active
          </span>
        )}
      </div>

      {/* 1. CATEGORIES FILTER (Matching reference screenshot) */}
      <div className="space-y-3.5">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#d4af37]">
          CATEGORIES
        </h3>
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {categories.map((category) => {
            const isChecked = filters.categories.includes(category.id);
            return (
              <label
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className="flex items-center text-xs text-slate-300 hover:text-white cursor-pointer group select-none py-0.5"
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-[#d4af37] border-[#d4af37] text-black'
                        : 'border-[#423d35] bg-[#1a1816] group-hover:border-[#736a5c]'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-[12.5px] ${isChecked ? 'text-white font-semibold' : 'text-slate-300'}`}>
                    {category.name}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. PRICE RANGE FILTER (Matching reference screenshot) */}
      <div className="space-y-3.5 pt-4 border-t border-[#26231f]">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-[#d4af37]">
            PRICE RANGE
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {currencySymbol}{localPriceMin.toLocaleString('en-IN')} - {currencySymbol}{localPriceMax >= 50000 ? '50,000+' : localPriceMax.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Range Track */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={50000}
            step={250}
            value={localPriceMax}
            onChange={(e) => setLocalPriceMax(Number(e.target.value))}
            className="w-full h-1.5 bg-[#272420] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>{currencySymbol}0</span>
            <span>{currencySymbol}50,000+</span>
          </div>
        </div>

        {/* Min / Max Input Fields */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-xs text-slate-500">{currencySymbol}</span>
            <input
              type="number"
              value={localPriceMin}
              onChange={(e) => setLocalPriceMin(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-[#181615] border border-[#38332c] rounded-lg pl-6 pr-2 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-xs text-slate-500">{currencySymbol}</span>
            <input
              type="number"
              value={localPriceMax}
              onChange={(e) => setLocalPriceMax(Number(e.target.value))}
              placeholder="50000"
              className="w-full bg-[#181615] border border-[#38332c] rounded-lg pl-6 pr-2 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </div>

      {/* 3. MATERIAL FILTER (Matching reference screenshot) */}
      <div className="space-y-3.5 pt-4 border-t border-[#26231f]">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#d4af37]">
          MATERIAL
        </h3>
        <div className="space-y-2.5">
          {materialsList.map((mat) => {
            const isChecked = filters.materials.includes(mat.id);
            return (
              <label
                key={mat.id}
                onClick={() => handleMaterialToggle(mat.id)}
                className="flex items-center text-xs text-slate-300 hover:text-white cursor-pointer group select-none py-0.5"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center mr-2.5 transition-colors ${
                    isChecked
                      ? 'bg-[#d4af37] border-[#d4af37] text-black'
                      : 'border-[#423d35] bg-[#1a1816] group-hover:border-[#736a5c]'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-[12.5px] ${isChecked ? 'text-white font-semibold' : 'text-slate-300'}`}>
                  {mat.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. STONE / ACCENT FILTER (Matching reference screenshot) */}
      <div className="space-y-3.5 pt-4 border-t border-[#26231f]">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#d4af37]">
          STONE / GEM
        </h3>
        <div className="space-y-2.5">
          {stonesList.map((st) => {
            const isChecked = filters.stones.includes(st.id);
            return (
              <label
                key={st.id}
                onClick={() => handleStoneToggle(st.id)}
                className="flex items-center text-xs text-slate-300 hover:text-white cursor-pointer group select-none py-0.5"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center mr-2.5 transition-colors ${
                    isChecked
                      ? 'bg-[#d4af37] border-[#d4af37] text-black'
                      : 'border-[#423d35] bg-[#1a1816] group-hover:border-[#736a5c]'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-[12.5px] ${isChecked ? 'text-white font-semibold' : 'text-slate-300'}`}>
                  {st.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. APPLY FILTERS & CLEAR ALL BUTTONS (Matching reference screenshot) */}
      <div className="space-y-3 pt-4 border-t border-[#26231f]">
        <button
          onClick={handleApplyFilters}
          className="w-full py-2.5 px-4 rounded-lg bg-transparent border border-[#d4af37] hover:bg-[#d4af37] text-[#d4af37] hover:text-black font-extrabold text-xs uppercase tracking-widest transition duration-200 cursor-pointer text-center shadow-sm"
        >
          APPLY FILTERS
        </button>

        <button
          onClick={onClearFilters}
          className="w-full py-1 text-center text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#d4af37] transition cursor-pointer"
        >
          CLEAR ALL
        </button>
      </div>

    </aside>
  );
};

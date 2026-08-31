import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { CATEGORIES_CATALOG } from '../storeConfig';

const AUTOPLAY_MS = 4000;

export const CategoryHeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % CATEGORIES_CATALOG.length) + CATEGORIES_CATALOG.length) % CATEGORIES_CATALOG.length);
  }, []);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % CATEGORIES_CATALOG.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const activeCategory = CATEGORIES_CATALOG[activeIndex];

  return (
    <section
      className="relative w-full bg-gradient-to-br from-[#e9cd77] via-[#d4af37] to-[#b8942a] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Shop by category highlights"
    >
      {/* Subtle ambient sheen */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-14">
          {/* ---------- 1:1 SQUARE IMAGE ---------- */}
          <div className="relative w-full max-w-[300px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[520px] shrink-0">
            <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-[#a5821f]/60 shadow-2xl">
              {CATEGORIES_CATALOG.map((category, index) => {
                const isActive = index === activeIndex;
                return (
                  <img
                    key={category.id}
                    src={category.imageUrl}
                    alt={`${category.name} collection`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  />
                );
              })}

              {/* Badge */}
              {activeCategory.badge && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 inline-flex px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#241b06] text-[#f5e6b8] text-[9px] sm:text-[10.5px] font-black uppercase tracking-widest shadow-lg">
                  {activeCategory.badge}
                </span>
              )}
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous category"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-full bg-black/50 hover:bg-black border border-white/30 hover:border-black text-white hover:text-white backdrop-blur-md transition-all duration-300 cursor-pointer flex"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next category"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-full bg-black/50 hover:bg-black border border-white/30 hover:border-black text-white hover:text-white backdrop-blur-md transition-all duration-300 cursor-pointer flex"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* ---------- SIDE INFO ---------- */}
          <div className="flex-1 w-full text-left max-w-xl lg:max-w-none text-center lg:text-left">
            <div className="space-y-4 sm:space-y-5">
              {/* Counter + label */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-3 text-center sm:text-left">
                <span className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#4a3a10]/50 bg-[#241b06]/5 text-[9px] sm:text-[10.5px] font-extrabold uppercase tracking-widest text-[#4a3a10]">
                  <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {(activeIndex + 1).toString().padStart(2, '0')} / {CATEGORIES_CATALOG.length.toString().padStart(2, '0')}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.05] text-[#241b06]">
                  {activeCategory.name}
                </h2>
              </div>

              <p className="text-[#3d2f0a] text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                {activeCategory.tagline}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs font-semibold">
                  <span className="font-mono text-[#241b06] text-sm sm:text-base font-extrabold">
                    From ₹{activeCategory.startingPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#4a3a10]/40 hidden sm:inline-block"></span>
                  <span className="text-[#5a4712] uppercase tracking-widest text-[11px] font-bold">
                    {activeCategory.count}+ Curated Items
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3.5 pt-1 sm:pt-2 justify-center sm:justify-start">
                <Link
                  to={`/categories/${activeCategory.id}`}
                  tabIndex={0}
                  className="group inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-[#241b06] hover:bg-black text-[#f5e6b8] hover:text-[#fae19c] font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore {activeCategory.name}
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/shop"
                  tabIndex={0}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl border-2 border-[#241b06] hover:bg-[#241b06] text-[#241b06] hover:text-[#f5e6b8] font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors duration-300"
                >
                  Shop All
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dots + progress */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-2.5">
          {CATEGORIES_CATALOG.map((category, index) => (
            <button
              key={category.id}
              onClick={(e) => { e.stopPropagation(); goTo(index); }}
              aria-label={`Go to ${category.name}`}
              aria-current={index === activeIndex}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-400 cursor-pointer ${
                index === activeIndex
                  ? 'w-6 sm:w-8 bg-[#241b06] shadow-[0_0_10px_rgba(36,27,6,0.6)]'
                  : 'w-1.5 sm:w-2 bg-[#241b06]/35 hover:bg-[#241b06]/60'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

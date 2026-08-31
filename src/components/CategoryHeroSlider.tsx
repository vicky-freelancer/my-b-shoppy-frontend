import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { CATEGORIES_CATALOG } from '../storeConfig';

const AUTOPLAY_MS = 3000;

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

  return (
    <section
      className="relative h-[50vh] sm:h-[65vh] lg:h-[78vh] min-h-[360px] sm:min-h-[480px] lg:min-h-[540px] max-h-[760px] overflow-hidden bg-[#0f0e0d]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Shop by category highlights"
    >
      {CATEGORIES_CATALOG.map((category, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={category.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={category.imageUrl}
              alt={`${category.name} collection`}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Slide content */}
            <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-col justify-end sm:justify-center pb-16 sm:pb-0">
              <div
                className={`max-w-2xl space-y-3 sm:space-y-5 lg:space-y-6 transform transition-all duration-700 delay-150 ${
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#d4af37]/60 bg-black/50 backdrop-blur-sm text-[9px] sm:text-[10.5px] font-extrabold uppercase tracking-widest text-[#fae19c]">
                    <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {(index + 1).toString().padStart(2, '0')} / {CATEGORIES_CATALOG.length.toString().padStart(2, '0')}
                  </span>
                  {category.badge && (
                    <span className="inline-flex px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#d4af37] text-[#241b06] text-[9px] sm:text-[10.5px] font-black uppercase tracking-widest shadow-lg">
                      {category.badge}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-xl sm:text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.05] text-[#d4af37]">
                  {category.name}
                </h1>

                <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                  {category.tagline}
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
                  <Link
                    to={`/categories/${category.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className="group inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Explore {category.name}
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/shop"
                    tabIndex={isActive ? 0 : -1}
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl border border-white/25 hover:border-[#d4af37] bg-black/30 backdrop-blur-sm text-white hover:text-[#d4af37] font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors duration-300"
                  >
                    Shop All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Previous category"
        className="hidden sm:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-black/40 hover:bg-[#d4af37] border border-white/15 hover:border-[#d4af37] text-white hover:text-black backdrop-blur-md transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Next category"
        className="hidden sm:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-black/40 hover:bg-[#d4af37] border border-white/15 hover:border-[#d4af37] text-white hover:text-black backdrop-blur-md transition-all duration-300 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots + progress */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
        {CATEGORIES_CATALOG.map((category, index) => (
          <button
            key={category.id}
            onClick={(e) => { e.stopPropagation(); goTo(index); }}
            aria-label={`Go to ${category.name}`}
            aria-current={index === activeIndex}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-400 cursor-pointer ${
              index === activeIndex
                ? 'w-6 sm:w-8 bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                : 'w-1.5 sm:w-2 bg-white/35 hover:bg-white/60'
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { CATEGORIES_CATALOG } from '../storeConfig';

const AUTOPLAY_MS = 3000;

/**
 * Home page hero — auto-playing slideshow of shop categories.
 */
export const CategoryHeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  return (
    <section
      className="relative h-[78vh] min-h-[540px] max-h-[760px] overflow-hidden bg-[#0f0e0d]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Shop by category highlights"
    >
      {/* Slides */}
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
            {/* Background image */}
            <img
              src={category.imageUrl}
              alt={`${category.name} collection`}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 w-full h-full object-cover"
            />


            {/* Slide content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div
                className={`max-w-2xl space-y-6 transform transition-all duration-700 delay-150 ${
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/60 bg-black/50 backdrop-blur-sm text-[10.5px] font-extrabold uppercase tracking-widest text-[#fae19c]">
                    <Package className="w-3.5 h-3.5" />
                    Category {(index + 1).toString().padStart(2, '0')} / {CATEGORIES_CATALOG.length.toString().padStart(2, '0')}
                  </span>
                  {category.badge && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-[#d4af37] text-[#241b06] text-[10.5px] font-black uppercase tracking-widest shadow-lg">
                      {category.badge}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-2xl sm:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.05] text-[#d4af37]">
                  {category.name}
                </h1>

                <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                  {category.tagline}
                </p>



                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <Link
                    to={`/categories/${category.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-sm uppercase tracking-widest shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Explore {category.name}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/shop"
                    tabIndex={isActive ? 0 : -1}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/25 hover:border-[#d4af37] bg-black/30 backdrop-blur-sm text-white hover:text-[#d4af37] font-bold text-sm uppercase tracking-widest transition-colors duration-300"
                  >
                    Shop All Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous category"
        className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-black/40 hover:bg-[#d4af37] border border-white/15 hover:border-[#d4af37] text-white hover:text-black backdrop-blur-md transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next category"
        className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-black/40 hover:bg-[#d4af37] border border-white/15 hover:border-[#d4af37] text-white hover:text-black backdrop-blur-md transition-all duration-300 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots + progress */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {CATEGORIES_CATALOG.map((category, index) => (
          <button
            key={category.id}
            onClick={() => goTo(index)}
            aria-label={`Go to ${category.name}`}
            aria-current={index === activeIndex}
            className={`h-2 rounded-full transition-all duration-400 cursor-pointer ${
              index === activeIndex
                ? 'w-8 bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                : 'w-2 bg-white/35 hover:bg-white/60'
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

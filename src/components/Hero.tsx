import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { HERO_SLIDES, STORE_CONFIG } from '../storeConfig';

const AUTOPLAY_MS = 2000;

export const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const slides = HERO_SLIDES;
  const count = slides.length;

  const goTo = (index: number) => {
    setActiveIndex(((index % count) + count) % count);
  };

  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, count]);

  const active = slides[activeIndex];

  // Slide ids that map to a real category route; the rest point to /shop
  const categoryIds = useMemo(() => new Set(STORE_CONFIG.categories.map((c) => c.id)), []);
  const activeTarget = categoryIds.has(active.id) ? `/categories/${active.id}` : '/shop';

  // Preload the first two slide images eagerly
  const eagerSlides = useMemo(() => new Set([0, 1]), []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
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
      className="relative flex min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] items-center overflow-hidden bg-[#d9a33f] texture-grain border-b border-[#6B5945]/15"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="MY B SHOPPY collections"
    >
      {/* ------- Full-bleed slide images ------- */}
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <img
              key={slide.id}
              src={slide.image}
              alt=""
              loading={eagerSlides.has(index) ? 'eager' : 'lazy'}
              decoding={index === 0 ? 'sync' : 'async'}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.06]'
              }`}
            />
          );
        })}
      </div>

      {/* ------- Legibility overlays ------- */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#2b1a09]/85 via-[#2b1a09]/45 to-[#2b1a09]/10"></div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#2b1a09]/40 via-transparent to-[#2b1a09]/10"></div>
      <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-gradient-to-t from-[#2b1a09]/50 to-transparent"></div>

      {/* ------- Editorial content ------- */}
      <div className="relative max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-14">
        <div className="max-w-2xl text-center sm:text-left">
          <p
            key={`eyebrow-${active.id}`}
            className="script text-[30px] sm:text-[36px] text-[#F4D99B] hero-text-in hero-text-in-1"
          >
            {active.eyebrow}
          </p>

          <h1
            key={`title-${active.id}`}
            className="mt-2 font-display text-[46px] leading-[1.03] sm:text-[64px] lg:text-[76px] xl:text-[86px] font-medium text-[#FFFDF6] hero-text-in hero-text-in-2"
          >
            {active.headlineLine1}
            <br />
            <em className="italic text-gold-gradient-light">{active.headlineLine2}</em>
          </h1>

          <p
            key={`sub-${active.id}`}
            className="mt-4 text-[11px] sm:text-xs font-semibold tracking-[0.4em] text-[#F4D99B]/90 hero-text-in hero-text-in-3"
          >
            {active.subheading}
          </p>

          {/* decorative heart + line */}
          <div
            key={`divider-${active.id}`}
            className="mt-5 flex items-center justify-center sm:justify-start gap-3 hero-text-in hero-text-in-3"
          >
            <span className="h-px w-14 sm:w-20 bg-[#F4D99B]/60"></span>
            <Heart className="w-4 h-4 fill-[#D8A83E] text-[#D8A83E]" />
            <span className="h-px w-14 sm:w-20 bg-[#F4D99B]/60"></span>
          </div>

          {/* Buttons */}
          <div
            key={`cta-${active.id}`}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3.5 hero-text-in hero-text-in-4"
          >
            <Link
              to={activeTarget}
              className="btn-arrow-cta group inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-[#D8A83E] text-[#111111] hover:bg-[#E8C875] font-semibold text-[12px] uppercase tracking-[0.22em] shadow-[0_18px_36px_-14px_rgba(17,17,17,0.55)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore More
              <ArrowRight className="w-4 h-4 arrow" />
            </Link>
            <Link
              to="/shop"
              className="btn-arrow-cta group inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full border-2 border-[#F4D99B]/80 text-[#FFFDF6] hover:bg-[#FFFDF6]/10 font-semibold text-[12px] uppercase tracking-[0.22em] transition-all duration-300 hover:-translate-y-0.5"
            >
              Shop All
              <Sparkles className="w-4 h-4 text-[#F4D99B]" />
            </Link>
          </div>
        </div>
      </div>

      {/* ------- Side arrows ------- */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/30 text-[#FFFDF6] hover:bg-[#D8A83E] hover:text-[#111111] hover:border-[#D8A83E] transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/30 text-[#FFFDF6] hover:bg-[#D8A83E] hover:text-[#111111] hover:border-[#D8A83E] transition-all duration-300 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ------- Pagination dots ------- */}
      <div className="absolute bottom-6 inset-x-0 z-10 flex items-center justify-center gap-2.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}: ${slide.headlineLine1} ${slide.headlineLine2}`}
            aria-current={index === activeIndex}
            className={`rounded-full transition-all duration-400 cursor-pointer ${
              index === activeIndex
                ? 'w-8 h-2.5 bg-[#D8A83E] shadow-[0_0_10px_rgba(216,168,62,0.7)]'
                : 'w-2.5 h-2.5 bg-[#FFFDF6]/50 hover:bg-[#FFFDF6]/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
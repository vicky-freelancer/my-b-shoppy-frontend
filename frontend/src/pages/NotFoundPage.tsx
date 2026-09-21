import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Home, ShoppingBag } from 'lucide-react';
import { GoldBand } from '../components/GoldBand';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-[#d9a33f]">
      {/* Ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#E8C875]/35 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/5 w-96 h-96 bg-white/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 py-28 sm:py-36 text-center space-y-7">
        <p className="font-display text-[110px] sm:text-[160px] leading-none font-medium text-transparent bg-clip-text bg-gradient-to-b from-[#D8A83E] via-[#E8C875]/70 to-transparent select-none">
          404
        </p>

        <h1
          className="font-display font-medium text-[#241A12] -mt-4 sm:-mt-10"
          style={{ fontSize: 'clamp(28px, 4.4vw, 44px)' }}
        >
          This Page <em className="italic text-gold-gradient">Wandered Off</em>
        </h1>

        <p className="text-sm sm:text-base text-[#6B5945] max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has moved. Let's guide you back to the
          beautiful things.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-sm uppercase tracking-[0.22em] transition-all duration-300 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#111111]/50 hover:border-[#B8860B] text-[#241A12] hover:text-[#B8860B] font-semibold text-sm uppercase tracking-[0.22em] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse the Shop
          </Link>
        </div>

        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#6B5945] hover:text-[#B8860B] transition-colors pt-4"
        >
          <Compass className="w-4 h-4" />
          Explore Categories Instead
        </Link>
      </div>

      {/* Closing band — alternates with the warm 404 content above */}
      <GoldBand
        eyebrow="Error 404"
        title="Let's Get You Back on Track"
        text="The treasure you seek may have moved — our storefront and catalogue are always right where you left them."
        primaryCta={{ label: 'Back to Home', path: '/' }}
        secondaryCta={{ label: 'Browse Categories', path: '/categories' }}
      />
    </div>
  );
};
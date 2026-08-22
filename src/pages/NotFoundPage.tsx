import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Home, ShoppingBag } from 'lucide-react';
import { GoldBand } from '../components/GoldBand';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/8 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 text-center space-y-7">
        <p className="font-display text-[110px] sm:text-[160px] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] via-[#fae19c]/60 to-transparent select-none">
          404
        </p>

        <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#f3f0e6] -mt-4 sm:-mt-10">
          This Page Wandered Off
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has moved. Let's guide you back to the
          beautiful things.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-[#4d4437] hover:border-[#d4af37] text-[#f2efe6] hover:text-[#d4af37] font-bold text-sm uppercase tracking-widest transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse the Shop
          </Link>
        </div>

        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#d4af37] transition-colors pt-4"
        >
          <Compass className="w-4 h-4" />
          Explore Categories Instead
        </Link>
      </div>

      {/* Closing gold band — alternates with the dark 404 content above */}
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

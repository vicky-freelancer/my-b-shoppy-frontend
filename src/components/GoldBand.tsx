import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface GoldBandCta {
  label: string;
  path: string;
}

interface GoldBandProps {
  eyebrow?: string;
  title: string;
  text?: string;
  primaryCta?: GoldBandCta;
  secondaryCta?: GoldBandCta;
}

/**
 * Full-width solid gold content band used to alternate
 * black / gold page sections across every page.
 */
export const GoldBand: React.FC<GoldBandProps> = ({
  eyebrow,
  title,
  text,
  primaryCta,
  secondaryCta,
}) => {
  return (
    <section className="relative bg-gradient-to-br from-[#f2c94e] via-[#e4a21b] to-[#c58b12] overflow-hidden">
      {/* Ambient sheen */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center space-y-5">
        {eyebrow && (
          <span className="block text-[11px] font-black uppercase tracking-widest text-[#4a3a10]">
            {eyebrow}
          </span>
        )}

        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#241b06] leading-tight max-w-2xl mx-auto">
          {title}
        </h2>

        {text && (
          <p className="text-sm sm:text-base text-[#3d2f0a] font-medium max-w-xl mx-auto leading-relaxed">
            {text}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            {primaryCta && (
              <Link
                to={primaryCta.path}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#241b06] hover:bg-black text-[#f5e6b8] hover:text-[#fae19c] font-extrabold text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
              >
                {primaryCta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.path}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-[#241b06]/60 hover:border-[#241b06] text-[#241b06] hover:bg-[#241b06]/10 font-extrabold text-xs uppercase tracking-widest transition-colors"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

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
 * Warm champagne/cream call-to-action band used to close out inner pages.
 */
export const GoldBand: React.FC<GoldBandProps> = ({
  eyebrow,
  title,
  text,
  primaryCta,
  secondaryCta,
}) => {
  return (
    <section className="relative bg-gold-soft border-y border-[#D8A83E]/30 overflow-hidden">
      <div className="absolute -top-24 right-[18%] w-96 h-96 bg-white/50 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute -bottom-32 left-[12%] w-80 h-80 bg-[#E8C875]/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-18 text-center space-y-5">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#B8860B]">
            <span aria-hidden="true" className="mr-2">✦</span>
            {eyebrow}
          </p>
        )}

        <h2
          className="font-display font-medium text-[#241A12] leading-tight max-w-2xl mx-auto"
          style={{ fontSize: 'clamp(30px, 4vw, 46px)' }}
        >
          {title}
        </h2>

        {text && (
          <p className="max-w-xl mx-auto text-[15px] leading-relaxed text-[#3d2f1a]/90">{text}</p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            {primaryCta && (
              <Link
                to={primaryCta.path}
                className="btn-arrow-cta group inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.24em] shadow-[0_18px_36px_-14px_rgba(17,17,17,0.5)] transition-all duration-300 hover:-translate-y-0.5"
              >
                {primaryCta.label}
                <ArrowRight className="w-4 h-4 arrow" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.path}
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full border-2 border-[#111111]/50 hover:border-[#111111] text-[#111111] hover:bg-[#111111]/5 font-semibold text-[12px] uppercase tracking-[0.24em] transition-colors"
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
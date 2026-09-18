import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow?: string;
  titleBefore?: string;
  titleItalic?: string;
  titleAfter?: string;
  subtext?: string;
  center?: boolean;
  linkLabel?: string;
  linkPath?: string;
  light?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  titleBefore,
  titleItalic,
  titleAfter,
  subtext,
  center = false,
  linkLabel,
  linkPath,
  light = false,
}) => {
  return (
    <div className={`flex flex-col sm:flex-row ${center ? 'justify-center' : 'justify-between'} sm:items-end gap-5`}>
      <div className={`space-y-3 ${center ? 'text-center mx-auto' : ''}`}>
        {eyebrow && (
          <p className={`text-[11px] font-bold uppercase tracking-[0.34em] ${light ? 'text-[#F4D99B]' : 'text-black'}`}>
            <span aria-hidden="true" className="mr-2">✦</span>
            {eyebrow}
          </p>
        )}
        <h2
          className={`font-display font-medium tracking-tight leading-[1.05] ${
            light ? 'text-[#FFF8E8]' : 'text-black'
          }`}
          style={{ fontSize: 'clamp(34px, 4.6vw, 58px)' }}
        >
          {titleBefore}{' '}
          {titleItalic && <em className={`italic ${light ? 'text-gold-gradient' : 'text-black'}`}>{titleItalic}</em>}
          {titleAfter && titleAfter}
        </h2>
        {subtext && (
          <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] pt-1 ${
            light ? 'text-[#F4D99B]/90' : 'text-black'
          }`}>
            {subtext}
          </p>
        )}
      </div>

      {linkLabel && linkPath && (
        <Link
          to={linkPath}
          className={`btn-arrow-cta group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.24em] transition-colors shrink-0 ${
            light ? 'text-[#F4D99B] hover:text-white' : 'text-black hover:text-black/70'
          }`}
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4 arrow text-[#B8860B]" />
        </Link>
      )}
    </div>
  );
};
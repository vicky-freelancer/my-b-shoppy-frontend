import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeroProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  subtitle?: string;
  image?: string;
  imageLabel?: string;
  metaText?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  breadcrumbs,
  subtitle,
  image = 'https://images.unsplash.com/photo-1611591475155-42e4fdb8885c?auto=format&fit=crop&w=800&q=80',
  imageLabel = 'Aura Gold Collection',
  metaText,
}) => {
  return (
    <div className="relative bg-gradient-to-r from-[#121110] via-[#1a1816] to-[#141210] border-b border-[#292520] overflow-hidden py-10 sm:py-14">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Typography Title & Breadcrumb */}
          <div className="space-y-3 z-10">
            <nav className="flex items-center flex-wrap space-x-2 text-xs font-semibold text-slate-400">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={`${crumb.label}-${index}`}>
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                  {crumb.path ? (
                    <Link to={crumb.path} className="hover:text-white transition">
                      {crumb.label}
                    </Link>
                  ) : index === breadcrumbs.length - 1 ? (
                    <span className="text-[#d4af37] font-bold">{crumb.label}</span>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f3f0e6]">
              {title}
            </h1>

            {subtitle && (
              <p className="text-slate-400 text-sm max-w-xl flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{subtitle}</span>
              </p>
            )}
          </div>

          {/* Right: Featured Banner Visual */}
          <div className="relative md:w-80 lg:w-96 h-28 sm:h-36 rounded-2xl overflow-hidden border border-[#3b352b] shadow-2xl shrink-0 group hidden md:block">
            <img
              src={image}
              alt={imageLabel}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-transparent to-black/60"></div>
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#fae19c] bg-[#121110]/80 px-2 py-0.5 rounded backdrop-blur-sm border border-[#4d4437]">
                {imageLabel}
              </span>
              {metaText && (
                <span className="text-slate-300 font-medium text-[11px] bg-black/60 px-2 py-0.5 rounded">
                  {metaText}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

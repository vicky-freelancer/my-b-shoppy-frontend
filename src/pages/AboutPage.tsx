import React from 'react';
import { Award, Gem, HandHeart, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { GoldHero } from '../components/GoldHero';
import { GoldBand } from '../components/GoldBand';
import { CATEGORIES_CATALOG } from '../storeConfig';
import { useSeo } from '../lib/seo';

const totalCatalogCount = CATEGORIES_CATALOG.reduce((acc, c) => acc + (c.count || 0), 0);

export const AboutPage: React.FC = () => {
  useSeo({
    title: 'About Us',
    description:
      'The story of my B shoppy — a luxury e-commerce house curating artificial jewels, hair accessories & gifts with premium quality and fair pricing.',
    path: '/about',
  });

  return (
    <div>
      <GoldHero
        title="Our Story"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'About Us' },
        ]}
        subtitle="Trendy. Affordable. Yours. — the three words that built everything we do at my B shoppy"
        metaText="Since Day One"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        {/* Story split section */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-5 order-2 lg:order-1">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f3f0e6] leading-tight">
              Born From a Simple Belief
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              my B shoppy started with one frustration: beautiful accessories were either
              heartbreakingly expensive or disappointingly flimsy. We believed the space between
              those two extremes deserved better — so we built it.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Today we curate over {totalCatalogCount.toLocaleString('en-IN')}+ pieces across nine
              collections, each tested for real life: anti-tarnish finishes that survive monsoons,
              silk that survives sleep, clasps that survive handbags. Every order ships in
              gift-ready packaging because we believe unboxing should feel like a celebration,
              not an errand.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              And because trust is our most treasured material, protected delivery lets you inspect
              every treasure before you pay a single rupee.
            </p>
          </div>

          <div className="relative order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
              alt="Curated gold jewellery collection"
              loading="lazy"
              className="rounded-3xl border border-[#38332c] shadow-2xl w-full h-[420px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#121110]/95 backdrop-blur-md border border-[#d4af37]/50 shadow-xl">
              <Gem className="w-6 h-6 text-[#d4af37]" />
              <div>
                <p className="text-sm font-extrabold text-white">9 Curated Collections</p>
                <p className="text-[11px] text-slate-400">One uncompromising standard</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats band — FULL GOLD SECTION alternating with dark story above */}
        <section className="relative bg-gradient-to-br from-[#e9cd77] via-[#d4af37] to-[#b8942a] overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: `${totalCatalogCount}+`, label: 'Curated Pieces' },
                { value: '25K+', label: 'Happy Shoppers' },
                { value: '4.9★', label: 'Average Rating' },
                { value: '24h', label: 'Dispatch Time' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1.5">
                  <p className="font-display text-3xl sm:text-4xl font-bold text-[#241b06]">
                    {stat.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-[#4a3a10] font-extrabold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
              What We Stand For
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f3f0e6]">
              The Values Behind Every Order
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Award,
                title: 'Quality First',
                desc: 'Every design is wear-tested by our own team before launch. If it fades, snags, or tarnishes early — it never reaches the catalogue.',
              },
              {
                icon: HandHeart,
                title: 'Fair Pricing',
                desc: 'Luxury aesthetics without luxury markups. We price honestly so gifting generosity stays affordable.',
              },
              {
                icon: ShieldCheck,
                title: 'Trust Built In',
                desc: 'Convenient payment options, protective packaging and responsive human support — your confidence is part of the product.',
              },
              {
                icon: Leaf,
                title: 'Conscious Curation',
                desc: 'Vegan leathers, cruelty-free materials and durable designs that stay out of landfill — style that doesn\'t cost the earth.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-[#141312] border border-[#272420] hover:border-[#4d4437] rounded-2xl p-6 space-y-3 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1c1a17] border border-[#38332c] flex items-center justify-center">
                  <value.icon className="w-5 h-5 text-[#d4af37]" />
                </div>
                <h3 className="text-base font-bold text-white">{value.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Craftsmanship banner */}
        <section className="relative rounded-3xl overflow-hidden border border-[#292520]">
          <img
            src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1400&q=80"
            alt="Craftsmanship detail"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0e0d]/95 via-[#0f0e0d]/75 to-transparent"></div>
          <div className="relative max-w-xl p-8 sm:p-14 space-y-5">
            <Sparkles className="w-8 h-8 text-[#d4af37]" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f3f0e6] leading-tight">
              Details You Can Feel
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Hammered textures that catch candlelight. French velvet with real weight. Springs
              tuned to hold without pulling. We obsess over millimetres because you shouldn't
              have to think about them.
            </p>
          </div>
        </section>
      </div>

      {/* Closing gold band — alternates with the dark craftsmanship section above */}
      <GoldBand
        eyebrow="Join The Family"
        title="Ready to Find Your Signature Piece?"
        text="Thousands of shoppers already made my B shoppy their favourite accessories destination — your treasure is one click away."
        primaryCta={{ label: 'Shop The Collection', path: '/shop' }}
        secondaryCta={{ label: 'Get In Touch', path: '/contact' }}
      />
    </div>
  );
};

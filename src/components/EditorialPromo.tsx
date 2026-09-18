import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

export const EditorialPromo: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#d9a33f]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-[#D8A83E]/40 shadow-[0_44px_90px_-40px_rgba(90,62,20,0.55)] min-h-[460px] md:min-h-[520px] flex items-stretch">
            {/* Background: luxury golden accessory photography */}
            <img
              src="/images/categories/Hair Accessories.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Warm golden veil */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF1DD]/95 via-[#F4D99B]/80 to-[#E8C875]/55"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF1DD]/70 to-transparent"></div>

            {/* floating golden sparkles */}
            <Sparkles className="absolute top-8 left-8 w-5 h-5 text-[#B8860B]/70 animate-float-y" />
            <Sparkles className="absolute bottom-10 right-10 w-4 h-4 text-[#8A6A15]/50 animate-float-y" style={{ animationDelay: '1.4s' }} />

            {/* Left: editorial copy */}
            <div className="relative z-10 w-full lg:w-[58%] flex flex-col justify-center px-7 sm:px-12 lg:px-16 py-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-black flex items-center gap-2">
                <span aria-hidden="true">✦</span> Details You Can Feel
              </p>
              <h2
                className="mt-4 font-display font-medium text-black leading-[1.08]"
                style={{ fontSize: 'clamp(36px, 4.8vw, 60px)' }}
              >
                More Than Just
                <br />
                <em className="italic text-black">Accessories</em>
              </h2>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-12 bg-[#B8860B]/60"></span>
                <Heart className="w-4 h-4 fill-[#D8A83E] text-[#D8A83E]" />
                <span className="h-px w-12 bg-[#B8860B]/60"></span>
              </div>

              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-black">
                We believe the little details make the biggest difference — bringing you
                stylish pieces made to add a little more charm to every look.
              </p>

              <Link
                to="/about"
                className="btn-arrow-cta group mt-8 inline-flex items-center gap-2.5 self-start px-8 py-4 rounded-full bg-[#111111] text-[#F4D99B] hover:bg-[#241A12] font-semibold text-[11.5px] uppercase tracking-[0.24em] shadow-[0_18px_36px_-14px_rgba(17,17,17,0.5)] transition-all duration-300 hover:-translate-y-0.5"
              >
                Discover Our Story
                <ArrowRight className="w-4 h-4 arrow" />
              </Link>
            </div>

            {/* Right: floating accessory composition */}
            <div className="relative z-10 hidden lg:flex lg:w-[42%] items-center justify-center p-10">
              <div className="relative w-[300px] h-[360px]">
                <img
                  src="/images/products/gold-bag.svg"
                  alt="Champagne gold bag"
                  loading="lazy"
                  className="absolute -right-4 top-0 w-[210px] rounded-[24px] border-[4px] border-white/80 shadow-[0_24px_50px_-18px_rgba(90,62,20,0.55)] rotate-[6deg] animate-float-y"
                />
                <img
                  src="/images/products/silk-scrunchie.svg"
                  alt="Silk scrunchie"
                  loading="lazy"
                  className="absolute -left-2 bottom-6 w-[150px] rounded-[20px] border-[4px] border-white/80 shadow-[0_20px_44px_-16px_rgba(90,62,20,0.5)] -rotate-[7deg] animate-float-y"
                  style={{ animationDelay: '0.9s' }}
                />
                <img
                  src="/images/products/gold-earrings.svg"
                  alt="Gold earrings"
                  loading="lazy"
                  className="absolute right-6 -bottom-4 w-[120px] rounded-full border-[4px] border-white/80 shadow-[0_18px_40px_-14px_rgba(90,62,20,0.5)] rotate-[10deg] animate-float-y"
                  style={{ animationDelay: '1.8s' }}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
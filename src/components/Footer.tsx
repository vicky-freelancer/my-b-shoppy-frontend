import React, { useState } from 'react';
import { Instagram, Facebook, Youtube, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { STORE_CONFIG } from '../storeConfig';

interface FooterProps {
  onSelectCategory?: (categoryId: string) => void;
  onOpenWishlist?: () => void;
  onOpenSupabaseSync?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenWishlist,
  onOpenSupabaseSync
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#0b0a0a] text-slate-400 border-t border-[#26231f] pt-14 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer 4-Column Grid (from screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 text-left">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-[#d4af37]">
              my B shoppy
            </span>

            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Trendy. Affordable. Yours.<br />
              Thank you for shopping with us.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#181615] border border-[#38332c] hover:border-[#d4af37] text-slate-300 hover:text-[#d4af37] flex items-center justify-center transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#181615] border border-[#38332c] hover:border-[#d4af37] text-slate-300 hover:text-[#d4af37] flex items-center justify-center transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#pinterest"
                aria-label="Pinterest"
                className="w-8 h-8 rounded-full bg-[#181615] border border-[#38332c] hover:border-[#d4af37] text-slate-300 hover:text-[#d4af37] flex items-center justify-center transition font-bold text-xs"
              >
                P
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#181615] border border-[#38332c] hover:border-[#d4af37] text-slate-300 hover:text-[#d4af37] flex items-center justify-center transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: SHOP (from screenshot) */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
              SHOP
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('all')}
                  className="hover:text-white transition cursor-pointer"
                >
                  All Products
                </button>
              </li>
              {STORE_CONFIG.categories.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(c.id)}
                    className="hover:text-white transition cursor-pointer"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: HELP & INFO (from screenshot) */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
              HELP & INFO
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#returns" className="hover:text-white transition">Returns & Replacements</a></li>
              <li><a href="#shipping" className="hover:text-white transition">Shipping Information</a></li>
              <li><a href="#tracking" className="hover:text-white transition">Order Tracking</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Col 4: MY ACCOUNT & NEWSLETTER (from screenshot) */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
              MY ACCOUNT
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={onOpenSupabaseSync}
                  className="hover:text-white transition cursor-pointer"
                >
                  My Account / DB Sync
                </button>
              </li>
              <li><a href="#orders" className="hover:text-white transition">Order History</a></li>
              <li>
                <button
                  onClick={onOpenWishlist}
                  className="hover:text-white transition cursor-pointer"
                >
                  Wishlist
                </button>
              </li>
              <li><a href="#credit" className="hover:text-white transition">Store Credit</a></li>
              <li><a href="#newsletter" className="hover:text-white transition">Newsletter</a></li>
            </ul>

            {/* Newsletter Input Box (from screenshot) */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#d4af37] block">
                NEWSLETTER
              </span>
              <p className="text-[11px] text-slate-400">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#181615] border border-r-0 border-[#38332c] rounded-l-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="px-3.5 bg-[#d4af37] hover:bg-[#fae19c] text-black font-bold rounded-r-lg flex items-center justify-center transition cursor-pointer"
                >
                  {newsletterSubscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges (Matching reference screenshot) */}
        <div className="pt-8 border-t border-[#26231f] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © 2025 <strong className="text-slate-300">my B shoppy</strong>. All Rights Reserved.
          </p>

          {/* Payment Badges (VISA, MasterCard, UPI, PayPal, Cash on Delivery) */}
          <div className="flex items-center space-x-3 text-[11px] font-bold text-slate-400">
            <span className="px-2 py-1 bg-[#181615] border border-[#38332c] rounded text-slate-200">
              VISA
            </span>
            <span className="px-2 py-1 bg-[#181615] border border-[#38332c] rounded text-slate-200">
              MasterCard
            </span>
            <span className="px-2 py-1 bg-[#181615] border border-[#38332c] rounded text-slate-200">
              UPI
            </span>
            <span className="px-2 py-1 bg-[#181615] border border-[#38332c] rounded text-slate-200">
              PayPal
            </span>
            <span className="px-2 py-1 bg-[#181615] border border-[#d4af37]/50 rounded text-[#d4af37] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
              <span>Cash on Delivery</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

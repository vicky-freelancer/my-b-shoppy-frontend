import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { STORE_CONFIG } from '../storeConfig';
import { useStore } from '../context/StoreContext';

/* ---- Brand social icons (not in lucide) ---- */
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* Social links config */
const whatsappNumber = STORE_CONFIG.contact.phone.replace(/\D/g, '');
const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/mybshoppy',
    Icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mybshoppy',
    Icon: Instagram,
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${whatsappNumber}`,
    Icon: WhatsAppIcon,
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/mybshoppy',
    Icon: XIcon,
  },
];

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const { openWishlist, openSupabaseSync } = useStore();

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

        {/* Main Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 text-left">

          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/logo.png"
                alt="my B shoppy logo"
                loading="lazy"
                className="h-12 w-auto object-contain"
              />
              <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-[#d4af37]">
                my B shoppy
              </span>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Trendy. Affordable. Yours.<br />
              Thank you for shopping with us.
            </p>

            {/* Social Icons — Facebook · Instagram · WhatsApp · X */}
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-8 h-8 rounded-full bg-[#181615] border border-[#38332c] hover:border-[#d4af37] hover:bg-[#d4af37] text-slate-300 hover:text-black flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
              SHOP
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              {STORE_CONFIG.categories.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link to={`/categories/${c.id}`} className="hover:text-white transition">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: HELP & INFO */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
              HELP & INFO
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/categories" className="hover:text-white transition">Categories</Link></li>
            </ul>
          </div>

          {/* Col 4: MY ACCOUNT & NEWSLETTER */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
              MY ACCOUNT
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={openSupabaseSync}
                  className="hover:text-white transition cursor-pointer"
                >
                  My Account / DB Sync
                </button>
              </li>
              <li>
                <button
                  onClick={openWishlist}
                  className="hover:text-white transition cursor-pointer"
                >
                  Wishlist
                </button>
              </li>
              <li><Link to="/contact" className="hover:text-white transition">Newsletter</Link></li>
            </ul>

            {/* Newsletter Input Box */}
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

        {/* ===== BOTTOM BAR — Address & Phone · Social Buttons ===== */}
        <div className="mt-4 pt-8 border-t border-[#26231f]">
          {/* Address / Phone / Email + Social buttons */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-slate-400">
              <span className="flex items-start gap-2 max-w-xs text-left">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.contact.address}</span>
              </span>
              <a
                href={`tel:${STORE_CONFIG.contact.phone.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2 hover:text-[#d4af37] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>{STORE_CONFIG.contact.phone}</span>
              </a>
              <a
                href={`mailto:${STORE_CONFIG.contact.email}`}
                className="flex items-center gap-2 hover:text-[#d4af37] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>{STORE_CONFIG.contact.email}</span>
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={`bar-${label}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 rounded-full bg-[#181615] border border-[#38332c] hover:border-[#d4af37] hover:bg-[#d4af37] text-slate-300 hover:text-black flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#26231f] text-center text-xs">
          <p className="text-slate-500">
            © 2026{' '}
            <a
              href="https://nexusdigilancer.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[#d4af37] transition-colors font-semibold"
            >
              Powered by nexusdigilancer.in
            </a>
            . All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

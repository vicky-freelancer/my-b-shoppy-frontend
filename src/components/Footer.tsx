import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  ArrowRight,
  Check,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { STORE_CONFIG } from '../storeConfig';

/* Pinterest icon is not in lucide-react */
const PinterestIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
  </svg>
);

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/mybshoppy', Icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com/mybshoppy', Icon: Facebook },
  { label: 'Pinterest', href: 'https://www.pinterest.com/mybshoppy', Icon: PinterestIcon },
];

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Categories', path: '/categories' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const customerCare = ['Shipping', 'Returns', 'Privacy Policy', 'Terms & Conditions'];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      window.setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#111111] text-[#F5F0E4]/75 border-t border-[#D8A83E]/25">
      {/* gold divider */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#B8860B] via-[#E8C875] to-[#B8860B]"></div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <span className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D8A83E]/70 shadow-[0_0_0_4px_rgba(216,168,62,0.12)]">
                <img src="/images/logo/logo.png" alt="MY B SHOPPY logo" loading="lazy" className="w-full h-full object-cover" />
              </span>
              <span className="leading-none">
                <span className="block font-display text-lg font-bold tracking-[0.08em] text-[#E8C875]">
                  MY B SHOPPY
                </span>
                <span className="block mt-1.5 text-[8.5px] tracking-[0.34em] text-[#D8A83E]/80">
                  STYLE • ACCESSORIES • YOU
                </span>
              </span>
            </Link>

            <p className="text-[13px] leading-relaxed text-[#F5F0E4]/60 max-w-sm">
              Premium Indian fashion accessories — hair clips, artificial jewellery, bows,
              scrunchies and more. Trendy, cute, and made for every mood.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-[#D8A83E]/35 hover:bg-[#D8A83E] hover:text-[#111111] text-[#E8C875] flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <ul className="space-y-2 text-[12px] text-[#F5F0E4]/55">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D8A83E]" /> {STORE_CONFIG.contact.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D8A83E]" /> {STORE_CONFIG.contact.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D8A83E]" /> {STORE_CONFIG.contact.email}
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E8C875]">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-2.5 text-[13px]">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="inline-block gold-link text-[#F5F0E4]/70 hover:text-[#E8C875] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E8C875]">
              Customer Care
            </h4>
            <ul className="mt-5 space-y-2.5 text-[13px]">
              {customerCare.map((label) => (
                <li key={label}>
                  <Link to="/contact" className="inline-block gold-link text-[#F5F0E4]/70 hover:text-[#E8C875] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E8C875]">
              Newsletter
            </h4>
            <p className="mt-5 text-[20px] font-display italic text-[#F4D99B]">
              Join our style circle
            </p>
            <p className="mt-2 text-[12px] text-[#F5F0E4]/55 max-w-xs">
              Be first to know about new drops, styling tips and subscriber-only offers.
            </p>

            <form onSubmit={handleSubscribe} className="mt-5 flex max-w-sm bg-[#1c1915] border border-[#D8A83E]/30 rounded-full overflow-hidden focus-within:border-[#D8A83E] transition-colors">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address for newsletter"
                className="flex-1 min-w-0 bg-transparent px-5 py-3.5 text-[13px] text-[#F5F0E4] placeholder-[#F5F0E4]/35 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="px-5 py-3.5 bg-[#D8A83E] hover:bg-[#E8C875] text-[#111111] font-bold transition-colors cursor-pointer"
              >
                {subscribed ? <Check className="w-4.5 h-4.5" /> : <ArrowRight className="w-4.5 h-4.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="mt-3 text-[12px] text-[#E8C875]">
                Welcome to the circle! Check your inbox soon.
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-7 border-t border-[#D8A83E]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#F5F0E4]/45">
            © 2026 MY B SHOPPY. All Rights Reserved.
          </p>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#D8A83E]/60">
            Made with <span className="text-[#E8C875]">♥</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
};
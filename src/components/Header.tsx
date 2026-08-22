import React, { useState } from 'react';
import { Search, User, ShoppingBag, Heart, Database, Menu, X, CheckCircle2 } from 'lucide-react';
import { STORE_CONFIG } from '../storeConfig';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenSupabaseSync: () => void;
  supabaseConnected: boolean;
  activeNavTab: string;
  onSelectNavTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenSupabaseSync,
  supabaseConnected,
  activeNavTab,
  onSelectNavTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'shop', label: 'SHOP' },
    { id: 'collections', label: 'COLLECTIONS' },
    { id: 'about', label: 'ABOUT US' },
    { id: 'blog', label: 'BLOG' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0f0e0d]/95 backdrop-blur-md border-b border-[#26231f] transition-colors">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo in Gold Serif */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onSelectNavTab('shop')}
            className="text-left group cursor-pointer"
          >
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-[#d4af37] group-hover:text-[#fae19c] transition-colors">
              my B shoppy
            </span>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = activeNavTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectNavTab(link.id)}
                className={`relative text-[13px] font-bold tracking-widest uppercase transition-colors py-2 cursor-pointer ${
                  isActive ? 'text-[#d4af37]' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Search, Wishlist, User, Cart) */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search Products"
            className="p-2 text-slate-300 hover:text-[#d4af37] transition cursor-pointer rounded-full hover:bg-[#1f1d1a]"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={onOpenWishlist}
            aria-label="Wishlist"
            className="relative p-2 text-slate-300 hover:text-[#d4af37] transition cursor-pointer rounded-full hover:bg-[#1f1d1a]"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* User Account Button */}
          <button
            onClick={onOpenSupabaseSync}
            aria-label="Account and DB Sync"
            className="p-2 text-slate-300 hover:text-[#d4af37] transition cursor-pointer rounded-full hover:bg-[#1f1d1a]"
            title="Supabase Database & Profile"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Shopping Cart Button with Gold Badge */}
          <button
            onClick={onOpenCart}
            aria-label="View Cart"
            className="relative p-2.5 text-[#d4af37] hover:text-white transition cursor-pointer rounded-full bg-[#1c1a17] hover:bg-[#2c2822] border border-[#38332c]"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#d4af37] text-[#0f0e0d] text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141312] border-b border-[#272420] px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectNavTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-xs font-bold uppercase rounded-lg ${
                  activeNavTab === link.id
                    ? 'bg-[#26231f] text-[#d4af37]'
                    : 'text-slate-300 hover:bg-[#1b1917]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#26231f] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Supabase {supabaseConnected ? 'Online' : 'Ready'}</span>
            </span>
            <button
              onClick={() => {
                onOpenSupabaseSync();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-300 underline font-medium"
            >
              Database Manager
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react';
import { STORE_CONFIG } from '../storeConfig';
import { useStore } from '../context/StoreContext';

const navLinks = [
  { id: 'home', label: 'HOME', path: '/' },
  { id: 'shop', label: 'SHOP', path: '/shop' },
  { id: 'categories', label: 'CATEGORIES', path: '/categories', hasDropdown: true },
  { id: 'about', label: 'ABOUT US', path: '/about' },
  { id: 'contact', label: 'CONTACT', path: '/contact' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const location = useLocation();
  const {
    cartItems,
    wishlistIds,
    openCart,
    openWishlist,
    openSearch,
    openSupabaseSync,
    supabaseConnected,
  } = useStore();

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const isLinkActive = (link: (typeof navLinks)[number]) => {
    if (link.path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f0e0d]/95 backdrop-blur-md border-b border-[#26231f] transition-colors">
      {/* Gold divider line above the nav to separate browser bookmark bar from the website */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#d4af37] via-[#fae19c] to-[#d4af37] shadow-[0_1px_6px_rgba(212,175,55,0.6)]"></div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <img
              src="/logo.png"
              alt="my B shoppy logo"
              className="h-11 w-auto sm:h-12 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-[#d4af37] group-hover:text-[#fae19c] transition-colors">
              my B shoppy
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link);

            /* Categories item with dropdown menu */
            if (link.hasDropdown) {
              return (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <button
                    onClick={() => setCategoriesOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={categoriesOpen}
                    className={`relative flex items-center gap-1.5 text-[13px] font-bold tracking-widest uppercase transition-colors py-2 cursor-pointer ${
                      isActive ? 'text-[#d4af37]' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        categoriesOpen ? 'rotate-180' : ''
                      }`}
                    />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
                    )}
                  </button>

                  {/* Dropdown Panel */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200 ${
                      categoriesOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="w-80 rounded-2xl bg-[#141312] border border-[#272420] shadow-2xl shadow-black/60 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-[#26231f]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">
                          Shop by Category
                        </span>
                        <Link
                          to="/categories"
                          onClick={() => setCategoriesOpen(false)}
                          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#d4af37] transition-colors"
                        >
                          View All
                        </Link>
                      </div>

                      <div className="max-h-[320px] overflow-y-auto py-2">
                        {STORE_CONFIG.categories.map((category) => {
                          const catActive = location.pathname === `/categories/${category.id}`;
                          return (
                            <Link
                              key={category.id}
                              to={`/categories/${category.id}`}
                              onClick={() => setCategoriesOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors group ${
                                catActive ? 'bg-[#26231f]' : 'hover:bg-[#1b1917]'
                              }`}
                            >
                              <img
                                src={category.imageUrl}
                                alt=""
                                loading="lazy"
                                className="w-9 h-9 rounded-lg object-cover border border-[#38332c]"
                              />
                              <span className="flex-1 min-w-0">
                                <span
                                  className={`block text-xs font-bold truncate ${
                                    catActive ? 'text-[#d4af37]' : 'text-slate-200 group-hover:text-white'
                                  }`}
                                >
                                  {category.name}
                                </span>
                                <span className="block text-[10px] text-slate-500 truncate">
                                  From ₹{category.startingPrice.toLocaleString('en-IN')} · {category.count}+ items
                                </span>
                              </span>
                              <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-600 group-hover:text-[#d4af37] transition-colors" />
                            </Link>
                          );
                        })}
                      </div>

                      <Link
                        to="/categories"
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center justify-center gap-2 px-5 py-3 border-t border-[#26231f] bg-[#121110] text-[11px] font-extrabold uppercase tracking-widest text-[#d4af37] hover:bg-[#181512] transition-colors"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Browse All Categories
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.id}
                to={link.path}
                className={`relative text-[13px] font-bold tracking-widest uppercase transition-colors py-2 cursor-pointer ${
                  isActive ? 'text-[#d4af37]' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Search, Wishlist, User, Cart) */}
        <div className="flex items-center space-x-4 sm:space-x-5">

          {/* Search Trigger */}
          <button
            onClick={openSearch}
            aria-label="Search Products"
            className="p-2 text-slate-300 hover:text-[#d4af37] transition cursor-pointer rounded-full hover:bg-[#1f1d1a]"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={openWishlist}
            aria-label="Wishlist"
            className="relative p-2 text-slate-300 hover:text-[#d4af37] transition cursor-pointer rounded-full hover:bg-[#1f1d1a]"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* User Account Button */}
          <button
            onClick={openSupabaseSync}
            aria-label="Account and DB Sync"
            className="hidden sm:block p-2 text-slate-300 hover:text-[#d4af37] transition cursor-pointer rounded-full hover:bg-[#1f1d1a]"
            title="Supabase Database & Profile"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Shopping Cart Button with Gold Badge */}
          <button
            onClick={openCart}
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
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <React.Fragment key={link.id}>
                  <button
                    onClick={() => setMobileCategoriesOpen((v) => !v)}
                    className={`flex items-center justify-between text-left px-3 py-2 text-xs font-bold uppercase rounded-lg col-span-2 ${
                      isLinkActive(link)
                        ? 'bg-[#26231f] text-[#d4af37]'
                        : 'text-slate-300 hover:bg-[#1b1917]'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        mobileCategoriesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="col-span-2 grid grid-cols-2 gap-2 pl-2">
                      {STORE_CONFIG.categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/categories/${category.id}`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileCategoriesOpen(false);
                          }}
                          className="text-left px-3 py-2 text-[11px] font-semibold rounded-lg text-slate-300 hover:bg-[#1b1917] hover:text-[#d4af37] transition-colors truncate"
                        >
                          {category.name}
                        </Link>
                      ))}
                      <Link
                        to="/categories"
                        onClick={() => setMobileMenuOpen(false)}
                        className="col-span-2 text-left px-3 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg text-[#d4af37] bg-[#26231f]/60 hover:bg-[#26231f] transition-colors"
                      >
                        View All Categories
                      </Link>
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <Link
                  key={link.id}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left px-3 py-2 text-xs font-bold uppercase rounded-lg ${
                    isLinkActive(link)
                      ? 'bg-[#26231f] text-[#d4af37]'
                      : 'text-slate-300 hover:bg-[#1b1917]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="pt-2 border-t border-[#26231f] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Supabase {supabaseConnected ? 'Online' : 'Ready'}</span>
            </span>
            <button
              onClick={() => {
                openSupabaseSync();
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

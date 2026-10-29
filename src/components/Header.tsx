import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Phone, Clock, ChevronDown, Shield, X, Menu as MenuIcon } from 'lucide-react';
import { useCart } from '@/context/AppContext';
import { categories } from '@/data/menu';
import type { CategoryId } from '@/types';

interface HeaderProps {
  onCategorySelect: (id: CategoryId) => void;
  onOpenAdmin: () => void;
  onSearch: (query: string) => void;
  onMenuScroll: () => void;
  onOrderScroll: () => void;
}

export default function Header({ onCategorySelect, onOpenAdmin, onSearch, onMenuScroll, onOrderScroll }: HeaderProps) {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (itemCount > 0) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 500);
      return () => clearTimeout(t);
    }
  }, [itemCount]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleCategoryClick = (id: CategoryId) => {
    onCategorySelect(id);
    setMobileMenuOpen(false);
    onMenuScroll();
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              09:00 — 23:00
            </span>
            <a href="tel:+998712345678" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              +998 71 234 56 78
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] font-bold text-white">UZ</span>
              O'zbekcha
            </span>
            <button onClick={onOpenAdmin} className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md shadow-2xl shadow-black/30'
          : 'bg-slate-950'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-terracotta-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <span className="font-display font-bold text-slate-950 text-lg">Q</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-lg lg:text-xl leading-none">Qamish</span>
                <span className="text-[10px] lg:text-xs text-amber-400/80 leading-none mt-0.5">Xorazm Taomlari</span>
              </div>
            </button>

            {/* Category links — desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="px-3 py-2 text-sm text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-all font-medium"
                >
                  {cat.name}
                </button>
              ))}
              <button
                onClick={() => handleCategoryClick('all')}
                className="px-3 py-2 text-sm text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-all font-medium"
              >
                {categories[5].name}
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search */}
              <div className="relative hidden sm:block">
                {searchOpen ? (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white/10 rounded-lg overflow-hidden animate-fade-in">
                    <input
                      autoFocus
                      type="text"
                      value={searchValue}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Taom qidirish..."
                      className="w-48 lg:w-56 bg-transparent text-white placeholder-slate-400 px-3 py-2 text-sm outline-none"
                    />
                    <button
                      onClick={() => { setSearchOpen(false); setSearchValue(''); handleSearch(''); }}
                      className="px-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={openCart}
                className={`relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-terracotta-500 hover:from-amber-400 hover:to-terracotta-400 text-slate-950 font-semibold px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 ${cartBump ? 'animate-bounce-subtle' : ''}`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Savat</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-slate-300 hover:text-amber-400 hover:bg-white/5 transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="sm:hidden pb-3">
            <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
              <Search className="w-4 h-4 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Taom qidirish..."
                className="flex-1 bg-transparent text-white placeholder-slate-400 px-2 py-2 text-sm outline-none"
              />
              {searchValue && (
                <button onClick={() => { setSearchValue(''); handleSearch(''); }} className="px-2 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile category menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-t border-white/10 animate-fade-in">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex items-center gap-3 px-3 py-3 text-sm text-slate-200 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-all font-medium text-left"
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-3 py-3 text-sm text-slate-200 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-all font-medium text-left border-t border-white/10 mt-2 pt-3"
              >
                <Shield className="w-4 h-4" />
                Admin panel
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

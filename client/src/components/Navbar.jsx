import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Sparkles, Menu, X, LogIn, UserPlus, LogOut, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout, switchRoleDemo } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Exact Requested Desktop Navigation Links
  const primaryNavItems = [
    { path: '/', label: t('nav.home') || 'Home' },
    { path: '/homestays', label: lang === 'ne' ? 'होमस्टे खोज्नुहोस्' : 'Explore Homestays' },
    { path: '/culture', label: lang === 'ne' ? '७७ जिल्ला संस्कृति' : '77 Districts Culture' },
    { path: '/ai-planner', label: lang === 'ne' ? 'एआई स्मार्ट प्लानर' : 'AI Smart Planner' },
    { path: '/my-bookings', label: lang === 'ne' ? 'मेरो बुकिङ' : 'My Bookings' }
  ];

  // Secondary Dashboards Dropdown Menu
  const secondaryNavItems = [
    { path: '/recommendations', label: lang === 'ne' ? 'एआई सिफारिसहरू' : 'AI Recommendations', isPing: true },
    { path: '/host', label: t('nav.host_dashboard') || 'Host Dashboard' },
    { path: '/admin', label: t('nav.admin_dashboard') || 'Admin Control' },
    { path: '/sus-evaluation', label: t('nav.sus_evaluation') || 'SUS Evaluation' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm text-slate-800 transition-colors w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1 sm:gap-2">
          
          {/* Brand Logo - Shrink 0 */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <Logo size="md" dark={false} />
          </Link>

          {/* Desktop Navigation Links - Flexible Shrink */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-shrink min-w-0">
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 py-1 xl:px-2.5 xl:py-1.5 rounded-xl text-[11px] xl:text-xs font-black transition-all flex items-center whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm'
                    : 'text-slate-700 hover:text-rose-700 hover:bg-stone-100'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Dashboards Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                className={`px-2 py-1 xl:px-2.5 xl:py-1.5 rounded-xl text-[11px] xl:text-xs font-black transition-all flex items-center gap-0.5 whitespace-nowrap border ${
                  secondaryNavItems.some(i => isActive(i.path))
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0" />
                <span>Dashboards</span>
                <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-stone-200 shadow-xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        isActive(item.path)
                          ? 'bg-rose-50 text-rose-700 font-black'
                          : 'text-slate-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.isPing && <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls: Language Switcher, Sign In, Register - Shrink 0 */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-black rounded-xl border border-emerald-200 transition-all cursor-pointer shadow-sm whitespace-nowrap"
              title="Toggle English / Nepali Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{lang === 'en' ? 'EN | नेपाली' : 'नेपाली | EN'}</span>
            </button>

            {/* Auth Buttons: Sign In & Register */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-black text-slate-900 line-clamp-1">{user.name}</span>
                  <span className="text-[10px] uppercase font-extrabold text-rose-600">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 sm:p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition-all cursor-pointer shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/login"
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black text-slate-800 hover:bg-stone-100 border border-stone-300 shadow-sm transition-all flex items-center gap-1 whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  <span>{t('nav.login') || 'Sign In'}</span>
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700 text-white shadow-md shadow-rose-600/20 hover:opacity-95 transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t('nav.register') || 'Register'}</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-stone-100 text-slate-800 hover:bg-stone-200 border border-stone-200 transition-all ml-0.5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white text-slate-900 border-b border-stone-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          {[...primaryNavItems, ...secondaryNavItems].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                isActive(item.path)
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-stone-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Quick Demo Role Switcher inside Mobile Drawer */}
          {user && (
            <div className="pt-3 border-t border-stone-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Switch Active Role:</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <button
                  onClick={() => { switchRoleDemo('tourist'); setMobileMenuOpen(false); }}
                  className={`py-2 rounded-xl text-xs font-bold ${user.role === 'tourist' ? 'bg-rose-600 text-white' : 'bg-stone-100 text-slate-700'}`}
                >
                  Tourist
                </button>
                <button
                  onClick={() => { switchRoleDemo('host'); setMobileMenuOpen(false); }}
                  className={`py-2 rounded-xl text-xs font-bold ${user.role === 'host' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-slate-700'}`}
                >
                  Host
                </button>
                <button
                  onClick={() => { switchRoleDemo('admin'); setMobileMenuOpen(false); }}
                  className={`py-2 rounded-xl text-xs font-bold ${user.role === 'admin' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-slate-700'}`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

import React, { useState, useRef, useEffect } from 'react';
import { Sprout, Globe, LogOut, User, Menu, X, ChevronDown, LayoutDashboard, Settings, ShoppingBag } from 'lucide-react';
import type { Farmer, LanguageCode } from '@/types';
import { languageOptions, translations } from '@/data/translations';

export type NavTarget = 'home' | 'how-it-works' | 'features' | 'listings' | 'testimonials' | 'contact';

interface HomepageNavbarProps {
  activeSection: string;
  currentLang: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  onNavigateSection: (target: NavTarget) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  farmer?: Farmer | null;
  onOpenDashboard?: () => void;
}

export default function HomepageNavbar({
  activeSection,
  currentLang,
  onSelectLanguage,
  onNavigateSection,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  farmer,
  onOpenDashboard,
}: HomepageNavbarProps) {
  const t = translations[currentLang] || translations.en;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = languageOptions.find((l) => l.code === currentLang) || languageOptions[0];

  // Homepage links (No Farmer Dashboard button)
  const mainNavItems = [
    { key: 'home', label: t.navHome },
    { key: 'how-it-works', label: t.navHowItWorks },
    { key: 'features', label: t.navFeatures },
    { key: 'listings', label: t.navListings },
    { key: 'testimonials', label: t.navTestimonials },
    { key: 'contact', label: t.navContact },
  ];

  const handleNavClick = (key: NavTarget) => {
    onNavigateSection(key);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-paper/95 backdrop-blur-md transition-all shadow-xs">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Left: Logo / Platform Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.01] active:scale-[0.99] text-left shrink-0"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-500 text-paper shadow-md">
              <Sprout size={22} className="text-white" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-ink block leading-none">
                Moolya
              </span>
              <span className="text-[10px] font-semibold text-leaf-600 tracking-wider uppercase hidden sm:block">
                Direct Agricultural Marketplace
              </span>
            </div>
          </button>

          {/* Middle: Nav Links (Desktop) - Home | How It Works | Features | Listings | Testimonials | Contact */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavItems.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key as NavTarget)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-leaf-50 text-leaf-600 font-semibold'
                      : 'text-ink/75 hover:bg-black/5 hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Controls (Language Dropdown + Login/SignUp OR Profile + Logout) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-ink transition-all hover:border-leaf-300 hover:bg-leaf-50/50 shadow-xs"
                aria-label="Select Language"
              >
                <Globe size={16} className="text-leaf-600" />
                <span className="hidden sm:inline font-semibold">{currentLangObj.nativeName}</span>
                <span className="sm:hidden font-semibold uppercase">{currentLangObj.code}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl animate-scale-in z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    Select Language
                  </div>
                  {languageOptions.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => {
                        onSelectLanguage(option.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        currentLang === option.code
                          ? 'bg-leaf-50 text-leaf-700 font-bold'
                          : 'text-ink hover:bg-gray-50'
                      }`}
                    >
                      <span>{option.nativeName} ({option.name})</span>
                      {currentLang === option.code && <span className="h-2 w-2 rounded-full bg-leaf-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth State Handling */}
            {isLoggedIn ? (
              /* LOGGED-IN: Logout button + Profile Icon (Rightmost) */
              <div className="flex items-center gap-2">
                {/* Logout Button (Immediately before profile icon) */}
                <button
                  onClick={onLogoutClick}
                  className="hidden md:flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-2 text-xs font-semibold text-red-700 transition-all hover:bg-red-100 hover:border-red-300"
                  title="Logout"
                >
                  <LogOut size={15} />
                  <span>{t.logout}</span>
                </button>

                {/* Profile Icon (Rightmost) */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 rounded-full border border-leaf-300 bg-white p-1 pr-3 shadow-xs transition-all hover:border-leaf-500 hover:bg-leaf-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-500 text-white font-bold text-xs shadow-inner">
                      {farmer?.name ? farmer.name[0] : <User size={16} />}
                    </div>
                    <span className="hidden sm:inline text-xs font-bold text-ink max-w-[100px] truncate">
                      {farmer?.name || 'My Account'}
                    </span>
                    <ChevronDown size={14} className="text-gray-400 hidden sm:inline" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl animate-scale-in z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <div className="text-xs font-bold text-ink">{farmer?.name || 'Rameshwar Lal'}</div>
                        <div className="text-[11px] text-gray-400">Farmer • Ajmer, Rajasthan</div>
                      </div>

                      {onOpenDashboard && (
                        <button
                          onClick={() => {
                            onOpenDashboard();
                            setProfileDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-ink hover:bg-leaf-50 hover:text-leaf-700 transition-colors"
                        >
                          <LayoutDashboard size={15} />
                          <span>Farmer Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onLogoutClick();
                          setProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* LOGGED-OUT VISITORS (DEFAULT): Show Login / Sign Up buttons only (No profile icon, no logout button, no account menu) */
              <div className="flex items-center gap-2">
                <button
                  onClick={onLoginClick}
                  className="rounded-xl border border-leaf-300 bg-white px-4 py-2 text-xs font-bold text-leaf-700 hover:bg-leaf-50 transition-all shadow-xs"
                >
                  {t.login}
                </button>
                <button
                  onClick={onLoginClick}
                  className="btn-primary text-xs py-2 px-4 shadow-sm font-bold"
                >
                  {t.signUp}
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-ink transition-colors hover:bg-gray-50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/5 bg-white p-4 shadow-xl animate-fade-in space-y-4">
          <nav className="flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key as NavTarget)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  activeSection === item.key
                    ? 'bg-leaf-50 text-leaf-600'
                    : 'text-ink hover:bg-gray-50'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  onLogoutClick();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-700"
              >
                <LogOut size={15} />
                <span>{t.logout} Account</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl border border-leaf-300 py-2 text-xs font-bold text-leaf-700 bg-white text-center"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl bg-leaf-500 py-2 text-xs font-bold text-white text-center shadow-xs"
                >
                  {t.signUp}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { User, Globe, ChevronDown } from 'lucide-react';
import { MoolyaIcon } from '@/components/MoolyaLogo';
import type { Farmer, LanguageCode } from '@/types';
import { languageOptions, translations } from '@/data/translations';

export type ScreenName = 'produce' | 'orders' | 'payments' | 'reviews' | 'profile';

interface NavbarProps {
  active: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  farmer: Farmer | null;
  currentLang: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
}

export default function Navbar({ active, onNavigate, farmer, currentLang, onSelectLanguage }: NavbarProps) {
  const t = translations[currentLang] || translations.en;
  
  const navItems: { key: ScreenName; label: string }[] = [
    { key: 'produce', label: t.navProduce },
    { key: 'orders', label: t.navOrders },
    { key: 'payments', label: t.navPayments },
    { key: 'reviews', label: t.navReviews },
  ];

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = languageOptions.find((l) => l.code === currentLang) || languageOptions[0];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        {/* Top row: logo + language dropdown + profile pill */}
        <div className="flex items-center justify-between py-3">
          <button
            onClick={() => onNavigate('produce')}
            className="flex items-center transition-opacity hover:opacity-80 shrink-0"
          >
            <MoolyaIcon className="h-10 sm:h-11 w-auto" />
          </button>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  active === item.key
                    ? 'bg-leaf-50 text-leaf-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

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

            {/* Profile pill */}
            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-2.5 rounded-full border py-1 pl-1 pr-3.5 transition-all ${
                active === 'profile'
                  ? 'border-leaf-200 bg-leaf-50'
                  : 'border-gray-200 bg-white hover:border-leaf-200 hover:bg-leaf-50'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-leaf-500">
                {farmer?.profilePhoto ? (
                  <img src={farmer.profilePhoto} alt={farmer.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <User size={16} />
                )}
              </div>
              <span className="hidden text-sm font-medium text-ink sm:inline">
                {farmer?.name ?? 'Profile'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav: scrollable pill row */}
        <nav className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-2.5 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                active === item.key
                  ? 'bg-leaf-500 text-paper'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}


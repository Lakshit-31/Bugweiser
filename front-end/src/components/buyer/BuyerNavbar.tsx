import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  FileSpreadsheet,
  Scale,
  MessageSquare,
  PackageCheck,
  Receipt,
  Star,
  User,
  Globe,
  ChevronDown,
  LogOut,
  ArrowLeftRight,
  MoreHorizontal,
} from 'lucide-react';
import { MoolyaIcon } from '@/components/MoolyaLogo';
import type { BuyerScreenName } from '@/types/buyer';
import type { LanguageCode } from '@/types';
import { languageOptions } from '@/data/translations';
import { mockBuyerProfile } from '@/data/buyerMockData';
import { buyerTranslations } from '@/data/buyerTranslations';

interface BuyerNavbarProps {
  activeScreen: BuyerScreenName;
  onNavigate: (screen: BuyerScreenName) => void;
  currentLang: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  onSwitchToFarmer: () => void;
  onLogout: () => void;
  unreadChatCount?: number;
}

export default function BuyerNavbar({
  activeScreen,
  onNavigate,
  currentLang,
  onSelectLanguage,
  onSwitchToFarmer,
  onLogout,
  unreadChatCount = 1,
}: BuyerNavbarProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const bt = buyerTranslations[currentLang] || buyerTranslations.en;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = languageOptions.find((l) => l.code === currentLang) || languageOptions[0];

  interface BuyerNavItem {
    key: BuyerScreenName;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: number;
  }

  // Primary nav items displayed directly on desktop bar
  const primaryNavItems: BuyerNavItem[] = [
    { key: 'buyer-dashboard', label: bt.navDashboard, icon: LayoutDashboard },
    { key: 'buyer-marketplace', label: bt.navMarketplace, icon: ShoppingBag },
    { key: 'buyer-requirements', label: bt.navRequirements, icon: FileSpreadsheet },
    { key: 'buyer-orders', label: bt.navOrders, icon: PackageCheck },
    { key: 'buyer-chat', label: bt.navChat, icon: MessageSquare, badge: unreadChatCount },
  ];

  // Secondary items in clean "More" dropdown on desktop, but in scrollable row on mobile
  const secondaryNavItems: BuyerNavItem[] = [
    { key: 'buyer-compare', label: bt.navCompare, icon: Scale },
    { key: 'buyer-transactions', label: bt.navTransactions, icon: Receipt },
    { key: 'buyer-reviews', label: bt.navReviews, icon: Star },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];
  const isMoreActive = secondaryNavItems.some((s) => s.key === activeScreen);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-paper/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 py-2.5">
          {/* Left: Logo & Portal Badge */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('buyer-dashboard')}
              className="flex items-center transition-opacity hover:opacity-85 shrink-0"
              title={bt.navDashboard}
            >
              <MoolyaIcon className="h-8 sm:h-9 w-auto shrink-0" />
            </button>
            <span className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-100/90 px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 border border-emerald-200">
              {bt.portalBadge}
            </span>
          </div>

          {/* Desktop Nav Items: Clean non-overlapping row with ample space */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {primaryNavItems.map((item) => {
              const isActive = activeScreen === item.key;
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`relative flex items-center gap-1.5 rounded-xl px-2.5 xl:px-3 py-1.5 text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-leaf-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-leaf-50 hover:text-leaf-800'
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span
                      className={`ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black shrink-0 ${
                        isActive ? 'bg-white text-leaf-800' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Desktop More Dropdown for Secondary Tools & Features */}
            <div className="relative shrink-0" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                  isMoreActive
                    ? 'bg-leaf-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-leaf-50 hover:text-leaf-800'
                }`}
              >
                <span>{bt.navMore}</span>
                <ChevronDown size={13} className={`transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-48 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl animate-scale-in z-50">
                  {secondaryNavItems.map((item) => {
                    const isActive = activeScreen === item.key;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          onNavigate(item.key);
                          setMoreMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-leaf-50 text-leaf-700 font-extrabold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={14} className="text-leaf-600" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Tools: Farmer Mode, Language Dropdown, Profile Pill (Strictly shrink-0) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Switch to Farmer */}
            <button
              onClick={onSwitchToFarmer}
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-leaf-300 hover:bg-leaf-50 transition-colors shrink-0 whitespace-nowrap"
              title="Switch to Farmer Portal"
            >
              <ArrowLeftRight size={13} className="text-leaf-600 shrink-0" />
              <span className="hidden xl:inline">{bt.farmerMode}</span>
            </button>

            {/* Language Dropdown */}
            <div className="relative shrink-0" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-ink hover:border-leaf-300 hover:bg-leaf-50/50 transition-all shadow-xs shrink-0"
                aria-label={bt.selectLanguage}
              >
                <Globe size={14} className="text-leaf-600 shrink-0" />
                <span className="hidden xl:inline font-semibold">{currentLangObj.nativeName}</span>
                <span className="xl:hidden font-semibold uppercase text-[11px]">{currentLangObj.code}</span>
                <ChevronDown size={12} className={`text-gray-400 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl animate-scale-in z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    {bt.selectLanguage}
                  </div>
                  {languageOptions.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => {
                        onSelectLanguage(option.code);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        currentLang === option.code
                          ? 'bg-leaf-50 text-leaf-700 font-bold'
                          : 'text-ink hover:bg-gray-50'
                      }`}
                    >
                      <span>{option.nativeName} ({option.name})</span>
                      {currentLang === option.code && <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative shrink-0" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-full border py-1 pl-1 pr-2.5 sm:pr-3 transition-all shrink-0 ${
                  activeScreen === 'buyer-profile' || profileOpen
                    ? 'border-leaf-400 bg-leaf-50'
                    : 'border-gray-200 bg-white hover:border-leaf-300 hover:bg-leaf-50/50'
                }`}
              >
                <img
                  src={mockBuyerProfile.profilePhoto}
                  alt={mockBuyerProfile.name}
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover border border-emerald-300 shrink-0"
                />
                <span className="hidden text-xs font-bold text-ink sm:inline shrink-0">
                  {mockBuyerProfile.name.split(' ')[0]}
                </span>
                <ChevronDown size={12} className="text-gray-400 shrink-0" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl animate-scale-in z-50">
                  <div className="p-3 border-b border-gray-100">
                    <div className="font-bold text-xs text-ink">{mockBuyerProfile.businessName}</div>
                    <div className="text-[11px] text-gray-500">{mockBuyerProfile.name} • GST Verified</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                      Trust Score: {mockBuyerProfile.trustScore}/100
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('buyer-profile');
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-leaf-50 hover:text-leaf-800"
                    >
                      <User size={14} /> {bt.profileSettings}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchToFarmer();
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-leaf-50 hover:text-leaf-800"
                    >
                      <ArrowLeftRight size={14} /> {bt.farmerMode}
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} /> {bt.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Nav Row: Horizontal smooth pill scroll */}
        <nav className="scrollbar-hide -mx-3 flex gap-1.5 overflow-x-auto px-3 pb-2 lg:hidden">
          {allNavItems.map((item) => {
            const isActive = activeScreen === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-leaf-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon size={13} className="shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span
                    className={`ml-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[9px] font-black shrink-0 ${
                      isActive ? 'bg-white text-leaf-800' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

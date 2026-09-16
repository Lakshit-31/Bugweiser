import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Sprout, Globe, LogOut, UserCheck, Home, Info, PhoneCall, HelpCircle, ShieldCheck } from 'lucide-react';

export const Navbar = ({ onOpenAuth, onOpenAdminAuth, activePortal, onSelectPortal, adminUser, onAdminLogout }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const handleNavClick = (sectionId) => {
    if (activePortal !== 'HOME') {
      onSelectPortal('HOME');
    }
    setTimeout(() => {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };

  return (
    <header className="bg-emerald-950 text-white shadow-lg sticky top-0 z-40 border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo & Main Nav Links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleNavClick('top')}
              className="flex items-center space-x-2 text-left focus:outline-none group shrink-0"
            >
              <div className="bg-white p-1 rounded-2xl shadow group-hover:scale-105 transition border border-amber-300/40">
                <img src="/moolya-logo.jpg" alt="Moolya Logo" className="h-9 w-auto object-contain rounded-xl" />
              </div>
              <span className="text-2xl font-black tracking-tight text-amber-300 font-serif hidden sm:inline">
                {t('appName')}
              </span>
            </button>

            {/* Nav items in single selected language for a clean look */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => handleNavClick('top')}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
                  activePortal === 'HOME' ? 'text-amber-300 bg-emerald-900/60 shadow-sm' : 'text-emerald-200 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'गृह' : 'Home'}</span>
              </button>

              <button
                onClick={() => handleNavClick('how-it-works')}
                className="px-3 py-2 rounded-xl text-xs font-extrabold text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/40 transition flex items-center space-x-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}</span>
              </button>

              <button
                onClick={() => handleNavClick('about-us')}
                className="px-3 py-2 rounded-xl text-xs font-extrabold text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/40 transition flex items-center space-x-1.5"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'हमारे बारे में' : 'About Us'}</span>
              </button>

              <button
                onClick={() => handleNavClick('contact-us')}
                className="px-3 py-2 rounded-xl text-xs font-extrabold text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/40 transition flex items-center space-x-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}</span>
              </button>
            </nav>
          </div>

          {/* Controls: Language Toggle & User Auth / Login & Registration */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hi' ? 'हिंदी' : 'English'}</span>
              <span className="text-[10px] bg-amber-400 text-emerald-950 px-1.5 py-0.5 rounded-full font-black">
                {lang === 'hi' ? 'EN' : 'हिं'}
              </span>
            </button>

            {/* Authenticated State vs Login/Registration */}
            {adminUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSelectPortal('ADMIN')}
                  className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-1.5 rounded-xl font-black text-xs shadow transition"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-950" />
                  <span>{lang === 'hi' ? 'एडमिन डैशबोर्ड' : 'Admin Dashboard'}</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit Admin</span>
                </button>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSelectPortal(user.role === 'ROLE_FARMER' ? 'FARMER' : 'BUYER')}
                  className="flex items-center space-x-2 bg-emerald-900 hover:bg-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-700 transition"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">{user.fullName}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-400 text-emerald-950 rounded font-black uppercase">
                    {user.role === 'ROLE_FARMER' ? t('farmerRole') : t('buyerRole')}
                  </span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    onSelectPortal('HOME');
                  }}
                  className="flex items-center space-x-1 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs px-4 py-2 rounded-xl transition shadow"
              >
                {lang === 'hi' ? 'लॉगिन / पंजीकरण' : 'Login / Register'}
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

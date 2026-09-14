import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Sprout, Globe, LogOut, UserCheck, ShoppingBag, User } from 'lucide-react';

export const Navbar = ({ onOpenAuth, activePortal, onSelectPortal }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header className="bg-emerald-950 text-white shadow-lg sticky top-0 z-40 border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo & Portal Switcher */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-amber-400 p-2 rounded-2xl text-emerald-950 font-bold shadow-inner">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-amber-300 font-serif">
                {t('appName')}
              </span>
            </div>

            {/* DIRECT 1-CLICK PORTAL SWITCHER (Farmer Portal vs Buyer Portal) */}
            <div className="hidden sm:flex items-center bg-emerald-900/80 p-1 rounded-2xl border border-emerald-800 space-x-1">
              <button
                onClick={() => onSelectPortal('FARMER')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
                  activePortal === 'FARMER' ? 'bg-amber-400 text-emerald-950 shadow' : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>{t('farmerDashboard')}</span>
              </button>

              <button
                onClick={() => onSelectPortal('BUYER')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
                  activePortal === 'BUYER' ? 'bg-amber-400 text-emerald-950 shadow' : 'text-emerald-200 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('buyerDashboard')}</span>
              </button>
            </div>
          </div>

          {/* Controls: Language Toggle & User Auth */}
          <div className="flex items-center space-x-3">
            
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

            {/* Auth section */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2 bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-800">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">{user.fullName}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-400 text-emerald-950 rounded font-black uppercase">
                    {user.role === 'ROLE_FARMER' ? t('farmerRole') : t('buyerRole')}
                  </span>
                </div>
                <button
                  onClick={logout}
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
                {t('login')} / {t('register')}
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import type { Farmer, UserRole, LanguageCode } from '@/types';
import { getFarmer } from '@/data/api';
import Navbar, { ScreenName } from '@/components/Navbar';
import HomepageNavbar, { NavTarget } from '@/components/HomepageNavbar';
import Homepage from '@/screens/Homepage';
import ProduceScreen from '@/screens/Produce';
import MatchesScreen from '@/screens/Matches';
import OrdersScreen from '@/screens/Orders';
import PaymentsScreen from '@/screens/Payments';
import ReviewsScreen from '@/screens/Reviews';
import ProfileScreen from '@/screens/Profile';
import Login from '@/screens/Login';
import Register from '@/screens/Register';
import AdminDashboard from '@/screens/AdminDashboard';
import { translations } from '@/data/translations';

export type MainView =
  | 'home'
  | 'produce'
  | 'dashboard'
  | 'marketplace'
  | 'orders'
  | 'payments'
  | 'reviews'
  | 'profile'
  | 'matches'
  | 'login'
  | 'register'
  | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<MainView>('home');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  // Default state on website open is logged-out
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(null);
  const [registerRole, setRegisterRole] = useState<UserRole>('farmer');

  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    if (isLoggedIn && !farmer) {
      getFarmer().then(setFarmer);
    }
  }, [isLoggedIn, farmer]);

  const handleHomepageNav = (target: NavTarget) => {
    setCurrentView('home');
    setActiveSection(target);
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (role: UserRole) => {
    setIsLoggedIn(true);
    if (role === 'admin') {
      setCurrentView('admin');
    } else if (role === 'farmer') {
      setCurrentView('produce');
    } else {
      setCurrentView('marketplace');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFarmer(null);
    setCurrentView('home');
  };

  const handleViewMatches = (produceId: string) => {
    setSelectedProduceId(produceId);
    setCurrentView('matches');
  };

  // Determine active screen for top navbar highlighting
  const getActiveScreenName = (): ScreenName => {
    if (currentView === 'matches' || currentView === 'dashboard' || currentView === 'marketplace') {
      return 'produce';
    }
    if (
      currentView === 'produce' ||
      currentView === 'orders' ||
      currentView === 'payments' ||
      currentView === 'reviews' ||
      currentView === 'profile'
    ) {
      return currentView;
    }
    return 'produce';
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col selection:bg-leaf-200 selection:text-leaf-800">

      {/* 
        NAVBAR SEPARATION:
        - Homepage navbar rendered ONLY on the Home page (currentView === 'home').
        - On other pages (farmer dashboard, produce, orders, payments, reviews, profile), render their original navbar.
      */}
      {currentView === 'home' ? (
        <HomepageNavbar
          activeSection={activeSection}
          currentLang={currentLang}
          onSelectLanguage={setCurrentLang}
          onNavigateSection={handleHomepageNav}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setCurrentView('login')}
          onSignupClick={() => setCurrentView('register')}
          onLogoutClick={handleLogout}
          farmer={farmer}
          onOpenDashboard={() => setCurrentView('produce')}
        />
      ) : currentView !== 'admin' && currentView !== 'login' && currentView !== 'register' ? (
        <>
          <Navbar
            active={getActiveScreenName()}
            onNavigate={(screen) => setCurrentView(screen as MainView)}
            farmer={farmer}
            currentLang={currentLang}
            onSelectLanguage={setCurrentLang}
          />

          {/* Quick link back to Homepage */}
          <div className="bg-white/80 border-b border-black/5 backdrop-blur-xs py-2 px-4">
            <div className="mx-auto max-w-content flex items-center justify-between text-xs font-semibold">
              <button
                onClick={() => { setCurrentView('home'); setActiveSection('home'); }}
                className="rounded-lg px-3 py-1 transition-colors text-leaf-700 hover:bg-leaf-50 flex items-center gap-1 font-bold border border-leaf-200"
              >
                {t.portalReturn}
              </button>
              <span className="text-gray-500 font-medium">
                {t.portalTitle}
              </span>
            </div>
          </div>
        </>
      ) : null}

      {/* Main View Router */}
      <main className="flex-1 mx-auto max-w-content px-4 py-6 sm:px-6 sm:py-8 w-full">

        {/* HOMEPAGE VIEW */}
        {currentView === 'home' && (
          <Homepage
            currentLang={currentLang}
            onNavigateSection={(sec) => {
              setActiveSection(sec);
              const el = document.getElementById(sec);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onRoleSelect={(role) => {
              if (role === 'farmer') {
                setCurrentView('produce');
              } else {
                setCurrentView('marketplace');
              }
            }}
            onOpenDashboard={() => setCurrentView('produce')}
            onOpenMarketplace={() => setCurrentView('marketplace')}
          />
        )}

        {/* FARMER PRODUCE / DASHBOARD / MARKETPLACE VIEW */}
        {(currentView === 'produce' || currentView === 'dashboard' || currentView === 'marketplace') && (
          <ProduceScreen onViewMatches={handleViewMatches} currentLang={currentLang} />
        )}

        {/* MATCHES VIEW */}
        {currentView === 'matches' && selectedProduceId && (
          <MatchesScreen
            produceId={selectedProduceId}
            onBack={() => setCurrentView('produce')}
            currentLang={currentLang}
          />
        )}

        {/* ORDERS VIEW */}
        {currentView === 'orders' && <OrdersScreen currentLang={currentLang} />}

        {/* PAYMENTS VIEW */}
        {currentView === 'payments' && <PaymentsScreen currentLang={currentLang} />}

        {/* REVIEWS VIEW */}
        {currentView === 'reviews' && <ReviewsScreen currentLang={currentLang} />}

        {/* PROFILE VIEW */}
        {currentView === 'profile' && (
          <ProfileScreen onLogout={handleLogout} currentLang={currentLang} />
        )}

        {/* LOGIN SCREEN */}
        {currentView === 'login' && (
          <Login
            onLogin={handleLoginSuccess}
            onGoRegister={(role) => {
              setRegisterRole(role);
              setCurrentView('register');
            }}
            onGoHome={() => {
              setCurrentView('home');
              setActiveSection('home');
            }}
          />
        )}

        {/* REGISTER SCREEN */}
        {currentView === 'register' && (
          <Register
            onRegister={handleLoginSuccess}
            onGoLogin={() => setCurrentView('login')}
            initialRole={registerRole}
            onGoHome={() => {
              setCurrentView('home');
              setActiveSection('home');
            }}
          />
        )}

        {/* ADMIN DASHBOARD VIEW */}
        {currentView === 'admin' && (
          <AdminDashboard onLogout={handleLogout} />
        )}

      </main>

    </div>
  );
}

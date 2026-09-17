import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider, useWebSocket } from './context/WebSocketContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { VoiceListingModal } from './components/VoiceListingModal';
import { RealtimeDealModal } from './components/RealtimeDealModal';
import { AuthModal } from './components/AuthModal';
import { AdminLayout } from './components/AdminLayout';
import { AdminLoginModal } from './components/AdminLoginModal';
import axios from 'axios';

const AppContent = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { triggerRefresh } = useWebSocket();

  const [isVoiceListingOpen, setIsVoiceListingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activePortal, setActivePortal] = useState('HOME'); // 'HOME', 'FARMER', 'BUYER', or 'ADMIN'

  // Initialize Admin state from localStorage
  useEffect(() => {
    const savedUserStr = localStorage.getItem('moolya_user');
    const token = localStorage.getItem('moolya_token');
    if (savedUserStr && token) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser?.role === 'ROLE_ADMIN') {
          setAdminUser(savedUser);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'ROLE_BUYER') {
      setActivePortal('BUYER');
    } else if (user?.role === 'ROLE_FARMER') {
      setActivePortal('FARMER');
    } else if (user?.role === 'ROLE_ADMIN') {
      setAdminUser(user);
      setActivePortal('ADMIN');
    } else if (!user) {
      setAdminUser(null);
      setActivePortal('HOME');
    }
  }, [user]);

  const handleOpenVoiceListing = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setIsVoiceListingOpen(true);
    }
  };

  const handleAdminLoginSuccess = (user, token) => {
    setAdminUser(user);
    setActivePortal('ADMIN');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('moolya_token');
    localStorage.removeItem('moolya_user');
    delete axios.defaults.headers.common['Authorization'];
    setAdminUser(null);
    if (logout) logout();
    setActivePortal('HOME');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation with Portal Switcher */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdminAuth={() => setIsAdminLoginOpen(true)}
        activePortal={activePortal}
        onSelectPortal={(portal) => setActivePortal(portal)}
        adminUser={adminUser}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main View */}
      <main className="flex-1">
        {activePortal === 'ADMIN' && adminUser ? (
          <AdminLayout adminUser={adminUser} onLogout={handleAdminLogout} />
        ) : activePortal === 'HOME' ? (
          <HomePage
            onSelectPortal={(portal) => setActivePortal(portal)}
            onOpenVoiceListing={handleOpenVoiceListing}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        ) : activePortal === 'FARMER' ? (
          <FarmerDashboard onOpenVoiceListing={handleOpenVoiceListing} />
        ) : (
          <BuyerDashboard onOpenAuth={() => setIsAuthOpen(true)} />
        )}
      </main>

      {/* Modals & Real-time Overlays */}
      <VoiceListingModal
        isOpen={isVoiceListingOpen}
        onClose={() => setIsVoiceListingOpen(false)}
        onOpenAuth={() => {
          setIsVoiceListingOpen(false);
          setIsAuthOpen(true);
        }}
        onListingCreated={() => {
          triggerRefresh();
        }}
      />

      <RealtimeDealModal />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-300 py-6 border-t border-emerald-900 text-center text-xs space-y-2 flex flex-col items-center justify-center">
        <div className="bg-white p-1 rounded-2xl shadow border border-amber-400/50 inline-block">
          <img src="/moolya-logo.jpg" alt="Moolya Logo" className="h-9 w-auto object-contain rounded-xl" />
        </div>
        <p className="font-bold text-amber-300">मूल्य ({t('appName')}) - {t('tagline')}</p>
        <p>© 2026 {t('appName')} Platform. English • हिंदी • ਪੰਜਾਬੀ • मराठी • ગુજરાતી • தமிழ்</p>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WebSocketProvider>
          <AppContent />
        </WebSocketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

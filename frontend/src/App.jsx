import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Navbar } from './components/Navbar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { VoiceListingModal } from './components/VoiceListingModal';
import { RealtimeDealModal } from './components/RealtimeDealModal';
import { AuthModal } from './components/AuthModal';

const AppContent = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [isVoiceListingOpen, setIsVoiceListingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activePortal, setActivePortal] = useState('FARMER'); // 'FARMER' or 'BUYER'

  const currentRole = user?.role === 'ROLE_BUYER' ? 'BUYER' : (user?.role === 'ROLE_FARMER' ? 'FARMER' : activePortal);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation with Portal Switcher */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        activePortal={currentRole}
        onSelectPortal={(portal) => setActivePortal(portal)}
      />

      {/* Main Portal View */}
      <main className="flex-1">
        {currentRole === 'FARMER' ? (
          <FarmerDashboard onOpenVoiceListing={() => setIsVoiceListingOpen(true)} />
        ) : (
          <BuyerDashboard />
        )}
      </main>

      {/* Modals & Real-time Overlays */}
      <VoiceListingModal
        isOpen={isVoiceListingOpen}
        onClose={() => setIsVoiceListingOpen(false)}
        onListingCreated={() => {
          // Callback after listing created
        }}
      />

      <RealtimeDealModal />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-300 py-6 border-t border-emerald-900 text-center text-xs space-y-1">
        <p className="font-bold text-amber-300">मूल्य (Moolya) - Direct Agricultural Produce & Voice AI Marketplace</p>
        <p>© 2026 Moolya Platform. Priority Localization: Devanagari Hindi & English.</p>
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

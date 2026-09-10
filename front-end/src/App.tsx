import { useState, useEffect } from 'react';
import type { Farmer, UserRole } from '@/types';
import { getFarmer } from '@/data/api';
import Login from '@/screens/Login';
import Register from '@/screens/Register';
import AdminDashboard from '@/screens/AdminDashboard';
import Navbar, { type ScreenName } from '@/components/Navbar';
import ProduceScreen from '@/screens/Produce';
import MatchesScreen from '@/screens/Matches';
import OrdersScreen from '@/screens/Orders';
import PaymentsScreen from '@/screens/Payments';
import ReviewsScreen from '@/screens/Reviews';
import ProfileScreen from '@/screens/Profile';

type View =
  | { name: 'login' }
  | { name: 'register'; role: UserRole }
  | { name: 'admin' }
  | { name: 'main'; screen: ScreenName }
  | { name: 'matches'; produceId: string };

export default function App() {
  const [view, setView] = useState<View>({ name: 'login' });
  const [farmer, setFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    if (view.name === 'main' && !farmer) {
      getFarmer().then(setFarmer);
    }
  }, [view, farmer]);

  const handleLogin = (role: UserRole) => {
    if (role === 'admin') {
      setView({ name: 'admin' });
    } else {
      setView({ name: 'main', screen: 'produce' });
    }
  };

  const handleLogout = () => {
    setFarmer(null);
    setView({ name: 'login' });
  };

  const handleNavigate = (screen: ScreenName) => setView({ name: 'main', screen });

  const handleViewMatches = (produceId: string) => setView({ name: 'matches', produceId });

  const handleBackToProduce = () => setView({ name: 'main', screen: 'produce' });

  if (view.name === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onGoRegister={(role) => setView({ name: 'register', role })}
      />
    );
  }

  if (view.name === 'register') {
    return (
      <Register
        onRegister={handleLogin}
        onGoLogin={() => setView({ name: 'login' })}
        initialRole={view.role}
      />
    );
  }

  if (view.name === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar
        active={view.name === 'matches' ? 'produce' : view.screen}
        onNavigate={handleNavigate}
        farmer={farmer}
      />

      <main className="mx-auto max-w-content px-4 py-6 sm:px-6 sm:py-8">
        {view.name === 'matches' ? (
          <MatchesScreen produceId={view.produceId} onBack={handleBackToProduce} />
        ) : view.screen === 'produce' ? (
          <ProduceScreen onViewMatches={handleViewMatches} />
        ) : view.screen === 'orders' ? (
          <OrdersScreen />
        ) : view.screen === 'payments' ? (
          <PaymentsScreen />
        ) : view.screen === 'reviews' ? (
          <ReviewsScreen />
        ) : (
          <ProfileScreen onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

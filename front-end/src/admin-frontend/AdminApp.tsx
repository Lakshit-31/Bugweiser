import { useState, useEffect } from 'react';
import type { AdminTab } from './types';
import { adminService } from './data/adminService';
import { ToastProvider } from './components/Toast';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';

import DashboardView from './views/DashboardView';
import FarmerManagementView from './views/FarmerManagementView';
import BuyerManagementView from './views/BuyerManagementView';
import ProduceManagementView from './views/ProduceManagementView';
import SmartMatchingView from './views/SmartMatchingView';
import OrderManagementView from './views/OrderManagementView';
import TransactionsView from './views/TransactionsView';
import RatingsView from './views/RatingsView';
import ComplaintsView from './views/ComplaintsView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';

interface AdminAppProps {
  onLogout: () => void;
  initialTab?: AdminTab;
}

export default function AdminApp({ onLogout, initialTab = 'dashboard' }: AdminAppProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('30 Days');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setTick] = useState(0);

  // Subscribe to reactive service changes
  useEffect(() => {
    const unsubscribe = adminService.subscribe(() => setTick((t) => t + 1));
    return () => {
      unsubscribe();
    };
  }, []);

  const farmers = adminService.getFarmers();
  const buyers = adminService.getBuyers();
  const complaints = adminService.getComplaints();

  const pendingVerificationsCount =
    farmers.filter((f) => f.verificationStatus === 'Pending Verification').length +
    buyers.filter((b) => b.verificationStatus === 'Pending Verification').length;

  const openComplaintsCount = complaints.filter((c) => c.status === 'Open' || c.status === 'Under Review').length;

  return (
    <ToastProvider>
      <div className="flex h-screen w-full overflow-hidden bg-paper text-ink">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSearchQuery('');
          }}
          pendingVerificationsCount={pendingVerificationsCount}
          openComplaintsCount={openComplaintsCount}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navbar */}
          <AdminNavbar
            activeTab={activeTab}
            onMenuClick={() => setMobileMenuOpen(true)}
            onLogout={onLogout}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          {/* View Container */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
            {activeTab === 'farmers' && <FarmerManagementView searchQuery={searchQuery} />}
            {activeTab === 'buyers' && <BuyerManagementView searchQuery={searchQuery} />}
            {activeTab === 'produce' && <ProduceManagementView searchQuery={searchQuery} />}
            {activeTab === 'matching' && <SmartMatchingView />}
            {activeTab === 'orders' && <OrderManagementView searchQuery={searchQuery} />}
            {activeTab === 'transactions' && <TransactionsView searchQuery={searchQuery} />}
            {activeTab === 'ratings' && <RatingsView searchQuery={searchQuery} />}
            {activeTab === 'complaints' && <ComplaintsView searchQuery={searchQuery} />}
            {activeTab === 'analytics' && (
              <AnalyticsView dateRange={dateRange} onDateRangeChange={setDateRange} />
            )}
            {activeTab === 'settings' && <SettingsView />}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

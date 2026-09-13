import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  Package,
  Sparkles,
  ClipboardList,
  Wallet,
  Star,
  AlertTriangle,
  BarChart3,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { AdminTab } from '../types';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  pendingVerificationsCount?: number;
  openComplaintsCount?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard; badgeKey?: 'verifications' | 'complaints' }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'farmers', label: 'Farmer Management', icon: Sprout, badgeKey: 'verifications' },
  { id: 'buyers', label: 'Buyer Management', icon: ShoppingBag },
  { id: 'produce', label: 'Produce Management', icon: Package },
  { id: 'matching', label: 'Smart Matching', icon: Sparkles },
  { id: 'orders', label: 'Order Management', icon: ClipboardList },
  { id: 'transactions', label: 'Transactions', icon: Wallet },
  { id: 'ratings', label: 'Ratings & Feedback', icon: Star },
  { id: 'complaints', label: 'Reports & Complaints', icon: AlertTriangle, badgeKey: 'complaints' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({
  activeTab,
  onTabChange,
  pendingVerificationsCount = 0,
  openComplaintsCount = 0,
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const content = (
    <div className="flex h-full flex-col justify-between bg-dusk-700 text-paper">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between border-b border-dusk-600 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-500 shadow-md shadow-leaf-500/30">
              <ShieldCheck size={22} className="text-paper" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-bold text-paper">Moolya</span>
                <span className="rounded bg-leaf-500/30 px-1.5 py-0.5 text-[10px] font-bold text-leaf-300">
                  Admin
                </span>
              </div>
              <p className="text-xs text-dusk-200">Management Dashboard</p>
            </div>
          </div>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="rounded-lg p-1 text-dusk-200 hover:bg-dusk-600 lg:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badgeValue =
              item.badgeKey === 'verifications'
                ? pendingVerificationsCount
                : item.badgeKey === 'complaints'
                ? openComplaintsCount
                : 0;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (onMobileClose) onMobileClose();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-leaf-500 text-paper font-semibold shadow-md shadow-leaf-500/20'
                    : 'text-dusk-100 hover:bg-dusk-600/70 hover:text-paper'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isActive ? 'text-paper' : 'text-dusk-200 group-hover:text-paper'}
                  />
                  <span>{item.label}</span>
                </div>

                {badgeValue > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isActive ? 'bg-paper text-leaf-700' : 'bg-rust-500 text-paper'
                    }`}
                  >
                    {badgeValue}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="border-t border-dusk-600 p-4 text-xs text-dusk-200">
        <div className="rounded-xl bg-dusk-600/50 p-3">
          <p className="font-semibold text-paper">Farmer-to-Buyer Platform</p>
          <p className="mt-0.5 text-[11px] text-dusk-200">Direct Linkage System</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-leaf-300 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf-400 animate-pulse" />
            Admin System Active
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-black/10 lg:block">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onMobileClose}
        >
          <div
            className="h-full w-72 max-w-[80vw] shadow-2xl animate-slide-right"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
}

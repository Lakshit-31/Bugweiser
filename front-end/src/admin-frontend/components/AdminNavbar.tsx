import { Menu, Search, Bell, LogOut, Shield, Calendar } from 'lucide-react';
import type { AdminTab } from '../types';

interface AdminNavbarProps {
  activeTab: AdminTab;
  onMenuClick: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Admin Dashboard Overview', subtitle: 'Real-time metrics, user growth, pending verifications & platform stats.' },
  farmers: { title: 'Farmer Directory & Verification', subtitle: 'Manage registered farmers, crop profiles, verification badges & account status.' },
  buyers: { title: 'Buyer Directory & Trust Scores', subtitle: 'Manage buyer businesses, GST verifications & reliability trust metrics.' },
  produce: { title: 'Produce Listing Moderation', subtitle: 'Approve, reject, or remove agricultural listings across all regions.' },
  matching: { title: 'Smart Matching Engine & Net Earnings', subtitle: 'Sharma Wholesale wheat 500kg match score breakdown & transport cost net earnings calculator.' },
  orders: { title: 'Order Lifecycle Management', subtitle: 'Track and audit digital contracts from Request to Transit & Completion.' },
  transactions: { title: 'Financial Ledger & Transactions', subtitle: 'Monitor payment processing, completed settlements, and platform transaction volume.' },
  ratings: { title: 'Ratings & Buyer Feedback', subtitle: 'Inspect 5-star ratings, buyer/farmer reviews, and moderate reported content.' },
  complaints: { title: 'Disputes & Report Management', subtitle: 'Resolve open user complaints, contract violations, and priority issues.' },
  analytics: { title: 'Platform Growth & Market Analytics', subtitle: 'Visual charts for user registrations, order volume, popular crops & regional demand.' },
  settings: { title: 'Platform & Security Settings', subtitle: 'Configure commission rates, verification requirements, and admin profile.' },
};

export default function AdminNavbar({
  activeTab,
  onMenuClick,
  onLogout,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: AdminNavbarProps) {
  const current = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-paper/95 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Mobile hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl border border-gray-200 bg-white p-2 text-ink hover:bg-gray-50 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-serif text-xl font-bold text-ink sm:text-2xl">{current.title}</h1>
            <p className="hidden text-xs text-gray-500 sm:block">{current.subtitle}</p>
          </div>
        </div>

        {/* Right: Global Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Bar */}
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search platform..."
              className="w-full rounded-xl border border-gray-200 bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-gray-400 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
            />
          </div>

          {/* Date Filter Select */}
          <div className="relative hidden md:block">
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600">
              <Calendar size={14} className="text-leaf-500" />
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="7 Days">7 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="3 Months">3 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
            </div>
          </div>

          {/* Admin Profile Pill & Logout */}
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-ink">Moolya Admin</p>
              <p className="text-[10px] text-leaf-600 font-medium">System Operator</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-dusk-500 text-paper">
              <Shield size={16} />
            </div>
            <button
              onClick={onLogout}
              title="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-rust-200 bg-rust-50 text-rust-600 hover:bg-rust-100 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

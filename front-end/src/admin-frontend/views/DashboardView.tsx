import {
  Users,
  Sprout,
  ShoppingBag,
  Package,
  ClipboardList,
  Wallet,
  Star,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import type { AdminTab } from '../types';
import { adminService } from '../data/adminService';

interface DashboardViewProps {
  onNavigate: (tab: AdminTab) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const farmers = adminService.getFarmers();
  const buyers = adminService.getBuyers();
  const produce = adminService.getProduce();
  const orders = adminService.getOrders();
  const transactions = adminService.getTransactions();
  const reviews = adminService.getReviews();
  const complaints = adminService.getComplaints();

  const totalFarmers = farmers.length;
  const totalBuyers = buyers.length;
  const activeProduce = produce.filter((p) => p.moderationStatus === 'Approved').length;
  const pendingFarmers = farmers.filter((f) => f.verificationStatus === 'Pending Verification').length;
  const pendingBuyers = buyers.filter((b) => b.verificationStatus === 'Pending Verification').length;
  const pendingVerifications = pendingFarmers + pendingBuyers;
  const activeOrders = orders.filter((o) => ['Requested', 'Accepted', 'Confirmed', 'In Transit'].includes(o.status)).length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;
  const totalTxnCount = transactions.length;
  const totalTxnValue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8';

  const pendingProduceCount = produce.filter((p) => p.moderationStatus === 'Pending Approval').length;
  const openComplaintsCount = complaints.filter((c) => c.status === 'Open' || c.status === 'Under Review').length;

  return (
    <div className="space-y-6">
      {/* Hero Platform Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dusk-700 via-dusk-600 to-leaf-700 p-6 text-paper shadow-xl">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-block rounded-md bg-leaf-500/30 px-2.5 py-1 text-xs font-bold text-leaf-300">
              Farmer-to-Buyer Direct Linkage Platform
            </span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-paper sm:text-3xl">
              Elimination of Agricultural Intermediaries
            </h2>
            <p className="mt-1.5 text-xs text-dusk-100 sm:text-sm leading-relaxed">
              Connecting rural farmers directly to commercial buyers with price transparency, location matching, and automated trust metrics.
            </p>
          </div>
          <button
            onClick={() => onNavigate('matching')}
            className="btn-primary shrink-0 bg-leaf-500 hover:bg-leaf-600 text-paper font-semibold shadow-lg"
          >
            Launch Smart Matcher <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 9 KPI Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Farmers"
          value={totalFarmers}
          trend="+18% this month"
          icon={<Sprout size={20} />}
          description="Verified agricultural producers"
        />
        <StatCard
          title="Total Buyers"
          value={totalBuyers}
          trend="+12% this month"
          icon={<ShoppingBag size={20} />}
          description="Wholesalers, co-ops & processors"
        />
        <StatCard
          title="Active Listings"
          value={activeProduce}
          trend="+34 today"
          icon={<Package size={20} />}
          description="Approved produce on market"
        />
        <StatCard
          title="Pending Verifications"
          value={pendingVerifications}
          trend={pendingVerifications > 0 ? 'Requires Admin Action' : 'All clear'}
          trendUp={pendingVerifications === 0}
          icon={<Clock size={20} />}
          description="Farmers & Buyers awaiting check"
          badgeText={pendingVerifications > 0 ? 'Action Needed' : undefined}
        />
        <StatCard
          title="Active Orders"
          value={activeOrders}
          trend="In Transit & Confirmed"
          icon={<ClipboardList size={20} />}
          description="Live contracts in execution"
        />
        <StatCard
          title="Completed Orders"
          value={completedOrders}
          trend="+85% success rate"
          icon={<CheckCircle2 size={20} />}
          description="Full settlement delivered"
        />
        <StatCard
          title="Total Transactions"
          value={totalTxnCount}
          trend="Settled payments"
          icon={<Wallet size={20} />}
          description="Digital payment receipts"
        />
        <StatCard
          title="Total Volume"
          value={`₹${(totalTxnValue / 100000).toFixed(2)} Lakh`}
          trend="+22% vs last month"
          icon={<TrendingUp size={20} />}
          description="Direct farmer earnings"
          highlight
        />
        <StatCard
          title="Avg Platform Rating"
          value={`${avgRating} / 5.0`}
          trend="Based on 48 reviews"
          icon={<Star size={20} className="fill-marigold-400 text-marigold-400" />}
          description="Farmer-Buyer mutual trust"
        />
      </div>

      {/* Middle Row: Pending Actions Box + SVG Trend Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pending Actions Box */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)] lg:col-span-1">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-ink">Pending Admin Actions</h3>
            <span className="rounded-full bg-rust-100 px-2.5 py-0.5 text-xs font-bold text-rust-700">
              {pendingVerifications + pendingProduceCount + openComplaintsCount} Pending
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('farmers')}
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-left transition-colors hover:bg-leaf-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-marigold-100 text-marigold-700">
                  <Sprout size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Farmers Verification</p>
                  <p className="text-[11px] text-gray-500">{pendingFarmers} farmers waiting for KYC</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>

            <button
              onClick={() => onNavigate('buyers')}
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-left transition-colors hover:bg-dusk-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dusk-100 text-dusk-700">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Buyers Verification</p>
                  <p className="text-[11px] text-gray-500">{pendingBuyers} buyers waiting for GST check</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>

            <button
              onClick={() => onNavigate('produce')}
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-left transition-colors hover:bg-leaf-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-leaf-100 text-leaf-700">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Produce Moderation</p>
                  <p className="text-[11px] text-gray-500">{pendingProduceCount} listings awaiting review</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>

            <button
              onClick={() => onNavigate('complaints')}
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-left transition-colors hover:bg-rust-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rust-100 text-rust-700">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Open Complaints</p>
                  <p className="text-[11px] text-gray-500">{openComplaintsCount} dispute tickets open</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Charts Summary Preview */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Growth & Transaction Trends</h3>
              <p className="text-xs text-gray-500">Weekly user onboarding vs total contract volume</p>
            </div>
            <button onClick={() => onNavigate('analytics')} className="btn-ghost text-xs py-1 px-3">
              View Analytics <ArrowRight size={14} />
            </button>
          </div>

          {/* Simple Clean SVG Sparkline Charts */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-leaf-100 bg-leaf-50/40 p-4">
              <span className="text-xs font-semibold text-leaf-700">Farmer Onboarding Trend</span>
              <div className="mt-3 h-28 w-full">
                <svg viewBox="0 0 300 100" className="h-full w-full">
                  <polyline
                    fill="none"
                    stroke="#2F5233"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points="0,80 60,65 120,70 180,40 240,25 300,10"
                  />
                  <circle cx="300" cy="10" r="5" fill="#2F5233" />
                </svg>
              </div>
              <p className="mt-2 text-right text-[11px] font-bold text-leaf-700">+310 Farmers this month</p>
            </div>

            <div className="rounded-xl border border-dusk-100 bg-dusk-50/40 p-4">
              <span className="text-xs font-semibold text-dusk-700">Transaction Volume Trend</span>
              <div className="mt-3 h-28 w-full">
                <svg viewBox="0 0 300 100" className="h-full w-full">
                  <polyline
                    fill="none"
                    stroke="#2C3E66"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points="0,90 60,75 120,50 180,35 240,20 300,5"
                  />
                  <circle cx="300" cy="5" r="5" fill="#2C3E66" />
                </svg>
              </div>
              <p className="mt-2 text-right text-[11px] font-bold text-dusk-700">₹14.5 Lakh monthly volume</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log Table */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-serif text-lg font-bold text-ink">Recent Platform Activity Feed</h3>
          <span className="text-xs text-gray-500">Live platform events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">Event Type</th>
                <th className="pb-3 px-3">Entity / Details</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-leaf-50/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-leaf-700">
                  <span className="inline-flex items-center gap-1.5"><Sprout size={14} /> New Farmer</span>
                </td>
                <td className="py-3 px-3 font-medium text-ink">Rameshwar Lal (Wheat, Mustard)</td>
                <td className="py-3 px-3 text-gray-500">Gegal, Ajmer</td>
                <td className="py-3 px-3"><StatusBadge status="Verified" size="sm" /></td>
                <td className="py-3 px-3 text-right font-mono text-gray-400">10 mins ago</td>
              </tr>
              <tr className="hover:bg-dusk-50/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-dusk-700">
                  <span className="inline-flex items-center gap-1.5"><ShoppingBag size={14} /> New Buyer</span>
                </td>
                <td className="py-3 px-3 font-medium text-ink">Sharma Wholesale & Foods</td>
                <td className="py-3 px-3 text-gray-500">Jaipur, Rajasthan</td>
                <td className="py-3 px-3"><StatusBadge status="Verified" size="sm" /></td>
                <td className="py-3 px-3 text-right font-mono text-gray-400">25 mins ago</td>
              </tr>
              <tr className="hover:bg-leaf-50/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-leaf-700">
                  <span className="inline-flex items-center gap-1.5"><Package size={14} /> Produce Listed</span>
                </td>
                <td className="py-3 px-3 font-medium text-ink">Organic Wheat (1,500 kg @ ₹32/kg)</td>
                <td className="py-3 px-3 text-gray-500">Pushkar, Ajmer</td>
                <td className="py-3 px-3"><StatusBadge status="Approved" size="sm" /></td>
                <td className="py-3 px-3 text-right font-mono text-gray-400">1 hour ago</td>
              </tr>
              <tr className="hover:bg-sky-50/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-sky-700">
                  <span className="inline-flex items-center gap-1.5"><ClipboardList size={14} /> Order Placed</span>
                </td>
                <td className="py-3 px-3 font-medium text-ink">ORD-2026-0153 (Pushkar Organic)</td>
                <td className="py-3 px-3 text-gray-500">Pushkar → Ajmer</td>
                <td className="py-3 px-3"><StatusBadge status="Confirmed" size="sm" /></td>
                <td className="py-3 px-3 text-right font-mono text-gray-400">2 hours ago</td>
              </tr>
              <tr className="hover:bg-leaf-50/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-leaf-700">
                  <span className="inline-flex items-center gap-1.5"><Wallet size={14} /> Settlement Done</span>
                </td>
                <td className="py-3 px-3 font-medium text-ink">TXN-2026-0918 (₹15,000 to Rameshwar)</td>
                <td className="py-3 px-3 text-gray-500">RTGS Direct</td>
                <td className="py-3 px-3"><StatusBadge status="Completed" size="sm" /></td>
                <td className="py-3 px-3 text-right font-mono text-gray-400">3 hours ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

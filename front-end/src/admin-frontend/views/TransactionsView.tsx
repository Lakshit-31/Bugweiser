import { useState } from 'react';
import { Search, Wallet, CheckCircle2, Clock, AlertTriangle, IndianRupee, Calendar, TrendingUp } from 'lucide-react';
import { adminService } from '../data/adminService';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

interface TransactionsViewProps {
  searchQuery: string;
}

export default function TransactionsView({ searchQuery }: TransactionsViewProps) {
  const transactions = adminService.getTransactions();
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const query = localSearch || searchQuery;

  const totalValue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedCount = transactions.filter((t) => t.paymentStatus === 'Completed').length;
  const pendingCount = transactions.filter((t) => t.paymentStatus === 'Pending' || t.paymentStatus === 'Processing').length;
  const failedCount = transactions.filter((t) => t.paymentStatus === 'Failed').length;

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.transactionId.toLowerCase().includes(query.toLowerCase()) ||
      t.orderId.toLowerCase().includes(query.toLowerCase()) ||
      t.farmerName.toLowerCase().includes(query.toLowerCase()) ||
      t.buyerName.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transaction Value"
          value={`₹${(totalValue / 100000).toFixed(2)} Lakh`}
          trend="+15% direct earnings"
          icon={<Wallet size={20} />}
          highlight
        />
        <StatCard
          title="Completed Payments"
          value={completedCount}
          trend="Settled via Escrow RTGS"
          icon={<CheckCircle2 size={20} />}
        />
        <StatCard
          title="Pending / Processing"
          value={pendingCount}
          trend="Arriving in 24-48 hrs"
          icon={<Clock size={20} />}
        />
        <StatCard
          title="Failed / Returned"
          value={failedCount}
          trend={failedCount > 0 ? 'Requires Audit' : 'All clear'}
          trendUp={failedCount === 0}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      {/* Transaction Trend Visualizer */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">Transaction Volume Trend</h3>
            <p className="text-xs text-gray-500">Direct digital settlement timeline</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-leaf-700">
            <TrendingUp size={15} /> 100% Direct Farmer Settlement
          </span>
        </div>

        {/* Clean SVG Trend */}
        <div className="h-32 w-full">
          <svg viewBox="0 0 500 120" className="h-full w-full">
            <polyline
              fill="none"
              stroke="#2F5233"
              strokeWidth="4"
              strokeLinecap="round"
              points="0,100 100,85 200,60 300,45 400,20 500,10"
            />
            <circle cx="500" cy="10" r="6" fill="#2F5233" />
          </svg>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)] md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search transactions by TXN ID, Order ID, farmer, or buyer..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-gray-400 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Payment Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Processing">Processing</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Transaction & Order ID</th>
                <th className="py-3.5 px-4">Farmer</th>
                <th className="py-3.5 px-4">Buyer</th>
                <th className="py-3.5 px-4">Crop Details</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Settlement Date</th>
                <th className="py-3.5 px-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTxns.map((txn) => (
                <tr key={txn.transactionId} className="hover:bg-leaf-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700 font-bold">
                        <Wallet size={18} />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-ink block">{txn.transactionId}</span>
                        <span className="font-mono text-[11px] text-gray-400">{txn.orderId}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800">{txn.farmerName}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800">{txn.buyerName}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-gray-700">
                      {txn.cropName} ({txn.quantity} {txn.unit})
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-serif font-bold text-leaf-700 text-sm flex items-center">
                      <IndianRupee size={14} />
                      {txn.amount.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                      <Calendar size={13} className="text-gray-400" />
                      {txn.date}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={txn.paymentStatus} />
                  </td>
                </tr>
              ))}

              {filteredTxns.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No transactions found matching query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

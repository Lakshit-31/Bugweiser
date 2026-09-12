import React, { useState } from 'react';
import {
  Receipt,
  ShieldCheck,
  TrendingDown,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';
import type { BuyerTransaction } from '@/types/buyer';
import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

interface BuyerTransactionsScreenProps {
  transactions: BuyerTransaction[];
  currentLang?: LanguageCode;
}

export default function BuyerTransactionsScreen({
  transactions,
  currentLang = 'en',
}: BuyerTransactionsScreenProps) {
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTxns = transactions.filter((t) => {
    if (filterType !== 'All' && t.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.transactionId.toLowerCase().includes(q) ||
        t.farmerName.toLowerCase().includes(q) ||
        t.cropName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSettled = transactions
    .filter((t) => t.paymentStatus === 'Settled' || t.paymentStatus === 'Received')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeEscrow = transactions
    .filter((t) => t.type === 'Escrow Deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-700">
            Escrow Financial Ledger
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {bt.transactionsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {bt.transactionsSub}
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Exporting full financial statement for FY 2025-2026...')}
          className="rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Download size={14} /> Export CSV Statement
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
            {bt.totalOutflow}
          </span>
          <div className="font-serif text-2xl sm:text-3xl font-black text-ink mt-1">
            ₹{totalSettled.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Across {transactions.length} verified procurement orders
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
            {bt.activeEscrowTrust}
          </span>
          <div className="font-serif text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
            ₹{activeEscrow.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck size={13} /> Protected until delivery inspection
          </span>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-800 block">
            {bt.disbursedToFarmers}
          </span>
          <div className="font-serif text-2xl sm:text-3xl font-black text-sky-950 mt-1">
            ₹1,93,533
          </div>
          <span className="text-[11px] text-sky-700 font-medium mt-1 block">
            T+0 direct RTGS to farmers
          </span>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
            {bt.netSavingsMandi}
          </span>
          <div className="font-serif text-2xl sm:text-3xl font-black text-amber-950 mt-1">
            ₹34,850
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-0.5">
            <TrendingDown size={13} /> Direct farmer pricing advantage
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs">
          {['All', 'Escrow Deposit', 'Settlement Release', 'Refund'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all whitespace-nowrap ${
                filterType === type
                  ? 'bg-leaf-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search txn ID, farmer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-1.5 pl-9 pr-3 text-xs text-ink focus:border-leaf-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper/70 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">Txn ID & Date</th>
                <th className="px-5 py-3.5">Farmer & Produce</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Payment Mode</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-ink font-medium">
              {filteredTxns.map((txn) => {
                const isDeposit = txn.type === 'Escrow Deposit';
                const isRefund = txn.type === 'Refund';

                return (
                  <tr key={txn.transactionId} className="hover:bg-paper/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold font-mono text-ink">{txn.transactionId}</div>
                      <div className="text-[11px] text-gray-400">{txn.date}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-ink">{txn.cropName}</div>
                      <div className="text-[11px] text-gray-500">
                        {txn.farmerName} • {txn.quantity} {txn.unit}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                          isDeposit
                            ? 'bg-emerald-50 text-emerald-800'
                            : isRefund
                            ? 'bg-red-50 text-red-800'
                            : 'bg-sky-50 text-sky-800'
                        }`}
                      >
                        {isDeposit && <ArrowUpRight size={11} />}
                        {isRefund && <RotateCcw size={11} />}
                        {!isDeposit && !isRefund && <ArrowDownLeft size={11} />}
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-semibold text-xs">
                      {txn.paymentMode}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-black text-sm text-ink">
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-900 border border-emerald-200">
                        <CheckCircle2 size={10} className="text-emerald-700" />
                        {txn.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Downloading payment slip for ${txn.transactionId}...`)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-leaf-700 transition-colors"
                        title="Download Payment Slip"
                        aria-label="Download Payment Slip"
                      >
                        <Download size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

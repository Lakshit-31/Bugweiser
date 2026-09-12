import { useState, useEffect } from 'react';
import { Wallet, Loader2, IndianRupee, Calendar, TrendingUp, Receipt } from 'lucide-react';
import type { Transaction, LanguageCode } from '@/types';
import { getTransactions } from '@/data/api';
import EmptyState from '@/components/EmptyState';
import { translations } from '@/data/translations';

const paymentStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Received:   { bg: 'bg-leaf-50',   text: 'text-leaf-600',   dot: 'bg-leaf-500' },
  Processing: { bg: 'bg-sky-50',    text: 'text-sky-500',    dot: 'bg-sky-400' },
  Pending:    { bg: 'bg-marigold-50', text: 'text-marigold-600', dot: 'bg-marigold-400' },
};

interface PaymentsScreenProps {
  currentLang: LanguageCode;
}

export default function PaymentsScreen({ currentLang }: PaymentsScreenProps) {
  const t = translations[currentLang] || translations.en;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions().then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  const totalReceived = transactions
    .filter((t) => t.paymentStatus === 'Received')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalProcessing = transactions
    .filter((t) => t.paymentStatus === 'Processing')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-ink">{t.paymentsTitle}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.paymentsSub}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-leaf-400" />
        </div>
      ) : (
        <>
          {/* Summary card */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-leaf-500 p-6 text-paper shadow-lg shadow-leaf-500/20">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-400/30">
                  <Wallet size={20} />
                </div>
                <span className="text-sm font-medium text-leaf-100">{t.totalReceivedLabel}</span>
              </div>
              <p className="font-serif text-3xl font-bold">
                ₹{totalReceived.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-sm text-leaf-100">
                {transactions.filter((t) => t.paymentStatus === 'Received').length} {t.completedTxnsSub}
              </p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-500">
                  <TrendingUp size={20} />
                </div>
                <span className="text-sm font-medium text-sky-600">{t.inProcessingLabel}</span>
              </div>
              <p className="font-serif text-3xl font-bold text-sky-600">
                ₹{totalProcessing.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-sm text-sky-500">
                {t.expectedArriveSub}
              </p>
            </div>
          </div>

          {/* Transactions list */}
          <h2 className="mb-3 font-serif text-lg font-semibold text-ink">{t.txnHistoryTitle}</h2>

          {transactions.length === 0 ? (
            <EmptyState
              icon={<Receipt size={28} />}
              title={t.noTxnTitle}
              description={t.noTxnSub}
            />
          ) : (
            <div className="space-y-3">
              {transactions.map((txn) => {
                const config = paymentStatusConfig[txn.paymentStatus] ?? paymentStatusConfig.Pending;
                return (
                  <div key={txn.transactionId} className="card flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-500">
                      <Receipt size={20} />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate font-semibold text-ink">{txn.buyerName}</h3>
                        <p className="flex shrink-0 items-center font-serif text-lg font-semibold text-leaf-600">
                          <IndianRupee size={14} />
                          {txn.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                        <span>{txn.cropName} · {txn.quantity} {txn.unit}</span>
                        <span className="text-gray-300">|</span>
                        <span className="font-mono text-xs text-gray-400">{txn.transactionId}</span>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-gray-400" />
                          {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Payment status pill */}
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
                      <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${config.dot}`} />
                      {txn.paymentStatus}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

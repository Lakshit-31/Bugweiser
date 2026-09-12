import { useState, useEffect } from 'react';
import { ClipboardList, Loader2, IndianRupee, Calendar, ShoppingBag } from 'lucide-react';
import type { Order, LanguageCode } from '@/types';
import { getOrders } from '@/data/api';
import StatusPill from '@/components/StatusPill';
import EmptyState from '@/components/EmptyState';
import { translations } from '@/data/translations';

type FilterStatus = 'All' | Order['status'];

const filterOptions: FilterStatus[] = ['All', 'Pending', 'Accepted', 'Confirmed', 'In Transit', 'Completed', 'Cancelled'];

interface OrdersScreenProps {
  currentLang: LanguageCode;
}

export default function OrdersScreen({ currentLang }: OrdersScreenProps) {
  const t = translations[currentLang] || translations.en;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('All');

  const filterLabels: Record<FilterStatus, string> = {
    'All': t.filterAll,
    'Pending': t.filterPending,
    'Accepted': t.filterAccepted,
    'Confirmed': t.filterConfirmed,
    'In Transit': t.filterInTransit,
    'Completed': t.filterCompleted,
    'Cancelled': t.filterCancelled,
  };

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-ink">{t.ordersTitle}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.ordersSub}</p>
      </div>

      {/* Filter pills */}
      <div className="scrollbar-hide -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {filterOptions.map((opt) => {
          const count = opt === 'All' ? orders.length : orders.filter((o) => o.status === opt).length;
          return (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                filter === opt
                  ? 'bg-leaf-500 text-paper'
                  : 'border border-gray-200 bg-white text-gray-500 hover:border-leaf-200 hover:text-leaf-600'
              }`}
            >
              {filterLabels[opt] || opt} {count > 0 && <span className="opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-leaf-400" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={28} />}
          title={`${filterLabels[filter] || filter} ${t.ordersTitle}`}
          description={
            filter === 'All'
              ? 'When buyers accept your produce listings, their orders will appear here. Go to the Produce screen to find buyer matches.'
              : `You don't have any ${filter.toLowerCase()} orders right now. Try a different filter.`
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => (
            <div key={order.orderId} className="card">
              {/* Order ID + status */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-gray-400">{t.orderIdLabel}</span>
                  <p className="font-mono text-sm font-semibold text-ink">{order.orderId}</p>
                </div>
                <StatusPill status={order.status} />
              </div>

              {/* Buyer + crop */}
              <div className="mb-3">
                <h3 className="font-semibold text-ink">{order.buyerName}</h3>
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <ShoppingBag size={13} className="text-leaf-400" />
                  {order.cropName} · {order.quantity} {order.unit}
                </p>
              </div>

              {/* Amount + date */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div>
                  <span className="text-xs text-gray-400">{t.totalAmountLabel}</span>
                  <p className="flex items-center font-serif text-lg font-semibold text-leaf-600">
                    <IndianRupee size={15} />
                    {order.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">{t.orderDateLabel}</span>
                  <p className="flex items-center justify-end gap-1 text-sm font-medium text-ink">
                    <Calendar size={12} className="text-gray-400" />
                    {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

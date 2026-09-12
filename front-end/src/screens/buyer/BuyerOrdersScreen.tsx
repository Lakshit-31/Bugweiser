import React, { useState } from 'react';
import {
  PackageCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ShieldCheck,
  FileText,
  MessageSquare,
  Star,
  MapPin,
  Calendar,
  AlertCircle,
  Download,
} from 'lucide-react';
import type { BuyerOrder } from '@/types/buyer';
import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

interface BuyerOrdersScreenProps {
  orders: BuyerOrder[];
  onOpenChat: (farmerName: string) => void;
  onOpenFeedback: (order: BuyerOrder) => void;
  currentLang?: LanguageCode;
}

export default function BuyerOrdersScreen({
  orders,
  onOpenChat,
  onOpenFeedback,
  currentLang = 'en',
}: BuyerOrdersScreenProps) {
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Accepted' | 'In Transit' | 'Completed' | 'Rejected'>('All');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<BuyerOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'All') return true;
    return o.status === activeTab;
  });

  const getStatusBadge = (status: BuyerOrder['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-800 border border-amber-200">Awaiting Farmer Acceptance</span>;
      case 'Accepted':
        return <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800 border border-emerald-200">Farmer Accepted</span>;
      case 'In Transit':
        return <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-extrabold text-sky-800 border border-sky-200">In Transit</span>;
      case 'Completed':
        return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900 border border-emerald-300">Delivered & Settled</span>;
      case 'Rejected':
        return <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-800 border border-red-200">Declined / Cancelled</span>;
    }
  };

  const trackingSteps = [
    { step: 1, title: bt.milestonePlaced },
    { step: 2, title: bt.milestoneAccepted },
    { step: 3, title: bt.milestoneInspected },
    { step: 4, title: bt.milestoneInTransit },
    { step: 5, title: bt.milestoneDelivered },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-700">
            Escrow Fulfilled Procurements
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {bt.ordersTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {bt.ordersSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-2xl bg-white p-3 text-xs border border-gray-200 shadow-2xs">
            Total Orders: <strong>{orders.length}</strong>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="scrollbar-hide -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0 text-xs border-b border-gray-200 pb-2">
        {(['All', 'Pending', 'Accepted', 'In Transit', 'Completed', 'Rejected'] as const).map((tab) => {
          const count = tab === 'All' ? orders.length : orders.filter((o) => o.status === tab).length;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-xl px-4 py-2 font-bold transition-all ${
                activeTab === tab
                  ? 'bg-leaf-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-ink'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Order Cards List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            return (
              <div
                key={order.orderId}
                className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs hover:border-leaf-300 hover:shadow-md transition-all space-y-4"
              >
                {/* Top Row: IDs, Farmer, Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.cropImage || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=200&q=80'}
                      alt={order.cropName}
                      className="h-12 w-12 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-ink">{order.cropName}</h3>
                        <span className="font-mono text-xs text-gray-400">#{order.orderId}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Farmer: <strong>{order.farmerName}</strong> • {order.farmerLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* 5-Milestone Tracking Progress Bar (unless rejected) */}
                {order.status !== 'Rejected' && (
                  <div className="pt-2">
                    <div className="grid grid-cols-5 text-center text-[10px] font-bold text-gray-400 mb-2">
                      {trackingSteps.map((s) => {
                        const isDone = s.step <= order.trackingStep;
                        const isCurrent = s.step === order.trackingStep;
                        return (
                          <span
                            key={s.step}
                            className={`${
                              isCurrent
                                ? 'text-leaf-800 font-extrabold'
                                : isDone
                                ? 'text-emerald-700'
                                : 'text-gray-400'
                            }`}
                          >
                            {s.step}. {s.title}
                          </span>
                        );
                      })}
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden flex">
                      {trackingSteps.map((s) => {
                        const isDone = s.step <= order.trackingStep;
                        const isCurrent = s.step === order.trackingStep;
                        return (
                          <div
                            key={s.step}
                            className={`h-full w-1/5 transition-all ${
                              isCurrent
                                ? 'bg-leaf-600 animate-pulse'
                                : isDone
                                ? 'bg-emerald-500'
                                : 'bg-transparent'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {order.status === 'Rejected' && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                    <div>
                      <span className="font-bold">Decline Reason:</span> {order.rejectionReason || 'Farmer was unable to fulfill requested delivery date.'}
                      <p className="text-[11px] text-red-600 mt-0.5">Escrow payment of ₹{order.totalAmount.toLocaleString('en-IN')} has been refunded in full.</p>
                    </div>
                  </div>
                )}

                {/* Financial & Logistics Snapshot */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Quantity & Agreed Rate</span>
                    <span className="font-bold text-ink">
                      {order.quantity} {order.unit} @ ₹{order.agreedPrice}/{order.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Total Escrow Amount</span>
                    <span className="font-black text-emerald-900 text-sm">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Logistics Model</span>
                    <span className="font-bold text-ink">{order.logisticsMethod}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Escrow Status</span>
                    <span className="font-bold text-emerald-700">{order.escrowStatus}</span>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-gray-500 flex items-center gap-3">
                    <span>Ordered: {order.orderDate}</span>
                    <span>•</span>
                    <span>Expected Delivery: {order.expectedDeliveryDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenChat(order.farmerName)}
                      className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                    >
                      <MessageSquare size={13} /> {bt.chatFarmerBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                    >
                      <FileText size={13} /> {bt.viewInvoiceBtn}
                    </button>
                    {order.status === 'Completed' && (
                      <button
                        type="button"
                        onClick={() => onOpenFeedback(order)}
                        className="rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-600 shadow-xs flex items-center gap-1"
                      >
                        <Star size={13} fill="currentColor" /> {bt.rateReviewBtn}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <PackageCheck size={36} className="mx-auto text-gray-300 mb-2" />
            <h3 className="font-serif text-base font-bold text-ink">No orders found in "{activeTab}"</h3>
            <p className="text-xs text-gray-400 mt-1">
              Explore the Produce Marketplace to submit new verified order proposals.
            </p>
          </div>
        )}
      </div>

      {/* Invoice Preview Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl animate-scale-in space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-leaf-700">Official Settlement Receipt</span>
                <h3 className="font-serif text-lg font-bold text-ink">Invoice #{selectedInvoiceOrder.orderId}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoiceOrder(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Date:</span>
                <span className="font-semibold text-ink">{selectedInvoiceOrder.orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Beneficiary Farmer:</span>
                <span className="font-semibold text-ink">{selectedInvoiceOrder.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Buyer Business:</span>
                <span className="font-semibold text-ink">Ajmer Grain Mandi Co-op Ltd.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GSTIN:</span>
                <span className="font-mono text-ink">08ABCDE1234F1Z5</span>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span>{selectedInvoiceOrder.cropName} ({selectedInvoiceOrder.quantity} {selectedInvoiceOrder.unit}):</span>
                  <span>₹{(selectedInvoiceOrder.quantity * selectedInvoiceOrder.agreedPrice).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Freight ({selectedInvoiceOrder.logisticsMethod}):</span>
                  <span>₹{selectedInvoiceOrder.freightAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Moolya Escrow Guarantee Fee (0.5%):</span>
                  <span>₹{selectedInvoiceOrder.escrowFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-sm text-emerald-950">
                  <span>Total Settled:</span>
                  <span>₹{selectedInvoiceOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedInvoiceOrder(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Receipt downloaded successfully!');
                  setSelectedInvoiceOrder(null);
                }}
                className="rounded-xl bg-leaf-600 px-4 py-2 text-xs font-bold text-white hover:bg-leaf-700 flex items-center gap-1.5"
              >
                <Download size={14} /> Download PDF Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  X,
  Send,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Building,
  ArrowRight,
  Info,
} from 'lucide-react';
import type { Produce } from '@/types';
import type { BuyerOrder } from '@/types/buyer';
import { mockBuyerProfile } from '@/data/buyerMockData';

interface OrderRequestModalProps {
  produce: Produce | null;
  onClose: () => void;
  onSubmitOrder: (newOrder: BuyerOrder) => void;
}

export default function OrderRequestModal({
  produce,
  onClose,
  onSubmitOrder,
}: OrderRequestModalProps) {
  if (!produce) return null;

  const [quantity, setQuantity] = useState<number>(produce.availableQuantity || 1000);
  const [proposedPrice, setProposedPrice] = useState<number>(produce.expectedPrice || 24.5);
  const [logisticsMethod, setLogisticsMethod] = useState<'Moolya Verified Freight' | 'Farmer Dispatch' | 'Buyer Pickup'>('Moolya Verified Freight');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(mockBuyerProfile.primaryWarehouse);
  const [deliveryDate, setDeliveryDate] = useState<string>('2026-03-28');
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calculations
  const baseCost = quantity * proposedPrice;
  const freightRatePerKg = logisticsMethod === 'Moolya Verified Freight' ? 1.1 : logisticsMethod === 'Farmer Dispatch' ? 0.7 : 0;
  const estimatedFreight = Math.round(quantity * freightRatePerKg);
  const escrowFee = Math.round(baseCost * 0.005); // 0.5% platform escrow
  const grandTotal = baseCost + estimatedFreight + escrowFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 || quantity > produce.availableQuantity) {
      setError(`Quantity must be between 1 and ${produce.availableQuantity} ${produce.unit}`);
      return;
    }
    if (proposedPrice <= 0) {
      setError('Please provide a valid price per unit');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `ORD-BUY-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newOrder: BuyerOrder = {
        orderId,
        farmerId: 'f-gurpreet',
        farmerName: produce.farmerName || 'Gurpreet Singh Dhillon',
        farmerPhone: '+91 98150 12345',
        farmerLocation: produce.location,
        cropName: produce.cropName,
        cropImage: produce.image,
        quantity,
        unit: produce.unit,
        agreedPrice: proposedPrice,
        freightAmount: estimatedFreight,
        escrowFee,
        totalAmount: grandTotal,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: deliveryDate,
        deliveryAddress,
        logisticsMethod,
        status: 'Pending',
        trackingStep: 1,
        escrowStatus: 'Held in Escrow',
      };

      onSubmitOrder(newOrder);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="my-8 w-full max-w-2xl rounded-3xl border border-leaf-100 bg-white shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-paper/60">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-700">
              Procurement Order Proposal
            </span>
            <h3 className="font-serif text-lg font-bold text-ink">
              Request Order for {produce.cropName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Lot Summary Banner */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={produce.image}
                alt={produce.cropName}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-xs text-ink">{produce.cropName}</h4>
                <p className="text-[11px] text-gray-500">
                  Farmer: <strong>{produce.farmerName}</strong> • {produce.location}
                </p>
                <p className="text-[11px] text-gray-500">
                  Farmer Listed Price: <strong>₹{produce.expectedPrice}/{produce.unit}</strong>
                </p>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="text-gray-400 block text-[11px]">Available Stock</span>
              <span className="font-extrabold text-ink">{produce.availableQuantity} {produce.unit}</span>
            </div>
          </div>

          {/* Form Fields: Quantity & Proposed Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Required Quantity ({produce.unit})
              </label>
              <input
                type="number"
                min="50"
                max={produce.availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-ink focus:border-leaf-500 focus:outline-none"
                required
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Max available: {produce.availableQuantity} {produce.unit}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Proposed Price per {produce.unit} (₹)
              </label>
              <input
                type="number"
                step="0.1"
                min="5"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-ink focus:border-leaf-500 focus:outline-none"
                required
              />
              <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
                {proposedPrice < produce.expectedPrice
                  ? `Counter-offer: ₹${(produce.expectedPrice - proposedPrice).toFixed(1)} below ask`
                  : proposedPrice === produce.expectedPrice
                  ? 'Accepted listed price'
                  : 'Premium offered'}
              </span>
            </div>
          </div>

          {/* Logistics Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Logistics & Freight Responsibility
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'Moolya Verified Freight',
                  title: 'Moolya Freight',
                  sub: 'Inspected & GPS Tracked',
                  fee: '₹1.10/kg',
                },
                {
                  id: 'Farmer Dispatch',
                  title: 'Farmer Transport',
                  sub: 'Farmer coordinates truck',
                  fee: '₹0.70/kg',
                },
                {
                  id: 'Buyer Pickup',
                  title: 'Buyer Self-Pickup',
                  sub: 'Send your own vehicle',
                  fee: '₹0 (Free)',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLogisticsMethod(opt.id as any)}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    logisticsMethod === opt.id
                      ? 'border-leaf-600 bg-leaf-50 text-leaf-950 shadow-xs'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="font-bold text-xs block">{opt.title}</span>
                  <span className="text-[10px] text-gray-500 block">{opt.sub}</span>
                  <span className="text-[11px] font-extrabold text-leaf-700 block mt-1">{opt.fee}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Delivery Hub / Warehouse Address
              </label>
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-ink focus:border-leaf-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Preferred Delivery By Date
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-ink focus:border-leaf-500 focus:outline-none"
                required
              />
              <div className="mt-2 rounded-xl bg-emerald-50/70 p-2.5 text-[11px] text-emerald-800 border border-emerald-100 flex items-start gap-1.5">
                <ShieldCheck size={14} className="shrink-0 text-emerald-600 mt-0.5" />
                <span>100% Escrow protected. Payment remains in neutral trust until quality check on arrival.</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-leaf-50/80 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-2">
              Financial & Settlement Breakdown
            </span>
            <div className="space-y-1.5 text-xs text-ink">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Produce Cost ({quantity} {produce.unit} × ₹{proposedPrice}):</span>
                <span className="font-bold">₹{baseCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Freight ({logisticsMethod}):</span>
                <span className="font-bold">₹{estimatedFreight.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moolya Escrow & Quality Assurance (0.5%):</span>
                <span className="font-bold">₹{escrowFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex justify-between text-sm font-black text-emerald-950">
                <span>Total Escrow Commitment:</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-leaf-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-leaf-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Escrow Order...</span>
              ) : (
                <>
                  <Send size={15} /> Confirm & Place Order Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

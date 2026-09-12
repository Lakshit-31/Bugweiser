import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  TrendingDown,
  MapPin,
  Truck,
  Award,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Send,
  Star,
  ArrowRight,
  Info,
} from 'lucide-react';
import { priceComparisonData } from '@/data/buyerMockData';
import type { PriceComparisonItem } from '@/types/buyer';
import MatchScoreBadge from '@/components/buyer/MatchScoreBadge';
import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

interface PriceComparisonScreenProps {
  onOpenChat: (farmerName: string) => void;
  onOpenOrderFromComparison: (item: PriceComparisonItem, quantity: number) => void;
  initialCrop?: string;
  currentLang?: LanguageCode;
}

export default function PriceComparisonScreen({
  onOpenChat,
  onOpenOrderFromComparison,
  initialCrop = 'wheat',
  currentLang = 'en',
}: PriceComparisonScreenProps) {
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;
  const [selectedCrop, setSelectedCrop] = useState<string>(
    initialCrop.toLowerCase().includes('mustard')
      ? 'mustard'
      : initialCrop.toLowerCase().includes('tomato')
      ? 'tomatoes'
      : 'wheat'
  );
  const [orderQuantity, setOrderQuantity] = useState<number>(1200);

  const availableCrops = [
    { key: 'wheat', label: 'Sharbati Wheat', mandiBenchmark: '₹27.20 / kg' },
    { key: 'mustard', label: 'Yellow Mustard Seeds', mandiBenchmark: '₹59.50 / kg' },
    { key: 'tomatoes', label: 'Red Hybrid Tomatoes', mandiBenchmark: '₹22.00 / kg' },
  ];

  const offers = priceComparisonData[selectedCrop] || priceComparisonData['wheat'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-700">
            Multi-Farmer Comparative Engine
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {bt.priceCompareTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {bt.priceCompareSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            {bt.mandiSavingsMode}
          </span>
        </div>
      </div>

      {/* Commodity Selector Bar */}
      <div className="flex flex-wrap gap-2">
        {availableCrops.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setSelectedCrop(c.key)}
            className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCrop === c.key
                ? 'bg-leaf-600 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Scale size={15} />
            <span>{c.label}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                selectedCrop === c.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              Mandi: {c.mandiBenchmark}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Landed Cost Quantity Simulator */}
      <div className="rounded-3xl border border-leaf-200/80 bg-gradient-to-br from-paper via-white to-emerald-50/40 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-700">
              {bt.quantitySimulatorTitle}
            </span>
            <h3 className="font-serif text-base font-bold text-ink">
              {bt.quantitySimulatorTitle}: <strong className="text-leaf-800 text-lg font-mono">{orderQuantity.toLocaleString()} kg</strong>
            </h3>
            <p className="text-xs text-gray-500">
              {bt.quantitySimulatorSub}
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(Number(e.target.value))}
              className="w-full accent-leaf-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>200 kg</span>
              <span>1,500 kg</span>
              <span>3,000 kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {offers.map((item, idx) => {
          const totalBase = orderQuantity * item.basePrice;
          const totalFreight = Math.round(orderQuantity * item.freightPerUnit);
          const totalLanded = totalBase + totalFreight;
          const totalMandiCost = orderQuantity * item.mandiPrice;
          const netTotalSavings = totalMandiCost - totalLanded;
          const isSavingsPositive = netTotalSavings > 0;

          return (
            <div
              key={idx}
              className={`rounded-3xl border transition-all relative flex flex-col justify-between overflow-hidden bg-white shadow-xs ${
                item.isRecommended
                  ? 'border-emerald-400 shadow-md ring-2 ring-emerald-400/20'
                  : 'border-gray-200 hover:border-leaf-300'
              }`}
            >
              {/* Top Highlight Badge */}
              {item.isRecommended && (
                <div className="bg-gradient-to-r from-emerald-600 to-leaf-600 px-4 py-1.5 text-center text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-1">
                  <Sparkles size={13} /> {bt.recommendedBestOffer}
                </div>
              )}

              <div className="p-6 space-y-5">
                {/* Farmer & Location Info */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">
                      Farmer Offer #{idx + 1}
                    </span>
                    <span className="rounded-md bg-leaf-50 px-2 py-0.5 text-[10px] font-extrabold text-leaf-800">
                      {item.quality}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-ink mt-1">
                    {item.farmerName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-leaf-600" /> ~{item.distanceKm} km {bt.distanceAway}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star size={12} fill="currentColor" /> {item.farmerRating}
                    </span>
                  </div>

                  {/* Match score badge */}
                  <div className="mt-3">
                    <MatchScoreBadge score={item.matchScore} size="sm" />
                  </div>
                </div>

                {/* Landed Cost Breakdown Box */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>{bt.baseFarmgatePrice}:</span>
                    <span className="font-bold text-ink">₹{item.basePrice.toFixed(2)} / kg</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck size={12} className="text-sky-600" /> {bt.freightToWarehouse}:
                    </span>
                    <span className="font-bold text-sky-800">+₹{item.freightPerUnit.toFixed(2)} / kg</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                    <span className="font-bold text-ink">{bt.totalLandedCost}:</span>
                    <span className="font-black text-base text-ink">
                      ₹{item.totalLandedCost.toFixed(2)} / kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-gray-400">
                    <span>APMC Mandi Reference:</span>
                    <span className="line-through">₹{item.mandiPrice.toFixed(2)} / kg</span>
                  </div>
                </div>

                {/* Total Expenditure for Simulated Quantity */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    For {orderQuantity.toLocaleString()} kg Order
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-gray-500 block">{bt.totalLandedCost}:</span>
                      <span className="font-serif text-xl font-black text-emerald-950">
                        ₹{totalLanded.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">{bt.savingsVsMandi}:</span>
                      <span
                        className={`text-sm font-extrabold flex items-center gap-0.5 justify-end ${
                          isSavingsPositive ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        <TrendingDown size={14} />
                        {isSavingsPositive
                          ? `${bt.savePercent} ₹${netTotalSavings.toLocaleString('en-IN')}`
                          : `Premium lot`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Spec Parameters */}
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{bt.availableStock}:</span>
                    <span className="font-semibold text-ink">{item.quantityAvailable} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{bt.harvestDate}:</span>
                    <span className="font-semibold text-ink">{item.harvestDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Escrow Protected:</span>
                    <span className="font-semibold text-emerald-700">✓ 100% Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-100 bg-gray-50/80 p-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenChat(item.farmerName)}
                  className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 hover:border-leaf-300 hover:text-leaf-800 transition-colors"
                  title="Chat with Farmer"
                  aria-label="Chat with Farmer"
                >
                  <MessageSquare size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenOrderFromComparison(item, orderQuantity)}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                    item.isRecommended
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-leaf-600 text-white hover:bg-leaf-700'
                  }`}
                >
                  <Send size={14} /> {bt.orderAtRateBtn} ₹{item.basePrice}/kg
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

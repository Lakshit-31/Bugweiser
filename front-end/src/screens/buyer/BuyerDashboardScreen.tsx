import React from 'react';
import {
  Sparkles,
  TrendingUp,
  PlusCircle,
  ShoppingBag,
  Scale,
  MessageSquare,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingDown,
  Layers,
} from 'lucide-react';
import type { BuyerScreenName, BuyerRequirement, BuyerOrder } from '@/types/buyer';
import type { Produce } from '@/types';
import { mockBuyerProfile } from '@/data/buyerMockData';
import MatchScoreBadge from '@/components/buyer/MatchScoreBadge';
import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

interface BuyerDashboardScreenProps {
  onNavigate: (screen: BuyerScreenName) => void;
  requirements: BuyerRequirement[];
  marketplaceLots: Produce[];
  orders: BuyerOrder[];
  onOpenRequirementModal: () => void;
  onSelectProduce: (produce: Produce) => void;
  onOpenPriceComparison: (cropName?: string) => void;
  currentLang?: LanguageCode;
}

export default function BuyerDashboardScreen({
  onNavigate,
  requirements,
  marketplaceLots,
  orders,
  onOpenRequirementModal,
  onSelectProduce,
  onOpenPriceComparison,
  currentLang = 'en',
}: BuyerDashboardScreenProps) {
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;
  // In transit order for live tracking preview
  const inTransitOrder = orders.find((o) => o.status === 'In Transit') || orders[2];
  const topMatches = marketplaceLots.slice(0, 3);

  const mandiTicker = [
    { crop: 'Sharbati Wheat', mandi: '₹27.20', direct: '₹24.50', diff: '-9.9%', trend: 'down' },
    { crop: 'Yellow Mustard', mandi: '₹59.50', direct: '₹54.00', diff: '-9.2%', trend: 'down' },
    { crop: 'Red Tomatoes', mandi: '₹22.00', direct: '₹18.00', diff: '-18.1%', trend: 'down' },
    { crop: '1121 Basmati', mandi: '₹46.00', direct: '₹42.00', diff: '-8.7%', trend: 'down' },
    { crop: 'Desi Gram', mandi: '₹71.00', direct: '₹65.00', diff: '-8.4%', trend: 'down' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-leaf-800 to-emerald-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                Enterprise Sourcing Portal
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">
                GSTIN: {mockBuyerProfile.gstNumber}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              {bt.welcomeBack}, {mockBuyerProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              {mockBuyerProfile.businessName} • {bt.dashboardSub}
            </p>
          </div>

          {/* Sourcing Actions */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenRequirementModal}
              className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-400 transition-all flex items-center gap-1.5"
            >
              <PlusCircle size={16} /> {bt.postRequirementBtn}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('buyer-marketplace')}
              className="rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 transition-all flex items-center gap-1.5 border border-white/20"
            >
              <ShoppingBag size={16} /> {bt.browseMarketplaceBtn}
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-leaf-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>{bt.kpiActiveRequirements}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
              <Layers size={15} />
            </span>
          </div>
          <div className="mt-2 font-serif text-2xl sm:text-3xl font-black text-ink">
            {requirements.length}
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Sparkles size={11} /> {bt.kpiFarmerBids}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-leaf-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>{bt.kpiProcuredVolume}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Truck size={15} />
            </span>
          </div>
          <div className="mt-2 font-serif text-2xl sm:text-3xl font-black text-ink">
            8.75 MT
          </div>
          <p className="mt-1 text-[11px] text-sky-600 font-semibold flex items-center gap-1">
            <TrendingUp size={11} /> {bt.kpiVolumeTrend}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-leaf-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>{bt.kpiEscrowSpend}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck size={15} />
            </span>
          </div>
          <div className="mt-2 font-serif text-2xl sm:text-3xl font-black text-ink">
            ₹3.14 Lakh
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={11} /> {bt.kpiDisputeFree}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs hover:border-leaf-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>{bt.kpiAvgMatchScore}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Sparkles size={15} />
            </span>
          </div>
          <div className="mt-2 font-serif text-2xl sm:text-3xl font-black text-ink">
            95.4%
          </div>
          <p className="mt-1 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            Optimal price & logistics index
          </p>
        </div>
      </div>

      {/* Live Mandi vs Direct Farmgate Price Ticker */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h3 className="font-serif text-sm font-bold text-ink">
              {bt.livePriceTicker}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onOpenPriceComparison()}
            className="text-xs font-bold text-leaf-700 hover:text-leaf-800 flex items-center gap-1"
          >
            {bt.compareMatrixBtn}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {mandiTicker.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-2.5 text-xs hover:border-leaf-300 transition-all"
            >
              <div className="font-bold text-ink truncate">{item.crop}</div>
              <div className="flex items-baseline justify-between mt-1 text-[11px]">
                <span className="text-gray-400 line-through">{item.mandi}</span>
                <span className="font-black text-emerald-800">{item.direct}/kg</span>
              </div>
              <div className="mt-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 inline-block">
                {bt.savePercent} {item.diff}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main 2-Column Content: In-Transit Shipment Tracker + Active Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Live Shipment Tracker & AI Matches */}
        <div className="lg:col-span-7 space-y-6">
          {/* In-Transit Order Widget */}
          {inTransitOrder && (
            <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Truck size={17} />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-ink">
                      {bt.activeInTransit}
                    </h3>
                    <p className="text-[11px] text-gray-500">Order #{inTransitOrder.orderId}</p>
                  </div>
                </div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-extrabold text-sky-800 border border-sky-200">
                  {inTransitOrder.logisticsMethod}
                </span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-ink text-sm">{inTransitOrder.cropName}</div>
                  <div className="text-gray-500 text-[11px]">
                    Farmer: <strong>{inTransitOrder.farmerName}</strong> ({inTransitOrder.farmerLocation})
                  </div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    Quantity: <strong>{inTransitOrder.quantity} {inTransitOrder.unit}</strong> • Escrow: <strong>₹{inTransitOrder.totalAmount.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('buyer-orders')}
                  className="rounded-xl border border-sky-300 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100 transition-colors shrink-0"
                >
                  {bt.trackTimelineBtn}
                </button>
              </div>

              {/* Progress Milestones Bar */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-4 text-center text-[10px] font-bold text-gray-500 mb-1.5">
                  <span className="text-emerald-700">1. Placed</span>
                  <span className="text-emerald-700">2. Accepted</span>
                  <span className="text-emerald-700">3. Inspected</span>
                  <span className="text-sky-700 font-extrabold">4. In Transit</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden flex">
                  <div className="h-full bg-emerald-500 w-1/4" />
                  <div className="h-full bg-emerald-500 w-1/4" />
                  <div className="h-full bg-emerald-500 w-1/4" />
                  <div className="h-full bg-sky-500 w-1/4 animate-pulse" />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-gray-500">
                  <span>GPS: Approving Kotputli Toll Plaza</span>
                  <span>Est. Delivery: Tomorrow, 2:00 PM</span>
                </div>
              </div>
            </div>
          )}

          {/* Top High Match Produce Lots */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif text-sm font-bold text-ink">
                  Top AI-Matched Lots for Your Profile
                </h3>
                <p className="text-[11px] text-gray-500">
                  Algorithmically scored against your quality & location preferences
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('buyer-marketplace')}
                className="text-xs font-bold text-leaf-700 hover:underline"
              >
                View All Lots →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {topMatches.map((lot) => (
                <div
                  key={lot.id}
                  onClick={() => onSelectProduce(lot)}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 p-3.5 hover:border-leaf-300 hover:shadow-xs transition-all cursor-pointer bg-paper/30 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={lot.image}
                      alt={lot.cropName}
                      className="h-14 w-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-ink group-hover:text-leaf-700">
                        {lot.cropName}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Farmer: {lot.farmerName} • {lot.location}
                      </p>
                      <span className="text-[11px] text-gray-500">
                        Available: <strong>{lot.availableQuantity} {lot.unit}</strong> @ ₹{lot.expectedPrice}/{lot.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <MatchScoreBadge score={lot.matchScore || 94} size="sm" />
                    <button
                      type="button"
                      className="rounded-xl bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white group-hover:bg-leaf-700"
                    >
                      Inspect Lot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Active Requirements & Fast Sourcing Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Requirements Overview Card */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif text-sm font-bold text-ink">
                  Active Procurement Demands
                </h3>
                <p className="text-[11px] text-gray-500">
                  {requirements.filter((r) => r.status === 'Matching' || r.status === 'Open').length} demands currently matching
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenRequirementModal}
                className="rounded-xl bg-leaf-50 px-2.5 py-1 text-xs font-bold text-leaf-800 hover:bg-leaf-100 transition-colors"
              >
                + Post New
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {requirements.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">{req.cropName}</span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                        req.status === 'Matching'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'Open'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Target: {req.quantity} {req.unit} @ ₹{req.preferredPrice}/{req.unit}</span>
                    <span className="font-bold text-emerald-700">
                      {req.matchedListingsCount} farmer matches
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-200/50">
                    <span className="text-[10px] text-gray-400">By {req.deliveryDate}</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('buyer-requirements')}
                      className="text-[11px] font-bold text-leaf-700 hover:underline"
                    >
                      View Proposals →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-2 text-center">
              <button
                type="button"
                onClick={() => onNavigate('buyer-requirements')}
                className="text-xs font-bold text-leaf-700 hover:underline"
              >
                Manage All {requirements.length} Requirements →
              </button>
            </div>
          </div>

          {/* Sourcing Short-cuts Panel */}
          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-leaf-50/70 p-5">
            <h3 className="font-serif text-sm font-bold text-emerald-950 mb-2">
              Buyer Procurement Toolkit
            </h3>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => onOpenPriceComparison('wheat')}
                className="w-full flex items-center justify-between rounded-xl bg-white p-3 font-semibold text-ink shadow-2xs hover:border-emerald-300 border border-gray-200 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Scale size={16} className="text-leaf-600" /> Compare Farmer Offers for Wheat
                </span>
                <ArrowRight size={14} className="text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('buyer-chat')}
                className="w-full flex items-center justify-between rounded-xl bg-white p-3 font-semibold text-ink shadow-2xs hover:border-emerald-300 border border-gray-200 transition-all"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-leaf-600" /> Direct Farmer Negotiations (1 unread)
                </span>
                <ArrowRight size={14} className="text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('buyer-transactions')}
                className="w-full flex items-center justify-between rounded-xl bg-white p-3 font-semibold text-ink shadow-2xs hover:border-emerald-300 border border-gray-200 transition-all"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-leaf-600" /> Escrow Balance & Transaction Slips
                </span>
                <ArrowRight size={14} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

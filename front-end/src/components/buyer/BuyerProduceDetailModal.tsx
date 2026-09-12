import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Sparkles,
  TrendingDown,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Send,
  Scale,
  User,
  Info,
  Layers,
} from 'lucide-react';
import type { Produce } from '@/types';
import MatchScoreBadge from './MatchScoreBadge';
import { mockFarmersExtended } from '@/data/buyerMockData';

interface BuyerProduceDetailModalProps {
  produce: Produce | null;
  onClose: () => void;
  onOpenOrderRequest: (produce: Produce) => void;
  onOpenChat: (farmerName: string, produce: Produce) => void;
  onOpenFarmerProfile: (farmerId: string) => void;
  onOpenPriceComparison: (cropName: string) => void;
}

export default function BuyerProduceDetailModal({
  produce,
  onClose,
  onOpenOrderRequest,
  onOpenChat,
  onOpenFarmerProfile,
  onOpenPriceComparison,
}: BuyerProduceDetailModalProps) {
  if (!produce) return null;

  // Find matching farmer profile
  const farmerKey = Object.keys(mockFarmersExtended).find((k) =>
    mockFarmersExtended[k].name.toLowerCase().includes(produce.farmerName?.toLowerCase() || '')
  ) || 'f-gurpreet';
  const farmer = mockFarmersExtended[farmerKey];

  const mandiPrice = produce.mandiPrice || Math.round(produce.expectedPrice * 1.12);
  const diffPerKg = mandiPrice - produce.expectedPrice;
  const savingsPercent = Math.round((diffPerKg / mandiPrice) * 100);
  const totalLotSavings = Math.round(diffPerKg * produce.availableQuantity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="my-8 w-full max-w-3xl rounded-3xl border border-leaf-100 bg-white shadow-2xl overflow-hidden animate-scale-in">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-paper/50">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold text-leaf-800 uppercase tracking-wider">
              {produce.category || 'Agricultural Produce'}
            </span>
            <span className="text-xs text-gray-500 font-medium">Lot ID: #{produce.id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[82vh] overflow-y-auto p-6 space-y-6">
          {/* Main Visual Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                <img
                  src={produce.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'}
                  alt={produce.cropName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white">
                    Grade {produce.quality}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-2xl font-bold text-ink leading-tight">
                    {produce.cropName}
                  </h2>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin size={14} className="text-leaf-600" /> {produce.location}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar size={14} className="text-leaf-600" /> Harvest: {produce.harvestDate}
                  </span>
                </div>

                {/* Match Score Display */}
                <div className="mt-4">
                  <MatchScoreBadge
                    score={produce.matchScore || 95}
                    size="md"
                    cropName={produce.cropName}
                    farmerName={produce.farmerName}
                  />
                </div>
              </div>

              {/* Price comparison widget */}
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Direct Farmgate Offer
                    </span>
                    <div className="text-2xl font-black text-emerald-950">
                      ₹{produce.expectedPrice} <span className="text-xs font-normal text-gray-600">/ {produce.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-gray-500 line-through">
                      APMC Mandi: ₹{mandiPrice}/{produce.unit}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 justify-end">
                      <TrendingDown size={14} /> Saves {savingsPercent}% (₹{diffPerKg}/{produce.unit})
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900 font-medium">
                  <span>Available Lot: <strong>{produce.availableQuantity} {produce.unit}</strong></span>
                  <span>Est. Total Savings: <strong>₹{totalLotSavings.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Specifications Card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
            <h3 className="font-serif text-base font-bold text-ink mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-leaf-600" /> Quality Specifications & Inspection
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-white p-3 border border-gray-200/70">
                <span className="text-gray-400 block text-[11px]">Moisture Content</span>
                <span className="font-bold text-ink text-sm">10.4%</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Compliant (&lt;12%)</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-gray-200/70">
                <span className="text-gray-400 block text-[11px]">Foreign Matter</span>
                <span className="font-bold text-ink text-sm">0.8%</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Triple Winnowed</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-gray-200/70">
                <span className="text-gray-400 block text-[11px]">Grain Quality</span>
                <span className="font-bold text-ink text-sm">Grade {produce.quality} A+</span>
                <span className="text-[10px] text-leaf-600 block mt-0.5">High Test Weight</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-gray-200/70">
                <span className="text-gray-400 block text-[11px]">Packaging</span>
                <span className="font-bold text-ink text-sm">50kg Bags</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">Gunny / PP Clean</span>
              </div>
            </div>
          </div>

          {/* Logistics Calculator */}
          <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <span className="font-bold text-sky-950 block">Moolya Verified Logistics Available</span>
                <span className="text-sky-800 text-[11px]">
                  Estimated transit: 24-36 hrs • Farmgate Weighing Scale on premise • Dedicated Freight rate: ₹1.10/kg
                </span>
              </div>
            </div>
            <span className="rounded-xl bg-sky-600/10 px-3 py-1.5 font-bold text-sky-800 shrink-0">
              Escrow Protection Active
            </span>
          </div>

          {/* Farmer Dossier Snippet */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={farmer?.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                alt={produce.farmerName || 'Farmer'}
                className="h-12 w-12 rounded-full object-cover border-2 border-leaf-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-ink text-sm">{produce.farmerName || farmer?.name}</h4>
                  <span className="rounded-md bg-leaf-50 px-2 py-0.5 text-[10px] font-extrabold text-leaf-700 border border-leaf-200">
                    Aadhaar & Soil Verified
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {produce.location} • {farmer?.experienceYears || 15}+ years farming • Rating: ⭐ {farmer?.rating || 4.9} ({farmer?.totalDealsCompleted || 40}+ deals)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenFarmerProfile(farmer?.id || 'f-gurpreet')}
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:border-leaf-400 hover:bg-leaf-50 hover:text-leaf-800 transition-colors shrink-0"
            >
              View Full Farmer Profile
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpenPriceComparison(produce.cropName)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
          >
            <Scale size={15} /> Compare Similar Farmer Offers
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChat(produce.farmerName || '', produce)}
              className="rounded-xl border border-leaf-500 bg-leaf-50 px-4 py-2.5 text-xs font-bold text-leaf-800 hover:bg-leaf-100 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare size={15} /> Chat with Farmer
            </button>
            <button
              type="button"
              onClick={() => onOpenOrderRequest(produce)}
              className="rounded-xl bg-leaf-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-leaf-700 transition-colors flex items-center gap-1.5"
            >
              <Send size={15} /> Send Order Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

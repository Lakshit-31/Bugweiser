import React from 'react';
import {
  X,
  MapPin,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Star,
  Layers,
} from 'lucide-react';
import { mockFarmersExtended, marketplaceProduceListings } from '@/data/buyerMockData';
import type { Produce } from '@/types';

interface FarmerProfileModalProps {
  farmerId: string | null;
  onClose: () => void;
  onOpenChat: (farmerName: string) => void;
  onSelectProduce: (produce: Produce) => void;
}

export default function FarmerProfileModal({
  farmerId,
  onClose,
  onOpenChat,
  onSelectProduce,
}: FarmerProfileModalProps) {
  if (!farmerId) return null;

  const farmer = mockFarmersExtended[farmerId] || mockFarmersExtended['f-gurpreet'];

  // Farmer's active produce from marketplace
  const farmerListings = marketplaceProduceListings.filter((p) =>
    p.farmerName?.toLowerCase().includes(farmer.name.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="my-8 w-full max-w-3xl rounded-3xl border border-leaf-100 bg-white shadow-2xl overflow-hidden animate-scale-in">
        {/* Header Hero */}
        <div className="relative bg-gradient-to-r from-leaf-800 via-leaf-700 to-emerald-900 p-6 sm:p-8 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white/80 hover:bg-black/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={farmer.profilePhoto}
                alt={farmer.name}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
              />
              <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md" title="Verified Farmer">
                <CheckCircle2 size={16} />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-white">{farmer.name}</h2>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                  Tier-1 Verified Farmer
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-100">
                <MapPin size={14} className="text-emerald-300" /> {farmer.farmLocation}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-emerald-100/90 font-medium">
                <span>🌾 Farm Size: <strong>{farmer.farmSize}</strong></span>
                <span>📅 Experience: <strong>{farmer.experienceYears} Years</strong></span>
                <span>⭐ Rating: <strong>{farmer.rating} / 5.0</strong> ({farmer.totalDealsCompleted} completed trades)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Trust Badges */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Government & Trust Credentials
            </span>
            <div className="flex flex-wrap gap-2">
              {farmer.verificationBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800"
                >
                  <ShieldCheck size={14} className="text-emerald-600" /> {badge}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-bold text-sky-800">
                <CheckCircle2 size={14} className="text-sky-600" /> Bank e-KYC Verified
              </span>
            </div>
          </div>

          {/* Performance Radar Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-3.5">
              <span className="text-[11px] text-gray-500 font-medium block">Reliability Score</span>
              <span className="font-serif text-2xl font-black text-emerald-800">{farmer.reliabilityScore}%</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Top 5% on Moolya</span>
            </div>
            <div className="rounded-2xl bg-sky-50/60 border border-sky-100 p-3.5">
              <span className="text-[11px] text-gray-500 font-medium block">On-Time Dispatch</span>
              <span className="font-serif text-2xl font-black text-sky-800">{farmer.onTimeDeliveryRate}%</span>
              <span className="text-[10px] text-sky-700 font-bold block mt-0.5">Prompt Transport</span>
            </div>
            <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-3.5">
              <span className="text-[11px] text-gray-500 font-medium block">Quality Grading</span>
              <span className="font-serif text-2xl font-black text-amber-800">{farmer.qualityScore}%</span>
              <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Moisture & Purity</span>
            </div>
            <div className="rounded-2xl bg-purple-50/60 border border-purple-100 p-3.5">
              <span className="text-[11px] text-gray-500 font-medium block">Total Deals</span>
              <span className="font-serif text-2xl font-black text-purple-800">{farmer.totalDealsCompleted}</span>
              <span className="text-[10px] text-purple-700 font-bold block mt-0.5">Repeat Buyers: 86%</span>
            </div>
          </div>

          {/* Bio */}
          <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
              About Farm & Cultivation Practices
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">{farmer.bio}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500">Crops Grown:</span>
              {farmer.cropsGrown.map((crop, i) => (
                <span key={i} className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-ink border border-gray-200">
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Active Listings by Farmer */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-3">
              Active Produce Listings ({farmerListings.length})
            </span>
            {farmerListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {farmerListings.map((lot) => (
                  <div
                    key={lot.id}
                    onClick={() => {
                      onClose();
                      onSelectProduce(lot);
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 p-3 hover:border-leaf-500 hover:shadow-sm transition-all cursor-pointer bg-white group"
                  >
                    <img
                      src={lot.image}
                      alt={lot.cropName}
                      className="h-14 w-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-ink truncate group-hover:text-leaf-700">
                        {lot.cropName}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Available: {lot.availableQuantity} {lot.unit}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-extrabold text-emerald-800">
                          ₹{lot.expectedPrice}/{lot.unit}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {lot.matchScore}% Match
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No additional active public lots right now.</p>
            )}
          </div>

          {/* Recent Reviews for Farmer */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-3">
              Verified Buyer Reviews & Endorsements
            </span>
            <div className="space-y-2.5">
              {(farmer.recentReviews || []).map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-gray-100 bg-paper/40 p-3.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-ink">{rev.buyerName}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={13} fill="currentColor" /> {rev.rating}.0
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Direct Trade • 0% Middleman Margin • 100% Escrow Protected
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenChat(farmer.name);
            }}
            className="rounded-xl bg-leaf-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-leaf-700 transition-colors flex items-center gap-1.5"
          >
            <MessageSquare size={15} /> Direct Chat with {farmer.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  );
}

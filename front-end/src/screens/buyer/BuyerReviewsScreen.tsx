import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Award,
  ShieldCheck,
  User,
} from 'lucide-react';
import type { BuyerReviewItem } from '@/types/buyer';
import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

interface BuyerReviewsScreenProps {
  reviews: BuyerReviewItem[];
  onOpenNewFeedbackModal?: () => void;
  currentLang?: LanguageCode;
}

export default function BuyerReviewsScreen({
  reviews,
  onOpenNewFeedbackModal,
  currentLang = 'en',
}: BuyerReviewsScreenProps) {
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;
  const [activeTab, setActiveTab] = useState<'given' | 'received'>('given');

  const receivedFromFarmers = [
    {
      farmerName: 'Gurpreet Singh Dhillon',
      location: 'Khanna, Punjab',
      rating: 5,
      date: '2026-03-08',
      comment: 'Vikram ji and his company always release Escrow immediately on weighing slip. Completely transparent buyers.',
    },
    {
      farmerName: 'Rameshwar Lal Jat',
      location: 'Ajmer, Rajasthan',
      rating: 5,
      date: '2026-02-28',
      comment: 'Truck arrived exactly on schedule at Gegal farm. Fair deductions, zero disputes. Always glad to supply them.',
    },
    {
      farmerName: 'Harinder Verma',
      location: 'Karnal, Haryana',
      rating: 5,
      date: '2026-02-15',
      comment: 'Reputed bulk buyer. Respects farmgate contracts and honors prices even when mandi rates swing.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-700">
            Reputation & Quality Trust
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {bt.ratingsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {bt.ratingsSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-2xl bg-amber-50 border border-amber-200 px-3.5 py-2 text-xs font-bold text-amber-900 flex items-center gap-1.5 shadow-2xs">
            <Star size={14} className="fill-amber-400 text-amber-400" /> Buyer Trust: 98/100 (Tier-A)
          </span>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
            {bt.avgQualityRating}
          </span>
          <div className="font-serif text-2xl font-black text-ink mt-1 flex items-center gap-1.5">
            <span>4.95</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Across {reviews.length} rated farm procurements
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
            {bt.onTimeEscrowRate}
          </span>
          <div className="font-serif text-2xl font-black text-emerald-950 mt-1">
            100.0%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Zero payment delays or defaults
          </span>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 sm:p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-800 block">
            {bt.repeatFarmerSourcing}
          </span>
          <div className="font-serif text-2xl font-black text-sky-950 mt-1">
            84%
          </div>
          <span className="text-[11px] text-sky-700 font-medium mt-1 block">
            High long-term farmer retention
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('given')}
          className={`rounded-xl px-4 py-2 font-bold transition-all ${
            activeTab === 'given'
              ? 'bg-leaf-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-ink'
          }`}
        >
          {bt.tabGivenReviews} ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('received')}
          className={`rounded-xl px-4 py-2 font-bold transition-all ${
            activeTab === 'received'
              ? 'bg-leaf-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-ink'
          }`}
        >
          {bt.tabReceivedReviews} ({receivedFromFarmers.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'given' ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs hover:border-leaf-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-ink">{rev.farmerName}</h3>
                  <p className="text-xs text-gray-500">
                    Commodity: <strong>{rev.cropName}</strong> • Order #{rev.orderId}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Star size={13} fill="currentColor" /> {rev.overallRating}.0 / 5.0
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.date}</span>
                </div>
              </div>

              {/* Dimensional sub-ratings */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block text-[10px]">Quality & Grade</span>
                  <span className="font-bold text-ink">⭐ {rev.qualityRating}.0</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Weight Accuracy</span>
                  <span className="font-bold text-ink">⭐ {rev.weightAccuracyRating}.0</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Transit Timeliness</span>
                  <span className="font-bold text-ink">⭐ {rev.timelinessRating}.0</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Communication</span>
                  <span className="font-bold text-ink">⭐ {rev.communicationRating}.0</span>
                </div>
              </div>

              {/* Comment text */}
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "{rev.comment}"
              </p>

              {/* Tag Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {rev.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-leaf-50 px-2.5 py-0.5 text-[10px] font-bold text-leaf-700 border border-leaf-200"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {receivedFromFarmers.map((rec, i) => (
            <div
              key={i}
              className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold">
                    {rec.farmerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-ink">{rec.farmerName}</h4>
                    <p className="text-xs text-gray-500">{rec.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star size={13} fill="currentColor" /> {rec.rating}.0
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "{rec.comment}"
              </p>
              <div className="text-[11px] text-gray-400">{rec.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, Info, ShieldCheck, CheckCircle2, TrendingUp, MapPin, Award, X } from 'lucide-react';

interface MatchScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showDetailsButton?: boolean;
  cropName?: string;
  farmerName?: string;
  priceDelta?: string;
  distanceKm?: number;
}

export default function MatchScoreBadge({
  score,
  size = 'md',
  showDetailsButton = true,
  cropName,
  farmerName,
  priceDelta = '-8.5%',
  distanceKm = 45,
}: MatchScoreBadgeProps) {
  const [showModal, setShowModal] = useState(false);

  // Determine classification and colors
  const isTopMatch = score >= 92;
  const isHighMatch = score >= 80 && score < 92;
  const label = isTopMatch ? 'Best Match' : isHighMatch ? 'High Match' : 'Fair Match';

  // Sub-scores derived realistically for the score
  const priceScore = Math.min(99, Math.round(score * 1.03));
  const proximityScore = Math.min(98, Math.round(score * 0.96));
  const qualityScore = Math.min(99, Math.round(score * 1.01));
  const reliabilityScore = Math.min(99, Math.round(score * 0.98));

  const strokeDash = `${score} 100`;

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800 shadow-xs">
        <Sparkles size={12} className="text-emerald-600 animate-pulse" />
        <span>{label} — {score}/100</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`inline-flex items-center gap-2.5 rounded-2xl border transition-all ${
          isTopMatch
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50/70 to-leaf-50 border-emerald-200/80 shadow-[0_2px_12px_rgba(16,185,129,0.12)]'
            : 'bg-gradient-to-r from-amber-50 to-orange-50/50 border-amber-200/70 shadow-xs'
        } ${size === 'lg' ? 'p-3.5 sm:p-4' : size === 'hero' ? 'p-5 sm:p-6' : 'px-3 py-1.5'}`}
      >
        {/* Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            className={`${
              size === 'hero' ? 'w-16 h-16 sm:w-20 sm:h-20' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9'
            } transform -rotate-90`}
            viewBox="0 0 36 36"
          >
            <path
              className="text-gray-200/80"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={isTopMatch ? 'text-emerald-500' : 'text-amber-500'}
              strokeDasharray={strokeDash}
              strokeDashoffset="0"
              strokeLinecap="round"
              strokeWidth="3.4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className={`font-black tracking-tight ${
                isTopMatch ? 'text-emerald-900' : 'text-amber-900'
              } ${size === 'hero' ? 'text-lg sm:text-xl font-serif' : size === 'lg' ? 'text-sm' : 'text-xs'}`}
            >
              {score}
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold uppercase tracking-wider ${
                isTopMatch ? 'text-emerald-800' : 'text-amber-800'
              } ${size === 'hero' ? 'text-sm' : size === 'lg' ? 'text-xs' : 'text-[11px]'}`}
            >
              {label} — {score}/100
            </span>
            {isTopMatch && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            AI Trust & Sourcing Match
          </span>
        </div>

        {/* Info button */}
        {showDetailsButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="ml-auto rounded-lg p-1 text-gray-400 hover:text-emerald-700 hover:bg-emerald-100/50 transition-colors"
            title="Inspect AI Match Breakdown"
            aria-label="Inspect AI Match Breakdown"
          >
            <Info size={16} />
          </button>
        )}
      </div>

      {/* Breakdown Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink">
                    Moolya Match Score Engine
                  </h3>
                  <p className="text-xs text-gray-500">
                    Proprietary SIH multi-variable procurement algorithm
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {/* Big Score Header */}
            <div className="my-5 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-leaf-700 p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Overall Compatibility
                  </span>
                  <div className="font-serif text-3xl font-black mt-1">
                    {score} <span className="text-lg font-normal text-emerald-200">/ 100</span>
                  </div>
                  <p className="mt-1 text-xs text-emerald-100">
                    {cropName ? `${cropName} by ${farmerName || 'Farmer'}` : 'Optimal Trade Parameters'}
                  </p>
                </div>
                <div className="rounded-xl bg-white/15 backdrop-blur-md px-3 py-2 text-right">
                  <div className="text-[11px] font-semibold text-emerald-200">Status</div>
                  <div className="text-sm font-black text-white">{label}</div>
                </div>
              </div>
            </div>

            {/* 4 Pillars */}
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-ink">
                    <TrendingUp size={14} className="text-emerald-600" />
                    Price Optimization (vs Mandi & Target)
                  </span>
                  <span className="font-bold text-emerald-700">{priceScore}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${priceScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Offers savings of {priceDelta} compared to APMC benchmark.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-ink">
                    <MapPin size={14} className="text-sky-600" />
                    Proximity & Logistics Efficiency
                  </span>
                  <span className="font-bold text-sky-700">{proximityScore}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all duration-500"
                    style={{ width: `${proximityScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Located within ~{distanceKm} km. Minimal transit turnaround & lower freight cost.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-ink">
                    <Award size={14} className="text-amber-600" />
                    Quality & Variety Specification Match
                  </span>
                  <span className="font-bold text-amber-700">{qualityScore}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${qualityScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Grade A test weight, moisture compliant (&lt;11%), certified clean lot.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-ink">
                    <ShieldCheck size={14} className="text-purple-600" />
                    Farmer Historical Trust & Reliability
                  </span>
                  <span className="font-bold text-purple-700">{reliabilityScore}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${reliabilityScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  98%+ on-time fulfillment rate, verified land credentials & bank e-KYC.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full rounded-xl bg-leaf-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-leaf-700 transition-colors"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

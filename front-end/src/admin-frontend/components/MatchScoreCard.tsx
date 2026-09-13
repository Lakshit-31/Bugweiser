import { MapPin, IndianRupee, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import type { RecommendedFarmerMatch } from '../types';
import MatchScoreRing from '@/components/MatchScoreRing';

interface MatchScoreCardProps {
  match: RecommendedFarmerMatch;
  rank: number;
  onSelectFarmer?: (farmerId: string) => void;
}

export default function MatchScoreCard({ match, rank, onSelectFarmer }: MatchScoreCardProps) {
  const { farmerName, location, breakdown } = match;

  const scoreFactors = [
    { label: 'Crop Match', score: breakdown.cropMatchScore },
    { label: 'Quantity Match', score: breakdown.quantityMatchScore },
    { label: 'Distance Radius', score: breakdown.distanceScore },
    { label: 'Offered Price', score: breakdown.priceScore },
    { label: 'Previous Txns', score: breakdown.prevTransactionsScore },
    { label: 'Response Rate', score: breakdown.responseRateScore },
    { label: 'Buyer Reliability', score: breakdown.reliabilityScore },
  ];

  return (
    <div className="relative rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_12px_rgba(30,43,31,0.06)] transition-all hover:border-leaf-200">
      {/* Rank Pill */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              rank === 1
                ? 'bg-leaf-500 text-paper'
                : rank === 2
                ? 'bg-marigold-500 text-paper'
                : 'bg-dusk-500 text-paper'
            }`}
          >
            #{rank}
          </span>
          <div>
            <h4 className="font-serif text-lg font-bold text-ink">{farmerName}</h4>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} className="text-leaf-500" /> {location}
            </p>
          </div>
        </div>

        {/* Match Score Ring */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-gray-400 font-medium">Match Confidence</span>
            <p className="text-xs font-bold text-leaf-600">Smart Algorithm</p>
          </div>
          <MatchScoreRing score={breakdown.totalMatchScore} size={64} />
        </div>
      </div>

      {/* 7 Breakdown Progress Bars */}
      <div className="mb-5 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-gray-50/70 p-3 sm:grid-cols-4">
        {scoreFactors.map((factor) => (
          <div key={factor.label} className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium text-gray-600">
              <span>{factor.label}</span>
              <span className="font-bold text-ink">{factor.score}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  factor.score >= 90
                    ? 'bg-leaf-500'
                    : factor.score >= 80
                    ? 'bg-marigold-500'
                    : 'bg-dusk-500'
                }`}
                style={{ width: `${factor.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Net Earnings Calculation Callout Box */}
      <div className="rounded-xl border border-leaf-100 bg-leaf-50/70 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-leaf-700">
            <Truck size={14} className="text-leaf-600" /> Expected Net Earnings Calculation
          </span>
          <span className="rounded-md bg-leaf-200/60 px-2 py-0.5 text-[10px] font-bold text-leaf-800">
            Transparency Engine
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          <div className="rounded-lg bg-white p-2.5 border border-leaf-100/60">
            <span className="text-gray-500">Offered Price</span>
            <p className="font-bold text-ink">₹{breakdown.offeredPrice}/kg</p>
          </div>

          <div className="rounded-lg bg-white p-2.5 border border-leaf-100/60">
            <span className="text-gray-500">Transport ({breakdown.distanceKm} km)</span>
            <p className="font-bold text-rust-600">-₹{breakdown.transportCostPerKg}/kg</p>
          </div>

          <div className="rounded-lg bg-leaf-500 p-2.5 text-paper">
            <span className="text-leaf-100">Est. Net Price</span>
            <p className="font-bold text-sm">₹{breakdown.offeredPrice - breakdown.transportCostPerKg}/kg</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-leaf-200/60 pt-2 text-xs">
          <span className="text-leaf-700 font-medium">Total Net Payout for 500 KG:</span>
          <span className="font-serif text-base font-bold text-leaf-800">
            ₹{breakdown.estimatedNetEarnings.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {onSelectFarmer && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onSelectFarmer(match.farmerId)}
            className="btn-primary text-xs py-2 px-4"
          >
            Connect Farmer & Buyer <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

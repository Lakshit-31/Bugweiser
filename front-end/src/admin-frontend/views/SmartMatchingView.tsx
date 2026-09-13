import { useState } from 'react';
import { Sparkles, ShoppingBag, MapPin, IndianRupee, Sprout, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';
import { adminService } from '../data/adminService';
import MatchScoreCard from '../components/MatchScoreCard';
import { useToast } from '../components/Toast';

export default function SmartMatchingView() {
  const { addToast } = useToast();
  const smartMatches = adminService.getSmartMatches();
  const currentRequirement = smartMatches[0];

  // Interactive Weight Adjuster Controls
  const [distanceWeight, setDistanceWeight] = useState(25);
  const [priceWeight, setPriceWeight] = useState(30);
  const [reliabilityWeight, setReliabilityWeight] = useState(25);
  const [historyWeight, setHistoryWeight] = useState(20);

  const handleConnect = (farmerId: string) => {
    addToast(
      'Direct Buyer-Farmer Link Created',
      `Match connection contract generated for Farmer ID: ${farmerId}.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Innovation Header Banner */}
      <div className="rounded-2xl border border-leaf-200 bg-gradient-to-br from-leaf-50 via-white to-leaf-100/50 p-6 shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-leaf-500 text-paper">
                <Sparkles size={16} />
              </span>
              <h2 className="font-serif text-2xl font-bold text-ink">
                Buyer Trust & Smart Match Engine
              </h2>
              <span className="rounded-full bg-marigold-100 px-2.5 py-0.5 text-xs font-bold text-marigold-800">
                Key Innovation
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-600 sm:text-sm max-w-3xl leading-relaxed">
              Eliminates middlemen dependence by scoring farmer suitability based on 7 factors (Crop Match, Quantity, Radius Distance, Offered Price, Transaction History, Response Rate, and Reliability Rating) alongside real-time transportation net earnings calculations.
            </p>
          </div>
        </div>
      </div>

      {/* Active Buyer Requirement Showcase Box */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_12px_rgba(30,43,31,0.06)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-dusk-500 text-paper font-bold">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="text-xs font-semibold text-dusk-600 uppercase tracking-wider">Active Buyer Requirement</span>
              <h3 className="font-serif text-xl font-bold text-ink">{currentRequirement.businessName}</h3>
            </div>
          </div>
          <span className="rounded-full bg-dusk-50 px-3 py-1 text-xs font-bold text-dusk-700 border border-dusk-100">
            Buyer ID: {currentRequirement.buyerId}
          </span>
        </div>

        {/* 4 Requirement Details Badges */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
            <span className="text-xs text-gray-400 font-medium">Requested Crop</span>
            <p className="font-bold text-ink text-sm mt-0.5 flex items-center gap-1.5">
              <Sprout size={15} className="text-leaf-600" />
              {currentRequirement.cropName}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
            <span className="text-xs text-gray-400 font-medium">Quantity Needed</span>
            <p className="font-bold text-ink text-sm mt-0.5">
              {currentRequirement.requiredQuantityKg.toLocaleString()} KG
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
            <span className="text-xs text-gray-400 font-medium">Preferred Location</span>
            <p className="font-bold text-ink text-sm mt-0.5 flex items-center gap-1">
              <MapPin size={14} className="text-leaf-500" />
              {currentRequirement.preferredLocation}
            </p>
          </div>

          <div className="rounded-xl bg-leaf-50 p-3 border border-leaf-100">
            <span className="text-xs text-leaf-700 font-medium">Buyer Budget Price</span>
            <p className="font-bold text-leaf-800 text-sm mt-0.5 flex items-center gap-0.5">
              <IndianRupee size={14} />
              {currentRequirement.budgetPricePerKg}/kg
            </p>
          </div>
        </div>
      </div>

      {/* Algorithm Tuning Control Panel */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-leaf-600" />
            <h3 className="font-serif text-base font-bold text-ink">Smart Match Scoring Weight Parameters</h3>
          </div>
          <span className="text-xs text-gray-400 font-medium">Admin Real-time Control</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Distance Weight</span>
              <span>{distanceWeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={distanceWeight}
              onChange={(e) => setDistanceWeight(Number(e.target.value))}
              className="w-full accent-leaf-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Price Match Weight</span>
              <span>{priceWeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={priceWeight}
              onChange={(e) => setPriceWeight(Number(e.target.value))}
              className="w-full accent-leaf-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Buyer Reliability Weight</span>
              <span>{reliabilityWeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={reliabilityWeight}
              onChange={(e) => setReliabilityWeight(Number(e.target.value))}
              className="w-full accent-leaf-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Txn History Weight</span>
              <span>{historyWeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={historyWeight}
              onChange={(e) => setHistoryWeight(Number(e.target.value))}
              className="w-full accent-leaf-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Recommended Farmers List */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-ink">
            Recommended Farmers ({currentRequirement.recommendedFarmers.length} Matched)
          </h3>
          <span className="text-xs text-gray-500 font-medium">Sorted by AI Match Score</span>
        </div>

        <div className="space-y-4">
          {currentRequirement.recommendedFarmers.map((match, idx) => (
            <MatchScoreCard
              key={match.farmerId}
              match={match}
              rank={idx + 1}
              onSelectFarmer={handleConnect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

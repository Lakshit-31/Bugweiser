import React, { useState } from 'react';
import {
  PlusCircle,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  X,
  Send,
  Scale,
  ShoppingBag,
} from 'lucide-react';
import type { BuyerRequirement, BuyerScreenName } from '@/types/buyer';
import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

interface BuyerRequirementsScreenProps {
  requirements: BuyerRequirement[];
  onAddRequirement: (newReq: BuyerRequirement) => void;
  onNavigate: (screen: BuyerScreenName) => void;
  onFilterMarketplaceForCrop: (cropName: string) => void;
  isPostModalOpen: boolean;
  onSetPostModalOpen: (open: boolean) => void;
  currentLang?: LanguageCode;
}

const CROP_SUGGESTIONS = [
  'Sharbati Wheat (शरबाती गेहूं)',
  'Yellow Mustard Seeds (सरसों)',
  'Red Hybrid Tomatoes (टमाटर)',
  '1121 Basmati Rice (बासमती चावल)',
  'Red Nashik Onions (लाल प्याज)',
  'Unpolished Chana / Bengal Gram (चना)',
  'Long Staple Desi Cotton (कपास)',
  'Premium Cumin / Jeera (जीरा)',
];

export default function BuyerRequirementsScreen({
  requirements,
  onAddRequirement,
  onNavigate,
  onFilterMarketplaceForCrop,
  isPostModalOpen,
  onSetPostModalOpen,
  currentLang = 'en',
}: BuyerRequirementsScreenProps) {
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;
  const [activeFilter, setActiveFilter] = useState<'all' | 'matching' | 'open' | 'fulfilled'>('all');

  // Form State for New Requirement Modal
  const [cropName, setCropName] = useState(CROP_SUGGESTIONS[0]);
  const [category, setCategory] = useState<'Grains' | 'Vegetables' | 'Oilseeds' | 'Commercial' | 'Pulses' | 'Spices'>('Grains');
  const [quantity, setQuantity] = useState<number>(2000);
  const [unit, setUnit] = useState('kg');
  const [preferredPrice, setPreferredPrice] = useState<number>(25.0);
  const [qualityGrade, setQualityGrade] = useState<'Grade A' | 'Grade B' | 'Grade C' | 'Organic'>('Grade A');
  const [preferredLocation, setPreferredLocation] = useState('Punjab / North Rajasthan Belt');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(150);
  const [deliveryDate, setDeliveryDate] = useState('2026-04-05');
  const [paymentTerms, setPaymentTerms] = useState('Agri-Escrow (100% on inspection)');
  const [notes, setNotes] = useState('Moisture strictly under 11%, zero weevil infestation.');

  const filteredRequirements = requirements.filter((req) => {
    if (activeFilter === 'matching') return req.status === 'Matching';
    if (activeFilter === 'open') return req.status === 'Open';
    if (activeFilter === 'fulfilled') return req.status === 'Fulfilled';
    return true;
  });

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: BuyerRequirement = {
      id: `REQ-2026-${Math.floor(200 + Math.random() * 800)}`,
      cropName,
      category,
      quantity,
      unit,
      preferredPrice,
      qualityGrade,
      preferredLocation,
      maxDistanceKm,
      deliveryDate,
      paymentTerms,
      status: 'Matching',
      createdAt: new Date().toISOString().split('T')[0],
      matchedListingsCount: Math.floor(2 + Math.random() * 4),
      notes,
    };
    onAddRequirement(newReq);
    onSetPostModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-700">
            Procurement Demand Manager
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Buyer Requirements & Match Bids
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Publish procurement contracts directly to verified farmers and farmer producer organizations (FPOs).
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSetPostModalOpen(true)}
          className="rounded-2xl bg-leaf-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-leaf-700 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <PlusCircle size={16} /> {bt.postRequirementBtn}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs">
        {[
          { key: 'all', label: `All Demands (${requirements.length})` },
          { key: 'matching', label: `Active Matching (${requirements.filter((r) => r.status === 'Matching').length})` },
          { key: 'open', label: `Open for Bids (${requirements.filter((r) => r.status === 'Open').length})` },
          { key: 'fulfilled', label: `Fulfilled (${requirements.filter((r) => r.status === 'Fulfilled').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key as any)}
            className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
              activeFilter === tab.key
                ? 'bg-leaf-600 text-white shadow-2xs'
                : 'text-gray-500 hover:bg-gray-100 hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requirements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequirements.map((req) => {
          return (
            <div
              key={req.id}
              className="rounded-3xl border border-gray-200/90 bg-white p-5 shadow-xs hover:border-leaf-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Pill Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-leaf-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-leaf-700 border border-leaf-200">
                      {req.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">#{req.id}</span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      req.status === 'Matching'
                        ? 'bg-amber-100 text-amber-800'
                        : req.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-ink">{req.cropName}</h3>

                {/* Specs Grid */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-gray-50 p-2.5 border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">Required Quantity</span>
                    <span className="font-black text-ink">{req.quantity} {req.unit}</span>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-2.5 border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">Target Price</span>
                    <span className="font-black text-emerald-800">₹{req.preferredPrice} / {req.unit}</span>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-2.5 border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">Quality Grade</span>
                    <span className="font-black text-ink">{req.qualityGrade}</span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="mt-3 space-y-1 text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-leaf-600 shrink-0" />
                    <span>Location: <strong>{req.preferredLocation}</strong> (Within {req.maxDistanceKm} km)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-leaf-600 shrink-0" />
                    <span>Delivery Deadline: <strong>{req.deliveryDate}</strong></span>
                  </div>
                  {req.notes && (
                    <p className="mt-2 text-gray-600 italic bg-paper/60 p-2 rounded-xl border border-gray-100">
                      "{req.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Sparkles size={14} /> {req.matchedListingsCount} Farmer Lots Matching
                </span>
                <button
                  type="button"
                  onClick={() => onFilterMarketplaceForCrop(req.cropName)}
                  className="rounded-xl bg-leaf-50 px-3.5 py-1.5 text-xs font-bold text-leaf-800 hover:bg-leaf-100 transition-colors flex items-center gap-1"
                >
                  Find Farmer Matches <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post New Requirement Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-3xl border border-leaf-100 bg-white shadow-2xl overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-paper/60">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-700">
                  Direct Farmer Procurement
                </span>
                <h3 className="font-serif text-lg font-bold text-ink">
                  Post New Commodity Requirement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSetPostModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-ink transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Select Crop or Commodity
                </label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-bold text-ink focus:border-leaf-500 focus:outline-none"
                >
                  {CROP_SUGGESTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-ink focus:border-leaf-500 focus:outline-none"
                  >
                    {['Grains', 'Vegetables', 'Oilseeds', 'Commercial', 'Pulses', 'Spices'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Quantity Needed
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="10"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-bold text-ink focus:border-leaf-500 focus:outline-none"
                      required
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="rounded-xl border border-gray-200 p-2.5 text-xs text-ink focus:border-leaf-500 focus:outline-none"
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">quintal</option>
                      <option value="ton">ton</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Target Price (₹/{unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={preferredPrice}
                    onChange={(e) => setPreferredPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-bold text-ink focus:border-leaf-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Preferred Quality Grade
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-ink focus:border-leaf-500 focus:outline-none"
                  >
                    <option value="Grade A">Grade A (Premium High Test Weight)</option>
                    <option value="Grade B">Grade B (Standard Commercial)</option>
                    <option value="Grade C">Grade C (Processing Grade)</option>
                    <option value="Organic">Certified Organic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Sourcing Radius (Max {maxDistanceKm} km)
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="350"
                    step="25"
                    value={maxDistanceKm}
                    onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                    className="w-full accent-leaf-600"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>25km</span>
                    <span>150km</span>
                    <span>350km</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Preferred Sourcing Region / States
                  </label>
                  <input
                    type="text"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    placeholder="e.g. Punjab, Haryana, Rajasthan"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-ink focus:border-leaf-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-ink focus:border-leaf-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-ink focus:border-leaf-500 focus:outline-none"
                >
                  <option value="Agri-Escrow (100% on inspection)">Agri-Escrow (100% on inspection at warehouse)</option>
                  <option value="Agri-Escrow (20% advance, 80% on dispatch)">Agri-Escrow (20% advance, 80% on dispatch)</option>
                  <option value="Immediate Bank Transfer upon weighbridge slip">Immediate Bank Transfer upon weighbridge slip</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Specific Quality / Packaging Instructions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Moisture limit, packaging type, foreign matter allowance..."
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-ink focus:border-leaf-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onSetPostModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-leaf-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-leaf-700 transition-colors flex items-center gap-1.5"
                >
                  <Send size={15} /> Publish Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

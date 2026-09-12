import React from 'react';
import { Filter, X, RotateCcw, Search, Sparkles, MapPin, Tag, Check, Sliders } from 'lucide-react';

export interface ProduceFiltersState {
  searchQuery: string;
  category: string;
  maxPrice: number;
  minQuantity: number;
  qualityGrades: string[];
  maxDistance: number;
  minMatchScore: number;
  sortBy: 'match' | 'price_low' | 'price_high' | 'distance' | 'freshness';
}

export const initialProduceFilters: ProduceFiltersState = {
  searchQuery: '',
  category: 'All',
  maxPrice: 400,
  minQuantity: 0,
  qualityGrades: ['Grade A', 'Grade B', 'Grade C', 'Organic'],
  maxDistance: 350,
  minMatchScore: 80,
  sortBy: 'match',
};

interface ProduceFilterDrawerProps {
  filters: ProduceFiltersState;
  onChangeFilters: (newFilters: ProduceFiltersState) => void;
  isOpen: boolean;
  onClose: () => void;
  totalMatchesCount: number;
}

const CATEGORIES = ['All', 'Grains', 'Vegetables', 'Oilseeds', 'Commercial', 'Pulses', 'Spices'];
const QUALITY_OPTIONS = ['Grade A', 'Grade B', 'Grade C', 'Organic'];
const DISTANCE_PRESETS = [50, 100, 200, 350];

export default function ProduceFilterDrawer({
  filters,
  onChangeFilters,
  isOpen,
  onClose,
  totalMatchesCount,
}: ProduceFilterDrawerProps) {
  const toggleQuality = (grade: string) => {
    const exists = filters.qualityGrades.includes(grade);
    let updated: string[];
    if (exists) {
      updated = filters.qualityGrades.filter((g) => g !== grade);
    } else {
      updated = [...filters.qualityGrades, grade];
    }
    onChangeFilters({ ...filters, qualityGrades: updated });
  };

  const handleReset = () => {
    onChangeFilters(initialProduceFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-up">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
                <Sliders size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">Search & Filter</h3>
                <p className="text-xs text-gray-500">Fine-tune verified farm listings</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-ink transition-colors"
                title="Reset all filters"
              >
                <RotateCcw size={13} /> Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-6">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Keyword / Farmer / Region
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Wheat, Ludhiana, Gurpreet, Organic..."
                  value={filters.searchQuery}
                  onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-ink focus:border-leaf-500 focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Crop Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = filters.category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onChangeFilters({ ...filters, category: cat })}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-leaf-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-ink'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Sort Results By
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'match', label: 'Best Match Score' },
                  { key: 'price_low', label: 'Price: Low to High' },
                  { key: 'price_high', label: 'Price: High to Low' },
                  { key: 'distance', label: 'Nearest Distance' },
                  { key: 'freshness', label: 'Latest Harvest' },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => onChangeFilters({ ...filters, sortBy: s.key as ProduceFiltersState['sortBy'] })}
                    className={`rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all border ${
                      filters.sortBy === s.key
                        ? 'border-leaf-500 bg-leaf-50 text-leaf-800'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                <span className="uppercase tracking-wider">Max Expected Price</span>
                <span className="text-leaf-700 font-extrabold text-sm">₹{filters.maxPrice} / kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                step="5"
                value={filters.maxPrice}
                onChange={(e) => onChangeFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-leaf-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>₹10</span>
                <span>₹200</span>
                <span>₹400</span>
              </div>
            </div>

            {/* Quality Grade Checkboxes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Quality Grade
              </label>
              <div className="grid grid-cols-2 gap-2">
                {QUALITY_OPTIONS.map((grade) => {
                  const checked = filters.qualityGrades.includes(grade);
                  return (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => toggleQuality(grade)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                        checked
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-md border ${
                          checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'
                        }`}
                      >
                        {checked && <Check size={12} />}
                      </div>
                      <span>{grade}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distance Filter */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1 uppercase tracking-wider">
                  <MapPin size={13} className="text-sky-600" /> Sourcing Radius
                </span>
                <span className="text-sky-700 font-extrabold text-sm">
                  {filters.maxDistance >= 350 ? 'All India (350+ km)' : `Within ${filters.maxDistance} km`}
                </span>
              </div>
              <input
                type="range"
                min="25"
                max="350"
                step="25"
                value={filters.maxDistance}
                onChange={(e) => onChangeFilters({ ...filters, maxDistance: Number(e.target.value) })}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                {DISTANCE_PRESETS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onChangeFilters({ ...filters, maxDistance: d })}
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold border transition-colors ${
                      filters.maxDistance === d
                        ? 'border-sky-500 bg-sky-50 text-sky-800'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {d >= 350 ? 'Pan-India' : `${d}km`}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Match Score */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles size={13} className="text-emerald-600" /> Minimum Match Score
                </span>
                <span className="text-emerald-700 font-extrabold text-sm">{filters.minMatchScore}%+</span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                step="5"
                value={filters.minMatchScore}
                onChange={(e) => onChangeFilters({ ...filters, minMatchScore: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-leaf-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-leaf-700 transition-colors flex items-center justify-center gap-1.5"
          >
            Show {totalMatchesCount} Matching Lots
          </button>
        </div>
      </div>
    </div>
  );
}

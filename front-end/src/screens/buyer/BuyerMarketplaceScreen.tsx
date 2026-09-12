import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Sliders,
  MapPin,
  Calendar,
  Sparkles,
  TrendingDown,
  LayoutGrid,
  List,
  Scale,
  MessageSquare,
  Send,
  User,
  CheckCircle2,
} from 'lucide-react';
import type { Produce } from '@/types';
import MatchScoreBadge from '@/components/buyer/MatchScoreBadge';
import ProduceFilterDrawer, {
  ProduceFiltersState,
  initialProduceFilters,
} from '@/components/buyer/ProduceFilterDrawer';

import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

interface BuyerMarketplaceScreenProps {
  produceLots: Produce[];
  onSelectProduce: (produce: Produce) => void;
  onOpenFarmerProfile: (farmerName: string) => void;
  onOpenPriceComparison: (cropName: string) => void;
  onOpenChat: (farmerName: string, produce?: Produce) => void;
  onOpenOrderRequest: (produce: Produce) => void;
  initialSearchQuery?: string;
  currentLang?: LanguageCode;
}

export default function BuyerMarketplaceScreen({
  produceLots,
  onSelectProduce,
  onOpenFarmerProfile,
  onOpenPriceComparison,
  onOpenChat,
  onOpenOrderRequest,
  initialSearchQuery = '',
  currentLang = 'en',
}: BuyerMarketplaceScreenProps) {
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;
  const [filters, setFilters] = useState<ProduceFiltersState>({
    ...initialProduceFilters,
    searchQuery: initialSearchQuery,
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { key: 'All', label: bt.catAll },
    { key: 'Grains', label: bt.catGrains },
    { key: 'Vegetables', label: bt.catVegetables },
    { key: 'Oilseeds', label: bt.catOilseeds },
    { key: 'Commercial', label: bt.catCommercial },
    { key: 'Pulses', label: bt.catPulses },
    { key: 'Spices', label: bt.catSpices },
  ];

  // Filter & Sort Logic
  const filteredProduce = useMemo(() => {
    return produceLots
      .filter((item) => {
        // Category
        if (filters.category !== 'All' && item.category !== filters.category) {
          return false;
        }
        // Search
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchCrop = item.cropName.toLowerCase().includes(q);
          const matchFarmer = item.farmerName?.toLowerCase().includes(q) || false;
          const matchLoc = item.location.toLowerCase().includes(q);
          if (!matchCrop && !matchFarmer && !matchLoc) return false;
        }
        // Max Price
        if (item.expectedPrice > filters.maxPrice) {
          return false;
        }
        // Min Quantity
        if (filters.minQuantity > 0 && item.availableQuantity < filters.minQuantity) {
          return false;
        }
        // Match Score
        if (item.matchScore && item.matchScore < filters.minMatchScore) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'match') {
          return (b.matchScore || 0) - (a.matchScore || 0);
        }
        if (filters.sortBy === 'price_low') {
          return a.expectedPrice - b.expectedPrice;
        }
        if (filters.sortBy === 'price_high') {
          return b.expectedPrice - a.expectedPrice;
        }
        return 0;
      });
  }, [produceLots, filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-700">
            Real-Time Farmgate Exchange
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {bt.marketplaceTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {bt.marketplaceSub}
          </p>
        </div>

        {/* Search & Filter Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-leaf-400 hover:bg-leaf-50 transition-colors shadow-2xs"
          >
            <Sliders size={15} className="text-leaf-600" />
            <span>{bt.filtersAndSorting}</span>
            {filters.category !== 'All' && (
              <span className="flex h-2 w-2 rounded-full bg-leaf-500" />
            )}
          </button>

          {/* Grid / List view toggle */}
          <div className="hidden sm:flex rounded-2xl border border-gray-200 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-colors ${
                viewMode === 'grid' ? 'bg-leaf-100 text-leaf-800' : 'text-gray-400 hover:text-ink'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xl transition-colors ${
                viewMode === 'list' ? 'bg-leaf-100 text-leaf-800' : 'text-gray-400 hover:text-ink'
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Live Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Horizontal Category Slider */}
        <div className="scrollbar-hide -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setFilters({ ...filters, category: cat.key })}
              className={`shrink-0 rounded-xl px-3.5 py-2 font-bold transition-all ${
                filters.category === cat.key
                  ? 'bg-leaf-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Inline Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={bt.searchPlaceholder}
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="w-full rounded-2xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-ink focus:border-leaf-500 focus:outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {bt.showingLots}: <strong>{filteredProduce.length}</strong>
          {filters.category !== 'All' ? ` (${categories.find((c) => c.key === filters.category)?.label})` : ''}
        </span>
        <span className="font-medium text-emerald-700">
          {bt.directFarmgateMsg}
        </span>
      </div>

      {/* Produce Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProduce.map((lot) => {
            const mandiPrice = lot.mandiPrice || Math.round(lot.expectedPrice * 1.12);
            const savingsPercent = Math.round(((mandiPrice - lot.expectedPrice) / mandiPrice) * 100);

            return (
              <div
                key={lot.id}
                className="rounded-3xl border border-gray-200/90 bg-white overflow-hidden shadow-xs hover:border-leaf-400 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Overlay Badges */}
                  <div
                    className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => onSelectProduce(lot)}
                  >
                    <img
                      src={lot.image}
                      alt={lot.cropName}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                        Grade {lot.quality}
                      </span>
                      <span className="rounded-lg bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white">
                        Available
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <MatchScoreBadge
                        score={lot.matchScore || 94}
                        size="sm"
                        showDetailsButton={false}
                      />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3
                        onClick={() => onSelectProduce(lot)}
                        className="font-serif text-lg font-bold text-ink hover:text-leaf-700 cursor-pointer transition-colors leading-tight"
                      >
                        {lot.cropName}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onOpenFarmerProfile(lot.farmerName || '')}
                        className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 hover:text-leaf-700 font-semibold"
                      >
                        <User size={13} className="text-leaf-600" />
                        <span>{lot.farmerName}</span>
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-gray-400" /> {lot.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400" /> {lot.harvestDate}
                      </span>
                    </div>

                    {/* Price & Savings Pill */}
                    <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/70 p-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                          Direct Price
                        </span>
                        <span className="text-xl font-black text-emerald-950">
                          ₹{lot.expectedPrice}
                          <span className="text-xs font-normal text-gray-600">/{lot.unit}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 line-through block">
                          Mandi: ₹{mandiPrice}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-0.5 justify-end">
                          <TrendingDown size={13} /> -{savingsPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                      <span>Available: <strong>{lot.availableQuantity} {lot.unit}</strong></span>
                      <span className="text-[11px] text-gray-400 font-medium">Escrow Protected</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="border-t border-gray-100 bg-gray-50/60 p-4 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenPriceComparison(lot.cropName)}
                    className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:border-leaf-300 hover:text-leaf-800 transition-colors"
                    title="Compare Farmer Prices"
                    aria-label="Compare Farmer Prices"
                  >
                    <Scale size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenChat(lot.farmerName || '', lot)}
                    className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:border-leaf-300 hover:text-leaf-800 transition-colors"
                    title="Chat with Farmer"
                    aria-label="Chat with Farmer"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenOrderRequest(lot)}
                    className="flex-1 rounded-xl bg-leaf-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-leaf-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Send size={13} /> Order Request
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredProduce.map((lot) => (
            <div
              key={lot.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs hover:border-leaf-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={lot.image}
                  alt={lot.cropName}
                  className="h-16 w-16 rounded-xl object-cover shrink-0 cursor-pointer"
                  onClick={() => onSelectProduce(lot)}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      onClick={() => onSelectProduce(lot)}
                      className="font-serif text-base font-bold text-ink hover:text-leaf-700 cursor-pointer"
                    >
                      {lot.cropName}
                    </h3>
                    <span className="rounded bg-leaf-50 px-1.5 py-0.5 text-[10px] font-bold text-leaf-700">
                      Grade {lot.quality}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Farmer: <strong>{lot.farmerName}</strong> • {lot.location} • Available: {lot.availableQuantity} {lot.unit}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 self-end md:self-center">
                <MatchScoreBadge score={lot.matchScore || 94} size="sm" />
                <div className="text-right">
                  <span className="text-base font-black text-emerald-950">
                    ₹{lot.expectedPrice}/{lot.unit}
                  </span>
                  <span className="text-[11px] text-gray-400 block line-through">
                    Mandi: ₹{lot.mandiPrice || Math.round(lot.expectedPrice * 1.12)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectProduce(lot)}
                  className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Inspect Details
                </button>
                <button
                  type="button"
                  onClick={() => onOpenOrderRequest(lot)}
                  className="rounded-xl bg-leaf-600 px-4 py-2 text-xs font-bold text-white hover:bg-leaf-700"
                >
                  Order Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Drawer */}
      <ProduceFilterDrawer
        filters={filters}
        onChangeFilters={setFilters}
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        totalMatchesCount={filteredProduce.length}
      />
    </div>
  );
}

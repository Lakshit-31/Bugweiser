import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Sprout, ShoppingBag, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { adminService } from '../data/adminService';
import StatCard from '../components/StatCard';

interface AnalyticsViewProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export default function AnalyticsView({ dateRange, onDateRangeChange }: AnalyticsViewProps) {
  const analytics = adminService.getAnalytics();
  const ranges = ['Today', '7 Days', '30 Days', '3 Months', '1 Year'];

  return (
    <div className="space-y-6">
      {/* Date Range Selector Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink">Marketplace Intelligence & Growth</h3>
          <p className="text-xs text-gray-500">Marketplace analytics for user acquisition, order volume & commodity price trends</p>
        </div>

        {/* Date Filter Buttons */}
        <div className="scrollbar-hide flex gap-1.5 overflow-x-auto text-xs">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => onDateRangeChange(r)}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                dateRange === r
                  ? 'bg-leaf-500 text-paper shadow-md shadow-leaf-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Farmer Acquisition"
          value="+310"
          trend="+42% vs previous period"
          icon={<Sprout size={20} />}
        />
        <StatCard
          title="Buyer Acquisition"
          value="+180"
          trend="+28% vs previous period"
          icon={<ShoppingBag size={20} />}
        />
        <StatCard
          title="Matched Contracts"
          value="185 Orders"
          trend="94% match accuracy"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Gross Market Volume"
          value="₹14.5 Lakh"
          trend="Zero middleman fee"
          icon={<IndianRupee size={20} />}
          highlight
        />
      </div>

      {/* Main Charts Row: Registration Growth + Order Trends */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h4 className="font-serif text-base font-bold text-ink">User Growth Comparison</h4>
              <p className="text-xs text-gray-500">Farmer vs Buyer onboarding velocity</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-leaf-700">
                <span className="h-2 w-2 rounded-full bg-leaf-500" /> Farmers
              </span>
              <span className="flex items-center gap-1 text-dusk-700">
                <span className="h-2 w-2 rounded-full bg-dusk-500" /> Buyers
              </span>
            </div>
          </div>

          <div className="h-44 w-full">
            <svg viewBox="0 0 400 120" className="h-full w-full">
              {/* Farmers Curve */}
              <polyline
                fill="none"
                stroke="#2F5233"
                strokeWidth="3"
                strokeLinecap="round"
                points="0,100 80,80 160,55 240,30 320,20 400,10"
              />
              {/* Buyers Curve */}
              <polyline
                fill="none"
                stroke="#2C3E66"
                strokeWidth="3"
                strokeLinecap="round"
                points="0,110 80,95 160,75 240,55 320,40 400,30"
              />
            </svg>
          </div>
        </div>

        {/* Order Volume Chart */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h4 className="font-serif text-base font-bold text-ink">Order Volume Timeline</h4>
              <p className="text-xs text-gray-500">Gross contract value in ₹</p>
            </div>
            <span className="text-xs font-bold text-leaf-700">₹14.5 Lakh Total</span>
          </div>

          <div className="h-44 w-full">
            <svg viewBox="0 0 400 120" className="h-full w-full">
              <polyline
                fill="none"
                stroke="#E3A008"
                strokeWidth="4"
                strokeLinecap="round"
                points="0,95 80,75 160,40 240,25 320,15 400,5"
              />
              <circle cx="400" cy="5" r="5" fill="#E3A008" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Most Listed vs Demanded Crops & Average Prices */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Most Listed Crops */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
          <h4 className="font-serif text-base font-bold text-ink mb-3">Most Listed Crops</h4>
          <div className="space-y-3 text-xs">
            {analytics.mostListedCrops.map((item) => (
              <div key={item.crop} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-ink">{item.crop}</span>
                  <span className="text-leaf-700">{item.listings} listings ({item.totalQty.toLocaleString()} kg)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-leaf-500"
                    style={{ width: `${(item.listings / 500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Demanded Crops */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
          <h4 className="font-serif text-base font-bold text-ink mb-3">Buyer Commodity Demand</h4>
          <div className="space-y-3 text-xs">
            {analytics.mostDemandedCrops.map((item) => (
              <div key={item.crop} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-ink">{item.crop}</span>
                  <span className="text-dusk-700">{(item.buyerDemandKg / 1000).toFixed(0)} Tons Demand</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-dusk-500"
                    style={{ width: `${(item.buyerDemandKg / 1000000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Market Prices */}
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
          <h4 className="font-serif text-base font-bold text-ink mb-3">Average Direct Market Prices</h4>
          <div className="divide-y divide-gray-100 text-xs">
            {analytics.averageCropPrices.map((item) => (
              <div key={item.crop} className="py-2.5 flex items-center justify-between">
                <span className="font-semibold text-gray-700">{item.crop}</span>
                <span className="font-serif font-bold text-leaf-700 text-sm">₹{item.pricePerKg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

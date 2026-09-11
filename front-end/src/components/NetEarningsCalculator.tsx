import React, { useState } from 'react';
import { Calculator, TrendingUp, ShieldCheck, ArrowRight, DollarSign, Percent, CheckCircle2 } from 'lucide-react';
import type { LanguageCode } from '@/types';
import { translations } from '@/data/translations';

interface NetEarningsCalculatorProps {
  currentLang: LanguageCode;
  onExploreListings?: () => void;
}

interface CropDefaults {
  name: string;
  defaultMandiPrice: number;
  unit: string;
}

const cropPresets: Record<string, CropDefaults> = {
  wheat: { name: 'Wheat (गेहूं / ਕਣਕ)', defaultMandiPrice: 2150, unit: 'Quintal' },
  rice: { name: 'Basmati Rice (चावल / ਚੌਲ)', defaultMandiPrice: 3800, unit: 'Quintal' },
  tomatoes: { name: 'Tomatoes (टमाटर / ਟਮਾਟਰ)', defaultMandiPrice: 1500, unit: 'Quintal' },
  onions: { name: 'Onions (प्याज / ਪਿਆਜ਼)', defaultMandiPrice: 1650, unit: 'Quintal' },
  cotton: { name: 'Cotton (कपास / ਕਪਾਹ)', defaultMandiPrice: 6200, unit: 'Quintal' },
  mustard: { name: 'Mustard (सरसों / ਸਰੋਂ)', defaultMandiPrice: 4800, unit: 'Quintal' },
  sugarcane: { name: 'Sugarcane (गन्ना / ਗੰਨਾ)', defaultMandiPrice: 320, unit: 'Quintal' },
};

export default function NetEarningsCalculator({ currentLang, onExploreListings }: NetEarningsCalculatorProps) {
  const t = translations[currentLang] || translations.en;
  
  const [selectedCropKey, setSelectedCropKey] = useState<string>('wheat');
  const [quantity, setQuantity] = useState<number>(20);
  const [mandiPrice, setMandiPrice] = useState<number>(cropPresets.wheat.defaultMandiPrice);

  const handleCropChange = (key: string) => {
    setSelectedCropKey(key);
    setMandiPrice(cropPresets[key].defaultMandiPrice);
  };

  const traditionalGross = quantity * mandiPrice;
  const middlemanCut = Math.round(traditionalGross * 0.18);
  const traditionalNet = traditionalGross - middlemanCut;

  const directUnitPrice = Math.round(mandiPrice * 1.08);
  const directGross = quantity * directUnitPrice;
  const platformFee = Math.round(directGross * 0.015);
  const directNet = directGross - platformFee;

  const extraProfit = directNet - traditionalNet;
  const profitBoostPercent = ((extraProfit / traditionalNet) * 100).toFixed(1);

  return (
    <div className="rounded-3xl border border-leaf-200 bg-gradient-to-br from-white via-leaf-50/40 to-marigold-50/30 p-6 md:p-8 shadow-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-3.5 py-1 text-xs font-semibold text-leaf-700 mb-2">
            <Calculator size={14} />
            <span>Interactive Profit Tool</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-ink">{t.calcTitle}</h3>
          <p className="text-sm text-ink/70 mt-1">{t.calcSub}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 border border-leaf-200 shadow-sm">
          <TrendingUp className="text-leaf-600" size={20} />
          <div>
            <div className="text-xs font-semibold text-ink/60">Estimated Profit Boost</div>
            <div className="text-lg font-bold text-leaf-600">+{profitBoostPercent}% Income</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs Column */}
        <div className="lg:col-span-6 space-y-5 bg-white p-5 md:p-6 rounded-2xl border border-black/5 shadow-sm">
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
              1. {t.selectCrop}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(cropPresets).map(([key, crop]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCropChange(key)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition-all text-left border ${
                    selectedCropKey === key
                      ? 'border-leaf-500 bg-leaf-500 text-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-ink hover:border-leaf-300'
                  }`}
                >
                  {crop.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Slider / Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/70">
                2. {t.enterQty}
              </label>
              <span className="text-sm font-bold text-leaf-600 bg-leaf-50 px-2.5 py-0.5 rounded-lg border border-leaf-200">
                {quantity} Quintals ({quantity * 100} kg)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 bg-leaf-100 rounded-lg appearance-none cursor-pointer accent-leaf-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>1 Quintal</span>
              <span>50 Quintals</span>
              <span>100 Quintals</span>
              <span>200 Quintals</span>
            </div>
          </div>

          {/* Mandi Rate Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/70">
                3. {t.mandiPriceLabel}
              </label>
              <span className="text-xs text-gray-500">Agmarknet Avg. Rate</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
              <input
                type="number"
                value={mandiPrice}
                onChange={(e) => setMandiPrice(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-2.5 text-sm font-semibold text-ink focus:border-leaf-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-leaf-100 transition-all"
              />
            </div>
          </div>

          <div className="rounded-xl bg-marigold-50/70 p-3.5 border border-marigold-200/80 text-xs text-ink/80 flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-marigold-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-marigold-800">Zero Hidden Deductions:</span> Direct linkage buyers pay directly for doorstep quality without broker commissions or unauthorized weighbridge cuts.
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 flex flex-col h-full justify-between bg-ink text-white p-6 rounded-2xl shadow-lg border border-leaf-800">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div>
                <div className="text-xs font-medium text-leaf-300 uppercase tracking-wider">Estimated Comparison</div>
                <div className="text-lg font-serif font-semibold text-white">
                  {quantity} Quintals of {cropPresets[selectedCropKey]?.name.split(' ')[0]}
                </div>
              </div>
              <div className="rounded-full bg-leaf-500/20 px-3 py-1 text-xs font-semibold text-leaf-300 border border-leaf-500/40">
                Live Direct Quote
              </div>
            </div>

            {/* Comparison Bars */}
            <div className="space-y-4 mb-6">
              {/* Traditional Mandi */}
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>Traditional Mandi Broker</span>
                  <span className="font-semibold text-gray-300">₹{traditionalNet.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400/70 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (traditionalNet / directNet) * 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-red-300/80 mt-1 flex items-center gap-1">
                  <span>- ₹{middlemanCut.toLocaleString('en-IN')} lost in broker fees & wastage</span>
                </div>
              </div>

              {/* Moolya Direct */}
              <div>
                <div className="flex justify-between text-xs font-medium text-white mb-1">
                  <span className="text-leaf-300 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-leaf-400" />
                    Moolya Direct Linkage
                  </span>
                  <span className="font-bold text-leaf-300 text-base">₹{directNet.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-leaf-400 to-leaf-300 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(76,175,80,0.5)]"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="text-[11px] text-leaf-200 mt-1">
                  <span>100% Escrow Direct Bank Deposit • Nominal ₹{platformFee.toLocaleString('en-IN')} service fee</span>
                </div>
              </div>
            </div>

            {/* Profit Highlight Card */}
            <div className="rounded-xl bg-gradient-to-r from-leaf-900/90 to-leaf-700/80 border border-leaf-500/50 p-4 mb-6 shadow-inner">
              <div className="text-xs font-semibold uppercase text-leaf-200">{t.extraProfit}</div>
              <div className="text-3xl font-extrabold text-white mt-0.5 flex items-baseline gap-2">
                ₹{extraProfit.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-leaf-300">
                  (⏱ Net +{profitBoostPercent}%)
                </span>
              </div>
              <p className="text-xs text-leaf-100/80 mt-1">
                You retain <span className="font-bold text-white">₹{extraProfit.toLocaleString('en-IN')} more</span> in direct farm earnings per harvest.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExploreListings}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-marigold-400 px-5 py-3 text-sm font-bold text-ink hover:bg-marigold-500 transition-all active:scale-[0.98] shadow-md"
          >
            <span>List Crop Now & Claim Extra Profit</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

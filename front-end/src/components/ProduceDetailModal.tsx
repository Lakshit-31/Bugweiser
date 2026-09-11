import React, { useState } from 'react';
import { X, MapPin, Calendar, Award, ShieldCheck, MessageCircle, Phone, Sparkles, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import type { Produce, LanguageCode } from '@/types';
import { translations } from '@/data/translations';

interface ProduceDetailModalProps {
  produce: Produce | null;
  currentLang: LanguageCode;
  onClose: () => void;
  onContactFarmer?: (produce: Produce) => void;
}

export default function ProduceDetailModal({ produce, currentLang, onClose, onContactFarmer }: ProduceDetailModalProps) {
  if (!produce) return null;
  const t = translations[currentLang] || translations.en;

  const [inquirySent, setInquirySent] = useState(false);
  const [offerPrice, setOfferPrice] = useState(produce.expectedPrice);
  const [offerQty, setOfferQty] = useState(produce.availableQuantity);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      if (onContactFarmer) onContactFarmer(produce);
    }, 1800);
  };

  const mandiComparison = produce.mandiPrice
    ? Math.round(((produce.expectedPrice - produce.mandiPrice) / produce.mandiPrice) * 100)
    : 12;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl my-8 overflow-hidden border border-leaf-100 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-600 backdrop-blur-md transition-all hover:bg-gray-100 hover:text-ink"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Image & Quick Badges Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative h-64 md:h-full min-h-[220px] rounded-2xl overflow-hidden bg-gray-100 shadow-md">
              <img
                src={produce.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'}
                alt={produce.cropName}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              {/* Match score badge overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-leaf-500/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-lg border border-white/20">
                <Sparkles size={14} className="text-marigold-300" />
                <span>{produce.matchScore || 94}/100 Match Score</span>
              </div>

              {/* Quality & Status pill */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-leaf-700 shadow">
                  Grade {produce.quality} Superior
                </span>
                <span className="rounded-lg bg-marigold-400 px-2.5 py-1 text-xs font-bold text-ink shadow">
                  {produce.status}
                </span>
              </div>
            </div>
          </div>

          {/* Details & Action Column */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-leaf-600 mb-1">
                {produce.category || 'Agricultural Produce'}
              </div>
              <h3 className="text-2xl font-bold font-serif text-ink">{produce.cropName}</h3>
              <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin size={14} className="text-leaf-500" />
                <span>{produce.location}</span>
              </p>
            </div>

            {/* Price & Quantity Grid */}
            <div className="grid grid-cols-2 gap-3 bg-paper p-3.5 rounded-2xl border border-leaf-100">
              <div>
                <div className="text-[11px] font-medium text-gray-500 uppercase">Direct Listed Price</div>
                <div className="text-xl font-extrabold text-leaf-600 mt-0.5">
                  ₹{produce.expectedPrice.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-gray-500">/ Quintal</span>
                </div>
                {produce.mandiPrice && (
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    vs Mandi Rate ₹{produce.mandiPrice.toLocaleString('en-IN')} (+{mandiComparison}%)
                  </div>
                )}
              </div>
              <div>
                <div className="text-[11px] font-medium text-gray-500 uppercase">Available Quantity</div>
                <div className="text-xl font-extrabold text-ink mt-0.5">
                  {produce.availableQuantity}{' '}
                  <span className="text-xs font-normal text-gray-500">{produce.unit || 'Quintals'}</span>
                </div>
                <div className="text-[10px] text-leaf-600 mt-0.5 flex items-center gap-1">
                  <Calendar size={11} /> Ready to ship (Harvested {produce.harvestDate})
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="rounded-xl border border-gray-200 p-3 flex items-center justify-between bg-white shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 font-bold text-sm">
                  {produce.farmerName ? produce.farmerName[0] : 'K'}
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{produce.farmerName || 'Rameshwar Lal (Farmer)'}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-leaf-500" /> eNAM Verified Grower • 4.9 ★ (28 deals)
                  </div>
                </div>
              </div>
              <span className="rounded-md bg-leaf-50 px-2 py-0.5 text-[10px] font-semibold text-leaf-700 border border-leaf-200">
                Direct Seller
              </span>
            </div>

            {/* Inquiry Form */}
            {inquirySent ? (
              <div className="rounded-2xl bg-leaf-50 border border-leaf-200 p-4 text-center space-y-2 animate-fade-in">
                <CheckCircle2 size={32} className="mx-auto text-leaf-600" />
                <h4 className="font-bold text-leaf-800 text-base">Direct Offer Sent to Farmer!</h4>
                <p className="text-xs text-leaf-700">
                  Farmer {produce.farmerName || 'Rameshwar Lal'} has been notified via WhatsApp & SMS. Direct link chat opens shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Offer Price (₹/Quintal)
                    </label>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold focus:border-leaf-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Quantity (Quintals)
                    </label>
                    <input
                      type="number"
                      max={produce.availableQuantity}
                      value={offerQty}
                      onChange={(e) => setOfferQty(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold focus:border-leaf-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-xs py-2.5 gap-1.5 shadow-md"
                  >
                    <MessageCircle size={16} />
                    <span>Send Direct Purchase Offer</span>
                  </button>
                  <a
                    href={`https://wa.me/919876543210?text=Hi, I am interested in buying ${produce.cropName} (${offerQty} Quintals) at ₹${offerPrice}/Quintal on Moolya.`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary text-xs py-2.5 px-3 gap-1 shadow-xs"
                    title="Chat via WhatsApp"
                  >
                    <Phone size={15} />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

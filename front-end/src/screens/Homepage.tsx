import React, { useState } from 'react';
import {
  Sprout,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageCircle,
  Award,
  ChevronRight,
  Star,
  Download,
  QrCode,
  MapPin,
  Calendar,
  Layers,
  Zap,
  Globe,
  Radio,
  FileCheck,
  Building2,
  Sliders,
  DollarSign
} from 'lucide-react';
import type { Produce, LanguageCode } from '@/types';
import { translations } from '@/data/translations';
import { featuredProduceListings, mockTestimonialsData } from '@/data/mockListings';
import NetEarningsCalculator from '@/components/NetEarningsCalculator';
import ProduceDetailModal from '@/components/ProduceDetailModal';
import MatchScoreRing from '@/components/MatchScoreRing';

interface HomepageProps {
  currentLang: LanguageCode;
  onNavigateSection: (sectionKey: string) => void;
  onRoleSelect: (role: 'farmer' | 'buyer') => void;
  onOpenDashboard: () => void;
  onOpenMarketplace: () => void;
}

export default function Homepage({
  currentLang,
  onNavigateSection,
  onRoleSelect,
  onOpenDashboard,
  onOpenMarketplace,
}: HomepageProps) {
  const t = translations[currentLang] || translations.en;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduce, setSelectedProduce] = useState<Produce | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [roleModalOpen, setRoleModalOpen] = useState<'farmer' | 'buyer' | null>(null);

  // Filter listings
  const filteredListings = featuredProduceListings.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Grains') return item.category === 'Grains';
    if (activeCategory === 'Vegetables') return item.category === 'Vegetables';
    if (activeCategory === 'Oilseeds') return item.category === 'Oilseeds' || item.category === 'Spices';
    if (activeCategory === 'Commercial') return item.category === 'Commercial';
    return true;
  });

  const steps = [
    {
      step: '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: Layers,
      highlight: '30-second mobile photo listing',
      tag: 'Step 1: Listing',
    },
    {
      step: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Sparkles,
      highlight: 'Match score up to 98/100',
      tag: 'Step 2: AI Matching',
    },
    {
      step: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: ShieldCheck,
      highlight: '100% Escrow deposit protection',
      tag: 'Step 3: Direct Trade',
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-12">
      
      {/* ---------------------------------------------------- */}
      {/* 1. HERO SECTION (Dark Readable Text on Light Background) */}
      {/* ---------------------------------------------------- */}
      <section id="home" className="relative pt-4 md:pt-8 scroll-mt-24">
        <div className="rounded-3xl bg-gradient-to-br from-paper via-leaf-50/80 to-marigold-50/60 text-ink p-6 sm:p-10 lg:p-14 overflow-hidden relative shadow-xl border border-leaf-200/80">
          
          {/* Subtle background glow graphics */}
          <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-marigold-300/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-leaf-200/30 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-leaf-100/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-leaf-800 border border-leaf-200 shadow-xs">
                <Sparkles size={14} className="text-leaf-600 animate-pulse" />
                <span>{t.heroBadge}</span>
              </div>

              {/* Main Headline (DARK READABLE TEXT) */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight text-ink leading-[1.18]">
                Connecting Farmers Directly to Buyers —{' '}
                <span className="text-leaf-600">
                  No Middlemen, Better Prices.
                </span>
              </h1>

              {/* Subtext (DARK GRAY / NEAR-BLACK READABLE TEXT) */}
              <p className="text-base sm:text-lg text-ink/80 max-w-2xl font-sans leading-relaxed">
                {t.heroSubtext}
              </p>

              {/* CTAs: I'm a Farmer & I'm a Buyer */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onRoleSelect('farmer');
                    setRoleModalOpen('farmer');
                  }}
                  className="btn-primary py-3.5 px-6 text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
                >
                  <Sprout size={20} className="text-white" />
                  <span>{t.iamFarmer}</span>
                  <ArrowRight size={16} className="text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onRoleSelect('buyer');
                    setRoleModalOpen('buyer');
                  }}
                  className="btn-secondary py-3.5 px-6 text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
                >
                  <Users size={20} className="text-ink" />
                  <span>{t.iamBuyer}</span>
                </button>
              </div>

              {/* Key Trust Signals Bar (DARK READABLE TEXT) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-black/10 text-xs font-semibold text-ink/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-leaf-600 shrink-0" />
                  <span>0% Middleman Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-leaf-600 shrink-0" />
                  <span>Escrow Bank Protection</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <CheckCircle2 size={16} className="text-leaf-600 shrink-0" />
                  <span>eNAM Government Aligned</span>
                </div>
              </div>
            </div>

            {/* Hero Right Image & Floating Cards */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Primary Large Farmer Image */}
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-leaf-950 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=900&q=80"
                    alt="Indian farmer holding fresh wheat crop in green agricultural field using mobile device"
                    className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-leaf-950/80 via-transparent to-transparent" />
                  
                  {/* Bottom Image Overlay Title */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-semibold text-marigold-300 uppercase tracking-wider">
                      Verified Punjab Grower
                    </div>
                    <div className="text-sm font-bold font-serif">Gurpreet Singh • Khanna, Punjab</div>
                  </div>
                </div>

                {/* Floating Badge Card 1: Profit Stat (Top Left) */}
                <div className="absolute -top-4 -left-4 sm:-left-6 rounded-2xl bg-white p-3.5 shadow-2xl border border-leaf-100 flex items-center gap-3 animate-slide-up z-20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700 font-bold">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink">{t.heroStat1}</div>
                    <div className="text-[10px] text-gray-500">{t.heroStat1Sub}</div>
                  </div>
                </div>

                {/* Floating Badge Card 2: Match Score (Bottom Right) */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 rounded-2xl bg-white p-3.5 shadow-2xl border border-leaf-100 flex items-center gap-3 animate-slide-up z-20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marigold-100 text-marigold-700 font-bold">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink">{t.heroStat2}</div>
                    <div className="text-[10px] text-gray-500">{t.heroStat2Sub}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. HOW IT WORKS SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-3.5 py-1 text-xs font-bold text-leaf-700">
            <Layers size={14} />
            <span>3-Step Direct Workflow</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink">
            {t.howTitle}
          </h2>
          <p className="text-sm md:text-base text-ink/70">
            {t.howSub}
          </p>
        </div>

        {/* 3 Step Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, idx) => {
            const IconComp = item.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(idx)}
                className={`card relative p-6 sm:p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-leaf-500 ring-2 ring-leaf-400/30 bg-gradient-to-b from-white to-leaf-50/50 shadow-xl -translate-y-1'
                    : 'hover:border-leaf-300'
                }`}
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-serif text-leaf-200">
                      {item.step}
                    </span>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                        isSelected ? 'bg-leaf-500 text-white shadow-md' : 'bg-leaf-100 text-leaf-700'
                      }`}
                    >
                      <IconComp size={22} />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-serif font-bold text-ink mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/70 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Highlight Tag */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-leaf-600 bg-leaf-50 px-2.5 py-1 rounded-lg border border-leaf-200">
                    {item.highlight}
                  </span>
                  <ChevronRight size={16} className={`text-leaf-500 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. TRUST STATS SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="rounded-3xl bg-ink text-white p-8 md:p-12 shadow-xl border border-leaf-900 relative overflow-hidden">
        
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          <div className="space-y-1 p-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-leaf-300">
              {t.statFarmers}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-300">
              {t.statFarmersLabel}
            </div>
            <div className="text-[11px] text-leaf-400">Across 14 Indian states</div>
          </div>

          <div className="space-y-1 p-2 pt-6 md:pt-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-marigold-400">
              {t.statBuyers}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-300">
              {t.statBuyersLabel}
            </div>
            <div className="text-[11px] text-marigold-300">Mills, Wholesalers & Retailers</div>
          </div>

          <div className="space-y-1 p-2 pt-6 md:pt-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-leaf-300">
              {t.statVolume}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-300">
              {t.statVolumeLabel}
            </div>
            <div className="text-[11px] text-leaf-400">Direct Farmer Revenue</div>
          </div>

          <div className="space-y-1 p-2 pt-6 md:pt-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-yellow-300">
              {t.statPayment}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-300">
              {t.statPaymentLabel}
            </div>
            <div className="text-[11px] text-yellow-200">24-hour Escrow Settlement</div>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. FEATURED PRODUCE LISTINGS SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="listings" className="scroll-mt-24 space-y-8">
        
        {/* Header & Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-3.5 py-1 text-xs font-bold text-leaf-700 mb-2">
              <Sprout size={14} />
              <span>Live Farm Listings</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink">
              {t.listingsTitle}
            </h2>
            <p className="text-sm text-ink/70 mt-1">
              {t.listingsSub}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {[
              { id: 'All', label: t.allCrops },
              { id: 'Grains', label: t.grains },
              { id: 'Vegetables', label: t.vegetables },
              { id: 'Oilseeds', label: t.oilseeds },
              { id: 'Commercial', label: t.commercial },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-leaf-500 text-white shadow-sm'
                    : 'bg-white text-ink/70 border border-gray-200 hover:border-leaf-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="card group flex flex-col justify-between overflow-hidden p-0 transition-all hover:scale-[1.01] hover:border-leaf-300 hover:shadow-lg"
            >
              <div>
                {/* Image + Match Score Header */}
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.cropName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-leaf-800 shadow-xs">
                    {item.category}
                  </span>

                  {/* Match Score Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-leaf-600 text-white px-2.5 py-1 text-[11px] font-bold shadow-md border border-white/20">
                    <Sparkles size={12} className="text-marigold-300" />
                    <span>{item.matchScore}/100</span>
                  </div>

                  {/* Location Overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs flex items-center gap-1">
                    <MapPin size={13} className="text-marigold-300 shrink-0" />
                    <span className="truncate font-medium">{item.location}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-ink line-clamp-1 group-hover:text-leaf-600 transition-colors">
                      {item.cropName}
                    </h3>
                    <div className="text-xs text-gray-500 font-medium">
                      Grower: {item.farmerName || 'Rameshwar Lal'}
                    </div>
                  </div>

                  {/* Price & Quantity Box */}
                  <div className="flex items-center justify-between rounded-xl bg-paper p-2.5 border border-leaf-100">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-gray-400">{t.expectedPrice}</div>
                      <div className="text-base font-extrabold text-leaf-600">
                        ₹{item.expectedPrice.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] font-normal text-gray-500">/ Qtl</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-semibold text-gray-400">{t.qty}</div>
                      <div className="text-sm font-bold text-ink">
                        {item.availableQuantity} {item.unit || 'kg'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduce(item)}
                  className="btn-ghost text-xs py-2 px-2.5 font-semibold text-center border-gray-200 hover:border-leaf-300"
                >
                  {t.viewDetails}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduce(item)}
                  className="btn-primary text-xs py-2 px-2.5 font-semibold gap-1 text-center"
                >
                  <MessageCircle size={14} />
                  <span>{t.directChat}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Marketplace Banner Button */}
        <div className="text-center pt-4">
          <button
            onClick={onOpenMarketplace}
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-leaf-300 px-6 py-3 text-sm font-bold text-leaf-700 hover:bg-leaf-50 transition-all shadow-sm"
          >
            <span>Explore All 3,500+ Active Listings in Marketplace</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. KEY FEATURES SECTION (With Highlighted Buyer Score Card & Calculator) */}
      {/* ---------------------------------------------------- */}
      <section id="features" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-3.5 py-1 text-xs font-bold text-leaf-700">
            <Zap size={14} />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink">
            {t.featuresTitle}
          </h2>
          <p className="text-sm md:text-base text-ink/70">
            {t.featuresSub}
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1: Smart Matching */}
          <div className="card p-6 space-y-3 hover:border-leaf-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-ink">{t.feat1Title}</h3>
            <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">{t.feat1Desc}</p>
          </div>

          {/* Feature 2: VISUALLY HIGHLIGHTED - Buyer Trust & Match Score */}
          <div className="card p-6 space-y-4 rounded-2xl bg-gradient-to-br from-leaf-700 via-leaf-800 to-leaf-900 text-white shadow-xl ring-2 ring-leaf-400 border border-leaf-500 relative overflow-hidden">
            <div className="absolute top-3 right-3 rounded-full bg-marigold-400 px-3 py-0.5 text-[10px] font-extrabold uppercase text-ink shadow-sm">
              Core Highlight
            </div>
            
            <div className="flex items-center gap-4">
              {/* Match Score Ring Component */}
              <div className="shrink-0">
                <MatchScoreRing score={94} size={76} strokeWidth={7} animated={true} />
              </div>
              <div>
                <div className="text-xs font-bold text-marigold-300 uppercase tracking-wider">AI Verified</div>
                <h3 className="text-lg font-serif font-bold text-white leading-snug">{t.feat2Title}</h3>
              </div>
            </div>

            <p className="text-xs text-leaf-100/90 leading-relaxed">
              {t.feat2Desc}
            </p>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-leaf-200">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-marigold-300" /> Payment Guarantee
              </span>
              <span className="font-bold text-white">Score 94/100</span>
            </div>
          </div>

          {/* Feature 3: Price Transparency */}
          <div className="card p-6 space-y-3 hover:border-leaf-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-marigold-100 text-marigold-700">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-ink">{t.feat3Title}</h3>
            <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">{t.feat3Desc}</p>
          </div>

          {/* Feature 4: Net Earnings Calculator */}
          <div className="card p-6 space-y-3 hover:border-leaf-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
              <DollarSign size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-ink">{t.feat4Title}</h3>
            <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">{t.feat4Desc}</p>
          </div>

          {/* Feature 5: Direct Communication */}
          <div className="card p-6 space-y-3 hover:border-leaf-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-ink">{t.feat5Title}</h3>
            <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">{t.feat5Desc}</p>
          </div>

          {/* Feature 6: Ratings & Feedback */}
          <div className="card p-6 space-y-3 hover:border-leaf-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-marigold-100 text-marigold-700">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-serif font-bold text-ink">{t.feat6Title}</h3>
            <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">{t.feat6Desc}</p>
          </div>

        </div>

        {/* EMBEDDED INTERACTIVE NET EARNINGS CALCULATOR WIDGET */}
        <div className="pt-4">
          <NetEarningsCalculator
            currentLang={currentLang}
            onExploreListings={onOpenMarketplace}
          />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. TESTIMONIALS SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="testimonials" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-marigold-100 px-3.5 py-1 text-xs font-bold text-marigold-800">
            <Star size={14} className="fill-marigold-500 text-marigold-500" />
            <span>Verified Trading Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink">
            {t.testiTitle}
          </h2>
          <p className="text-sm md:text-base text-ink/70">
            {t.testiSub}
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockTestimonialsData.map((item) => (
            <div key={item.id} className="card p-6 flex flex-col justify-between space-y-4 hover:border-leaf-300">
              <div className="space-y-3">
                {/* 5-star rating */}
                <div className="flex gap-1 text-marigold-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-marigold-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-ink/80 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              {/* Avatar + Author Details */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-leaf-400 shadow-sm"
                />
                <div>
                  <div className="text-sm font-bold text-ink">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.role} • {item.location}</div>
                  <div className="text-[10px] font-semibold text-leaf-600 mt-0.5">{item.badge}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. LANGUAGE / ACCESSIBILITY BANNER */}
      {/* ---------------------------------------------------- */}
      <section className="rounded-3xl bg-gradient-to-r from-leaf-700 via-leaf-800 to-leaf-900 text-white p-8 md:p-10 shadow-xl border border-leaf-600">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-marigold-300 border border-white/15">
              <Globe size={14} />
              <span>Multi-Language Rural Access</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
              {t.bannerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-leaf-100 leading-relaxed">
              {t.bannerSub}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {['English', 'हिन्दी (Hindi)', 'मराठी (Marathi)', 'ਪੰਜਾਬੀ (Punjabi)'].map((lang) => (
                <span key={lang} className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white border border-white/20">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
            <div className="flex items-center gap-3">
              <Radio className="text-marigold-300 animate-pulse" size={24} />
              <div>
                <div className="text-xs font-bold text-white">Voice & Offline Support</div>
                <div className="text-[11px] text-leaf-200">Farmers can record crop voice notes or send SMS</div>
              </div>
            </div>
            <div className="text-xs font-mono bg-black/20 p-2.5 rounded-xl border border-white/10 text-leaf-200">
              SMS "SELL WHEAT 15 QTL KHANNA" to 56161
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer id="contact" className="rounded-3xl bg-ink text-gray-300 p-8 md:p-12 shadow-2xl border border-leaf-900 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-500 text-white">
                <Sprout size={20} />
              </div>
              <span className="font-serif text-2xl font-bold text-white">
                Moolya
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t.footerDesc}
            </p>

            {/* Helpline */}
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 space-y-1">
              <div className="text-[11px] font-bold uppercase text-marigold-400">{t.contactSupport}</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Phone size={16} className="text-leaf-400" />
                <span>{t.helpline}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-leaf-300 transition-colors">Home</a></li>
              <li><a href="#how-it-works" className="hover:text-leaf-300 transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-leaf-300 transition-colors">Platform Features</a></li>
              <li><a href="#listings" className="hover:text-leaf-300 transition-colors">Featured Produce Listings</a></li>
              <li><a href="#testimonials" className="hover:text-leaf-300 transition-colors">Farmer Testimonials</a></li>
              <li><button onClick={onOpenMarketplace} className="hover:text-leaf-300 transition-colors text-left">Produce Marketplace</button></li>
            </ul>
          </div>

          {/* Col 3: Government Scheme Partnerships */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              {t.govtPartnerships}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-white/5 p-3 border border-white/10 flex items-center gap-2.5">
                <Building2 size={18} className="text-leaf-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{t.enamIntegration}</div>
                  <div className="text-[10px] text-gray-400">National Agriculture Market</div>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-3 border border-white/10 flex items-center gap-2.5">
                <FileCheck size={18} className="text-marigold-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{t.pmKisanSupport}</div>
                  <div className="text-[10px] text-gray-400">Direct Farmer Aadhaar ID</div>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-3 border border-white/10 flex items-center gap-2.5 col-span-1 sm:col-span-2">
                <Award size={18} className="text-yellow-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{t.nabardBacked}</div>
                  <div className="text-[10px] text-gray-400">AgTech Innovation & Rural Financial Credit</div>
                </div>
              </div>
            </div>

            {/* Mobile App Download Card */}
            <div className="rounded-2xl bg-leaf-900/80 p-4 border border-leaf-700 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white">{t.downloadApp}</div>
                <div className="text-[11px] text-leaf-200 mt-0.5">{t.scanQr}</div>
              </div>
              <div className="h-14 w-14 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center">
                <QrCode size={44} className="text-ink" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>{t.allRights}</div>
          <div className="flex gap-4">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Security Escrow</span>
          </div>
        </div>
      </footer>

      {/* PRODUCE DETAIL MODAL */}
      <ProduceDetailModal
        produce={selectedProduce}
        currentLang={currentLang}
        onClose={() => setSelectedProduce(null)}
        onContactFarmer={(item) => {
          setSelectedProduce(null);
          onOpenMarketplace();
        }}
      />

      {/* ROLE MODAL FEEDBACK */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center space-y-4 shadow-2xl animate-scale-in border border-leaf-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700 font-bold">
              {roleModalOpen === 'farmer' ? <Sprout size={32} /> : <Users size={32} />}
            </div>
            <h3 className="text-2xl font-bold font-serif text-ink">
              Welcome to Moolya!
            </h3>
            <p className="text-xs sm:text-sm text-ink/70">
              {roleModalOpen === 'farmer'
                ? 'You are entering the Moolya Farmer portal to list crops, view bids, and check direct mandi payouts.'
                : 'You are entering the Moolya Buyer portal to discover fresh farm produce and negotiate directly with growers.'}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setRoleModalOpen(null);
                  if (roleModalOpen === 'farmer') {
                    onOpenDashboard();
                  } else {
                    onOpenMarketplace();
                  }
                }}
                className="btn-primary py-2.5 font-bold text-xs"
              >
                Proceed to {roleModalOpen === 'farmer' ? 'Farmer Dashboard' : 'Produce Marketplace'}
              </button>
              <button
                type="button"
                onClick={() => setRoleModalOpen(null)}
                className="btn-ghost py-2 font-semibold text-xs border-gray-200"
              >
                Stay on Homepage
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

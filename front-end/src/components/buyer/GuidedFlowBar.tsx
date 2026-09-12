import React, { useState } from 'react';
import {
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  ShoppingBag,
  Filter,
  FileText,
  UserCheck,
  Scale,
  MessageSquare,
  Send,
  PackageCheck,
  Receipt,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { BuyerScreenName } from '@/types/buyer';
import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

export type FlowStepKey =
  | 'login'
  | 'dashboard'
  | 'marketplace'
  | 'filter'
  | 'produce_details'
  | 'farmer_details'
  | 'match_score'
  | 'compare'
  | 'chat'
  | 'order_request'
  | 'orders'
  | 'transactions'
  | 'feedback';

interface GuidedFlowBarProps {
  currentStep: FlowStepKey;
  onSelectStep: (step: FlowStepKey) => void;
  currentLang?: LanguageCode;
}

export default function GuidedFlowBar({
  currentStep,
  onSelectStep,
  currentLang = 'en',
}: GuidedFlowBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;

  const stepsList: {
    key: FlowStepKey;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    { key: 'login', label: bt.flowSteps.auth, icon: UserCheck },
    { key: 'dashboard', label: bt.flowSteps.dashboard, icon: LayoutDashboard },
    { key: 'marketplace', label: bt.flowSteps.marketplace, icon: ShoppingBag },
    { key: 'filter', label: bt.flowSteps.filter, icon: Filter },
    { key: 'produce_details', label: bt.flowSteps.produceDetails, icon: FileText },
    { key: 'farmer_details', label: bt.flowSteps.farmerProfile, icon: UserCheck },
    { key: 'match_score', label: bt.flowSteps.matchScore, icon: Sparkles },
    { key: 'compare', label: bt.flowSteps.compare, icon: Scale },
    { key: 'chat', label: bt.flowSteps.chat, icon: MessageSquare },
    { key: 'order_request', label: bt.flowSteps.orderRequest, icon: Send },
    { key: 'orders', label: bt.flowSteps.orders, icon: PackageCheck },
    { key: 'transactions', label: bt.flowSteps.transactions, icon: Receipt },
    { key: 'feedback', label: bt.flowSteps.feedback, icon: Star },
  ];

  const currentIndex = stepsList.findIndex((s) => s.key === currentStep);

  const handleNext = () => {
    if (currentIndex < stepsList.length - 1) {
      onSelectStep(stepsList[currentIndex + 1].key);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectStep(stepsList[currentIndex - 1].key);
    }
  };

  return (
    <aside aria-label="SIH Interactive Presentation Demo Bar" className="border-b border-emerald-200/80 bg-gradient-to-r from-emerald-950 via-leaf-800 to-emerald-950 text-white shadow-md relative z-30">
      <div className="mx-auto max-w-content px-4 py-2 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400/20 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
              <Sparkles size={12} /> {bt.sihDemoGuide}
            </span>
            <span className="hidden sm:inline text-xs text-emerald-100 font-medium">
              {bt.sihFlowSub}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-emerald-100 hover:bg-white/20 disabled:opacity-30 transition-colors"
            >
              {bt.prevStep}
            </button>
            <span className="text-xs font-bold text-emerald-200">
              {currentIndex + 1} / {stepsList.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= stepsList.length - 1}
              className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-emerald-400 disabled:opacity-30 transition-colors flex items-center gap-1"
            >
              {bt.nextStep}
            </button>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="ml-1 rounded-lg p-1 text-emerald-300 hover:bg-white/10 transition-colors"
              title={collapsed ? 'Expand flow bar' : 'Collapse flow bar'}
              aria-label={collapsed ? 'Expand flow bar' : 'Collapse flow bar'}
            >
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* Horizontal scrollable steps row */}
        {!collapsed && (
          <div className="mt-2.5 pt-2 border-t border-white/10">
            <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {stepsList.map((step, idx) => {
                const isActive = step.key === currentStep;
                const isPassed = idx < currentIndex;
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => onSelectStep(step.key)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 font-medium transition-all shrink-0 ${
                      isActive
                        ? 'bg-white text-emerald-950 font-bold shadow-sm scale-105'
                        : isPassed
                        ? 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-700/60'
                        : 'bg-white/5 text-emerald-300/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : isPassed
                          ? 'bg-emerald-400/30 text-emerald-300'
                          : 'bg-white/10 text-emerald-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <StepIcon size={13} className={isActive ? 'text-emerald-700' : ''} />
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { OrderStatus } from '../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  history?: { status: OrderStatus; timestamp: string; note?: string }[];
}

const steps: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'Requested', label: 'Requested', description: 'Buyer submitted contract request' },
  { key: 'Accepted', label: 'Accepted', description: 'Farmer accepted price terms' },
  { key: 'Confirmed', label: 'Confirmed', description: 'Payment escrow secured' },
  { key: 'In Transit', label: 'In Transit', description: 'Produce dispatched & tracked' },
  { key: 'Completed', label: 'Completed', description: 'Goods received & funds released' },
];

export default function OrderTimeline({ currentStatus, history = [] }: OrderTimelineProps) {
  const isCancelled = currentStatus === 'Cancelled';

  const getStepIndex = (status: OrderStatus) => {
    return steps.findIndex((s) => s.key === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="py-3">
      {isCancelled ? (
        <div className="flex items-center gap-3 rounded-xl border border-rust-200 bg-rust-50 p-4 text-rust-700">
          <AlertTriangle size={24} className="text-rust-500 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Order Cancelled</h4>
            <p className="text-xs text-rust-600">This order was cancelled prior to dispatch.</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Bar */}
          <div className="space-y-6 sm:space-y-0 sm:flex sm:items-center sm:justify-between relative">
            <div className="hidden sm:block absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-0" />
            <div
              className="hidden sm:block absolute top-4 left-4 h-0.5 bg-leaf-500 transition-all duration-500 -z-0"
              style={{
                width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%`,
              }}
            />

            {steps.map((step, idx) => {
              const isDone = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              const histEntry = history.find((h) => h.status === step.key);

              return (
                <div
                  key={step.key}
                  className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center relative z-10"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                      isDone
                        ? 'border-leaf-500 bg-leaf-500 text-paper shadow-md shadow-leaf-500/20'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle size={18} />
                    ) : isCurrent ? (
                      <Clock size={18} className="animate-spin text-marigold-500" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  <div>
                    <p className={`text-xs font-bold ${isDone ? 'text-ink' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {histEntry && (
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {histEntry.timestamp}
                      </p>
                    )}
                    <p className="text-[11px] text-gray-500 sm:hidden mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

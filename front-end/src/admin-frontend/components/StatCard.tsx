import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: ReactNode;
  description?: string;
  badgeText?: string;
  highlight?: boolean;
}

export default function StatCard({
  title,
  value,
  trend,
  trendUp = true,
  icon,
  description,
  badgeText,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md ${
        highlight
          ? 'bg-gradient-to-br from-leaf-600 to-leaf-700 text-paper border-leaf-600 shadow-lg shadow-leaf-600/15'
          : 'bg-white border-black/5 shadow-[0_1px_3px_rgba(30,43,31,0.06)]'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${highlight ? 'text-leaf-100' : 'text-gray-500'}`}>
          {title}
        </span>
        {icon && (
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              highlight ? 'bg-white/15 text-paper' : 'bg-leaf-50 text-leaf-600'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className={`font-serif text-3xl font-bold ${highlight ? 'text-paper' : 'text-ink'}`}>
          {value}
        </span>
        {badgeText && (
          <span className="rounded-full bg-marigold-100 px-2 py-0.5 text-[11px] font-semibold text-marigold-800">
            {badgeText}
          </span>
        )}
      </div>

      {(trend || description) && (
        <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-2.5 text-xs">
          {trend && (
            <span className={`inline-flex items-center gap-1 font-semibold ${
              highlight
                ? 'text-leaf-100'
                : trendUp
                ? 'text-leaf-600'
                : 'text-rust-500'
            }`}>
              {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {trend}
            </span>
          )}
          {description && (
            <span className={highlight ? 'text-leaf-200' : 'text-gray-400'}>{description}</span>
          )}
        </div>
      )}
    </div>
  );
}

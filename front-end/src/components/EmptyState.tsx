import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-leaf-200 bg-white/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-leaf-50 text-leaf-400">
        {icon}
      </div>
      <h3 className="mb-1.5 font-serif text-lg font-semibold text-ink">{title}</h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>
      {action}
    </div>
  );
}

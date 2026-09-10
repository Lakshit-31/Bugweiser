type StatusType =
  | 'Available'
  | 'Reserved'
  | 'Sold Out'
  | 'Pending'
  | 'Accepted'
  | 'Confirmed'
  | 'In Transit'
  | 'Completed'
  | 'Cancelled'
  | 'Received'
  | 'Processing'
  | 'Active'
  | 'Suspended';

const statusConfig: Record<StatusType, { bg: string; text: string; border: string }> = {
  Available:      { bg: 'bg-leaf-50',   text: 'text-leaf-600',   border: 'border-leaf-100' },
  Reserved:       { bg: 'bg-marigold-50', text: 'text-marigold-600', border: 'border-marigold-100' },
  'Sold Out':     { bg: 'bg-gray-100',  text: 'text-gray-500',   border: 'border-gray-200' },
  Pending:        { bg: 'bg-marigold-50', text: 'text-marigold-600', border: 'border-marigold-100' },
  Accepted:       { bg: 'bg-marigold-50', text: 'text-marigold-600', border: 'border-marigold-100' },
  Confirmed:      { bg: 'bg-dusk-50',   text: 'text-dusk-500',   border: 'border-dusk-100' },
  'In Transit':   { bg: 'bg-sky-50',    text: 'text-sky-500',    border: 'border-sky-100' },
  Completed:      { bg: 'bg-leaf-50',   text: 'text-leaf-600',   border: 'border-leaf-100' },
  Cancelled:      { bg: 'bg-rust-50',   text: 'text-rust-500',   border: 'border-rust-100' },
  Received:       { bg: 'bg-leaf-50',   text: 'text-leaf-600',   border: 'border-leaf-100' },
  Processing:     { bg: 'bg-sky-50',    text: 'text-sky-500',    border: 'border-sky-100' },
  Active:         { bg: 'bg-leaf-50',   text: 'text-leaf-600',   border: 'border-leaf-100' },
  Suspended:      { bg: 'bg-rust-50',   text: 'text-rust-500',   border: 'border-rust-100' },
};

export default function StatusPill({ status }: { status: StatusType }) {
  const config = statusConfig[status] ?? statusConfig.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      {status}
    </span>
  );
}

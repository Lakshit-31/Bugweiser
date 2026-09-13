interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  // Verification
  Verified: { bg: 'bg-leaf-50', text: 'text-leaf-600', border: 'border-leaf-200', dot: 'bg-leaf-500' },
  'Pending Verification': { bg: 'bg-marigold-50', text: 'text-marigold-700', border: 'border-marigold-200', dot: 'bg-marigold-500' },
  Rejected: { bg: 'bg-rust-50', text: 'text-rust-600', border: 'border-rust-200', dot: 'bg-rust-500' },

  // Account
  Active: { bg: 'bg-leaf-50', text: 'text-leaf-600', border: 'border-leaf-200', dot: 'bg-leaf-500' },
  Suspended: { bg: 'bg-rust-50', text: 'text-rust-600', border: 'border-rust-200', dot: 'bg-rust-500' },

  // Produce Moderation
  Approved: { bg: 'bg-leaf-50', text: 'text-leaf-600', border: 'border-leaf-200', dot: 'bg-leaf-500' },
  'Pending Approval': { bg: 'bg-marigold-50', text: 'text-marigold-700', border: 'border-marigold-200', dot: 'bg-marigold-500' },

  // Availability
  Available: { bg: 'bg-leaf-50', text: 'text-leaf-600', border: 'border-leaf-200', dot: 'bg-leaf-500' },
  Reserved: { bg: 'bg-marigold-50', text: 'text-marigold-700', border: 'border-marigold-200', dot: 'bg-marigold-500' },
  'Sold Out': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },

  // Order Lifecycle
  Requested: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', dot: 'bg-sky-500' },
  Accepted: { bg: 'bg-dusk-50', text: 'text-dusk-600', border: 'border-dusk-200', dot: 'bg-dusk-500' },
  Confirmed: { bg: 'bg-dusk-100', text: 'text-dusk-700', border: 'border-dusk-300', dot: 'bg-dusk-600' },
  'In Transit': { bg: 'bg-marigold-50', text: 'text-marigold-700', border: 'border-marigold-300', dot: 'bg-marigold-500' },
  Completed: { bg: 'bg-leaf-50', text: 'text-leaf-600', border: 'border-leaf-200', dot: 'bg-leaf-500' },
  Cancelled: { bg: 'bg-rust-50', text: 'text-rust-600', border: 'border-rust-200', dot: 'bg-rust-500' },

  // Complaints
  Open: { bg: 'bg-rust-50', text: 'text-rust-600', border: 'border-rust-200', dot: 'bg-rust-500' },
  'Under Review': { bg: 'bg-marigold-50', text: 'text-marigold-700', border: 'border-marigold-200', dot: 'bg-marigold-500' },
  Resolved: { bg: 'bg-leaf-50', text: 'text-leaf-600', border: 'border-leaf-200', dot: 'bg-leaf-500' },

  // Priority
  High: { bg: 'bg-rust-100', text: 'text-rust-700', border: 'border-rust-300', dot: 'bg-rust-600' },
  Medium: { bg: 'bg-marigold-100', text: 'text-marigold-800', border: 'border-marigold-300', dot: 'bg-marigold-500' },
  Low: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' },

  // Review Status
  Normal: { bg: 'bg-leaf-50', text: 'text-leaf-600', border: 'border-leaf-200', dot: 'bg-leaf-500' },
  Reported: { bg: 'bg-marigold-50', text: 'text-marigold-700', border: 'border-marigold-200', dot: 'bg-marigold-500' },
  Hidden: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300', dot: 'bg-gray-400' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusStyles[status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  };

  const py = size === 'sm' ? 'py-0.5 px-2 text-[11px]' : 'py-1 px-2.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${py} ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

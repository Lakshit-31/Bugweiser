import { useState } from 'react';
import { Star, MessageSquare, EyeOff, Flag, CheckCircle, Search, Calendar, User } from 'lucide-react';
import { adminService } from '../data/adminService';
import StatusBadge from '../components/StatusBadge';
import StarRating from '@/components/StarRating';
import { useToast } from '../components/Toast';

interface RatingsViewProps {
  searchQuery: string;
}

export default function RatingsView({ searchQuery }: RatingsViewProps) {
  const { addToast } = useToast();
  const reviews = adminService.getReviews();

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const query = localSearch || searchQuery;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8';

  const fiveStar = reviews.filter((r) => r.rating === 5).length;
  const fourStar = reviews.filter((r) => r.rating === 4).length;
  const threeStar = reviews.filter((r) => r.rating === 3).length;
  const twoStar = reviews.filter((r) => r.rating === 2).length;
  const oneStar = reviews.filter((r) => r.rating === 1).length;

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.reviewerName.toLowerCase().includes(query.toLowerCase()) ||
      r.targetUserName.toLowerCase().includes(query.toLowerCase()) ||
      r.comment.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: 'Normal' | 'Reported' | 'Hidden') => {
    adminService.updateReviewStatus(id, newStatus);
    addToast('Review Status Updated', `Review set to ${newStatus}.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* 5-Star Overview Header Banner */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-leaf-100 bg-leaf-50 p-6 text-center md:col-span-1">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-500 text-paper">
            <Star size={32} className="fill-paper" />
          </div>
          <p className="font-serif text-3xl font-bold text-leaf-800">{avgRating} / 5.0</p>
          <p className="mt-1 text-xs text-leaf-700 font-semibold">Average Mutual Trust Rating</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Based on {reviews.length} completed transactions</p>
        </div>

        {/* 5-Star Rating Distribution */}
        <div className="flex flex-col justify-center rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_3px_rgba(30,43,31,0.06)] md:col-span-2">
          <h4 className="font-serif text-sm font-bold text-ink mb-3">Rating Breakdown Distribution</h4>
          <div className="space-y-2 text-xs">
            {[
              { stars: 5, count: fiveStar },
              { stars: 4, count: fourStar },
              { stars: 3, count: threeStar },
              { stars: 2, count: twoStar },
              { stars: 1, count: oneStar },
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="w-12 font-bold text-ink">{item.stars} Stars</span>
                <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-marigold-400"
                    style={{ width: `${(item.count / Math.max(1, reviews.length)) * 100}%` }}
                  />
                </div>
                <span className="w-8 font-mono text-right text-gray-500 font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)] md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search reviews by reviewer, target user, or comment text..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-gray-400 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="all">All Review Statuses</option>
          <option value="Normal">Normal</option>
          <option value="Reported">Reported</option>
          <option value="Hidden">Hidden</option>
        </select>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
              review.status === 'Reported'
                ? 'border-marigold-200 bg-marigold-50/30'
                : review.status === 'Hidden'
                ? 'border-gray-200 bg-gray-50/60 opacity-60'
                : 'border-black/5 bg-white'
            }`}
          >
            <div>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Reviewer ({review.reviewerRole})
                  </span>
                  <p className="font-bold text-ink text-sm mt-0.5">{review.reviewerName}</p>
                </div>
                <StatusBadge status={review.status} size="sm" />
              </div>

              <div className="mb-2">
                <span className="text-[11px] text-gray-400 font-medium">Reviewed: </span>
                <span className="font-semibold text-dusk-700 text-xs">{review.targetUserName} ({review.targetUserRole})</span>
              </div>

              <div className="mb-3">
                <StarRating rating={review.rating} size={16} />
              </div>

              <p className="text-xs text-gray-700 leading-relaxed italic bg-paper/60 p-3 rounded-xl border border-black/5">
                "{review.comment}"
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Calendar size={12} /> {review.date}
              </span>

              {/* Admin Moderation Actions */}
              <div className="flex items-center gap-1">
                {review.status !== 'Hidden' ? (
                  <button
                    onClick={() => handleStatusChange(review.id, 'Hidden')}
                    title="Hide Inappropriate Review"
                    className="rounded-lg p-1.5 text-rust-500 hover:bg-rust-50 transition-colors"
                  >
                    <EyeOff size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(review.id, 'Normal')}
                    title="Restore Review"
                    className="rounded-lg p-1.5 text-leaf-600 hover:bg-leaf-50 transition-colors"
                  >
                    <CheckCircle size={15} />
                  </button>
                )}

                {review.status !== 'Reported' && (
                  <button
                    onClick={() => handleStatusChange(review.id, 'Reported')}
                    title="Flag for Admin Review"
                    className="rounded-lg p-1.5 text-marigold-600 hover:bg-marigold-50 transition-colors"
                  >
                    <Flag size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

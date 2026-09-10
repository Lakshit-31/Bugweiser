import { useState, useEffect } from 'react';
import { MessageSquare, Loader2, Calendar, Star } from 'lucide-react';
import type { Review } from '@/types';
import { getReviews } from '@/data/api';
import StarRating from '@/components/StarRating';
import EmptyState from '@/components/EmptyState';

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-ink">Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">Reviews you've left for buyers after completed orders.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-leaf-400" />
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={28} />}
          title="No reviews yet"
          description="After completing an order, share your experience with the buyer. Your reviews help other farmers choose trustworthy buyers."
        />
      ) : (
        <>
          {/* Summary */}
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-leaf-100 bg-leaf-50 px-6 py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-500 text-paper">
              <Star size={26} className="fill-paper" />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-leaf-700">{avgRating} / 5</p>
              <p className="text-sm text-leaf-600">Average rating across {reviews.length} review{reviews.length !== 1 && 's'}</p>
            </div>
          </div>

          {/* Reviews grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="card flex flex-col">
                {/* Buyer name + rating */}
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-semibold text-ink">{review.buyerName}</h3>
                  <StarRating rating={review.rating} />
                </div>

                {/* Comment */}
                <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
                  "{review.comment}"
                </p>

                {/* Date */}
                <div className="flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-400">
                  <Calendar size={12} />
                  {new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

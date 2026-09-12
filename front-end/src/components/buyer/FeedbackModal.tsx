import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react';
import type { BuyerReviewItem, BuyerOrder } from '@/types/buyer';

interface FeedbackModalProps {
  order: BuyerOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: BuyerReviewItem) => void;
}

const AVAILABLE_TAGS = [
  'Crisp Quality',
  'Exact Weighbridge Weight',
  'Prompt Dispatch',
  'Fair Price',
  'Low Moisture (<11%)',
  'Clean Gunny Bags',
  'Pesticide Safe',
  'Great Communication',
];

export default function FeedbackModal({
  order,
  isOpen,
  onClose,
  onSubmitReview,
}: FeedbackModalProps) {
  if (!isOpen || !order) return null;

  const [overallRating, setOverallRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [weightRating, setWeightRating] = useState<number>(5);
  const [timelinessRating, setTimelinessRating] = useState<number>(5);
  const [communicationRating, setCommunicationRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Crisp Quality', 'Exact Weighbridge Weight']);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newReview: BuyerReviewItem = {
        id: `rev-${Date.now()}`,
        farmerId: order.farmerId,
        farmerName: order.farmerName,
        cropName: order.cropName,
        orderId: order.orderId,
        overallRating,
        qualityRating,
        weightAccuracyRating: weightRating,
        timelinessRating,
        communicationRating,
        comment: comment || 'Smooth procurement with excellent crop specifications and honest weighing.',
        date: new Date().toISOString().split('T')[0],
        tags: selectedTags,
        helpfulCount: 1,
      };
      onSubmitReview(newReview);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const renderStars = (current: number, setFn: (n: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFn(star)}
            className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
          >
            <Star
              size={20}
              className={star <= current ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="my-8 w-full max-w-xl rounded-3xl border border-leaf-100 bg-white shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-paper/60">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-700">
              Post-Trade Evaluation
            </span>
            <h3 className="font-serif text-lg font-bold text-ink">
              Review Farmer & Produce
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Order Snapshot */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-ink">{order.cropName}</h4>
              <p className="text-[11px] text-gray-500">
                Farmer: <strong>{order.farmerName}</strong> • {order.quantity} {order.unit}
              </p>
            </div>
            <span className="rounded-lg bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-800">
              Delivered
            </span>
          </div>

          {/* Overall Rating */}
          <div className="rounded-2xl bg-amber-50/50 border border-amber-200/60 p-4 text-center">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-900 mb-2">
              Overall Trade Satisfaction
            </label>
            <div className="flex justify-center mb-1">
              {renderStars(overallRating, setOverallRating)}
            </div>
            <span className="text-xs font-bold text-amber-800">
              {overallRating === 5
                ? 'Outstanding - Exceeded Quality Expectations'
                : overallRating === 4
                ? 'Very Good - Met All Standards'
                : overallRating === 3
                ? 'Acceptable'
                : 'Sub-par'}
            </span>
          </div>

          {/* Detailed Pillars */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
              Multi-Metric Evaluation
            </span>

            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
              <span className="font-semibold text-gray-700">Produce Quality & Grade:</span>
              {renderStars(qualityRating, setQualityRating)}
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
              <span className="font-semibold text-gray-700">Weighbridge Accuracy:</span>
              {renderStars(weightRating, setWeightRating)}
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
              <span className="font-semibold text-gray-700">Dispatch & Transit Timeliness:</span>
              {renderStars(timelinessRating, setTimelinessRating)}
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
              <span className="font-semibold text-gray-700">Farmer Responsiveness:</span>
              {renderStars(communicationRating, setCommunicationRating)}
            </div>
          </div>

          {/* Tag Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Trade Highlights
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'border-leaf-600 bg-leaf-50 text-leaf-800'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Review */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Detailed Written Feedback
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the grain luster, moisture consistency, bagging quality, or interaction with the farmer..."
              className="w-full rounded-2xl border border-gray-200 bg-white p-3 text-xs text-ink focus:border-leaf-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-leaf-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-leaf-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <ThumbsUp size={14} /> Submit Verified Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

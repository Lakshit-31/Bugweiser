import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, IndianRupee, Shield, TrendingUp, Loader2, Users } from 'lucide-react';
import type { BuyerMatch, Produce } from '@/types';
import { getMatches, getProduce } from '@/data/api';
import MatchScoreRing from '@/components/MatchScoreRing';
import EmptyState from '@/components/EmptyState';

interface MatchesScreenProps {
  produceId: string;
  onBack: () => void;
}

export default function MatchesScreen({ produceId, onBack }: MatchesScreenProps) {
  const [matches, setMatches] = useState<BuyerMatch[]>([]);
  const [produce, setProduce] = useState<Produce | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMatches(produceId), getProduce()]).then(([matchData, produceData]) => {
      setMatches(matchData);
      setProduce(produceData.find((p) => p.id === produceId) ?? null);
      setLoading(false);
    });
  }, [produceId]);

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to Produce
      </button>

      {/* Produce header */}
      {produce && (
        <div className="mb-6 rounded-2xl border border-leaf-100 bg-leaf-50 px-5 py-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <h1 className="font-serif text-xl font-semibold text-leaf-700">{produce.cropName}</h1>
            <span className="text-sm text-leaf-600">
              {produce.quantity.toLocaleString()} {produce.unit} · Grade {produce.quality} · ₹{produce.expectedPrice}/{produce.unit}
            </span>
          </div>
        </div>
      )}

      <div className="mb-5 flex items-center gap-2">
        <Users size={20} className="text-leaf-500" />
        <h2 className="font-serif text-lg font-semibold text-ink">
          Buyer Matches {matches.length > 0 && `(${matches.length})`}
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-leaf-400" />
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="No buyer matches yet"
          description="We're actively searching for buyers interested in this crop. Check back soon — new matches appear automatically as buyers join the platform."
        />
      ) : (
        <div className="space-y-3">
          {matches.map((match, index) => (
            <div
              key={match.id}
              className="card flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Score ring */}
              <MatchScoreRing score={match.matchScore} size={60} />

              {/* Buyer info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-ink">{match.buyerName}</h3>
                  {index === 0 && (
                    <span className="shrink-0 rounded-full bg-leaf-500 px-2.5 py-0.5 text-xs font-semibold text-paper">
                      Best match
                    </span>
                  )}
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-leaf-400" />
                    {match.distance} km away
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield size={13} className="text-dusk-400" />
                    {match.reliability}% reliable
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee size={13} className="text-marigold-500" />
                    {match.offeredPrice}/{match.cropMatch.toLowerCase()}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-sm">
                  <TrendingUp size={14} className="text-leaf-500" />
                  <span className="text-gray-500">Est. net earnings:</span>
                  <span className="font-semibold text-leaf-600">
                    ₹{match.estimatedNetEarnings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Accept button */}
              <button className="btn-primary hidden shrink-0 sm:inline-flex">
                Accept
              </button>
              <button className="btn-primary shrink-0 px-3 sm:hidden">
                <ArrowLeft size={14} className="rotate-180" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

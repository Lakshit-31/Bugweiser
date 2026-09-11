import { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Package, IndianRupee, Loader2, Sprout, X, TrendingUp } from 'lucide-react';
import type { Produce } from '@/types';
import { getProduce, addProduce } from '@/data/api';
import StatusPill from '@/components/StatusPill';
import EmptyState from '@/components/EmptyState';

interface ProduceScreenProps {
  onViewMatches: (produceId: string) => void;
}

const qualityColors: Record<string, string> = {
  A: 'bg-leaf-50 text-leaf-600 border-leaf-100',
  B: 'bg-marigold-50 text-marigold-600 border-marigold-100',
  C: 'bg-rust-50 text-rust-500 border-rust-100',
};

/**
 * Dynamic crop image mapping helper.
 * Safely maps crop names dynamically using keyword matching so any crop
 * gets a matching real image, or returns null for fallback icon without throwing errors.
 */
function getCropImage(cropName?: string, itemImage?: string): string | null {
  if (itemImage) return itemImage;
  if (!cropName) return null;

  const lower = String(cropName).toLowerCase();

  if (lower.includes('wheat') || lower.includes('gehun') || lower.includes('गेहूं') || lower.includes('<ctrl42>ਕਣਕ')) {
    return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('tomato') || lower.includes('tamatar') || lower.includes('टमाटर') || lower.includes('ਟਮਾਟਰ')) {
    return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('onion') || lower.includes('pyaz') || lower.includes('प्याज') || lower.includes('ਪਿਆਜ਼')) {
    return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('rice') || lower.includes('basmati') || lower.includes('paddy') || lower.includes('चावल') || lower.includes('ਚੌਲ')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('mustard') || lower.includes('sarson') || lower.includes('सरसों') || lower.includes('ਸਰੋਂ')) {
    return 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('cotton') || lower.includes('kapas') || lower.includes('कपास') || lower.includes('ਕਪਾਹ')) {
    return 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('sugarcane') || lower.includes('ganna') || lower.includes('गन्ना') || lower.includes('ਗੰਨਾ')) {
    return 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('cumin') || lower.includes('jeera') || lower.includes('जीरा')) {
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('gram') || lower.includes('chana') || lower.includes('chickpea') || lower.includes('चना')) {
    return 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('bajra') || lower.includes('millet') || lower.includes('pearl') || lower.includes('बाजरा')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('potato') || lower.includes('aalu') || lower.includes('आलू')) {
    return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80';
  }
  if (lower.includes('soybean') || lower.includes('soya') || lower.includes('सोयाबीन')) {
    return 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80';
  }

  return null;
}

export default function ProduceScreen({ onViewMatches }: ProduceScreenProps) {
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getProduce()
      .then((data) => {
        setProduce(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching produce:', err);
        setProduce([]);
        setLoading(false);
      });
  }, []);

  const handleImageError = (id: string) => {
    if (!id) return;
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">My Produce</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your crop listings and find buyers.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary shrink-0">
          <Plus size={16} /> List new produce
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-leaf-400" />
        </div>
      ) : !produce || produce.length === 0 ? (
        <EmptyState
          icon={<Sprout size={28} />}
          title="No produce listed yet"
          description="Tap 'List new produce' to add your first crop — buyers will be matched to you automatically."
          action={
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={16} /> List new produce
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {produce.map((item, idx) => {
            if (!item) return null;
            const itemId = item.id || `item-${idx}`;
            const cropImageUrl = getCropImage(item.cropName, item.image);
            const hasImageFailed = Boolean(imageErrorMap[itemId]);
            const showImage = Boolean(cropImageUrl && !hasImageFailed);
            const qualityStyle = qualityColors[item.quality] || qualityColors['A'];

            const formattedHarvestDate = item.harvestDate
              ? new Date(item.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : 'N/A';

            return (
              <button
                key={itemId}
                onClick={() => onViewMatches(itemId)}
                className="card group text-left p-0 overflow-hidden flex flex-col justify-between hover:border-leaf-300"
              >
                <div>
                  {/* Produce Image / Dynamic Crop Photo Header */}
                  <div className="relative h-44 w-full bg-leaf-50/60 overflow-hidden border-b border-black/5 flex items-center justify-center">
                    {showImage ? (
                      <img
                        src={cropImageUrl!}
                        alt={item.cropName || 'Crop produce'}
                        onError={() => handleImageError(itemId)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      /* Neutral produce placeholder icon when image unavailable */
                      <div className="flex flex-col items-center justify-center text-leaf-600 gap-1.5 p-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-100/80 text-leaf-700">
                          <Sprout size={28} />
                        </div>
                        <span className="text-[11px] font-bold text-leaf-700 uppercase tracking-wider">
                          Agricultural Produce
                        </span>
                      </div>
                    )}

                    {/* Floating Status Pill over image */}
                    <div className="absolute top-3 right-3 z-10 shadow-xs">
                      <StatusPill status={item.status || 'Available'} />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Crop name + quality */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-ink group-hover:text-leaf-600 transition-colors leading-snug">
                          {item.cropName || 'Unnamed Crop'}
                        </h3>
                        <span className={`mt-1.5 inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${qualityStyle}`}>
                          Grade {item.quality || 'A'}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <MapPin size={14} className="text-leaf-500 shrink-0" />
                      <span className="truncate">{item.location || 'Location Not Specified'}</span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs bg-paper p-3 rounded-xl border border-leaf-100">
                      <div>
                        <span className="text-gray-400 font-medium">Quantity</span>
                        <p className="font-bold text-ink text-sm mt-0.5">
                          {typeof item.quantity === 'number' ? item.quantity.toLocaleString('en-IN') : item.quantity} {item.unit || 'kg'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Expected Price</span>
                        <p className="font-bold text-leaf-600 text-sm mt-0.5">₹{item.expectedPrice}/{item.unit || 'kg'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Available</span>
                        <p className="font-bold text-ink mt-0.5">
                          {typeof item.availableQuantity === 'number' ? item.availableQuantity.toLocaleString('en-IN') : item.availableQuantity} {item.unit || 'kg'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Harvest Date</span>
                        <p className="font-bold text-ink mt-0.5">
                          {formattedHarvestDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View matches CTA */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-bold text-leaf-600 group-hover:text-leaf-700">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp size={15} />
                      View buyer matches
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400">Match score available →</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {showForm && (
        <NewProduceForm
          onClose={() => setShowForm(false)}
          onCreated={(newItem) => {
            setProduce((prev) => [newItem, ...prev]);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

// --- New Produce Form Modal ---

function NewProduceForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (item: Produce) => void;
}) {
  const [form, setForm] = useState({
    cropName: '',
    quantity: '',
    unit: 'kg',
    quality: 'A' as 'A' | 'B' | 'C',
    expectedPrice: '',
    harvestDate: '',
    location: 'Gegal, Ajmer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cropName || !form.quantity || !form.expectedPrice || !form.harvestDate) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    const newItem = await addProduce({
      cropName: form.cropName,
      quantity: parseInt(form.quantity),
      unit: form.unit,
      quality: form.quality,
      expectedPrice: parseInt(form.expectedPrice),
      harvestDate: form.harvestDate,
      location: form.location,
    });
    setLoading(false);
    onCreated(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-ink">List New Produce</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-ink">Crop Name</label>
              <input
                value={form.cropName}
                onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                placeholder="e.g. Wheat, Mustard, Bajra, Tomatoes"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="500"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="input-field"
              >
                <option value="kg">kg</option>
                <option value="quintal">quintal</option>
                <option value="ton">ton</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-ink">Quality Grade</label>
              <div className="grid grid-cols-3 gap-2">
                {(['A', 'B', 'C'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, quality: g })}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                      form.quality === g
                        ? qualityColors[g]
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    Grade {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Expected Price (per {form.unit})</label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={form.expectedPrice}
                  onChange={(e) => setForm({ ...form, expectedPrice: e.target.value })}
                  placeholder="24"
                  className="input-field pl-9"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Harvest Date</label>
              <input
                type="date"
                value={form.harvestDate}
                onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-ink">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Village, District"
                className="input-field"
              />
            </div>
          </div>

          {error && <p className="text-sm text-rust-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><Package size={16} /> List Produce</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

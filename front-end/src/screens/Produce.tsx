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

export default function ProduceScreen({ onViewMatches }: ProduceScreenProps) {
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getProduce().then((data) => {
      setProduce(data);
      setLoading(false);
    });
  }, []);

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
      ) : produce.length === 0 ? (
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {produce.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewMatches(item.id)}
              className="card group text-left"
            >
              {/* Crop name + quality + status */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-leaf-600 transition-colors">
                    {item.cropName}
                  </h3>
                  <span className={`mt-1 inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${qualityColors[item.quality]}`}>
                    Grade {item.quality}
                  </span>
                </div>
                <StatusPill status={item.status} />
              </div>

              {/* Location */}
              <div className="mb-2.5 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin size={14} className="text-leaf-400" />
                {item.location}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Quantity</span>
                  <p className="font-semibold text-ink">{item.quantity.toLocaleString()} {item.unit}</p>
                </div>
                <div>
                  <span className="text-gray-400">Expected Price</span>
                  <p className="font-semibold text-ink">₹{item.expectedPrice}/{item.unit}</p>
                </div>
                <div>
                  <span className="text-gray-400">Available</span>
                  <p className="font-semibold text-ink">{item.availableQuantity.toLocaleString()} {item.unit}</p>
                </div>
                <div>
                  <span className="text-gray-400">Harvest Date</span>
                  <p className="font-semibold text-ink">
                    {new Date(item.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>

              {/* View matches CTA */}
              <div className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-sm font-medium text-leaf-600 group-hover:text-leaf-700">
                <TrendingUp size={14} />
                View buyer matches
              </div>
            </button>
          ))}
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
                placeholder="e.g. Wheat, Mustard, Bajra"
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

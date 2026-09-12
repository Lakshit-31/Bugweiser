import { useState, useEffect } from 'react';
import { User, MapPin, Sprout, LogOut, Loader2, Check, Plus, X, Phone } from 'lucide-react';
import type { Farmer, LanguageCode } from '@/types';
import { getFarmer, updateFarmer } from '@/data/api';
import { translations } from '@/data/translations';

interface ProfileScreenProps {
  onLogout: () => void;
  currentLang: LanguageCode;
}

export default function ProfileScreen({ onLogout, currentLang }: ProfileScreenProps) {
  const t = translations[currentLang] || translations.en;
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Farmer | null>(null);
  const [newCrop, setNewCrop] = useState('');

  useEffect(() => {
    getFarmer().then((data) => {
      setFarmer(data);
      setForm(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    const updated = await updateFarmer(form);
    setFarmer(updated);
    setForm(updated);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addCrop = () => {
    if (!form || !newCrop.trim()) return;
    if (form.cropsGrown.includes(newCrop.trim())) return;
    setForm({ ...form, cropsGrown: [...form.cropsGrown, newCrop.trim()] });
    setNewCrop('');
  };

  const removeCrop = (crop: string) => {
    if (!form) return;
    setForm({ ...form, cropsGrown: form.cropsGrown.filter((c) => c !== crop) });
  };

  if (loading || !farmer || !form) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-leaf-400" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">{t.myProfileTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.profileSub}</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-ghost shrink-0">
            {t.editProfileBtn}
          </button>
        )}
      </div>

      {/* Avatar + name header */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-500">
          {farmer.profilePhoto ? (
            <img src={farmer.profilePhoto} alt={farmer.name} className="h-full w-full rounded-2xl object-cover" />
          ) : (
            <User size={28} />
          )}
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink">{farmer.name}</h2>
          <p className="flex items-center gap-1.5 text-sm text-gray-500">
            <Phone size={13} /> +91 {farmer.phone}
          </p>
        </div>
      </div>

      {/* Farm details */}
      <div className="space-y-5 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-500">{t.fullNameLabel}</label>
          {editing ? (
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          ) : (
            <p className="font-medium text-ink">{farmer.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-500">{t.phoneLabel}</label>
          {editing ? (
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field"
            />
          ) : (
            <p className="font-medium text-ink">+91 {farmer.phone}</p>
          )}
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">{t.villageLabel}</label>
            {editing ? (
              <input
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="font-medium text-ink">{farmer.village}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">{t.districtLabel}</label>
            {editing ? (
              <input
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="font-medium text-ink">{farmer.district}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">{t.stateLabel}</label>
            {editing ? (
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="font-medium text-ink">{farmer.state}</p>
            )}
          </div>
        </div>

        {/* Farm location */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-500">{t.farmLocationLabel}</label>
          {editing ? (
            <input
              value={form.farmLocation}
              onChange={(e) => setForm({ ...form, farmLocation: e.target.value })}
              className="input-field"
            />
          ) : (
            <p className="flex items-center gap-1.5 font-medium text-ink">
              <MapPin size={14} className="text-leaf-400" />
              {farmer.farmLocation}
            </p>
          )}
        </div>

        {/* Farm size */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-500">{t.farmSizeLabel}</label>
          {editing ? (
            <input
              value={form.farmSize}
              onChange={(e) => setForm({ ...form, farmSize: e.target.value })}
              className="input-field"
            />
          ) : (
            <p className="flex items-center gap-1.5 font-medium text-ink">
              <Sprout size={14} className="text-leaf-400" />
              {farmer.farmSize}
            </p>
          )}
        </div>

        {/* Crops grown */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-500">{t.cropsGrownLabel}</label>
          <div className="flex flex-wrap gap-2">
            {form.cropsGrown.map((crop) => (
              <span
                key={crop}
                className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-50 px-3 py-1.5 text-sm font-medium text-leaf-600"
              >
                {crop}
                {editing && (
                  <button onClick={() => removeCrop(crop)} className="text-leaf-400 hover:text-rust-500">
                    <X size={14} />
                  </button>
                )}
              </span>
            ))}
            {editing && (
              <div className="flex items-center gap-1.5">
                <input
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCrop())}
                  placeholder="Add crop"
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-leaf-400 focus:outline-none"
                />
                <button onClick={addCrop} className="rounded-lg bg-leaf-500 p-1.5 text-paper hover:bg-leaf-600">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex items-center gap-3">
        {editing ? (
          <>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <>{t.saveChangesBtn}</>}
            </button>
            <button
              onClick={() => {
                setForm(farmer);
                setEditing(false);
              }}
              className="btn-ghost flex-1"
            >
              {t.cancel}
            </button>
          </>
        ) : (
          <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rust-200 bg-rust-50 px-5 py-2.5 text-sm font-semibold text-rust-500 transition-all hover:bg-rust-100">
            <LogOut size={16} /> {t.logout}
          </button>
        )}
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-slide-up rounded-xl bg-leaf-500 px-5 py-3 text-sm font-medium text-paper shadow-lg">
          <span className="flex items-center gap-2">
            <Check size={16} /> {t.profileSavedMsg}
          </span>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  User,
  Building,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Save,
  Sparkles,
  ArrowLeftRight,
} from 'lucide-react';
import { mockBuyerProfile } from '@/data/buyerMockData';
import type { LanguageCode } from '@/types';
import { buyerTranslations } from '@/data/buyerTranslations';

interface BuyerProfileScreenProps {
  onSwitchToFarmer: () => void;
  onLogout: () => void;
  currentLang?: LanguageCode;
}

export default function BuyerProfileScreen({
  onSwitchToFarmer,
  onLogout,
  currentLang = 'en',
}: BuyerProfileScreenProps) {
  const bt = buyerTranslations[currentLang] || buyerTranslations.en;
  const [profile, setProfile] = useState(mockBuyerProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Save Toast */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white shadow-xl flex items-center gap-2 animate-slide-up">
          <CheckCircle2 size={16} /> Profile & KYC details updated successfully!
        </div>
      )}

      {/* Header Profile Card */}
      <div className="rounded-3xl border border-leaf-100 bg-gradient-to-r from-leaf-800 to-emerald-900 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={profile.profilePhoto}
              alt={profile.name}
              className="h-20 w-20 rounded-2xl object-cover border-4 border-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold">{profile.name}</h1>
                <span className="rounded-md bg-emerald-400/20 px-2 py-0.5 text-[11px] font-extrabold text-emerald-300 border border-emerald-400/30">
                  GST Verified
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5 font-medium">
                {profile.businessName}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-200">
                <span>📍 {profile.city}, {profile.state}</span>
                <span>•</span>
                <span>⭐ Trust Score: <strong>{profile.trustScore}/100</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white hover:bg-white/25 transition-colors border border-white/20"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            <button
              type="button"
              onClick={onSwitchToFarmer}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeftRight size={14} /> Switch to Farmer
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Credentials Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
              <Building size={18} className="text-leaf-600" /> Enterprise Commercial Dossier
            </h3>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={13} /> Level-A Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Registered Business Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-semibold text-ink disabled:opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                GSTIN Number (Govt. e-Filing)
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.gstNumber}
                onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-mono font-bold text-ink disabled:opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Permanent Account Number (PAN)
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.panNumber}
                onChange={(e) => setProfile({ ...profile, panNumber: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-mono text-ink disabled:opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                FSSAI License Registration
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.fssaiLicense}
                onChange={(e) => setProfile({ ...profile, fssaiLicense: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-mono text-ink disabled:opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Contact Person Details */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2 border-b border-gray-100 pb-3">
            <User size={18} className="text-leaf-600" /> Authorized Representative
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-bold text-ink disabled:opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Mobile Number (OTP Registered)
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-mono text-ink disabled:opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-ink disabled:opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Warehouses and Sourcing Hubs */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2 border-b border-gray-100 pb-3">
            <MapPin size={18} className="text-leaf-600" /> Receiving Warehouses & Sourcing Facilities
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Primary Receiving Godown (Ajmer District)
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.primaryWarehouse}
                onChange={(e) => setProfile({ ...profile, primaryWarehouse: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-ink disabled:opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Secondary Regional Logistics Hub (Jaipur Corridor)
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.secondaryWarehouse}
                onChange={(e) => setProfile({ ...profile, secondaryWarehouse: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-ink disabled:opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Bank & Escrow Settlement Account */}
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-emerald-950 flex items-center gap-2">
              <CreditCard size={18} className="text-emerald-700" /> Linked Agri-Escrow Bank Account
            </h3>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Auto-Reconciliation Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px]">Bank Name</span>
              <span className="font-bold text-ink">{profile.bankDetails.bankName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Account Holder</span>
              <span className="font-bold text-ink">{profile.bankDetails.accountName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Account Number</span>
              <span className="font-mono font-bold text-ink">{profile.bankDetails.accountNumber}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">IFSC Code</span>
              <span className="font-mono font-bold text-ink">{profile.bankDetails.ifscCode}</span>
            </div>
          </div>
        </div>

        {/* Submit & Logout */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            Log Out of Buyer Account
          </button>

          {isEditing && (
            <button
              type="submit"
              className="rounded-xl bg-leaf-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-leaf-700 transition-colors flex items-center gap-1.5"
            >
              <Save size={15} /> Save Changes
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

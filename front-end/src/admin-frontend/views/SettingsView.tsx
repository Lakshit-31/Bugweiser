import { useState } from 'react';
import { Shield, Save, Bell, Lock, Sliders, User, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { adminService } from '../data/adminService';
import { useToast } from '../components/Toast';

export default function SettingsView() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState(adminService.getSettings());
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    adminService.updateSettings(settings);
    setTimeout(() => {
      setSaving(false);
      addToast('Settings Saved', 'Platform parameters updated successfully.', 'success');
    }, 400);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Admin Profile Card */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <User size={18} className="text-leaf-600" />
          <h3 className="font-serif text-lg font-bold text-ink">Admin Profile Details</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
          <div>
            <label className="font-semibold text-gray-700 block mb-1.5">Administrator Name</label>
            <input
              type="text"
              value={settings.adminName}
              onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
              className="w-full rounded-xl border border-gray-200 p-2.5 font-medium text-ink focus:border-leaf-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1.5">Admin Email</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              className="w-full rounded-xl border border-gray-200 p-2.5 font-medium text-ink focus:border-leaf-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1.5">Admin Phone</label>
            <input
              type="text"
              value={settings.adminPhone}
              onChange={(e) => setSettings({ ...settings, adminPhone: e.target.value })}
              className="w-full rounded-xl border border-gray-200 p-2.5 font-medium text-ink focus:border-leaf-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Platform & Algorithm Parameters */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Sliders size={18} className="text-leaf-600" />
          <h3 className="font-serif text-lg font-bold text-ink">Platform & Matching Parameters</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 text-xs sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700 block">Platform Service Fee / Commission (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.commissionPercent}
              onChange={(e) => setSettings({ ...settings, commissionPercent: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-200 p-2.5 font-medium text-ink focus:border-leaf-400 focus:outline-none"
            />
            <p className="text-[11px] text-gray-400">Zero commission mode for direct farmer benefits (default: 1.5%)</p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700 block">Maximum Buyer-Farmer Radius Distance (km)</label>
            <input
              type="number"
              value={settings.maxRadiusKm}
              onChange={(e) => setSettings({ ...settings, maxRadiusKm: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-200 p-2.5 font-medium text-ink focus:border-leaf-400 focus:outline-none"
            />
            <p className="text-[11px] text-gray-400">Maximum search radius threshold for local matching</p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100 sm:col-span-2">
            <div>
              <p className="font-bold text-ink">Auto-Approve Verified Farmer Produce Listings</p>
              <p className="text-[11px] text-gray-500">Automatically make listings live if farmer is KYC verified</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoApproveListings}
              onChange={(e) => setSettings({ ...settings, autoApproveListings: e.target.checked })}
              className="h-5 w-5 accent-leaf-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Verification & Security Settings */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Shield size={18} className="text-leaf-600" />
          <h3 className="font-serif text-lg font-bold text-ink">Verification & Security Controls</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
            <div>
              <p className="font-bold text-ink">Mandatory Buyer GST Verification</p>
              <p className="text-[11px] text-gray-500">Require GSTIN check before buyer can place digital orders</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireGstVerification}
              onChange={(e) => setSettings({ ...settings, requireGstVerification: e.target.checked })}
              className="h-5 w-5 accent-leaf-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
            <div>
              <p className="font-bold text-ink">Enforce Two-Factor Authentication (2FA) for Admins</p>
              <p className="text-[11px] text-gray-500">Require SMS/App OTP on every admin login</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
              className="h-5 w-5 accent-leaf-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={saving} className="btn-primary py-2.5 px-6">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Admin Settings'}
        </button>
      </div>
    </form>
  );
}

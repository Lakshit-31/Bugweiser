import { useState } from 'react';
import { Search, MapPin, Phone, Mail, Sprout, CheckCircle, Ban, Eye, ShieldCheck, Star, Calendar } from 'lucide-react';
import type { FarmerAdmin, VerificationStatus, AccountStatus } from '../types';
import { adminService } from '../data/adminService';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

interface FarmerManagementViewProps {
  searchQuery: string;
}

export default function FarmerManagementView({ searchQuery }: FarmerManagementViewProps) {
  const { addToast } = useToast();
  const farmers = adminService.getFarmers();

  const [localSearch, setLocalSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerAdmin | null>(null);

  const query = localSearch || searchQuery;

  const locations = Array.from(new Set(farmers.map((f) => f.district)));

  const filteredFarmers = farmers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.id.toLowerCase().includes(query.toLowerCase()) ||
      f.phone.includes(query) ||
      f.village.toLowerCase().includes(query.toLowerCase());

    const matchesLoc = locationFilter === 'all' || f.district === locationFilter;
    const matchesVer = verificationFilter === 'all' || f.verificationStatus === verificationFilter;
    const matchesAcc = accountFilter === 'all' || f.accountStatus === accountFilter;

    return matchesSearch && matchesLoc && matchesVer && matchesAcc;
  });

  const handleVerify = (id: string, name: string) => {
    adminService.updateFarmerVerification(id, 'Verified');
    addToast(`Farmer Verified`, `${name} (${id}) KYC has been approved.`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    adminService.updateFarmerVerification(id, 'Rejected');
    addToast(`Verification Rejected`, `${name} (${id}) verification marked rejected.`, 'error');
  };

  const handleToggleAccountStatus = (id: string, name: string, currentStatus: AccountStatus) => {
    const nextStatus: AccountStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    adminService.updateFarmerAccountStatus(id, nextStatus);
    if (nextStatus === 'Suspended') {
      addToast(`Account Suspended`, `${name} has been suspended from platform.`, 'error');
    } else {
      addToast(`Account Activated`, `${name} account is now active.`, 'success');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Controls & Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)] md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by Farmer ID, name, phone, or village..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-gray-400 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Districts</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Verification Status Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Verifications</option>
            <option value="Verified">Verified</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Account Status Filter */}
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Account Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Farmer Table */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Farmer Info</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Farm Details & Crops</th>
                <th className="py-3.5 px-4">Listings / Orders</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFarmers.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-leaf-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700 font-bold">
                        <Sprout size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-ink text-sm block">{farmer.name}</span>
                        <span className="font-mono text-[11px] text-gray-400">{farmer.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                      <MapPin size={13} className="text-leaf-500 shrink-0" />
                      {farmer.village}, {farmer.district}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-ink">{farmer.farmSize}</span>
                      <div className="flex flex-wrap gap-1">
                        {farmer.cropsGrown.slice(0, 3).map((c) => (
                          <span key={c} className="rounded bg-leaf-50 px-1.5 py-0.5 text-[10px] font-medium text-leaf-700">
                            {c}
                          </span>
                        ))}
                        {farmer.cropsGrown.length > 3 && (
                          <span className="text-[10px] text-gray-400 font-bold">
                            +{farmer.cropsGrown.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-700">
                      <span className="font-bold text-leaf-700">{farmer.totalListings}</span> listings ·{' '}
                      <span className="font-bold text-ink">{farmer.totalOrders}</span> orders
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-bold text-ink">
                      <Star size={13} className="fill-marigold-400 text-marigold-400" />
                      {farmer.rating}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={farmer.verificationStatus} />
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={farmer.accountStatus} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedFarmer(farmer)}
                        title="View Full Profile"
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-ink transition-colors"
                      >
                        <Eye size={16} />
                      </button>

                      {farmer.verificationStatus === 'Pending Verification' && (
                        <>
                          <button
                            onClick={() => handleVerify(farmer.id, farmer.name)}
                            title="Verify KYC"
                            className="rounded-lg p-1.5 text-leaf-600 hover:bg-leaf-50 transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(farmer.id, farmer.name)}
                            title="Reject Verification"
                            className="rounded-lg p-1.5 text-rust-500 hover:bg-rust-50 transition-colors"
                          >
                            <Ban size={16} />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleToggleAccountStatus(farmer.id, farmer.name, farmer.accountStatus)}
                        title={farmer.accountStatus === 'Active' ? 'Suspend Account' : 'Activate Account'}
                        className={`rounded-lg p-1.5 transition-colors ${
                          farmer.accountStatus === 'Active'
                            ? 'text-rust-500 hover:bg-rust-50'
                            : 'text-leaf-600 hover:bg-leaf-50'
                        }`}
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFarmers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No farmers found matching query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Farmer Profile Detail Modal */}
      {selectedFarmer && (
        <Modal
          isOpen={!!selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
          title={`Farmer Profile: ${selectedFarmer.name}`}
          subtitle={`ID: ${selectedFarmer.id} · Joined ${selectedFarmer.joinedDate}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 rounded-xl bg-leaf-50 p-4 border border-leaf-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-500 text-paper font-bold text-xl">
                <Sprout size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-bold text-ink">{selectedFarmer.name}</h4>
                  <StatusBadge status={selectedFarmer.verificationStatus} size="sm" />
                </div>
                <p className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                  <Phone size={12} /> +91 {selectedFarmer.phone} · <Mail size={12} /> {selectedFarmer.email}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-leaf-700 font-medium mt-1">
                  <MapPin size={12} /> {selectedFarmer.farmLocation}
                </p>
              </div>
            </div>

            {/* Farm Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Farm Size</span>
                <p className="font-bold text-ink text-sm mt-0.5">{selectedFarmer.farmSize}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Total Listings</span>
                <p className="font-bold text-leaf-700 text-sm mt-0.5">{selectedFarmer.totalListings} Listings</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Completed Orders</span>
                <p className="font-bold text-ink text-sm mt-0.5">{selectedFarmer.totalOrders} Orders</p>
              </div>
            </div>

            {/* Crops Grown */}
            <div>
              <h5 className="font-bold text-xs text-ink uppercase tracking-wider mb-2">Crops Grown</h5>
              <div className="flex flex-wrap gap-2">
                {selectedFarmer.cropsGrown.map((crop) => (
                  <span
                    key={crop}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-100 px-3 py-1.5 text-xs font-semibold text-leaf-800"
                  >
                    <Sprout size={14} className="text-leaf-600" />
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions in Modal */}
            <div className="flex gap-3 border-t border-gray-100 pt-4">
              {selectedFarmer.verificationStatus === 'Pending Verification' && (
                <button
                  onClick={() => {
                    handleVerify(selectedFarmer.id, selectedFarmer.name);
                    setSelectedFarmer(null);
                  }}
                  className="btn-primary flex-1"
                >
                  <ShieldCheck size={16} /> Approve KYC Verification
                </button>
              )}
              <button
                onClick={() => {
                  handleToggleAccountStatus(selectedFarmer.id, selectedFarmer.name, selectedFarmer.accountStatus);
                  setSelectedFarmer(null);
                }}
                className={`flex-1 btn-ghost ${
                  selectedFarmer.accountStatus === 'Active' ? 'text-rust-600 border-rust-200' : 'text-leaf-600'
                }`}
              >
                {selectedFarmer.accountStatus === 'Active' ? 'Suspend Farmer Account' : 'Reactivate Account'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

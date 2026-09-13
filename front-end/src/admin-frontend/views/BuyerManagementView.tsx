import { useState } from 'react';
import { Search, MapPin, Phone, Mail, ShoppingBag, CheckCircle, Ban, Eye, ShieldCheck, Star, FileText } from 'lucide-react';
import type { BuyerAdmin, VerificationStatus, AccountStatus } from '../types';
import { adminService } from '../data/adminService';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

interface BuyerManagementViewProps {
  searchQuery: string;
}

export default function BuyerManagementView({ searchQuery }: BuyerManagementViewProps) {
  const { addToast } = useToast();
  const buyers = adminService.getBuyers();

  const [localSearch, setLocalSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerAdmin | null>(null);

  const query = localSearch || searchQuery;

  const cities = Array.from(new Set(buyers.map((b) => b.city)));

  const filteredBuyers = buyers.filter((b) => {
    const matchesSearch =
      b.businessName.toLowerCase().includes(query.toLowerCase()) ||
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.id.toLowerCase().includes(query.toLowerCase()) ||
      b.gstNumber.toLowerCase().includes(query.toLowerCase()) ||
      b.phone.includes(query);

    const matchesCity = cityFilter === 'all' || b.city === cityFilter;
    const matchesVer = verificationFilter === 'all' || b.verificationStatus === verificationFilter;
    const matchesAcc = accountFilter === 'all' || b.accountStatus === accountFilter;

    return matchesSearch && matchesCity && matchesVer && matchesAcc;
  });

  const handleVerify = (id: string, name: string) => {
    adminService.updateBuyerVerification(id, 'Verified');
    addToast(`Buyer Verified`, `${name} GST & business profile approved.`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    adminService.updateBuyerVerification(id, 'Rejected');
    addToast(`Buyer Rejected`, `${name} verification rejected.`, 'error');
  };

  const handleToggleAccountStatus = (id: string, name: string, currentStatus: AccountStatus) => {
    const nextStatus: AccountStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    adminService.updateBuyerAccountStatus(id, nextStatus);
    if (nextStatus === 'Suspended') {
      addToast(`Buyer Suspended`, `${name} has been suspended.`, 'error');
    } else {
      addToast(`Buyer Activated`, `${name} is now active.`, 'success');
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)] md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by Buyer ID, Business name, GST number, or phone..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-gray-400 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

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

          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Buyer Table */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Business / Buyer</th>
                <th className="py-3.5 px-4">GST Number</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Required Crops</th>
                <th className="py-3.5 px-4">Reliability Score</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBuyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-dusk-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-dusk-100 text-dusk-700 font-bold">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-ink text-sm block">{buyer.businessName}</span>
                        <span className="text-gray-500 font-medium text-xs">{buyer.name} · {buyer.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-semibold text-dusk-700 bg-dusk-50 px-2 py-0.5 rounded border border-dusk-100">
                      {buyer.gstNumber}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                      <MapPin size={13} className="text-dusk-500 shrink-0" />
                      {buyer.city}, {buyer.state}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {buyer.requiredCrops.map((c) => (
                        <span key={c} className="rounded bg-dusk-50 px-1.5 py-0.5 text-[10px] font-medium text-dusk-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            buyer.reliabilityScore >= 90
                              ? 'bg-leaf-500'
                              : buyer.reliabilityScore >= 80
                              ? 'bg-marigold-500'
                              : 'bg-rust-500'
                          }`}
                          style={{ width: `${buyer.reliabilityScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-ink">{buyer.reliabilityScore}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={buyer.verificationStatus} />
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={buyer.accountStatus} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBuyer(buyer)}
                        title="View Full Profile"
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-ink transition-colors"
                      >
                        <Eye size={16} />
                      </button>

                      {buyer.verificationStatus === 'Pending Verification' && (
                        <>
                          <button
                            onClick={() => handleVerify(buyer.id, buyer.businessName)}
                            title="Approve GST & Verification"
                            className="rounded-lg p-1.5 text-leaf-600 hover:bg-leaf-50 transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(buyer.id, buyer.businessName)}
                            title="Reject Verification"
                            className="rounded-lg p-1.5 text-rust-500 hover:bg-rust-50 transition-colors"
                          >
                            <Ban size={16} />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleToggleAccountStatus(buyer.id, buyer.businessName, buyer.accountStatus)}
                        title={buyer.accountStatus === 'Active' ? 'Suspend Buyer' : 'Activate Buyer'}
                        className={`rounded-lg p-1.5 transition-colors ${
                          buyer.accountStatus === 'Active'
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

              {filteredBuyers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No buyers found matching query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buyer Detail Modal */}
      {selectedBuyer && (
        <Modal
          isOpen={!!selectedBuyer}
          onClose={() => setSelectedBuyer(null)}
          title={`Buyer Business Profile: ${selectedBuyer.businessName}`}
          subtitle={`Contact: ${selectedBuyer.name} · GST: ${selectedBuyer.gstNumber}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-xl bg-dusk-50 p-4 border border-dusk-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dusk-500 text-paper font-bold text-xl">
                <ShoppingBag size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-bold text-ink">{selectedBuyer.businessName}</h4>
                  <StatusBadge status={selectedBuyer.verificationStatus} size="sm" />
                </div>
                <p className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                  <Phone size={12} /> +91 {selectedBuyer.phone} · <Mail size={12} /> {selectedBuyer.email}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-dusk-700 font-semibold mt-1">
                  <FileText size={12} /> GSTIN: {selectedBuyer.gstNumber} · Location: {selectedBuyer.city}, {selectedBuyer.state}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Reliability Score</span>
                <p className="font-bold text-leaf-700 text-base mt-0.5">{selectedBuyer.reliabilityScore}%</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Buyer Rating</span>
                <p className="font-bold text-ink text-base mt-0.5 flex items-center gap-1">
                  <Star size={14} className="fill-marigold-400 text-marigold-400" /> {selectedBuyer.rating}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Total Orders</span>
                <p className="font-bold text-ink text-base mt-0.5">{selectedBuyer.totalOrders}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Total Volume</span>
                <p className="font-bold text-dusk-700 text-base mt-0.5">₹{(selectedBuyer.totalTransactionValue / 100000).toFixed(1)}L</p>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-xs text-ink uppercase tracking-wider mb-2">Required Commodities</h5>
              <div className="flex flex-wrap gap-2">
                {selectedBuyer.requiredCrops.map((crop) => (
                  <span
                    key={crop}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-dusk-100 px-3 py-1.5 text-xs font-semibold text-dusk-800"
                  >
                    <ShoppingBag size={14} className="text-dusk-600" />
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 pt-4">
              {selectedBuyer.verificationStatus === 'Pending Verification' && (
                <button
                  onClick={() => {
                    handleVerify(selectedBuyer.id, selectedBuyer.businessName);
                    setSelectedBuyer(null);
                  }}
                  className="btn-primary flex-1"
                >
                  <ShieldCheck size={16} /> Approve GST & Verification
                </button>
              )}
              <button
                onClick={() => {
                  handleToggleAccountStatus(selectedBuyer.id, selectedBuyer.businessName, selectedBuyer.accountStatus);
                  setSelectedBuyer(null);
                }}
                className={`flex-1 btn-ghost ${
                  selectedBuyer.accountStatus === 'Active' ? 'text-rust-600 border-rust-200' : 'text-leaf-600'
                }`}
              >
                {selectedBuyer.accountStatus === 'Active' ? 'Suspend Buyer Account' : 'Reactivate Buyer Account'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

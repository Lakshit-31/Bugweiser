import { useState } from 'react';
import { Search, MapPin, Package, CheckCircle, Ban, Trash2, Eye, Calendar, IndianRupee, Sprout } from 'lucide-react';
import type { ProduceAdmin } from '../types';
import { adminService } from '../data/adminService';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

interface ProduceManagementViewProps {
  searchQuery: string;
}

export default function ProduceManagementView({ searchQuery }: ProduceManagementViewProps) {
  const { addToast } = useToast();
  const produceList = adminService.getProduce();

  const [localSearch, setLocalSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduce, setSelectedProduce] = useState<ProduceAdmin | null>(null);

  const query = localSearch || searchQuery;

  const crops = Array.from(new Set(produceList.map((p) => p.cropName)));

  const filteredProduce = produceList.filter((p) => {
    const matchesSearch =
      p.cropName.toLowerCase().includes(query.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase());

    const matchesCrop = cropFilter === 'all' || p.cropName === cropFilter;
    const matchesStatus = statusFilter === 'all' || p.moderationStatus === statusFilter;

    return matchesSearch && matchesCrop && matchesStatus;
  });

  const handleApprove = (id: string, cropName: string) => {
    adminService.updateProduceModeration(id, 'Approved');
    addToast(`Listing Approved`, `${cropName} (${id}) is now live for buyers.`, 'success');
  };

  const handleReject = (id: string, cropName: string) => {
    adminService.updateProduceModeration(id, 'Rejected');
    addToast(`Listing Rejected`, `${cropName} (${id}) failed moderation check.`, 'error');
  };

  const handleRemove = (id: string, cropName: string) => {
    adminService.removeProduce(id);
    addToast(`Listing Removed`, `${cropName} (${id}) removed from marketplace.`, 'info');
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
            placeholder="Search produce by ID, crop name, farmer, or location..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-gray-400 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Crops</option>
            {crops.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Moderation Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Produce Table */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Listing ID & Crop</th>
                <th className="py-3.5 px-4">Farmer</th>
                <th className="py-3.5 px-4">Quantity & Grade</th>
                <th className="py-3.5 px-4">Expected Price</th>
                <th className="py-3.5 px-4">Harvest Date</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Moderation</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProduce.map((item) => (
                <tr key={item.id} className="hover:bg-leaf-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700 font-bold">
                        <Package size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-ink text-sm block">{item.cropName}</span>
                        <span className="font-mono text-[11px] text-gray-400">{item.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800">{item.farmerName}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{item.quantity.toLocaleString()} {item.unit}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                          item.quality === 'A'
                            ? 'bg-leaf-50 text-leaf-700 border-leaf-200'
                            : item.quality === 'B'
                            ? 'bg-marigold-50 text-marigold-800 border-marigold-200'
                            : 'bg-rust-50 text-rust-700 border-rust-200'
                        }`}
                      >
                        Grade {item.quality}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-serif font-bold text-leaf-700 text-sm">
                      ₹{item.expectedPrice}/{item.unit}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                      <Calendar size={13} className="text-gray-400" />
                      {new Date(item.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                      <MapPin size={13} className="text-leaf-500 shrink-0" />
                      {item.location}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.moderationStatus} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedProduce(item)}
                        title="View Produce Details"
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-ink transition-colors"
                      >
                        <Eye size={16} />
                      </button>

                      {item.moderationStatus !== 'Approved' && (
                        <button
                          onClick={() => handleApprove(item.id, item.cropName)}
                          title="Approve Listing"
                          className="rounded-lg p-1.5 text-leaf-600 hover:bg-leaf-50 transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      {item.moderationStatus !== 'Rejected' && (
                        <button
                          onClick={() => handleReject(item.id, item.cropName)}
                          title="Reject Listing"
                          className="rounded-lg p-1.5 text-rust-500 hover:bg-rust-50 transition-colors"
                        >
                          <Ban size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => handleRemove(item.id, item.cropName)}
                        title="Remove Listing Permanently"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-rust-50 hover:text-rust-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProduce.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No produce listings found matching query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Produce Detail Modal */}
      {selectedProduce && (
        <Modal
          isOpen={!!selectedProduce}
          onClose={() => setSelectedProduce(null)}
          title={`Produce Listing: ${selectedProduce.cropName}`}
          subtitle={`Listing ID: ${selectedProduce.id} · Farmer: ${selectedProduce.farmerName}`}
          maxWidth="xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-xl bg-leaf-50 p-4 border border-leaf-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-500 text-paper font-bold text-xl">
                <Package size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-bold text-ink">{selectedProduce.cropName}</h4>
                  <StatusBadge status={selectedProduce.moderationStatus} size="sm" />
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  Listed by <span className="font-bold text-ink">{selectedProduce.farmerName}</span> on {selectedProduce.listedDate}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-leaf-700 font-semibold mt-1">
                  <MapPin size={12} /> {selectedProduce.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Total Quantity</span>
                <p className="font-bold text-ink text-base mt-0.5">{selectedProduce.quantity} {selectedProduce.unit}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Quality Grade</span>
                <p className="font-bold text-leaf-700 text-base mt-0.5">Grade {selectedProduce.quality}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Expected Price</span>
                <p className="font-bold text-ink text-base mt-0.5">₹{selectedProduce.expectedPrice}/{selectedProduce.unit}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <span className="text-gray-400 font-medium">Harvest Date</span>
                <p className="font-bold text-gray-700 text-xs mt-1">{selectedProduce.harvestDate}</p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 pt-4">
              {selectedProduce.moderationStatus !== 'Approved' && (
                <button
                  onClick={() => {
                    handleApprove(selectedProduce.id, selectedProduce.cropName);
                    setSelectedProduce(null);
                  }}
                  className="btn-primary flex-1"
                >
                  <CheckCircle size={16} /> Approve & Publish Listing
                </button>
              )}
              {selectedProduce.moderationStatus !== 'Rejected' && (
                <button
                  onClick={() => {
                    handleReject(selectedProduce.id, selectedProduce.cropName);
                    setSelectedProduce(null);
                  }}
                  className="btn-ghost flex-1 text-rust-600 border-rust-200"
                >
                  <Ban size={16} /> Reject Listing
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

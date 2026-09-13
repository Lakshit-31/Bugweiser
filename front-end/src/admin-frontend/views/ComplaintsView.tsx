import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Eye, ShieldAlert, Calendar, MessageSquare, Ban } from 'lucide-react';
import type { ComplaintAdmin } from '../types';
import { adminService } from '../data/adminService';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

interface ComplaintsViewProps {
  searchQuery: string;
}

export default function ComplaintsView({ searchQuery }: ComplaintsViewProps) {
  const { addToast } = useToast();
  const complaints = adminService.getComplaints();

  const [localSearch, setLocalSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintAdmin | null>(null);
  const [resolutionInput, setResolutionInput] = useState('');

  const query = localSearch || searchQuery;

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.reportedUserName.toLowerCase().includes(query.toLowerCase()) ||
      c.reporterName.toLowerCase().includes(query.toLowerCase()) ||
      c.issueCategory.toLowerCase().includes(query.toLowerCase());

    const matchesPrio = priorityFilter === 'all' || c.priority === priorityFilter;
    const matchesStat = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesPrio && matchesStat;
  });

  const handleResolve = (id: string, notes: string) => {
    adminService.updateComplaintStatus(id, 'Resolved', notes);
    addToast('Dispute Resolved', `Complaint ${id} marked as resolved.`, 'success');
    setSelectedComplaint(null);
    setResolutionInput('');
  };

  const handleReject = (id: string) => {
    adminService.updateComplaintStatus(id, 'Rejected', 'Dismissed by admin moderation.');
    addToast('Complaint Rejected', `Complaint ${id} has been dismissed.`, 'info');
    setSelectedComplaint(null);
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
            placeholder="Search reports by Report ID, reported user, reporter, or issue category..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-gray-400 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Report ID & Category</th>
                <th className="py-3.5 px-4">Reported User</th>
                <th className="py-3.5 px-4">Reporter</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-rust-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rust-100 text-rust-700 font-bold">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-ink text-sm block">{c.issueCategory}</span>
                        <span className="font-mono text-[11px] text-gray-400">{c.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800 block">{c.reportedUserName}</span>
                    <span className="text-[11px] text-gray-400 capitalize">{c.reportedUserRole}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800 block">{c.reporterName}</span>
                    <span className="text-[11px] text-gray-400 capitalize">{c.reporterRole}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                      <Calendar size={13} className="text-gray-400" />
                      {c.date}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={c.priority} />
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={c.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setResolutionInput(c.resolutionNotes || '');
                      }}
                      className="btn-ghost text-xs py-1.5 px-3"
                    >
                      <Eye size={14} /> Resolve Dispute
                    </button>
                  </td>
                </tr>
              ))}

              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No complaints found matching query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Detail & Resolution Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Dispute Ticket: ${selectedComplaint.id}`}
          subtitle={`Category: ${selectedComplaint.issueCategory} · Priority: ${selectedComplaint.priority}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            <div className="rounded-xl bg-rust-50 p-4 border border-rust-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-rust-800 text-sm">{selectedComplaint.issueCategory}</span>
                <StatusBadge status={selectedComplaint.status} size="sm" />
              </div>
              <p className="text-rust-900 leading-relaxed font-medium">
                "{selectedComplaint.description}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/60">
                <span className="text-gray-400 font-medium">Reported Party</span>
                <p className="font-bold text-ink text-sm mt-0.5">{selectedComplaint.reportedUserName}</p>
                <span className="text-[11px] text-gray-500 capitalize">{selectedComplaint.reportedUserRole}</span>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/60">
                <span className="text-gray-400 font-medium">Filing Party</span>
                <p className="font-bold text-ink text-sm mt-0.5">{selectedComplaint.reporterName}</p>
                <span className="text-[11px] text-gray-500 capitalize">{selectedComplaint.reporterRole}</span>
              </div>
            </div>

            {/* Resolution Input */}
            <div className="space-y-1.5">
              <label className="font-bold text-ink block">Admin Resolution Notes</label>
              <textarea
                rows={3}
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder="Enter formal resolution terms or warning notice..."
                className="w-full rounded-xl border border-gray-200 p-3 text-xs text-ink focus:border-leaf-400 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 border-t border-gray-100 pt-3">
              <button
                onClick={() => handleResolve(selectedComplaint.id, resolutionInput)}
                className="btn-primary flex-1"
              >
                <CheckCircle size={16} /> Mark Resolved
              </button>
              <button
                onClick={() => handleReject(selectedComplaint.id)}
                className="btn-ghost flex-1 text-rust-600 border-rust-200"
              >
                <Ban size={16} /> Dismiss Ticket
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

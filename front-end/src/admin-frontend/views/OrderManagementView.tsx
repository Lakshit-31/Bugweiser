import { useState } from 'react';
import { Search, ClipboardList, Eye, IndianRupee, Calendar, ShoppingBag, Sprout, CheckCircle2 } from 'lucide-react';
import type { OrderAdmin, OrderStatus } from '../types';
import { adminService } from '../data/adminService';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import OrderTimeline from '../components/OrderTimeline';
import { useToast } from '../components/Toast';

interface OrderManagementViewProps {
  searchQuery: string;
}

const statusOptions: ('All' | OrderStatus)[] = [
  'All',
  'Requested',
  'Accepted',
  'Confirmed',
  'In Transit',
  'Completed',
  'Cancelled',
];

export default function OrderManagementView({ searchQuery }: OrderManagementViewProps) {
  const { addToast } = useToast();
  const orders = adminService.getOrders();

  const [localSearch, setLocalSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderAdmin | null>(null);

  const query = localSearch || searchQuery;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(query.toLowerCase()) ||
      o.farmerName.toLowerCase().includes(query.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(query.toLowerCase()) ||
      o.cropName.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusOverride = (id: string, newStatus: OrderStatus) => {
    adminService.updateOrderStatus(id, newStatus, `Admin override to ${newStatus}`);
    addToast(`Order Status Updated`, `Order ${id} set to ${newStatus}.`, 'success');
    if (selectedOrder && selectedOrder.orderId === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Pills */}
      <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(30,43,31,0.06)] md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by Order ID, farmer, buyer, or crop..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-gray-400 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="scrollbar-hide flex gap-1.5 overflow-x-auto text-xs">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-full px-3 py-1.5 font-semibold transition-all shrink-0 ${
                filterStatus === status
                  ? 'bg-dusk-500 text-paper shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_3px_rgba(30,43,31,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID & Crop</th>
                <th className="py-3.5 px-4">Farmer</th>
                <th className="py-3.5 px-4">Buyer</th>
                <th className="py-3.5 px-4">Quantity & Rate</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Order Date</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-sky-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-dusk-100 text-dusk-700 font-bold">
                        <ClipboardList size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-ink text-sm block">{order.cropName}</span>
                        <span className="font-mono text-[11px] text-gray-400">{order.orderId}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800 flex items-center gap-1">
                      <Sprout size={13} className="text-leaf-600" />
                      {order.farmerName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800 flex items-center gap-1">
                      <ShoppingBag size={13} className="text-dusk-600" />
                      {order.buyerName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-ink">{order.quantity} {order.unit}</span>
                    <span className="text-gray-400 font-medium text-[11px] block">
                      @ ₹{order.agreedPrice}/{order.unit}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-serif font-bold text-leaf-700 text-sm flex items-center">
                      <IndianRupee size={14} />
                      {order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-gray-600 font-medium">
                      <Calendar size={13} className="text-gray-400" />
                      {order.orderDate}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn-ghost text-xs py-1.5 px-3"
                    >
                      <Eye size={14} /> View Timeline
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No orders found matching query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Timeline Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Lifecycle Contract: ${selectedOrder.orderId}`}
          subtitle={`Crop: ${selectedOrder.cropName} · Total: ₹${selectedOrder.totalAmount.toLocaleString('en-IN')}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Visual Stepper Timeline */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
              <h4 className="font-serif text-sm font-bold text-ink mb-2">Visual Order Lifecycle Tracker</h4>
              <OrderTimeline currentStatus={selectedOrder.status} history={selectedOrder.statusHistory} />
            </div>

            {/* Farmer & Buyer Cards */}
            <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              <div className="rounded-xl border border-leaf-100 bg-leaf-50/50 p-4">
                <span className="text-xs font-bold text-leaf-700 uppercase tracking-wider block mb-1">
                  Farmer Details
                </span>
                <p className="font-bold text-ink text-sm">{selectedOrder.farmerName}</p>
                <p className="text-gray-500 mt-1">ID: {selectedOrder.farmerId}</p>
              </div>

              <div className="rounded-xl border border-dusk-100 bg-dusk-50/50 p-4">
                <span className="text-xs font-bold text-dusk-700 uppercase tracking-wider block mb-1">
                  Buyer Details
                </span>
                <p className="font-bold text-ink text-sm">{selectedOrder.buyerName}</p>
                <p className="text-gray-500 mt-1">ID: {selectedOrder.buyerId}</p>
              </div>
            </div>

            {/* Admin Override Dropdown Actions */}
            <div className="border-t border-gray-100 pt-4">
              <h5 className="font-bold text-xs text-ink uppercase tracking-wider mb-2">
                Admin Status Override Actions
              </h5>
              <div className="flex flex-wrap gap-2">
                {(['Requested', 'Accepted', 'Confirmed', 'In Transit', 'Completed', 'Cancelled'] as OrderStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      disabled={selectedOrder.status === st}
                      onClick={() => handleStatusOverride(selectedOrder.orderId, st)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        selectedOrder.status === st
                          ? 'bg-dusk-700 text-paper cursor-default'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

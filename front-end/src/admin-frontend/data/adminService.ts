import type {
  FarmerAdmin,
  BuyerAdmin,
  ProduceAdmin,
  OrderAdmin,
  TransactionAdmin,
  RatingReviewAdmin,
  ComplaintAdmin,
  AdminSettings,
  VerificationStatus,
  AccountStatus,
  OrderStatus,
} from '../types';
import {
  initialFarmers,
  initialBuyers,
  initialProduce,
  mockSmartMatches,
  initialOrders,
  initialTransactions,
  initialReviews,
  initialComplaints,
  mockAnalytics,
  initialSettings,
} from './mockAdminData';

const STORAGE_KEYS = {
  FARMERS: 'moolya_admin_farmers_v1',
  BUYERS: 'moolya_admin_buyers_v1',
  PRODUCE: 'moolya_admin_produce_v1',
  ORDERS: 'moolya_admin_orders_v1',
  TRANSACTIONS: 'moolya_admin_txns_v1',
  REVIEWS: 'moolya_admin_reviews_v1',
  COMPLAINTS: 'moolya_admin_complaints_v1',
  SETTINGS: 'moolya_admin_settings_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Silent fail fallback
  }
}

type Listener = () => void;
const listeners = new Set<Listener>();

export const adminService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify() {
    listeners.forEach((l) => l());
  },

  // --- Farmers ---
  getFarmers(): FarmerAdmin[] {
    return loadStorage(STORAGE_KEYS.FARMERS, initialFarmers);
  },
  updateFarmerVerification(id: string, status: VerificationStatus) {
    const list = this.getFarmers().map((f) =>
      f.id === id ? { ...f, verificationStatus: status } : f
    );
    saveStorage(STORAGE_KEYS.FARMERS, list);
    this.notify();
  },
  updateFarmerAccountStatus(id: string, status: AccountStatus) {
    const list = this.getFarmers().map((f) =>
      f.id === id ? { ...f, accountStatus: status } : f
    );
    saveStorage(STORAGE_KEYS.FARMERS, list);
    this.notify();
  },

  // --- Buyers ---
  getBuyers(): BuyerAdmin[] {
    return loadStorage(STORAGE_KEYS.BUYERS, initialBuyers);
  },
  updateBuyerVerification(id: string, status: VerificationStatus) {
    const list = this.getBuyers().map((b) =>
      b.id === id ? { ...b, verificationStatus: status } : b
    );
    saveStorage(STORAGE_KEYS.BUYERS, list);
    this.notify();
  },
  updateBuyerAccountStatus(id: string, status: AccountStatus) {
    const list = this.getBuyers().map((b) =>
      b.id === id ? { ...b, accountStatus: status } : b
    );
    saveStorage(STORAGE_KEYS.BUYERS, list);
    this.notify();
  },

  // --- Produce ---
  getProduce(): ProduceAdmin[] {
    return loadStorage(STORAGE_KEYS.PRODUCE, initialProduce);
  },
  updateProduceModeration(id: string, status: 'Approved' | 'Pending Approval' | 'Rejected') {
    const list = this.getProduce().map((p) =>
      p.id === id ? { ...p, moderationStatus: status } : p
    );
    saveStorage(STORAGE_KEYS.PRODUCE, list);
    this.notify();
  },
  removeProduce(id: string) {
    const list = this.getProduce().filter((p) => p.id !== id);
    saveStorage(STORAGE_KEYS.PRODUCE, list);
    this.notify();
  },

  // --- Smart Matches ---
  getSmartMatches() {
    return mockSmartMatches;
  },

  // --- Orders ---
  getOrders(): OrderAdmin[] {
    return loadStorage(STORAGE_KEYS.ORDERS, initialOrders);
  },
  updateOrderStatus(id: string, status: OrderStatus, note?: string) {
    const list = this.getOrders().map((o) => {
      if (o.orderId === id) {
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
        return {
          ...o,
          status,
          statusHistory: [...o.statusHistory, { status, timestamp, note }],
        };
      }
      return o;
    });
    saveStorage(STORAGE_KEYS.ORDERS, list);
    this.notify();
  },

  // --- Transactions ---
  getTransactions(): TransactionAdmin[] {
    return loadStorage(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
  },

  // --- Reviews ---
  getReviews(): RatingReviewAdmin[] {
    return loadStorage(STORAGE_KEYS.REVIEWS, initialReviews);
  },
  updateReviewStatus(id: string, status: 'Normal' | 'Reported' | 'Hidden') {
    const list = this.getReviews().map((r) =>
      r.id === id ? { ...r, status } : r
    );
    saveStorage(STORAGE_KEYS.REVIEWS, list);
    this.notify();
  },

  // --- Complaints ---
  getComplaints(): ComplaintAdmin[] {
    return loadStorage(STORAGE_KEYS.COMPLAINTS, initialComplaints);
  },
  updateComplaintStatus(
    id: string,
    status: 'Open' | 'Under Review' | 'Resolved' | 'Rejected',
    notes?: string
  ) {
    const list = this.getComplaints().map((c) =>
      c.id === id ? { ...c, status, resolutionNotes: notes || c.resolutionNotes } : c
    );
    saveStorage(STORAGE_KEYS.COMPLAINTS, list);
    this.notify();
  },

  // --- Analytics ---
  getAnalytics() {
    return mockAnalytics;
  },

  // --- Settings ---
  getSettings(): AdminSettings {
    return loadStorage(STORAGE_KEYS.SETTINGS, initialSettings);
  },
  updateSettings(settings: Partial<AdminSettings>) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    saveStorage(STORAGE_KEYS.SETTINGS, updated);
    this.notify();
  },
};

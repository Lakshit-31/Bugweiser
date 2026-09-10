export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface Farmer {
  name: string;
  phone: string;
  profilePhoto: string;
  state: string;
  district: string;
  village: string;
  farmLocation: string;
  farmSize: string;
  cropsGrown: string[];
}

export interface Buyer {
  name: string;
  phone: string;
  profilePhoto: string;
  businessName: string;
  state: string;
  district: string;
  city: string;
  gstNumber: string;
}

export interface AdminUser {
  name: string;
  phone: string;
  email: string;
  role: 'admin';
}

export interface Produce {
  id: string;
  cropName: string;
  quantity: number;
  unit: string;
  quality: 'A' | 'B' | 'C';
  expectedPrice: number;
  harvestDate: string;
  location: string;
  availableQuantity: number;
  status: 'Available' | 'Reserved' | 'Sold Out';
}

export interface BuyerMatch {
  id: string;
  produceId: string;
  buyerName: string;
  cropMatch: string;
  quantityMatch: number;
  distance: number;
  offeredPrice: number;
  reliability: number;
  matchScore: number;
  estimatedNetEarnings: number;
}

export interface Order {
  orderId: string;
  buyerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  agreedPrice: number;
  totalAmount: number;
  orderDate: string;
  status: 'Pending' | 'Accepted' | 'Confirmed' | 'In Transit' | 'Completed' | 'Cancelled';
}

export interface Transaction {
  transactionId: string;
  buyerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  amount: number;
  date: string;
  paymentStatus: 'Received' | 'Processing' | 'Pending';
}

export interface Review {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
}

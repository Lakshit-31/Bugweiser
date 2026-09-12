import type { Produce, Review } from './index';

export type BuyerScreenName =
  | 'buyer-dashboard'
  | 'buyer-marketplace'
  | 'buyer-requirements'
  | 'buyer-compare'
  | 'buyer-chat'
  | 'buyer-orders'
  | 'buyer-transactions'
  | 'buyer-reviews'
  | 'buyer-profile';

export interface BuyerRequirement {
  id: string;
  cropName: string;
  category: 'Grains' | 'Vegetables' | 'Oilseeds' | 'Commercial' | 'Pulses' | 'Spices';
  quantity: number;
  unit: string;
  preferredPrice: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C' | 'Organic';
  preferredLocation: string;
  maxDistanceKm: number;
  deliveryDate: string;
  paymentTerms: string;
  status: 'Open' | 'Matching' | 'Fulfilled' | 'Expired';
  createdAt: string;
  matchedListingsCount: number;
  notes?: string;
}

export interface FarmerProfileExtended {
  id: string;
  name: string;
  phone: string;
  profilePhoto: string;
  state: string;
  district: string;
  village: string;
  farmLocation: string;
  farmSize: string;
  experienceYears: number;
  verificationBadges: string[];
  reliabilityScore: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  rating: number;
  totalDealsCompleted: number;
  bio: string;
  bankVerified: boolean;
  cropsGrown: string[];
  activeListings?: Produce[];
  recentReviews?: Review[];
}

export interface PriceComparisonItem {
  farmerId: string;
  farmerName: string;
  cropName: string;
  produceId: string;
  basePrice: number; // per unit
  mandiPrice: number; // reference per unit
  quantityAvailable: number;
  unit: string;
  quality: 'Grade A' | 'Grade B' | 'Grade C' | 'Organic';
  distanceKm: number;
  freightPerUnit: number;
  totalLandedCost: number;
  netSavingsVsMandi: number;
  matchScore: number;
  farmerRating: number;
  harvestDate: string;
  isRecommended?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'farmer';
  text: string;
  timestamp: string;
  type?: 'text' | 'offer' | 'counter_offer' | 'system';
  offerDetails?: {
    crop: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalAmount: number;
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
  };
}

export interface ChatConversation {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerAvatar: string;
  cropTopic: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  produceId?: string;
  messages: ChatMessage[];
}

export interface BuyerOrder {
  orderId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  cropName: string;
  cropImage?: string;
  quantity: number;
  unit: string;
  agreedPrice: number;
  freightAmount: number;
  escrowFee: number;
  totalAmount: number;
  orderDate: string;
  expectedDeliveryDate: string;
  deliveryAddress: string;
  logisticsMethod: 'Buyer Pickup' | 'Farmer Dispatch' | 'Moolya Verified Freight';
  status: 'Pending' | 'Accepted' | 'In Transit' | 'Completed' | 'Rejected';
  trackingStep: 1 | 2 | 3 | 4 | 5; // 1: Placed, 2: Accepted, 3: Quality Check, 4: In Transit, 5: Delivered
  escrowStatus: 'Held in Escrow' | 'Released to Farmer' | 'Refunded to Buyer' | 'Awaiting Payment';
  rejectionReason?: string;
}

export interface BuyerTransaction {
  transactionId: string;
  orderId: string;
  farmerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  amount: number;
  date: string;
  type: 'Escrow Deposit' | 'Settlement Release' | 'Refund' | 'Logistics Fee';
  paymentMode: 'UPI' | 'NEFT / RTGS' | 'Agri-Escrow Wallet' | 'Corporate Card';
  paymentStatus: 'Received' | 'Processing' | 'Pending' | 'Settled';
  receiptUrl?: string;
}

export interface BuyerReviewItem {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  orderId: string;
  overallRating: number;
  qualityRating: number;
  weightAccuracyRating: number;
  timelinessRating: number;
  communicationRating: number;
  comment: string;
  date: string;
  tags: string[];
  helpfulCount: number;
}

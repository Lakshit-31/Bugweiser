export type AdminTab =
  | 'dashboard'
  | 'farmers'
  | 'buyers'
  | 'produce'
  | 'matching'
  | 'orders'
  | 'transactions'
  | 'ratings'
  | 'complaints'
  | 'analytics'
  | 'settings';

export type VerificationStatus = 'Verified' | 'Pending Verification' | 'Rejected';
export type AccountStatus = 'Active' | 'Suspended';

export interface FarmerAdmin {
  id: string;
  name: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  village: string;
  farmLocation: string;
  farmSize: string;
  cropsGrown: string[];
  totalListings: number;
  totalOrders: number;
  rating: number;
  verificationStatus: VerificationStatus;
  accountStatus: AccountStatus;
  joinedDate: string;
}

export interface BuyerAdmin {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  city: string;
  gstNumber: string;
  requiredCrops: string[];
  requiredQuantityKg: number;
  preferredLocations: string[];
  totalOrders: number;
  totalTransactionValue: number;
  reliabilityScore: number;
  rating: number;
  verificationStatus: VerificationStatus;
  accountStatus: AccountStatus;
  joinedDate: string;
}

export interface ProduceAdmin {
  id: string;
  cropName: string;
  farmerId: string;
  farmerName: string;
  quantity: number;
  unit: string;
  quality: 'A' | 'B' | 'C';
  expectedPrice: number;
  harvestDate: string;
  location: string;
  availableQuantity: number;
  availabilityStatus: 'Available' | 'Reserved' | 'Sold Out';
  moderationStatus: 'Approved' | 'Pending Approval' | 'Rejected';
  listedDate: string;
}

export interface MatchScoreBreakdown {
  cropMatchScore: number;
  quantityMatchScore: number;
  distanceScore: number;
  priceScore: number;
  prevTransactionsScore: number;
  responseRateScore: number;
  reliabilityScore: number;
  totalMatchScore: number;
  distanceKm: number;
  offeredPrice: number;
  expectedPrice: number;
  transportCostPerKg: number;
  estimatedNetEarnings: number;
}

export interface RecommendedFarmerMatch {
  farmerId: string;
  farmerName: string;
  location: string;
  breakdown: MatchScoreBreakdown;
}

export interface SmartMatchRequirement {
  buyerId: string;
  buyerName: string;
  businessName: string;
  cropName: string;
  requiredQuantityKg: number;
  preferredLocation: string;
  budgetPricePerKg: number;
  recommendedFarmers: RecommendedFarmerMatch[];
}

export type OrderStatus = 'Requested' | 'Accepted' | 'Confirmed' | 'In Transit' | 'Completed' | 'Cancelled';

export interface OrderAdmin {
  orderId: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  agreedPrice: number;
  totalAmount: number;
  orderDate: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[];
}

export interface TransactionAdmin {
  transactionId: string;
  orderId: string;
  farmerName: string;
  buyerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  amount: number;
  date: string;
  paymentStatus: 'Completed' | 'Pending' | 'Processing' | 'Failed';
}

export interface RatingReviewAdmin {
  id: string;
  reviewerName: string;
  reviewerRole: 'farmer' | 'buyer';
  targetUserName: string;
  targetUserRole: 'farmer' | 'buyer';
  rating: number;
  comment: string;
  date: string;
  status: 'Normal' | 'Reported' | 'Hidden';
}

export interface ComplaintAdmin {
  id: string;
  reportedUserName: string;
  reportedUserRole: 'farmer' | 'buyer';
  reporterName: string;
  reporterRole: 'farmer' | 'buyer';
  issueCategory: string;
  description: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Under Review' | 'Resolved' | 'Rejected';
  resolutionNotes?: string;
}

export interface AnalyticsData {
  timeframe: 'Today' | '7 Days' | '30 Days' | '3 Months' | '1 Year';
  farmerRegistrations: { date: string; value: number }[];
  buyerRegistrations: { date: string; value: number }[];
  orderTrends: { date: string; count: number; volume: number }[];
  mostListedCrops: { crop: string; listings: number; totalQty: number }[];
  mostDemandedCrops: { crop: string; buyerDemandKg: number }[];
  topLocations: { location: string; activeUsers: number }[];
  averageCropPrices: { crop: string; pricePerKg: number }[];
}

export interface AdminSettings {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  commissionPercent: number;
  maxRadiusKm: number;
  autoApproveListings: boolean;
  notifyOnNewComplaint: boolean;
  notifyOnHighValueOrder: boolean;
  requireGstVerification: boolean;
  twoFactorAuth: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

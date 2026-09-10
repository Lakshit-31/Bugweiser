import type {
  Farmer,
  Buyer,
  Produce,
  BuyerMatch,
  Order,
  Transaction,
  Review,
  UserRole,
} from '@/types';
import {
  mockFarmer,
  mockBuyer,
  mockProduce,
  mockMatches,
  mockOrders,
  mockTransactions,
  mockReviews,
  mockAdminUser,
  mockAllUsers,
  mockPlatformStats,
} from '@/data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getFarmer(): Promise<Farmer> {
  await delay(300);
  return { ...mockFarmer };
}

export async function updateFarmer(data: Farmer): Promise<Farmer> {
  await delay(400);
  Object.assign(mockFarmer, data);
  return { ...mockFarmer };
}

export async function getBuyer(): Promise<Buyer> {
  await delay(300);
  return { ...mockBuyer };
}

export async function updateBuyer(data: Buyer): Promise<Buyer> {
  await delay(400);
  Object.assign(mockBuyer, data);
  return { ...mockBuyer };
}

export async function getAdminUser() {
  await delay(200);
  return { ...mockAdminUser };
}

export async function getAllUsers() {
  await delay(300);
  return [...mockAllUsers];
}

export async function getPlatformStats() {
  await delay(300);
  return [...mockPlatformStats];
}

export async function getProduce(): Promise<Produce[]> {
  await delay(300);
  return [...mockProduce];
}

export async function addProduce(data: Omit<Produce, 'id' | 'availableQuantity' | 'status'>): Promise<Produce> {
  await delay(400);
  const newProduce: Produce = {
    ...data,
    id: `p${Date.now()}`,
    availableQuantity: data.quantity,
    status: 'Available',
  };
  mockProduce.unshift(newProduce);
  return newProduce;
}

export async function getMatches(produceId: string): Promise<BuyerMatch[]> {
  await delay(350);
  return mockMatches
    .filter((m) => m.produceId === produceId)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export async function getOrders(): Promise<Order[]> {
  await delay(300);
  return [...mockOrders];
}

export async function getTransactions(): Promise<Transaction[]> {
  await delay(300);
  return [...mockTransactions];
}

export async function getReviews(): Promise<Review[]> {
  await delay(300);
  return [...mockReviews];
}

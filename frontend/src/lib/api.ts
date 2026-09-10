import type { ApiErrorResponse, ApiResponse, CartItem, Category, Order, PaymentMethod, PriceAlert, Product, User, WishlistItem } from './types';
import { getSessionId } from './session';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('cuy-auth');
    if (!raw) return null;
    return (JSON.parse(raw) as { state?: { token?: string | null } }).state?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const sessionId = getSessionId();
  if (sessionId) {
    headers['x-session-id'] = sessionId;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorResponse | null;
    throw new ApiError(response.status, body?.error?.message ?? `Request failed (${response.status})`);
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
}

export interface ProductFilter {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CheckoutInput {
  items: { productId: string; quantity: number }[];
  paymentMethod: PaymentMethod;
  shippingAddress: Record<string, unknown>;
  notes?: string;
}

export const api = {
  getProducts: (filter: ProductFilter = {}) => {
    const params = new URLSearchParams();
    if (filter.category) params.set('category', filter.category);
    if (filter.minPrice !== undefined) params.set('minPrice', String(filter.minPrice));
    if (filter.maxPrice !== undefined) params.set('maxPrice', String(filter.maxPrice));
    if (filter.search) params.set('search', filter.search);
    if (filter.sort) params.set('sort', filter.sort);
    if (filter.page) params.set('page', String(filter.page));
    if (filter.limit) params.set('limit', String(filter.limit));
    const qs = params.toString();
    return request<PaginatedProducts>(`/products${qs ? `?${qs}` : ''}`);
  },

  getProduct: (slug: string) => request<Product>(`/products/${slug}`),

  getRelatedProducts: (slug: string) => request<Product[]>(`/products/${slug}/related`),

  getCategories: () => request<unknown>('/categories'),

  register: (data: { email: string; password: string; name?: string; phone?: string }) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request<User>('/auth/me'),

  updateProfile: (data: { name?: string; phone?: string; email?: string }) =>
    request<User>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getCart: () => request<CartItem[]>('/cart', { cache: 'no-store' }),

  addCartItem: (productId: string, quantity = 1) =>
    request<CartItem>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  updateCartItem: (productId: string, quantity: number) =>
    request<CartItem>(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeCartItem: (productId: string) =>
    request<{ message: string }>(`/cart/items/${productId}`, { method: 'DELETE' }),

  mergeSessionCart: () => request<CartItem[]>('/cart/merge', { method: 'POST' }),

  checkout: (data: CheckoutInput) => request<Order>('/checkout', { method: 'POST', body: JSON.stringify(data) }),

  getOrders: () => request<Order[]>('/orders', { cache: 'no-store' }),

  getOrder: (id: string) => request<Order>(`/orders/${id}`),

  getWishlist: () => request<WishlistItem[]>('/wishlist', { cache: 'no-store' }),

  addWishlistItem: (productId: string) =>
    request<WishlistItem>(`/wishlist/${productId}`, { method: 'POST' }),

  removeWishlistItem: (productId: string) =>
    request<{ message: string }>(`/wishlist/${productId}`, { method: 'DELETE' }),

  getPriceAlerts: () => request<PriceAlert[]>('/price-alerts', { cache: 'no-store' }),

  createPriceAlert: (productId: string, targetPrice: number) =>
    request<PriceAlert>('/price-alerts', {
      method: 'POST',
      body: JSON.stringify({ productId, targetPrice }),
    }),

  deletePriceAlert: (id: string) =>
    request<{ message: string }>(`/price-alerts/${id}`, { method: 'DELETE' }),
};
export type Category = 'COMMERCIAL' | 'MEDIUM' | 'LARGE' | 'BONELESS' | 'GOURMET';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentMethod = 'VISA' | 'MASTERCARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  vitamins: string[];
  minerals: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  weightGrams: number;
  price: string;
  comparePrice: string | null;
  description: string | null;
  nutrition: NutritionInfo | null;
  imageUrl: string | null;
  stockQuantity: number;
  totalSales: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  userId: string | null;
  sessionId: string | null;
  productId: string;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: string;
  product: Product;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  productId: string;
  targetPrice: string;
  isActive: boolean;
  product: Product;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  shippingAddress: Record<string, unknown>;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  error: {
    message: string;
    stack?: string;
  };
}

export const CATEGORY_LABELS: Record<Category, string> = {
  COMMERCIAL: 'Cuy Comercial',
  MEDIUM: 'Cuy Mediano',
  LARGE: 'Cuy Grande',
  BONELESS: 'Cuy Deshuesado',
  GOURMET: 'Cuy Gourmet',
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  COMMERCIAL: '~300g · perfecto para la familia',
  MEDIUM: '~400g · ideal para asados',
  LARGE: '~500g · para celebraciones',
  BONELESS: '~300g · listo para cocinar',
  GOURMET: '~300g · selección premium',
};
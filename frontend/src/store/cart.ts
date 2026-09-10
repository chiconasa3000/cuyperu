import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { CartItem } from '@/lib/types';

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartState {
  items: CartLine[];
  addItem: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  setItems: (items: CartLine[]) => void;
}

const mapServerItem = (item: CartItem): CartLine => ({
  productId: item.productId,
  slug: item.product.slug,
  name: item.product.name,
  price: Number(item.product.price),
  imageUrl: item.product.imageUrl,
  quantity: item.quantity,
});

export const cartApi = {
  addItem: (productId: string, quantity = 1) =>
    api.addCartItem(productId, quantity).catch(() => null),

  updateQuantity: (productId: string, quantity: number) =>
    api.updateCartItem(productId, quantity).catch(() => null),

  removeItem: (productId: string) =>
    api.removeCartItem(productId).catch(() => null),

  fetchServerCart: async (): Promise<CartLine[] | null> => {
    try {
      const items = await api.getCart();
      return items.map(mapServerItem);
    } catch {
      return null;
    }
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (line, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === line.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === line.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...line, quantity }] };
        });
        cartApi.addItem(line.productId, quantity);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
        cartApi.removeItem(productId);
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                ),
        }));
        if (quantity <= 0) {
          cartApi.removeItem(productId);
        } else {
          cartApi.updateQuantity(productId, quantity);
        }
      },

      clear: () => set({ items: [] }),

      setItems: (items) => set({ items }),
    }),
    { name: 'cuy-cart' }
  )
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectCartTotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
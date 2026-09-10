import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  setIds: (ids: string[]) => void;
  sync: (items: { productId: string }[]) => void;
}

export const wishlistApi = {
  fetchRemote: async () => {
    try {
      const items = await api.getWishlist();
      return items.map((i) => i.productId);
    } catch {
      return null;
    }
  },
};

const max = 80;

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (productId) => {
        const has = get().ids.includes(productId);
        if (has) {
          get().remove(productId);
        } else {
          get().add(productId);
        }
      },

      add: (productId) => {
        if (get().ids.includes(productId)) return;
        if (get().ids.length >= max) return;
        set((state) => ({ ids: [...state.ids, productId] }));
        api.addWishlistItem(productId).catch(() => {});
      },

      remove: (productId) => {
        set((state) => ({ ids: state.ids.filter((id) => id !== productId) }));
        api.removeWishlistItem(productId).catch(() => {});
      },

      setIds: (ids) => set({ ids }),

      sync: (items) => {
        const remote = new Set(
          items.map((i) => i.productId).slice(0, max)
        );
        set((state) => {
          const merged = [...new Set([...state.ids, ...remote])].slice(0, max);
          return { ids: merged };
        });
      },
    }),
    { name: 'cuy-wishlist' }
  )
);

export const selectWishlistIds = (state: WishlistState) => state.ids;

export const filterWishlistProducts = (ids: string[], products: Product[]) =>
  products.filter((p) => ids.includes(p.id));
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const MAX_COMPARE = 4;

interface CompareState {
  slugs: string[];
  toggle: (slug: string) => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      slugs: [],

      toggle: (slug) => {
        const has = get().slugs.includes(slug);
        if (has) {
          get().remove(slug);
        } else {
          get().add(slug);
        }
      },

      add: (slug) => {
        if (get().slugs.includes(slug)) return;
        if (get().slugs.length >= MAX_COMPARE) return;
        set((state) => ({ slugs: [...state.slugs, slug] }));
      },

      remove: (slug) =>
        set((state) => ({ slugs: state.slugs.filter((s) => s !== slug) })),

      clear: () => set({ slugs: [] }),
    }),
    { name: 'cuy-compare' }
  )
);

export const isCompareFull = (slugs: string[]) => slugs.length >= MAX_COMPARE;

export { MAX_COMPARE as compareMax };
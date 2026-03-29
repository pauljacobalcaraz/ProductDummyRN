import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useProductStore = create(
  persist(
    (set) => ({
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
      page: 1,
      setPage: (page) => set({ page }),
      sortBy: null,   // "price" | "rating" | null
      sortOrder: "asc", // "asc" | "desc"
      setSort: (by) =>
        set((s) => ({
          sortBy: s.sortBy === by && s.sortOrder === "desc" ? null : by,
          sortOrder: s.sortBy === by && s.sortOrder === "asc" ? "desc" : "asc",
        })),
      slow3G: false,
      toggleSlow3G: () => set((s) => ({ slow3G: !s.slow3G })),
      stressTest: false,
      toggleStressTest: () => set((s) => ({ stressTest: !s.stressTest })),
      favorites: new Set(),
      toggleFavorite: (id) =>
        set((s) => {
          const next = new Set(s.favorites);
          next.has(id) ? next.delete(id) : next.add(id);
          return { favorites: next };
        }),
    }),
    {
      name: "product-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist favorites — transient UI state should reset on app open
      partialize: (s) => ({ favorites: [...s.favorites] }),
      // AsyncStorage stores arrays; rehydrate back to a Set
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.favorites)) {
          state.favorites = new Set(state.favorites);
        }
      },
    }
  )
);

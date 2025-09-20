import { create } from "zustand";
import { LoadingState } from "../types/storeTypes";

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

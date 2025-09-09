import { create } from 'zustand';

type UiState = {
  isLoading: boolean,
  setLoading: (value: boolean) => void,
};

export const useUiStore = create<UiState>((set) => ({
  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),
}));



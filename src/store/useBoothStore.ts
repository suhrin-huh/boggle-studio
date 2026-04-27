import { create } from 'zustand';
import { BoothStore } from '@/types/booth';

const useBoothStore = create<BoothStore>((set) => ({
  selectedTheme: null,
  capturedCuts: [],
  finalImageName: '',

  setTheme: (theme) => set({ selectedTheme: theme }),

  addCapture: (imageData) =>
    set((state) => ({ capturedCuts: [...state.capturedCuts, imageData] })),

  resetBooth: () =>
    set({ selectedTheme: null, capturedCuts: [], finalImageName: '' }),
}));

export default useBoothStore;

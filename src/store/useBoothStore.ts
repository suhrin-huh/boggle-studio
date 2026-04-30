import { create } from 'zustand';
import { BoothStore } from '@/types/booth';

/**
 * 인생 네컷 생성에 필요한 전역 변수 관리
 * @returns selectedTheme : 선택된 테마
 * @returns capturedCuts : 촬영모드 선택 시 촬영된 사진
 * @returns finalImageName : 최종 이미지명
 * @returns setTheme (theme) => void : 테마 변경 함수
 * @returns addCapture: (imageData) => void : 사진 추가 함수
 * @returns resetBooth : 전역 변수 초기화 함수
 */
export const useBoothStore = create<BoothStore>((set) => ({
  selectedTheme: null,
  capturedCuts: [],
  finalImageName: '',
  setTheme: (theme) => set({ selectedTheme: theme }),
  addCapture: (imageData) => set((state) => ({ capturedCuts: [...state.capturedCuts, imageData] })),
  resetBooth: () => set({ selectedTheme: null, capturedCuts: [], finalImageName: '' }),
}));

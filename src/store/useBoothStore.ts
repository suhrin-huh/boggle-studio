import { create } from 'zustand';
import { ThemeOption } from '@/types/booth';
import { FrameId } from '@/constants/booth';

export interface BoothState {
  selectedTheme: ThemeOption | null;
  frameId: FrameId | null;
  capturedCuts: string[];
  finalImageName: string;
}

export interface BoothActions {
  setTheme: (theme: ThemeOption) => void;
  setFrameId: (id: FrameId) => void;
  addCapture: (imageData: string) => void;
  resetBooth: () => void;
}

export type BoothStore = BoothState & BoothActions;

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
  frameId: null,
  capturedCuts: [],
  finalImageName: '',
  setTheme: (theme) => set({ selectedTheme: theme }),
  setFrameId: (id) => set({ frameId: id }),
  addCapture: (imageData) => set((state) => ({ capturedCuts: [...state.capturedCuts, imageData] })),
  resetBooth: () =>
    set({ selectedTheme: null, frameId: null, capturedCuts: [], finalImageName: '' }),
}));

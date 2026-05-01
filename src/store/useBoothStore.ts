import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FrameId } from '@/constants/booth';

export interface BoothState {
  frameId: FrameId | null;
  capturedCuts: string[];
  finalImageName: string;
}

export interface BoothActions {
  setFrameId: (id: FrameId) => void;
  setCapturedCuts: (imageDatas: string[]) => void;
  resetBooth: () => void;
}

export type BoothStore = BoothState & BoothActions;

/**
 * 인생 네컷 생성에 필요한 전역 변수 관리
 * @returns frameId : 선택된 프레임 ID
 * @returns capturedCuts : 촬영된 사진 데이터
 * @returns finalImageName : 최종 이미지명
 * @returns setFrameId : 프레임 변경 함수
 * @returns setCapturedCuts : capturedCuts 업데이트 함수
 * @returns resetBooth : 전역 변수 초기화 함수
 */
export const useBoothStore = create<BoothStore>()(
  persist(
    (set) => ({
      frameId: null,
      capturedCuts: [],
      finalImageName: '',
      setFrameId: (id) => set({ frameId: id }),
      setCapturedCuts: (imageDatas: string[]) => set({ capturedCuts: [...imageDatas] }),
      resetBooth: () => set({ frameId: null, capturedCuts: [], finalImageName: '' }),
    }),
    {
      name: 'booth-store',
      partialize: (state) => ({ frameId: state.frameId }),
    },
  ),
);

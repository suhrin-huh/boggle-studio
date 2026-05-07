import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FrameId } from '@/constants/booth';

export interface BoothState {
  frameId: FrameId | null;
  photoSlots: string[];
  finalImageName: string;
  effectSlots: string[]; // 캡처 순간마다 저장된 캔버스 이펙트 스냅샷 배열 (photoSlots와 1:1 대응)
}

export interface BoothActions {
  setFrameId: (id: FrameId) => void;
  setPhotoSlots: (imageDatas: string[]) => void;
  setEffectSlots: (snapshots: string[]) => void;
  resetBooth: () => void;
}

export type BoothStore = BoothState & BoothActions;

/**
 * 인생 네컷 생성에 필요한 전역 변수 관리
 * @returns frameId : 선택된 프레임 ID
 * @returns photoSlots : 촬영된 사진 데이터
 * @returns finalImageName : 최종 이미지명
 * @returns setFrameId : 프레임 변경 함수
 * @returns setPhotoSlots : photoSlots 업데이트 함수
 * @returns resetBooth : 전역 변수 초기화 함수
 */
export const useBoothStore = create<BoothStore>()(
  persist(
    (set) => ({
      frameId: null,
      photoSlots: [],
      finalImageName: '',
      effectSlots: [],
      setFrameId: (id) => set({ frameId: id }),
      setPhotoSlots: (imageDatas: string[]) => set({ photoSlots: [...imageDatas] }),
      setEffectSlots: (snapshots) => set({ effectSlots: [...snapshots] }),
      resetBooth: () => set({ frameId: null, photoSlots: [], finalImageName: '', effectSlots: [] }),
    }),
    {
      name: 'booth-store',
      partialize: (state) => ({ frameId: state.frameId }),
    },
  ),
);

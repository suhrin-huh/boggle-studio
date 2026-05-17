import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeId } from '@/constants/booth';

export interface BoothState {
  themeId: ThemeId | null;
  photoSlots: string[];
  finalImageName: string;
}

export interface BoothActions {
  setThemeId: (id: ThemeId) => void;
  setPhotoSlots: (imageDatas: string[]) => void;
  resetBooth: () => void;
}

export type BoothStore = BoothState & BoothActions;

/**
 * 인생 네컷 생성에 필요한 전역 변수 관리
 * @returns themeId : 선택된 테마 ID (프레임-배경 조합)
 * @returns photoSlots : 촬영된 사진 데이터
 * @returns finalImageName : 최종 이미지명
 * @returns setThemeId : 테마 변경 함수
 * @returns setPhotoSlots : photoSlots 업데이트 함수
 * @returns resetBooth : 전역 변수 초기화 함수
 */
export const useBoothStore = create<BoothStore>()(
  persist(
    (set) => ({
      themeId: null,
      photoSlots: [],
      finalImageName: '',
      setThemeId: (id) => set({ themeId: id }),
      setPhotoSlots: (imageDatas: string[]) => set({ photoSlots: [...imageDatas] }),
      resetBooth: () => set({ themeId: null, photoSlots: [], finalImageName: '' }),
    }),
    {
      name: 'booth-store',
      partialize: (state) => ({ themeId: state.themeId }),
    },
  ),
);

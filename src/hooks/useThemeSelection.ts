import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FrameType, Background, ThemeId } from '@/constants/booth';
import { useBoothStore } from '@/store/useBoothStore';

/**
 * 테마 선택 페이지의 프레임 타입·배경 선택 상태와 확인 처리를 관리하는 훅
 * - 촬영 없이 직접 접근한 경우 홈으로 리다이렉트
 * - confirm 시 선택된 프레임+배경을 ThemeId로 조합해 store에 저장 후 결과 페이지로 이동
 * @returns selectedFrame - 현재 선택된 프레임 타입 ('basic' | 'wide')
 * @returns selectedBg - 현재 선택된 배경 식별자
 * @returns setSelectedFrame - 프레임 타입 변경 핸들러
 * @returns setSelectedBg - 배경 변경 핸들러
 * @returns handleConfirm - 테마 확정 및 결과 페이지 이동 핸들러
 */
export const useThemeSelection = () => {
  const router = useRouter();
  const setThemeId = useBoothStore((state) => state.setThemeId);
  const photoSlots = useBoothStore((state) => state.photoSlots);

  const [selectedFrame, setSelectedFrame] = useState<FrameType>('basic');
  const [selectedBg, setSelectedBg] = useState<Background>('black');

  useEffect(() => {
    // 촬영 없이 프레임 페이지로 바로 접근한 경우 방어
    if (photoSlots.length === 0) {
      router.replace('/');
    }
  }, [photoSlots, router]);

  const handleConfirm = () => {
    const themeId: ThemeId = `${selectedFrame}-${selectedBg}`;
    setThemeId(themeId);
    router.push('/result');
  };

  return {
    selectedFrame,
    selectedBg,
    setSelectedFrame,
    setSelectedBg,
    handleConfirm,
  };
};

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FRAME_OPTIONS,
  BACKGROUND_OPTIONS,
  FrameType,
  Background,
  ThemeId,
} from '@/constants/booth';
import { useBoothStore } from '@/store/useBoothStore';

const FRAME_KEYS = Object.keys(FRAME_OPTIONS) as FrameType[];
const BG_KEYS = Object.keys(BACKGROUND_OPTIONS) as Background[];

export function useThemeSelection() {
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
    FRAME_KEYS,
    BG_KEYS,
  };
}

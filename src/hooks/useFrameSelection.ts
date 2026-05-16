import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FRAME_OPTIONS, FrameType, ThemeId } from '@/constants/booth';
import { useBoothStore } from '@/store/useBoothStore';

export function useFrameSelection() {
  const frameKeys = Object.keys(FRAME_OPTIONS) as FrameType[];
  const router = useRouter();
  const setThemeId = useBoothStore((state) => state.setThemeId);
  const photoSlots = useBoothStore((state) => state.photoSlots);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    // 촬영 없이 프레임 페이지로 바로 접근한 경우 방어
    if (photoSlots.length === 0) {
      router.replace('/');
    }
  }, [photoSlots, router]);

  const handleConfirm = () => {
    const themeId: ThemeId = `${frameKeys[focusedIndex]}-black`;
    setThemeId(themeId);
    router.push('/result');
  };

  return { setFocusedIndex, handleConfirm };
}

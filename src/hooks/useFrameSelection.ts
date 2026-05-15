import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FRAMES, FrameId } from '@/constants/booth';
import { useBoothStore } from '@/store/useBoothStore';

export function useFrameSelection() {
  const frameKeys = Object.keys(FRAMES) as FrameId[];
  const router = useRouter();
  const setFrameId = useBoothStore((state) => state.setFrameId);
  const photoSlots = useBoothStore((state) => state.photoSlots);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    // 촬영 없이 프레임 페이지로 바로 접근한 경우 방어
    if (photoSlots.length === 0) {
      router.replace('/');
    }
  }, [photoSlots, router]);

  const handleConfirm = () => {
    setFrameId(frameKeys[focusedIndex]);
    router.push('/result');
  };

  return { setFocusedIndex, handleConfirm };
}

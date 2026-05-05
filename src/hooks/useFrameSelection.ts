import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FRAMES, FrameId } from '@/constants/booth';
import { useBoothStore } from '@/store/useBoothStore';

export function useFrameSelection() {
  const frameKeys = Object.keys(FRAMES) as FrameId[];
  const router = useRouter();
  const setFrameId = useBoothStore((state) => state.setFrameId);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleConfirm = () => {
    setFrameId(frameKeys[focusedIndex]);
    router.push('/capture');
  };

  return { setFocusedIndex, handleConfirm };
}

'use client';

import { useEffect } from 'react';
import { useBoothStore } from '@/store/useBoothStore';

export default function BoothReset() {
  const resetBooth = useBoothStore((state) => state.resetBooth);

  useEffect(() => {
    resetBooth();
  }, [resetBooth]);

  return null;
}

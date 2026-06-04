'use client';

import { useEffect } from 'react';

import { useBoothStore } from '@/store/useBoothStore';

/**
 * 홈 페이지 진입 시 부스 전역 스토어를 초기화하는 비시각 컴포넌트.
 */
export default function BoothReset() {
  const resetBooth = useBoothStore((state) => state.resetBooth);

  useEffect(() => {
    resetBooth();
  }, [resetBooth]);

  return null;
}

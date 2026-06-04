'use client';

import { useEffect, useRef, useState } from 'react';

import { recordActiveView } from '@/actions/logs';

/**
 * 페이지 체류 시간을 측정해 방문자 활성 조회수를 기록하는 비시각 컴포넌트
 */
export default function VisitorLogger() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasCountedInThisLoad, setHasCountedInThisLoad] = useState(false);
  const VIEW_THRESHOLD = 2000; // 2초

  useEffect(() => {
    const startTimer = () => {
      if (hasCountedInThisLoad) return;

      if (!timerRef.current) {
        timerRef.current = setTimeout(async () => {
          const result = await recordActiveView();
          if (result?.success) {
            setHasCountedInThisLoad(true);
          }
        }, VIEW_THRESHOLD);
      }
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startTimer();
      } else {
        stopTimer();
      }
    };

    // visibilitychange는 변경 시에만 발생하므로 마운트 시점에 초기 상태를 직접 확인
    if (document.visibilityState === 'visible') {
      startTimer();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasCountedInThisLoad]); // hasCountedInThisLoad 변경 시 startTimer의 가드 조건을 최신 값으로 반영

  return null;
}

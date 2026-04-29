import { useRef, useCallback } from 'react';

// `react-webcam`: 브라우저의 `MediaDevices API`를 리액트 스타일로 쉽게 다룰 수 있게 해주는 라이브러리
import type Webcam from 'react-webcam';

/**
 * 카메라 제어
 * @returns webcamRef : 상태가 아닌 필요한 순간에만 인스턴스에 접근
 * @returns capture : 사진 촬영
 */
export default function useCamera() {
  //
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback((): string | null => {
    if (!webcamRef.current) return null;
    return webcamRef.current.getScreenshot();
  }, []);

  return { webcamRef, capture };
}

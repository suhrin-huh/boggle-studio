import { useState, useRef, useCallback } from 'react';

// `react-webcam`: 브라우저의 `MediaDevices API`를 리액트 스타일로 쉽게 다룰 수 있게 해주는 라이브러리
import type Webcam from 'react-webcam';

/**
 * 카메라 제어
 * @returns webcamRef : 상태가 아닌 필요한 순간에만 인스턴스에 접근
 * @returns capture : 사진 촬영
 * @returns isCameraReady : 웹캠 로드 상태 여부
 * @returns setIsCameraReady
 */
export default function useCamera() {
  const webcamRef = useRef<Webcam>(null);
  // 웹캠 로드 상태 여부
  const [isCameraReady, setIsCameraReady] = useState(false);

  const capture = useCallback((): string | null => {
    if (!webcamRef.current) return null;
    return webcamRef.current.getScreenshot();
  }, []);

  const handleCameraReady = useCallback(() => setIsCameraReady(true), []);

  return { webcamRef, capture, isCameraReady, handleCameraReady };
}

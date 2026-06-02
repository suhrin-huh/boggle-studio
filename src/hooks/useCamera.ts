import { useState, useRef, useCallback } from 'react';

import type Webcam from 'react-webcam';
import { cropToRatio } from '@/utils/canvasHelper';

interface UseCameraProps {
  captureRatio: number;
}

/**
 * 카메라 제어
 * @param captureRatio - 스냅샷 크롭 비율 (width / height)
 * @returns webcamRef      - 웹캠 인스턴스 ref
 * @returns capture        - 크롭된 스냅샷 반환 (Promise)
 * @returns isCameraReady  - 웹캠 로드 상태 여부
 * @returns handleCameraReady
 */
export const useCamera = ({ captureRatio }: UseCameraProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const capture = useCallback(async (): Promise<string | null> => {
    const screenshot = webcamRef.current?.getScreenshot() ?? null;
    if (!screenshot) return null;
    return cropToRatio(screenshot, captureRatio);
  }, [captureRatio]);

  const handleCameraReady = useCallback(() => setIsCameraReady(true), []);

  return { webcamRef, capture, isCameraReady, handleCameraReady };
};

'use client';

import { useState } from 'react';

import { saveVideoBlob, generateVideoKey } from '@/utils/idbHelper';
import { TOTAL_SLOTS, CAPTURE_INTERVAL_MS } from '@/constants';

interface UseCaptureSequenceProps {
  capture: () => Promise<string | null>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob>;
  addNextPhoto: (photoData: string) => void;
  filledCount: number;
  isCameraReady: boolean;
}

/**
 * 자동 순차 촬영 시퀀스를 관리하는 훅.
 * 카운트다운 → 스냅샷 → 녹화 저장을 남은 슬롯 수만큼 반복합니다.
 */
export const useCaptureSequence = ({
  capture,
  startRecording,
  stopRecording,
  addNextPhoto,
  filledCount,
  isCameraReady,
}: UseCaptureSequenceProps) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [localVideoKeys, setLocalVideoKeys] = useState<string[]>([]);

  const handleCapture = async () => {
    if (isCapturing || !isCameraReady) return;
    setIsCapturing(true);

    for (let i = filledCount; i < TOTAL_SLOTS; i++) {
      await startRecording();

      const seconds = CAPTURE_INTERVAL_MS / 1000;
      for (let c = seconds; c > 0; c--) {
        setCountdown(c);
        await new Promise<void>((r) => setTimeout(r, 1000));
      }
      setCountdown(null);

      const screenshot = await capture();
      if (!screenshot) break;

      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 350);

      const blob = await stopRecording();
      const key = generateVideoKey(i);
      await saveVideoBlob(key, blob);

      addNextPhoto(screenshot);
      setLocalVideoKeys((prev) => [...prev, key]);
    }

    setIsCapturing(false);
  };

  return { isFlashing, isCapturing, countdown, localVideoKeys, handleCapture };
};

'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useBoothStore } from '@/store/useBoothStore';
import { useCamera } from '@/hooks/useCamera';
import { useLocalPhotoSlots } from '@/hooks/useLocalPhotoSlots';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { useCaptureSequence } from '@/hooks/useCaptureSequence';

import CameraScreen from './CameraScreen';
import CameraControls from './CameraControls';
import CountdownOverlay from './CountdownOverlay';
import LoadingText from './LoadingText';

import { TOTAL_SLOTS } from '@/constants';
import { CameraPhase } from '@/types';

/**
 * 카메라 촬영 흐름 전체를 관리하는 부스 컴포넌트
 */
export default function CameraBooth() {
  const CAPTURE_RATIO = 4 / 3;

  const router = useRouter();

  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);
  const setVideoSlotKeys = useBoothStore((state) => state.setVideoSlotKeys);

  const { localSlots, addNextPhoto, isAllFilled, filledCount } = useLocalPhotoSlots({
    totalSlots: TOTAL_SLOTS,
  });

  const { webcamRef, capture, isCameraReady, handleCameraReady } = useCamera({
    captureRatio: CAPTURE_RATIO,
  });

  const { startSlotRecording, stopSlotRecording } = useVideoRecorder(webcamRef);

  const { isFlashing, isCapturing, countdown, localVideoKeys, handleCapture } = useCaptureSequence({
    capture,
    startRecording: startSlotRecording,
    stopRecording: stopSlotRecording,
    addNextPhoto,
    filledCount,
    isCameraReady,
  });

  const phase = useMemo<CameraPhase>(() => {
    if (!isCameraReady) return 'loading';
    if (isAllFilled) return 'done';
    if (isCapturing) return 'capturing';
    return 'idle';
  }, [isCameraReady, isAllFilled, isCapturing]);

  const handlePrint = () => {
    setPhotoSlots(localSlots as string[]);
    setVideoSlotKeys(localVideoKeys);
    router.push('/theme');
  };

  return (
    <>
      {phase === 'loading' && <LoadingText />}
      <CameraScreen
        phase={phase}
        onCameraReady={handleCameraReady}
        filledCount={filledCount}
        totalSlots={TOTAL_SLOTS}
        webcamRef={webcamRef}
        isFlashing={isFlashing}
      >
        <CountdownOverlay countdown={countdown} />
      </CameraScreen>

      <CameraControls phase={phase} onCapture={handleCapture} onPrint={handlePrint} />
    </>
  );
}

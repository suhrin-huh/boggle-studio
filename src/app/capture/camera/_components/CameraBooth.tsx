'use client';

// libraries & frameworks
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

// global stores & hooks
import { useBoothStore } from '@/store/useBoothStore';
import { useCamera } from '@/hooks/useCamera';
import { useLocalPhotoSlots } from '@/hooks/useLocalPhotoSlots';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { useCaptureSequence } from '@/hooks/useCaptureSequence';

// components
import CameraScreen from './CameraScreen';
import CameraControls from './CameraControls';
import CountdownOverlay from './CountdownOverlay';
import LoadingText from './LoadingText';

// assets
import { TOTAL_SLOTS } from '@/constants/booth';
import { CameraPhase } from '@/types';

export default function CameraBooth() {
  const router = useRouter();

  // 전역스토어
  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);
  const setVideoSlotKeys = useBoothStore((state) => state.setVideoSlotKeys);

  // 전역 스토어
  const { localSlots, addNextPhoto, isAllFilled, filledCount } = useLocalPhotoSlots({
    totalSlots: TOTAL_SLOTS,
  });

  // webcam
  const { webcamRef, capture, isCameraReady, handleCameraReady } = useCamera();

  // 스케치 영상 제작
  const { startSlotRecording, stopSlotRecording } = useVideoRecorder(webcamRef);

  // 카메라 촬영 효과
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
      {/* webcam 스크린 */}
      <CameraScreen
        phase={phase}
        onCameraReady={handleCameraReady}
        filledCount={filledCount}
        totalSlots={TOTAL_SLOTS}
        webcamRef={webcamRef}
        isFlashing={isFlashing}
      >
        {/* 카운트다운 효과 오버레이 */}
        <CountdownOverlay countdown={countdown} />
      </CameraScreen>

      {/* 카메라 컨트롤 버튼 */}
      <CameraControls phase={phase} onCapture={handleCapture} onPrint={handlePrint} />
    </>
  );
}

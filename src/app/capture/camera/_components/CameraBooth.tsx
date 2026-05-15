'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';
import useCamera from '@/hooks/useCamera';
import useLocalPhotoSlots from '@/hooks/useLocalPhotoSlots';
import CameraScreen from './CameraScreen';
import CameraControls from './CameraControls';

export default function CameraBooth() {
  const router = useRouter();

  // global states
  const frameId = useBoothStore((state) => state.frameId);
  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);

  // frameId를 바탕으로 totalSlots 계산
  const totalSlots = frameId ? FRAMES[frameId].requiredPhotoCount : 4;

  // local states
  const { localSlots, addNextPhoto, isAllFilled, filledCount } = useLocalPhotoSlots({ totalSlots });

  const { webcamRef, capture, isCameraReady, setIsCameraReady } = useCamera();

  // 촬영 순간 플래시 효과 트리거 상태
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    // 프레임 선택 없이 카메라 페이지로 바로 접근한 경우 방어
    if (!frameId) {
      router.replace('/');
    }
  }, [frameId, router]);

  // frameId가 없으면 빈 화면을 반환하여 에러 방지
  if (!frameId) return null;

  const handleCapture = () => {
    const screenshot = capture();
    if (!screenshot) return;

    // 플래시 효과 on
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 350);

    // 촬영 모드의 경우 순차적으로 photoSlot에 할당
    addNextPhoto(screenshot);
  };

  const handlePrint = () => {
    setPhotoSlots(localSlots as string[]);
    router.push('/result');
  };

  return (
    <>
      <CameraScreen
        isCameraReady={isCameraReady}
        setIsCameraReady={setIsCameraReady}
        filledCount={filledCount}
        totalSlots={totalSlots}
        webcamRef={webcamRef}
        isFlashing={isFlashing}
      ></CameraScreen>

      {/* 액션 버튼 */}
      <CameraControls isAllFilled={isAllFilled} onCapture={handleCapture} onPrint={handlePrint} />
    </>
  );
}

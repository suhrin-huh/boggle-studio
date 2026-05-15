'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import useCamera from '@/hooks/useCamera';
import useLocalPhotoSlots from '@/hooks/useLocalPhotoSlots';
import CameraScreen from './CameraScreen';
import CameraControls from './CameraControls';
import { TOTAL_SLOTS } from '@/constants/booth';

export default function CameraBooth() {
  const router = useRouter();

  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);

  const { localSlots, addNextPhoto, isAllFilled, filledCount } = useLocalPhotoSlots({
    totalSlots: TOTAL_SLOTS,
  });

  const { webcamRef, capture, isCameraReady, setIsCameraReady } = useCamera();

  const [isFlashing, setIsFlashing] = useState(false);

  const handleCapture = () => {
    const screenshot = capture();
    if (!screenshot) return;

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 350);

    addNextPhoto(screenshot);
  };

  const handlePrint = () => {
    setPhotoSlots(localSlots as string[]);
    router.push('/frame');
  };

  return (
    <>
      <CameraScreen
        isCameraReady={isCameraReady}
        setIsCameraReady={setIsCameraReady}
        filledCount={filledCount}
        totalSlots={TOTAL_SLOTS}
        webcamRef={webcamRef}
        isFlashing={isFlashing}
      />

      <CameraControls isAllFilled={isAllFilled} onCapture={handleCapture} onPrint={handlePrint} />
    </>
  );
}

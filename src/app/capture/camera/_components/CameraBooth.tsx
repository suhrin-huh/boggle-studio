'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';
import useCamera from '@/hooks/useCamera';
import useLocalPhotoSlots from '@/hooks/useLocalPhotoSlots';
import NeumorphicButton from '@/components/common/NeumorphicButton';

const VIDEO_CONSTRAINTS = {
  width: { ideal: 1920 },
  height: { ideal: 1440 },
  facingMode: { ideal: 'user' },
};

export default function CameraBooth() {
  const router = useRouter();
  const frameId = useBoothStore((state) => state.frameId);
  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);

  // Zustand에서 frameId를 바탕으로 totalSlots 계산
  const totalSlots = frameId ? FRAMES[frameId].requiredPhotoCount : 4;

  const { localSlots, addNextPhoto, isAllFilled } = useLocalPhotoSlots({ totalSlots });
  const { webcamRef, capture } = useCamera();

  const filledCount = localSlots.filter((slot) => slot !== null).length;

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
    if (screenshot) addNextPhoto(screenshot);
  };

  const handlePrint = () => {
    setPhotoSlots(localSlots as string[]);
    router.push('/result');
  };

  return (
    <>
      <div className="shadow-neu relative aspect-4/3 w-75">
        {/* 촬영 카운트 */}
        <span className="absolute top-[5%] right-[5%] z-10 text-[16px] font-semibold text-white tabular-nums">
          {filledCount} / {totalSlots}
        </span>

        {/* 웹캠 */}
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/png"
          videoConstraints={VIDEO_CONSTRAINTS}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* 액션 버튼 */}
      <div className="mt-4 flex flex-col items-center gap-3">
        {!isAllFilled ? (
          <NeumorphicButton onClick={handleCapture}>Capture</NeumorphicButton>
        ) : (
          <NeumorphicButton onClick={handlePrint} className="text-red-800">
            Create Your Print!
          </NeumorphicButton>
        )}
      </div>
    </>
  );
}

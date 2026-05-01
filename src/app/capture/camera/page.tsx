'use client';

import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';
import CameraCapture from './_components/CameraCapture';
import PixelButton from '@/components/common/PixelButton';

interface CameraPageProps {}

/**
 * 촬영하기 모드
 */
export default function CameraPage({}: CameraPageProps) {
  const router = useRouter();
  const { addCapture, capturedCuts, frameId } = useBoothStore();
  const requiredPhotoCount = frameId ? FRAMES[frameId].requiredPhotoCount : 0;
  const allFilled = capturedCuts.length >= requiredPhotoCount;

  return (
    <div>
      <h1>촬영</h1>
      <p>
        {capturedCuts.length}/{requiredPhotoCount}
      </p>
      <CameraCapture
        capturedCuts={capturedCuts}
        onCapture={addCapture}
        requiredPhotoCount={requiredPhotoCount}
      />
      <div>
        <PixelButton
          variant={allFilled ? 'primary' : 'ghost'}
          disabled={!allFilled}
          onClick={() => router.push('/result')}
          className="scale-110"
        >
          사진 출력하기
        </PixelButton>
      </div>
    </div>
  );
}

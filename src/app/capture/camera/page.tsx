'use client';

import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';
import PixelButton from '@/components/common/PixelButton';
import Webcam from 'react-webcam';
import useCamera from '@/hooks/useCamera';
import useLocalPhotoSlots from '@/hooks/useLocalPhotoSlots';

// 이거는 width/height (하드웨어 해상도)
const VIDEO_CONSTRAINTS = {
  width: 1920,
  height: 1080,
  facingMode: 'user', // 전면 카메라 (모바일 고려)
};

interface CameraPageProps {}

/**
 * 촬영하기 모드
 */
export default function CameraPage({}: CameraPageProps) {
  const router = useRouter();
  const frameId = useBoothStore((state) => state.frameId);
  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);
  const totalSlots = frameId ? FRAMES[frameId].requiredPhotoCount : 0;
  const { localSlots, addNextPhoto, isAllFilled } = useLocalPhotoSlots({ totalSlots });
  const { webcamRef, capture } = useCamera();

  // 촬영하기 버튼 이벤트 핸들러
  const handleCapture = () => {
    const screenshot = capture();
    if (screenshot) addNextPhoto(screenshot);
  };

  // 출력 버튼 이벤트 핸들러
  const handlePrint = () => {
    setPhotoSlots(localSlots as string[]);
    router.push('/result');
  };

  return (
    <div>
      <h1>촬영</h1>
      <p>
        {localSlots.filter((slot) => slot !== null).length}/{totalSlots}
      </p>
      <div>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={VIDEO_CONSTRAINTS}
          className="aspect-4/3 w-75 object-cover shadow-lg"
        />
        <br />
        <button onClick={handleCapture} disabled={isAllFilled}>
          촬영하기
        </button>
        {localSlots.map(
          (src, i) =>
            src !== null && (
              <img key={i} src={src} alt={`촬영 ${i + 1}`} style={{ width: 100, height: 75 }} />
            ),
        )}
      </div>
      <div>
        <PixelButton
          variant={isAllFilled ? 'primary' : 'ghost'}
          disabled={!isAllFilled}
          onClick={handlePrint}
          className="scale-110"
        >
          사진 출력하기
        </PixelButton>
      </div>
    </div>
  );
}

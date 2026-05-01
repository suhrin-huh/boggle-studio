'use client';

import Webcam from 'react-webcam';
import useCamera from '@/hooks/useCamera';

const VIDEO_CONSTRAINTS = {
  width: 800,
  height: 600,
  facingMode: 'user',
};

interface CameraCaptureProps {
  capturedCuts: string[];
  onCapture: (data: string) => void;
  requiredPhotoCount: number;
}

/**
 * 카메라 촬영 전용 컴포넌트
 * @param capturedCuts : 촬영된 사진 데이터
 * @param onCapture : 촬영하기 버튼 클릭 시 동작할 이벤트 함수
 * @param requiredPhotoCount : 필요한 사진 장수
 */
export default function CameraCapture({ capturedCuts, onCapture, requiredPhotoCount }: CameraCaptureProps) {
  const { webcamRef, capture } = useCamera();

  const handleCapture = () => {
    if (capturedCuts.length >= requiredPhotoCount) return;
    const screenshot = capture();
    if (screenshot) onCapture(screenshot);
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/png"
        videoConstraints={VIDEO_CONSTRAINTS}
        style={{ width: 400, height: 300 }}
      />
      <br />
      <button onClick={handleCapture} disabled={capturedCuts.length >= requiredPhotoCount}>
        촬영하기
      </button>
      {capturedCuts.map((src, i) => (
        <img key={i} src={src} alt={`촬영 ${i + 1}`} style={{ width: 100, height: 75 }} />
      ))}
    </div>
  );
}

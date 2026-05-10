import Webcam from 'react-webcam';
import type { RefObject, HTMLAttributes } from 'react';

const VIDEO_CONSTRAINTS = {
  width: { ideal: 1920 },
  height: { ideal: 1440 },
  // 4:3 비율을 카메라 스트림 단계에서 강제 → 브라우저가 16:9 기본값으로 fallback하는 것을 방지
  aspectRatio: 4 / 3,
  facingMode: { ideal: 'user' },
};

interface CameraScreenProps extends HTMLAttributes<HTMLDivElement> {
  isCameraReady: boolean;
  setIsCameraReady: (ready: boolean) => void;
  filledCount: number;
  totalSlots: number;
  webcamRef: RefObject<Webcam | null>;
}

export default function CameraScreen({
  isCameraReady,
  setIsCameraReady,
  filledCount,
  totalSlots,
  webcamRef,
  children,
  ...rest
}: CameraScreenProps) {
  return (
    <div className="relative aspect-4/3" {...rest}>
      {/* 로딩 스피너 */}
      {!isCameraReady && (
        <div className="absolute flex h-full w-full flex-col items-center justify-center gap-4">
          <div className="border-muted h-10 w-10 animate-spin rounded-full border-8 border-t-white" />
          <p className="text-mute-dark text-body-md">Setting...</p>
        </div>
      )}

      {/* 촬영 횟수 카운트 */}
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
        onUserMedia={() => setIsCameraReady(true)}
        className="h-full w-full rounded-lg object-cover shadow-lg"
      />

      {/* 기타 요소 : 이펙트, 스티커 등 */}
      {children}
    </div>
  );
}

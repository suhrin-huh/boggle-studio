// libraries & frameworks
import Webcam from 'react-webcam';
import type { RefObject, HTMLAttributes } from 'react';
import LoadingText from './LoadingText';

const VIDEO_CONSTRAINTS = {
  width: { ideal: 1920 },
  height: { ideal: 1440 },
  // 4:3 비율을 카메라 스트림 단계에서 강제 → 브라우저가 16:9 기본값으로 fallback하는 것을 방지
  aspectRatio: 4 / 3,
  facingMode: { ideal: 'user' },
};

interface CameraScreenProps extends HTMLAttributes<HTMLDivElement> {
  isCameraReady: boolean;
  onCameraReady: () => void;
  filledCount: number;
  totalSlots: number;
  webcamRef: RefObject<Webcam | null>;
  isFlashing: boolean;
}

/**
 * 카메라 촬영 화면
 * @property isCameraReady
 * @property setIsCameraReady
 * @property filledCount
 * @property totalSlots
 * @property webcamRef
 * @property isFlashing
 */
export default function CameraScreen({
  isCameraReady,
  onCameraReady,
  filledCount,
  totalSlots,
  webcamRef,
  isFlashing,
  children,
  ...rest
}: CameraScreenProps) {
  return (
    <div
      className={`relative aspect-4/3 overflow-hidden rounded-lg after:pointer-events-none after:absolute after:inset-0 after:z-50 after:bg-white after:opacity-0 ${isFlashing ? 'after:animate-[flash_0.35s_ease-out_forwards]' : ''}`}
      {...rest}
    >
      {/* 로딩 UI */}
      {!isCameraReady && <LoadingText />}

      {/* 웹캠 */}
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored
        screenshotFormat="image/png"
        videoConstraints={VIDEO_CONSTRAINTS}
        onUserMedia={onCameraReady}
        className="h-full w-full rounded-lg object-cover shadow-lg"
      />

      {/* 촬영 횟수 카운트 */}
      {isCameraReady && (
        <span className="absolute top-[5%] right-[5%] z-10 text-[16px] font-semibold text-white tabular-nums">
          {filledCount} / {totalSlots}
        </span>
      )}

      {/* 기타 요소 : 이펙트, 스티커 등 */}
      {children}
    </div>
  );
}

// libraries & frameworks
import Webcam from 'react-webcam';
import type { RefObject, HTMLAttributes } from 'react';

// components
import LoadingText from './LoadingText';

// assets
import { CameraPhase } from '@/types';

const VIDEO_CONSTRAINTS = {
  width: { ideal: 1920 },
  height: { ideal: 1440 },
  // 4:3 비율을 카메라 스트림 단계에서 강제 → 브라우저가 16:9 기본값으로 fallback하는 것을 방지
  aspectRatio: 4 / 3,
  facingMode: { ideal: 'user' },
};

interface CameraScreenProps extends HTMLAttributes<HTMLDivElement> {
  phase: CameraPhase;
  onCameraReady: () => void;
  filledCount: number;
  totalSlots: number;
  webcamRef: RefObject<Webcam | null>;
  isFlashing: boolean;
}

/**
 * 카메라 촬영 화면
 * @property phase
 * @property setIsCameraReady
 * @property filledCount
 * @property totalSlots
 * @property webcamRef
 * @property isFlashing
 */
export default function CameraScreen({
  phase,
  onCameraReady,
  filledCount,
  totalSlots,
  webcamRef,
  isFlashing,
  children,
  ...rest
}: CameraScreenProps) {
  const isAllFilled = phase === 'done';

  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-lg" {...rest}>
      {/* 로딩 UI */}
      {phase === 'loading' && <LoadingText />}

      {/* 완료 상태 : 웹캠 대신 DONE! 텍스트 표시 */}
      {isAllFilled ? (
        <div className="bg-muted-dark/50 flex h-full w-full items-center justify-center rounded-lg">
          <span className="font-unbounded text-xl font-bold tracking-widest text-white">DONE!</span>
        </div>
      ) : (
        /* 웹캠 */
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/png"
          videoConstraints={VIDEO_CONSTRAINTS}
          onUserMedia={onCameraReady}
          className="h-full w-full rounded-lg object-cover shadow-lg"
        />
      )}

      {/* 플래시 효과 오버레이 — UI 전용, 카메라 raw 스트림(MediaRecorder)에는 포함되지 않음 */}
      <div
        className={`pointer-events-none absolute inset-0 z-50 bg-white opacity-0 ${isFlashing ? 'animate-[flash_0.35s_ease-out_forwards]' : ''}`}
      />

      {/* 촬영 횟수 카운트 */}
      {phase === 'capturing' && (
        <span className="absolute top-[5%] right-[5%] z-10 text-[16px] font-semibold text-white tabular-nums">
          {filledCount} / {totalSlots}
        </span>
      )}

      {/* 기타 요소 : 이펙트, 스티커 등 */}
      {children}
    </div>
  );
}

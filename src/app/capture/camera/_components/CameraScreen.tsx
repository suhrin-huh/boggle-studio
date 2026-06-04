import Webcam from 'react-webcam';
import type { RefObject, HTMLAttributes } from 'react';

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
 * 웹캠 스트림과 플래시·카운트 UI를 조합한 카메라 촬영 화면
 * @param phase - 현재 카메라 촬영 단계
 * @param onCameraReady - 웹캠 스트림이 준비됐을 때 호출하는 콜백
 * @param filledCount - 현재까지 촬영된 슬롯 수
 * @param totalSlots - 전체 슬롯 수
 * @param webcamRef - 웹캠 엘리먼트 참조
 * @param isFlashing - 촬영 플래시 효과 활성화 여부
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
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg" {...rest}>
      {isAllFilled ? (
        <div className="bg-muted-dark/50 flex h-full w-full items-center justify-center rounded-lg">
          <p className="font-unbounded text-xl font-bold text-white">DONE!</p>
        </div>
      ) : (
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

      {phase === 'capturing' && (
        <span className="absolute top-[5%] right-[5%] z-10 text-[16px] font-semibold text-white tabular-nums">
          {filledCount + 1} / {totalSlots}
        </span>
      )}

      {children}
    </div>
  );
}

// libraries & frameworks
import type { HTMLAttributes } from 'react';

// components
import NeumorphicButton from '@/components/common/NeumorphicButton';

// assets
import { CameraPhase } from '@/types';

interface CameraControlsProps extends HTMLAttributes<HTMLDivElement> {
  phase: CameraPhase;
  onCapture: () => void;
  onPrint: () => void;
}

/**
 * 촬영 컨트롤 버튼
 * @param phase 카메라 촬영 단계
 * @param onCapture 촬영 버튼 클릭 핸들러
 * @param onPrint 프레임 선택 버튼 클릭 핸들러
 */
export default function CameraControls({ phase, onCapture, onPrint }: CameraControlsProps) {
  // 카메라 준비 중 → 버튼 없음
  if (phase === 'loading') return null;

  // 모든 슬롯 완료 → 프레임 선택 버튼
  if (phase === 'done') {
    return (
      <NeumorphicButton className="mx-auto w-1/2 md:h-15" onClick={onPrint}>
        Choose a Frame
      </NeumorphicButton>
    );
  }

  // idle | capturing → 촬영 버튼 (촬영 중에는 비활성화)
  return (
    <NeumorphicButton
      className="mx-auto w-1/2 md:h-15"
      disabled={phase === 'capturing'}
      onClick={onCapture}
    >
      Start!
    </NeumorphicButton>
  );
}

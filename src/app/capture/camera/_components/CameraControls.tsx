import type { HTMLAttributes } from 'react';

import NeumorphicButton from '@/components/common/NeumorphicButton';

import { CameraPhase } from '@/types';

interface CameraControlsProps extends HTMLAttributes<HTMLDivElement> {
  phase: CameraPhase;
  onCapture: () => void;
  onPrint: () => void;
}

/**
 * 촬영 컨트롤 버튼
 * @param phase - 카메라 촬영 단계
 * @param onCapture - 촬영 버튼 클릭 핸들러
 * @param onPrint - 프레임 선택 버튼 클릭 핸들러
 */
export default function CameraControls({ phase, onCapture, onPrint }: CameraControlsProps) {
  if (phase === 'loading') return null;

  if (phase === 'done') {
    return (
      <NeumorphicButton className="mx-auto w-1/2 sm:h-15" onClick={onPrint}>
        Choose a Frame
      </NeumorphicButton>
    );
  }

  return (
    <NeumorphicButton
      className="mx-auto w-1/2 sm:h-15"
      disabled={phase === 'capturing'}
      onClick={onCapture}
    >
      Start!
    </NeumorphicButton>
  );
}

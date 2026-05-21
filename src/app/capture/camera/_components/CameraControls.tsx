import NeumorphicButton from '@/components/common/NeumorphicButton';
import type { HTMLAttributes } from 'react';

interface CameraControlsProps extends HTMLAttributes<HTMLDivElement> {
  isAllFilled: boolean;
  isCapturing: boolean;
  onCapture: () => void;
  onPrint: () => void;
}

/**
 * 촬영 컨트롤 버튼
 * @param isAllFilled : 모든 슬롯 촬영 완료 여부 — true이면 버튼이 Next로 전환됨
 * @param isCapturing: 자동 촬영 시퀀스 진행 중 여부 — true이면 버튼 비활성화
 * @param onCapture: 촬영 버튼 클릭 핸들러
 * @param onPrint: Next 버튼 클릭 핸들러
 * @param @returns
 */
export default function CameraControls({
  isAllFilled,
  isCapturing,
  onCapture,
  onPrint,
}: CameraControlsProps) {
  return (
    <div className="flex w-full gap-3">
      <NeumorphicButton
        className={`flex-1 ${isAllFilled ? 'text-red-800' : ''} ${isCapturing ? 'opacity-50' : ''}`}
        disabled={isCapturing}
        onClick={isAllFilled ? onPrint : onCapture}
      >
        {isAllFilled ? 'Choose a Frame' : 'Capture'}
      </NeumorphicButton>
    </div>
  );
}

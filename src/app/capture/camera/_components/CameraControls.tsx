import NeumorphicButton from '@/components/common/NeumorphicButton';
import type { HTMLAttributes } from 'react';

interface CameraControlsProps extends HTMLAttributes<HTMLDivElement> {
  isAllFilled: boolean;
  onCapture: () => void;
  onPrint: () => void;
}

export default function CameraControls({ isAllFilled, onCapture, onPrint }: CameraControlsProps) {
  return (
    <div className="flex w-full gap-3">
      <NeumorphicButton
        className={`flex-1 ${isAllFilled ? 'text-red-800' : ''}`}
        onClick={isAllFilled ? onPrint : onCapture}
      >
        {isAllFilled ? 'Select a Frame' : 'Capture'}
      </NeumorphicButton>
    </div>
  );
}

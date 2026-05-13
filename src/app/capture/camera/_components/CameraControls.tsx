import NeumorphicButton from '@/components/common/NeumorphicButton';
import type { HTMLAttributes } from 'react';

interface CameraControlsProps extends HTMLAttributes<HTMLDivElement> {
  effectType?: string | null;
  isPlaying: boolean;
  isAllFilled: boolean;
  onTogglePlay: () => void;
  onCapture: () => void;
  onPrint: () => void;
}

export default function CameraControls({
  effectType,
  isPlaying,
  isAllFilled,
  onTogglePlay,
  onCapture,
  onPrint,
}: CameraControlsProps) {
  return (
    <div className="flex w-full gap-3">
      {effectType && (
        <NeumorphicButton className="flex-1" onClick={onTogglePlay}>
          {isPlaying ? 'Pause Effect' : 'Play Effect'}
        </NeumorphicButton>
      )}

      <NeumorphicButton
        className={`flex-1 ${isAllFilled ? 'text-red-800' : ''}`}
        onClick={isAllFilled ? onPrint : onCapture}
      >
        {isAllFilled ? 'Create Your Print!' : 'Capture'}
      </NeumorphicButton>
    </div>
  );
}

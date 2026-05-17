import { FRAME_OPTIONS, FrameType } from '@/constants/booth';
import { CheckIcon } from '@/assets/icon/CheckIcon';

interface FrameTypeButtonsProps {
  frameKeys: FrameType[];
  selected: FrameType;
  onSelect: (frame: FrameType) => void;
}

export default function FrameTypeButtons({ frameKeys, selected, onSelect }: FrameTypeButtonsProps) {
  return (
    <div className="gap-sm flex">
      {frameKeys.map((frameKey) => {
        const isSelected = selected === frameKey;
        return (
          <button
            key={frameKey}
            onClick={() => onSelect(frameKey)}
            className="px-lg py-md text-muted-dark border-muted-light font-unbounded relative overflow-hidden rounded-full border text-xs tracking-widest transition-colors"
          >
            {FRAME_OPTIONS[frameKey].label}
            {isSelected && (
              <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                <CheckIcon size={24} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

import { FRAME_OPTIONS, FrameType } from '@/constants/booth';
import { CheckIcon } from '@/assets/icon/CheckIcon';

interface FrameTypePickerProps {
  frameKeys: FrameType[];
  selected: FrameType;
  onSelect: (frame: FrameType) => void;
}

export default function FrameTypePicker({ frameKeys, selected, onSelect }: FrameTypePickerProps) {
  return (
    <ul className="gap-sm flex">
      {frameKeys.map((frameKey) => {
        const isSelected = selected === frameKey;
        return (
          <li key={frameKey}>
            <button
              onClick={() => onSelect(frameKey)}
              className="px-lg py-xs sm:py-sm sm:text-body-lg text-muted-dark border-muted-light text-body-xs relative overflow-hidden rounded-lg border transition-colors"
            >
              {FRAME_OPTIONS[frameKey].label}
              {isSelected && (
                <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                  <CheckIcon size={24} />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

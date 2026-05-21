// libraries & frameworks
import Image from 'next/image';

// assets & types
import { BACKGROUND_OPTIONS, Background } from '@/constants/booth';

interface BackgroundPickerProps {
  bgKeys: Background[];
  selected: Background;
  onSelect: (bg: Background) => void;
}

/**
 *
 * @property bgKeys 배경 옵션 종류
 * @property selected 선택된 옵션
 * @property onSelect 옵션 클릭 핸들러
 */
export default function BackgroundPicker({ bgKeys, selected, onSelect }: BackgroundPickerProps) {
  return (
    <ul className="gap-sm flex flex-wrap justify-center">
      {bgKeys.map((bgKey) => {
        const isSelected = selected === bgKey;
        return (
          <li key={bgKey}>
            <button
              onClick={() => onSelect(bgKey)}
              className={`relative block h-10 w-10 overflow-hidden rounded-full transition-all ${
                isSelected ? 'ring-3 ring-white ring-offset-2 ring-offset-black' : ''
              }`}
              aria-label={BACKGROUND_OPTIONS[bgKey].label}
            >
              <Image
                src={BACKGROUND_OPTIONS[bgKey].sampleImageUrl}
                alt={BACKGROUND_OPTIONS[bgKey].label}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

import Image from 'next/image';
import { BACKGROUND_OPTIONS, Background } from '@/constants/booth';

interface BackgroundPickerProps {
  bgKeys: Background[];
  selected: Background;
  onSelect: (bg: Background) => void;
}

export default function BackgroundPicker({ bgKeys, selected, onSelect }: BackgroundPickerProps) {
  return (
    <ul className="gap-md flex flex-wrap justify-center">
      {bgKeys.map((bgKey) => {
        const isSelected = selected === bgKey;
        return (
          <li key={bgKey}>
            <button
              onClick={() => onSelect(bgKey)}
              className={`relative block h-12.5 w-12.5 overflow-hidden rounded-full transition-all ${
                isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
              }`}
              aria-label={BACKGROUND_OPTIONS[bgKey].label}
            >
              <Image
                src={BACKGROUND_OPTIONS[bgKey].sampleImageUrl}
                alt={BACKGROUND_OPTIONS[bgKey].label}
                width={50}
                height={50}
                className="h-full w-full object-cover"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

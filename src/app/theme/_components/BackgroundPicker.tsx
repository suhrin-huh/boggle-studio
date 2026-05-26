// libraries & frameworks
import Image from 'next/image';

// components
import Carousel from '@/components/common/Carousel';

// assets & types
import { BACKGROUND_OPTIONS, Background } from '@/constants/booth';

/** 캐러셀에 동시 표시할 배경 옵션 개수 */
const VISIBLE_COUNT = 5;
/** 배경 옵션 아이템의 크기(px) */
const ITEM_SIZE = 40;
/** 배경 옵션 아이템 간 간격(px) — gap-sm(8px) 기준 */
const ITEM_GAP = 8;

interface BackgroundPickerProps {
  bgKeys: Background[];
  selected: Background;
  onSelect: (bg: Background) => void;
}

/**
 * @property bgKeys 배경 옵션 종류
 * @property selected 선택된 옵션
 * @property onSelect 옵션 변경 핸들러
 */
export default function BackgroundPicker({ bgKeys, selected, onSelect }: BackgroundPickerProps) {
  return (
    <Carousel
      items={bgKeys}
      renderItem={(bgKey, _index, isActive) => (
        <div className="p-sm">
          <Image
            src={BACKGROUND_OPTIONS[bgKey].sampleImageUrl}
            alt={BACKGROUND_OPTIONS[bgKey].label}
            width={ITEM_SIZE}
            height={ITEM_SIZE}
            className={`rounded-full object-cover transition-all ${
              isActive ? 'ring-1 ring-white ring-offset-1 ring-offset-black' : ''
            }`}
          />
        </div>
      )}
      visibleCount={VISIBLE_COUNT}
      itemWidth={ITEM_SIZE}
      itemGap={ITEM_GAP}
      currentIndex={Math.max(0, bgKeys.indexOf(selected))}
      onIndexChange={(index) => onSelect(bgKeys[index])}
    />
  );
}

import Image from 'next/image';

import Carousel from '@/components/common/Carousel';

import { BACKGROUND_OPTIONS, Background } from '@/constants';

const VISIBLE_COUNT = 5;
const ITEM_SIZE = 50; // px
const ITEM_GAP = 8; // gap-sm(8px) 기준

interface BackgroundPickerProps {
  bgKeys: Background[];
  selected: Background;
  onSelect: (bg: Background) => void;
}

/**
 * 배경 선택 캐러셀 컴포넌트
 * @param bgKeys - 선택 가능한 배경 종류 키 배열
 * @param selected - 현재 선택된 배경 키
 * @param onSelect - 배경 선택 시 호출되는 핸들러
 */
export default function BackgroundPicker({ bgKeys, selected, onSelect }: BackgroundPickerProps) {
  return (
    <Carousel
      items={bgKeys}
      renderItem={(bgKey, _index, isActive) => (
        <div className="p-sm select-none">
          <Image
            src={BACKGROUND_OPTIONS[bgKey].sampleImageUrl}
            alt={`option-${BACKGROUND_OPTIONS[bgKey].id}`}
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

// libraries & frameworks
import Image from 'next/image';

// components
import Carousel from '@/components/common/Carousel';

// assets & types
import { BACKGROUND_OPTIONS, Background } from '@/constants';

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
 * 배경 선택 캐러셀 컴포넌트
 * 사용 가능한 배경 옵션을 캐러셀 형태로 표시하고, 선택된 항목에 링 스타일을 적용
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

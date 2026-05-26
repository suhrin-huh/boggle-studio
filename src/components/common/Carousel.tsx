'use client';

import ChevronLeftIcon from '@/assets/icon/ChevronLeftIcon';
import ChevronRightIcon from '@/assets/icon/ChevronRightIcon';

interface CarouselProps<T> {
  /** 렌더링할 아이템 배열 */
  items: T[];
  /** 각 아이템을 렌더링하는 함수 (item, index, isActive) */
  renderItem: (item: T, index: number, isActive: boolean) => React.ReactNode;
  /** 무한 순환 여부 (기본값: false) */
  infinite?: boolean;
  /** 인덱스 변경 시 호출되는 콜백 */
  onIndexChange?: (index: number) => void;
  /** 최외곽 div에 추가할 CSS 클래스 */
  className?: string;
  // --- 슬라이딩 모드 전용 props ---
  /** 한 번에 보여줄 아이템 수 */
  visibleCount?: number;
  /** 각 아이템의 너비(px). 지정 시 슬라이딩 모드로 동작 */
  itemWidth?: number;
  /** 아이템 간 간격(px) (기본값: 0) */
  itemGap?: number;
  /** 현재 선택된 인덱스 (부모가 상태를 소유, 기본값: 0) */
  currentIndex?: number;
}

/**
 * 제네릭 슬라이드 캐러셀 컴포넌트.
 * `itemWidth`를 지정하면 다수의 아이템이 슬라이딩 방식으로 표시되며,
 * 미지정 시 기존 show/hide 방식으로 동작합니다.
 *
 * @param items - 렌더링할 아이템 배열
 * @param renderItem - 각 아이템을 렌더링하는 함수 (item, index, isActive)
 * @param infinite - 무한 순환 여부 (기본값: false)
 * @param onIndexChange - 인덱스 변경 시 호출되는 콜백
 * @param className - 최외곽 div에 추가할 CSS 클래스
 * @param visibleCount - 슬라이딩 모드: 한 번에 보여줄 아이템 수
 * @param itemWidth - 슬라이딩 모드: 각 아이템의 너비(px). 지정 시 슬라이딩 활성화
 * @param itemGap - 슬라이딩 모드: 아이템 간격(px) (기본값: 0)
 * @param currentIndex - 현재 선택된 인덱스 (부모가 상태를 소유, 기본값: 0)
 */
export default function Carousel<T>({
  items,
  renderItem,
  infinite = false,
  onIndexChange,
  className,
  visibleCount,
  itemWidth,
  itemGap,
  currentIndex = 0,
}: CarouselProps<T>) {
  const navigate = (nextIndex: number) => {
    onIndexChange?.(nextIndex);
  };

  const goPrev = () => {
    if (infinite) {
      navigate((currentIndex - 1 + items.length) % items.length);
    } else if (currentIndex > 0) {
      navigate(currentIndex - 1);
    }
  };

  const goNext = () => {
    if (infinite) {
      navigate((currentIndex + 1) % items.length);
    } else if (currentIndex < items.length - 1) {
      navigate(currentIndex + 1);
    }
  };

  // !infinite 모드일 때 범위를 벗어난 클릭을 막는 시각적/기능적 제약
  const isPrevDisabled = !infinite && currentIndex === 0;
  const isNextDisabled = !infinite && currentIndex === items.length - 1;

  if (items.length === 0) return null;

  // 슬라이딩 모드 여부: itemWidth가 지정된 경우에만 활성화
  const isSlidingMode = itemWidth !== undefined;

  // --- 슬라이딩 모드 계산 ---
  const gap = itemGap ?? 0;
  const itemTotalWidth = isSlidingMode ? itemWidth + gap : 0;

  // 전체 width
  const viewportWidth = isSlidingMode ? (visibleCount ?? 1) * itemTotalWidth - gap : 0;

  // 선택 아이템을 뷰포트 중앙에 배치하는 translateX 값
  const translateX = isSlidingMode
    ? (viewportWidth - itemWidth) / 2 - currentIndex * itemTotalWidth
    : 0;

  return (
    <div className={`gap-lg flex items-center ${className ?? ''}`}>
      <button
        onClick={goPrev}
        disabled={isPrevDisabled}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 shadow transition-all hover:scale-110 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="이전 아이템으로 이동"
      >
        <ChevronLeftIcon />
      </button>

      {isSlidingMode ? (
        /* 슬라이딩 모드: 고정 너비 뷰포트 안에서 translateX 애니메이션으로 슬라이드 */
        <div style={{ width: viewportWidth }} className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ gap, transform: `translateX(${translateX}px)` }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(index)}
                style={{ width: itemWidth, flexShrink: 0 }}
                className="cursor-pointer"
              >
                {renderItem(item, index, index === currentIndex)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 기존 show/hide 모드: 이미지 사전 로드로 전환 시 지연 없음 */
        <div className="flex flex-1 justify-center overflow-hidden">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-1 justify-center ${index === currentIndex ? '' : 'hidden'}`}
            >
              {renderItem(item, index, index === currentIndex)}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={goNext}
        disabled={isNextDisabled}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 shadow transition-all hover:scale-110 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="다음 아이템으로 이동"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

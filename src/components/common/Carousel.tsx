'use client';

import { useState } from 'react';

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  infinite?: boolean;
  onIndexChange?: (index: number) => void;
  className?: string;
}

export default function Carousel<T>({
  items,
  renderItem,
  infinite = false,
  onIndexChange,
  className,
}: CarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
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

  // !infinite 모드일 때 사용자가 범위를 벗어난 클릭을 하지 못하도록 시각적/기능적 제약
  const isPrevDisabled = !infinite && currentIndex === 0;
  const isNextDisabled = !infinite && currentIndex === items.length - 1;

  if (items.length === 0) return null;

  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`}>
      <button
        onClick={goPrev}
        disabled={isPrevDisabled}
        className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="이전 아이템으로 이동"
      >
        ◀
      </button>
      {/* flex-1과 overflow-hidden : 캐러셀 내용물이 부모 컨테이너를 벗어나지 않도록 영역을 확보*/}
      <div className="flex flex-1 justify-center overflow-hidden">
        <div className="flex flex-1 justify-center">
          {renderItem(items[currentIndex], currentIndex)}
        </div>
      </div>

      <button
        onClick={goNext}
        disabled={isNextDisabled}
        className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="다음 아이템으로 이동"
      >
        ▶
      </button>
    </div>
  );
}

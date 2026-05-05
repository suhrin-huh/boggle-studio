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
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 shadow transition-all hover:scale-110 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="이전 아이템으로 이동"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* 모든 아이템을 미리 렌더링하고 CSS로 show/hide — 이미지 사전 로드로 전환 시 지연 없음 */}
      <div className="flex flex-1 justify-center overflow-hidden">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex flex-1 justify-center ${index === currentIndex ? '' : 'hidden'}`}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <button
        onClick={goNext}
        disabled={isNextDisabled}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 shadow transition-all hover:scale-110 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="다음 아이템으로 이동"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

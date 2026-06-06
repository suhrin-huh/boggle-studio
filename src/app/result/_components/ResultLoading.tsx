import Image from 'next/image';

import generatingSampleImg from '@/assets/image/generating-sample.png';

interface SlotBezelProps {
  variant: 'full' | 'top';
}

/**
 * 즉석 사진 출력구 UI 컴포넌트
 * @param variant - full: 전체 높이 배경 베젤 / top: 입체감을 위한 상단 덮개 베젤
 */
function SlotBezel({ variant }: SlotBezelProps) {
  const isTop = variant === 'top';

  return (
    <div
      className={`bg-muted-hover absolute top-0 flex w-60 justify-center border-white ${
        isTop
          ? 'z-20 h-6 items-end rounded-t-2xl border-4 border-b-0'
          : 'z-10 h-12 items-center rounded-2xl border-4 shadow-md'
      }`}
    >
      <div className={`bg-muted-dark w-50 ${isTop ? 'h-2 rounded-t-full' : 'h-4 rounded-full'}`} />
    </div>
  );
}

/**
 * 합성된 사진이 출력되기 전, 기기에서 밀려 나오는 애니메이션 로딩 컴포넌트
 */
export default function ResultLoading() {
  return (
    <>
      <div className="relative flex h-120 w-full flex-col items-center justify-start overflow-hidden pt-10 font-sans">
        <SlotBezel variant="full" />

        <div className="absolute top-7.5 z-10 flex w-60 animate-[photo-emerge-down_5s_ease-out_forwards] flex-col items-center overflow-hidden">
          <Image src={generatingSampleImg} alt="sample image" width={150} height={450} />
        </div>

        <SlotBezel variant="top" />
      </div>
    </>
  );
}

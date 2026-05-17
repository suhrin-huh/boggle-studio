import Image from 'next/image';
import PageTitle from '@/components/common/PageTitle';

interface SlotBezelProps {
  /**
   * - `full`: 사진 뒤에 깔리는 베젤 배경 (z-index: 10, 전체 높이)
   * - `top`: 사진 앞을 덮어 입체감을 주는 상단 베젤 덮개 (z-index: 20, 절반 높이)
   */
  variant: 'full' | 'top';
}

/**
 * 즉석 사진 출력구 UI 컴포넌트
 * @property variant : full | top
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
 * - 합성된 사진이 출력되기 전 Loading component
 * - 사진이 기기 내부에서 밀려 나오는 듯한 효과
 */
export default function ResultLoading() {
  return (
    <>
      <PageTitle title="Generating..." />
      <div className="relative flex h-120 w-full flex-col items-center justify-start overflow-hidden pt-10 font-sans">
        {/* 뒤에 깔리는 전체 베젤 */}
        <SlotBezel variant="full" />

        {/* 예시 이미지 */}
        <div className="absolute top-[30px] z-10 flex w-60 animate-[photo-emerge-down_3s_ease-out_forwards] flex-col items-center overflow-hidden">
          <Image src="/images/samples/black.png" alt="sample image" width={150} height={450} />
        </div>

        {/* 앞을 덮는 상단 덮개 베젤 */}
        <SlotBezel variant="top" />
      </div>
    </>
  );
}

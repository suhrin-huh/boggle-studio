import Image from 'next/image';
import { FrameType } from '@/constants';
import PreviewPhotoCanvas from './PreviewPhotoCanvas';

interface ThemePreviewProps {
  src: string;
  width: number;
  height: number;
  selectedFrame: FrameType;
  overlayUrl?: string | null;
}

/**
 * 선택된 테마의 미리보기 컴포넌트
 * 배경 이미지 → 사진 캔버스(z-10) → 오버레이(z-20) 순으로 레이어를 쌓아
 * 실제 최종 결과물과 동일한 합성 순서를 미리보기로 표현
 * @param src        - 배경 이미지 URL
 * @param width      - 이미지 너비(px)
 * @param height     - 이미지 높이(px)
 * @param selectedFrame  - 현재 선택된 프레임 타입 ('basic' | 'wide')
 * @param overlayUrl - 오버레이 이미지 URL (null이면 오버레이 없음)
 */
export default function ThemePreview({
  src,
  width,
  height,
  selectedFrame,
  overlayUrl,
}: ThemePreviewProps) {
  return (
    <div className="flex justify-center">
      <div className="relative overflow-hidden">
        {/* 레이어 1: 배경 프레임 이미지 */}
        <Image
          src={src}
          alt="theme preview"
          width={width}
          height={height}
          className="object-cover"
          priority
        />
        {/* 레이어 2: 사진 슬롯 캔버스 */}
        <PreviewPhotoCanvas selectedFrame={selectedFrame} />
        {/* 레이어 3: 오버레이 (wide 프레임에만 존재) */}
        {overlayUrl && (
          <img
            src={overlayUrl}
            alt=""
            className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

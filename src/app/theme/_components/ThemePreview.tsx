import Image from 'next/image';

import PreviewPhotoCanvas from './PreviewPhotoCanvas';

import { FrameType } from '@/constants';

interface ThemePreviewProps {
  selectedFrame: FrameType;
  width: number;
  height: number;
  backgroundUrl: string;
  overlayUrl: string | null;
}

/**
 * 선택된 테마의 미리보기 컴포넌트
 * - background -> photo -> overlay
 * @param selectedFrame - 현재 선택된 프레임 타입
 * @param width - 이미지 너비(px)
 * @param height - 이미지 높이(px)
 * @param backgroundUrl - 배경 이미지 URL
 * @param overlayUrl - 오버레이 이미지 URL (null이면 오버레이 없음)
 */
export default function ThemePreview({
  selectedFrame,
  width,
  height,
  backgroundUrl,
  overlayUrl,
}: ThemePreviewProps) {
  return (
    <div className="flex justify-center">
      <div className="relative overflow-hidden" style={{ width, height }}>
        <Image
          src={backgroundUrl}
          alt="theme preview"
          width={width}
          height={height}
          className="object-cover"
          priority
        />
        <PreviewPhotoCanvas selectedFrame={selectedFrame} />
        {overlayUrl && (
          <Image
            src={overlayUrl}
            width={width}
            height={height}
            alt="preview-overlay"
            className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

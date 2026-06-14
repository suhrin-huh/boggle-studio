'use client';

import { useEffect, useRef } from 'react';

import { useBoothStore } from '@/store/useBoothStore';
import { batchDrawPhotoSlots } from '@/utils/canvasHelper';

import { FRAME_OPTIONS, FrameType, PREVIEW_SCALE } from '@/constants';

interface PreviewPhotoCanvasProps {
  selectedFrame: FrameType;
}

/**
 * 미리보기 크기(PREVIEW_SCALE)로 축소된 캔버스에 사진 슬롯을 합성하는 컴포넌트
 * @param selectedFrame - 현재 선택된 프레임 타입
 */
export default function PreviewPhotoCanvas({ selectedFrame }: PreviewPhotoCanvasProps) {
  const photoSlots = useBoothStore((state) => state.photoSlots);
  const canvasRefs = useRef<Partial<Record<FrameType, HTMLCanvasElement | null>>>({});
  const frameKeys = Object.keys(FRAME_OPTIONS) as FrameType[];

  useEffect(() => {
    if (photoSlots.length === 0) return;

    const drawToCanvas = async (canvas: HTMLCanvasElement, frameType: FrameType) => {
      const { width, height, slots } = FRAME_OPTIONS[frameType];
      const cw = Math.round(width * PREVIEW_SCALE);
      const ch = Math.round(height * PREVIEW_SCALE);
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, cw, ch);
      await batchDrawPhotoSlots(ctx, photoSlots, slots, PREVIEW_SCALE);
    };

    frameKeys.forEach((key) => {
      const el = canvasRefs.current[key];
      if (el) drawToCanvas(el, key);
    });
  }, [photoSlots.length]);

  return (
    <>
      {frameKeys.map((key) => (
        <canvas
          key={key}
          ref={(el) => {
            canvasRefs.current[key] = el;
          }}
          className={`absolute inset-0 z-10 ${selectedFrame === key ? '' : 'hidden'}`}
        />
      ))}
    </>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { FRAME_OPTIONS, FrameType, PREVIEW_SCALE } from '@/constants/booth';
import { useBoothStore } from '@/store/useBoothStore';
import { batchDrawPhotoSlots } from '@/utils/canvasHelper';

interface PreviewPhotoCanvasProps {
  selectedFrame: FrameType;
}

/**
 * 미리보기 크기(PREVIEW_SCALE)로 축소된 캔버스에 사진 슬롯을 합성하는 컴포넌트
 * basic/wide 두 캔버스를 모두 미리 그려두어, 배경·프레임 전환 시 재합성 없이 즉시 전환
 */
export default function PreviewPhotoCanvas({ selectedFrame }: PreviewPhotoCanvasProps) {
  const photoSlots = useBoothStore((state) => state.photoSlots);
  const basicCanvasRef = useRef<HTMLCanvasElement>(null);
  const wideCanvasRef = useRef<HTMLCanvasElement>(null);

  // 마운트 시 basic/wide 두 캔버스를 모두 그려두어 배경 전환 시 재합성 불필요
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

    if (basicCanvasRef.current) drawToCanvas(basicCanvasRef.current, 'basic');
    if (wideCanvasRef.current) drawToCanvas(wideCanvasRef.current, 'wide');
  }, [photoSlots]);

  return (
    <>
      <canvas
        ref={basicCanvasRef}
        className={`absolute inset-0 ${selectedFrame === 'basic' ? '' : 'hidden'}`}
      />
      <canvas
        ref={wideCanvasRef}
        className={`absolute inset-0 ${selectedFrame === 'wide' ? '' : 'hidden'}`}
      />
    </>
  );
}

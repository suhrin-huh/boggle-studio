'use client';

import { useEffect, useRef } from 'react';
import { FRAME_OPTIONS, FrameType, PREVIEW_SCALE } from '@/constants/booth';
import { useBoothStore } from '@/store/useBoothStore';

interface PhotoCompositeCanvasProps {
  selectedFrame: FrameType;
}

async function drawPhotosOnCanvas(
  canvas: HTMLCanvasElement,
  frameType: FrameType,
  photoSlots: string[],
) {
  const { width, height, slots } = FRAME_OPTIONS[frameType];
  const cw = Math.round(width * PREVIEW_SCALE);
  const ch = Math.round(height * PREVIEW_SCALE);

  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, cw, ch);

  await Promise.all(
    slots.map((slot, i) => {
      const src = photoSlots[i];
      if (!src) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          ctx.drawImage(
            img,
            Math.round(slot.x * PREVIEW_SCALE),
            Math.round(slot.y * PREVIEW_SCALE),
            Math.round(slot.width * PREVIEW_SCALE),
            Math.round(slot.height * PREVIEW_SCALE),
          );
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src;
      });
    }),
  );
}

export default function PhotoCompositeCanvas({ selectedFrame }: PhotoCompositeCanvasProps) {
  const photoSlots = useBoothStore((state) => state.photoSlots);
  const basicCanvasRef = useRef<HTMLCanvasElement>(null);
  const wideCanvasRef = useRef<HTMLCanvasElement>(null);

  // 마운트 시 basic/wide 두 캔버스를 모두 그려두어 배경 전환 시 재합성 불필요
  useEffect(() => {
    if (photoSlots.length === 0) return;
    if (basicCanvasRef.current) drawPhotosOnCanvas(basicCanvasRef.current, 'basic', photoSlots);
    if (wideCanvasRef.current) drawPhotosOnCanvas(wideCanvasRef.current, 'wide', photoSlots);
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

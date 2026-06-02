import { useState, useRef, useCallback, useEffect } from 'react';

// 출력 이미지 가로 크기 (px)
export const CROP_OUTPUT_WIDTH = 400;

// 출력 이미지 세로 크기 (px)
export const CROP_OUTPUT_HEIGHT = 300;

// 출력 비율 (4:3)
const ASPECT = CROP_OUTPUT_WIDTH / CROP_OUTPUT_HEIGHT;

// 핸들 히트 반경 (캔버스 px)
const HANDLE_R = 10;

// 선택 영역 최소 가로 크기 (캔버스 px)
const MIN_SEL_W = 40;

// 선택 영역 최소 세로 크기 (캔버스 px)
const MIN_SEL_H = 30;

/** 캔버스 좌표 기준 선택 영역 (4:3 직사각형) */
interface CropSelection {
  x: number;
  y: number;
  w: number; // 캔버스 px
  h: number; // 캔버스 px — 항상 w * (CROP_OUTPUT_HEIGHT / CROP_OUTPUT_WIDTH)
}

/** 캔버스 렌더 메타데이터 */
interface CropImgData {
  img: HTMLImageElement;
  scale: number;
  drawW: number;
  drawH: number;
  offX: number;
  offY: number;
}

/** 드래그 상태 */
type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se';
interface DragState {
  mode: DragMode;
  startX: number;
  startY: number;
  origSel: CropSelection;
}

/** 핸들 */
interface Handle {
  id: DragMode;
  cx: number;
  cy: number;
}

/** cropRect — 원본 이미지 픽셀 기준 최종 결과 */
export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface UseCropSelectionReturn {
  /** 확정된 크롭 영역 (원본 픽셀 기준). confirmCrop() 호출 전엔 null */
  cropRect: CropRect | null;
  /** 파일을 로드하고 캔버스를 초기화 */
  loadFile: (file: File) => void;
  /** <canvas> ref — JSX에 붙여야 함 */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** 크롭 영역을 base64 PNG로 반환 (CROP_OUTPUT_WIDTH × CROP_OUTPUT_HEIGHT). cropRect가 없으면 null */
  cropToBase64: () => string | null;
  /** cropRect만 초기 80% 중앙 선택으로 리셋 (이미지 유지) */
  resetCrop: () => void;
  /** 이미지·상태 전체 초기화 */
  reset: () => void;
  /** 현재 선택 영역을 cropRect로 확정 */
  confirmCrop: () => void;
}

/** 가로 크기로부터 세로 크기를 계산 */
const heightFromWidth = (w: number) => w / ASPECT;

/* ════════════════════════════════════════════════════
   훅
════════════════════════════════════════════════════ */
export const useCropSelection = (): UseCropSelectionReturn => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgDataRef = useRef<CropImgData | null>(null);
  const selectionRef = useRef<CropSelection | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const cropRectRef = useRef<CropRect | null>(null);
  const imageUrlRef = useRef<string | null>(null);

  // cropRect는 외부에서 읽을 수 있도록 state로도 노출
  const [cropRect, setCropRect] = useState<CropRect | null>(null);

  /* ── 핸들 위치 계산 (4 모서리) ──────────────────── */
  const getHandles = (sel: CropSelection): Handle[] => [
    { id: 'nw', cx: sel.x, cy: sel.y },
    { id: 'ne', cx: sel.x + sel.w, cy: sel.y },
    { id: 'sw', cx: sel.x, cy: sel.y + sel.h },
    { id: 'se', cx: sel.x + sel.w, cy: sel.y + sel.h },
  ];

  const hitHandle = (pos: { x: number; y: number }, sel: CropSelection): Handle | undefined =>
    getHandles(sel).find((h) => Math.hypot(pos.x - h.cx, pos.y - h.cy) <= HANDLE_R);

  const insideSel = (pos: { x: number; y: number }, sel: CropSelection): boolean =>
    pos.x > sel.x && pos.x < sel.x + sel.w && pos.y > sel.y && pos.y < sel.y + sel.h;

  /* ── 캔버스 좌표 변환 ───────────────────────────── */
  const getCanvasPos = useCallback((e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = 'touches' in e ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  }, []);

  /* ── 캔버스 그리기 ──────────────────────────────── */
  const drawCrop = useCallback(() => {
    const canvas = canvasRef.current;
    const d = imgDataRef.current;
    const sel = selectionRef.current;
    if (!canvas || !d || !sel) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. 이미지
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(d.img, 0, 0, d.img.width, d.img.height, d.offX, d.offY, d.drawW, d.drawH);

    // 2. 선택 영역 밖 어둡게
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(sel.x, sel.y, sel.w, sel.h);
    ctx.drawImage(d.img, 0, 0, d.img.width, d.img.height, d.offX, d.offY, d.drawW, d.drawH);

    // 3. 테두리
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sel.x, sel.y, sel.w, sel.h);

    // 3×3 그리드
    const tw = sel.w / 3;
    const th = sel.h / 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 1; i <= 2; i++) {
      ctx.moveTo(sel.x + tw * i, sel.y);
      ctx.lineTo(sel.x + tw * i, sel.y + sel.h);
      ctx.moveTo(sel.x, sel.y + th * i);
      ctx.lineTo(sel.x + sel.w, sel.y + th * i);
    }
    ctx.stroke();

    // 4. 모서리 핸들
    getHandles(sel).forEach((h) => {
      ctx.beginPath();
      ctx.arc(h.cx, h.cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 선택 초기화 (80% 중앙, 4:3 비율 유지)
  const initSelection = useCallback((d: CropImgData, prev?: CropRect | null) => {
    if (prev) {
      selectionRef.current = {
        x: d.offX + prev.x * d.scale,
        y: d.offY + prev.y * d.scale,
        w: prev.w * d.scale,
        h: prev.h * d.scale,
      };
    } else {
      // 캔버스에 맞는 최대 4:3 사각형의 80%
      const maxW = d.drawW * 0.8;
      const maxH = d.drawH * 0.8;
      const w = Math.min(maxW, maxH * ASPECT);
      const h = heightFromWidth(w);
      selectionRef.current = {
        x: d.offX + (d.drawW - w) / 2,
        y: d.offY + (d.drawH - h) / 2,
        w,
        h,
      };
    }
  }, []);

  // 캔버스 초기화
  const initCanvas = useCallback(
    (img: HTMLImageElement, prev?: CropRect | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dispW = canvas.clientWidth || canvas.width;
      const dispH = canvas.clientHeight || canvas.height;
      canvas.width = dispW;
      canvas.height = dispH;

      const scale = Math.min(dispW / img.width, dispH / img.height);
      const drawW = Math.floor(img.width * scale);
      const drawH = Math.floor(img.height * scale);
      const offX = Math.floor((dispW - drawW) / 2);
      const offY = Math.floor((dispH - drawH) / 2);

      const d: CropImgData = { img, scale, drawW, drawH, offX, offY };
      imgDataRef.current = d;

      initSelection(d, prev);
      drawCrop();
    },
    [initSelection, drawCrop],
  );

  // 드래그 시작
  const handlePointerDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      const sel = selectionRef.current;
      if (!canvas || !sel) return;

      const pos = getCanvasPos(e, canvas);
      const handle = hitHandle(pos, sel);

      if (handle) {
        dragRef.current = { mode: handle.id, startX: pos.x, startY: pos.y, origSel: { ...sel } };
      } else if (insideSel(pos, sel)) {
        dragRef.current = { mode: 'move', startX: pos.x, startY: pos.y, origSel: { ...sel } };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [getCanvasPos],
  );

  // 드래그 이동
  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      const drag = dragRef.current;
      const d = imgDataRef.current;
      const sel = selectionRef.current;
      if (!canvas || !drag || !d || !sel) return;

      if ('touches' in e) e.preventDefault();

      const pos = getCanvasPos(e, canvas);
      const o = drag.origSel;
      const dx = pos.x - drag.startX;
      const dy = pos.y - drag.startY;

      // 비율을 유지하면서 크기를 계산하는 헬퍼
      // 가로 delta 기준으로 세로를 자동 계산
      const clampedW = (newW: number, maxW: number) => Math.max(MIN_SEL_W, Math.min(newW, maxW));

      if (drag.mode === 'move') {
        selectionRef.current = {
          ...sel,
          x: Math.max(d.offX, Math.min(d.offX + d.drawW - sel.w, o.x + dx)),
          y: Math.max(d.offY, Math.min(d.offY + d.drawH - sel.h, o.y + dy)),
        };
      } else if (drag.mode === 'se') {
        const nw = clampedW(
          o.w + dx,
          Math.min(d.offX + d.drawW - o.x, (d.offY + d.drawH - o.y) * ASPECT),
        );
        const nh = heightFromWidth(nw);
        selectionRef.current = { ...sel, w: nw, h: nh };
      } else if (drag.mode === 'sw') {
        const nw = clampedW(
          o.w - dx,
          Math.min(o.x + o.w - d.offX, (d.offY + d.drawH - o.y) * ASPECT),
        );
        const nh = heightFromWidth(nw);
        selectionRef.current = { ...sel, w: nw, h: nh, x: o.x + o.w - nw };
      } else if (drag.mode === 'ne') {
        const nw = clampedW(
          o.w + dx,
          Math.min(d.offX + d.drawW - o.x, (o.y + o.h - d.offY) * ASPECT),
        );
        const nh = heightFromWidth(nw);
        selectionRef.current = { ...sel, w: nw, h: nh, y: o.y + o.h - nh };
      } else if (drag.mode === 'nw') {
        const nw = clampedW(o.w - dx, Math.min(o.x + o.w - d.offX, (o.y + o.h - d.offY) * ASPECT));
        const nh = heightFromWidth(nw);
        selectionRef.current = { ...sel, w: nw, h: nh, x: o.x + o.w - nw, y: o.y + o.h - nh };
      }

      drawCrop();
    },
    [getCanvasPos, drawCrop],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  // 이벤트 등록/해제
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: MouseEvent | TouchEvent) => handlePointerDown(e);
    const onMove = (e: MouseEvent | TouchEvent) => handlePointerMove(e);
    const onUp = () => handlePointerUp();

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  // loadFile
  const loadFile = useCallback(
    (file: File) => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);

      const url = URL.createObjectURL(file);
      imageUrlRef.current = url;

      const img = new Image();
      img.onload = () => {
        cropRectRef.current = null;
        setCropRect(null);
        initCanvas(img, null);
      };
      img.src = url;
    },
    [initCanvas],
  );

  // confirmCrop
  const confirmCrop = useCallback(() => {
    const d = imgDataRef.current;
    const sel = selectionRef.current;
    if (!d || !sel) return;

    const rect: CropRect = {
      x: Math.round((sel.x - d.offX) / d.scale),
      y: Math.round((sel.y - d.offY) / d.scale),
      w: Math.round(sel.w / d.scale),
      h: Math.round(sel.h / d.scale),
    };
    cropRectRef.current = rect;
    setCropRect(rect);
  }, []);

  /* ── cropToBase64 (CROP_OUTPUT_WIDTH × CROP_OUTPUT_HEIGHT) ── */
  const cropToBase64 = useCallback((): string | null => {
    const rect = cropRectRef.current;
    const d = imgDataRef.current;
    if (!rect || !d) return null;

    const offscreen = document.createElement('canvas');
    offscreen.width = CROP_OUTPUT_WIDTH;
    offscreen.height = CROP_OUTPUT_HEIGHT;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(
      d.img,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      0,
      0,
      CROP_OUTPUT_WIDTH,
      CROP_OUTPUT_HEIGHT,
    );
    return offscreen.toDataURL('image/png');
  }, []);

  // resetCrop
  const resetCrop = useCallback(() => {
    const d = imgDataRef.current;
    if (!d) return;
    cropRectRef.current = null;
    setCropRect(null);
    initSelection(d, null);
    drawCrop();
  }, [initSelection, drawCrop]);

  // reset (전체)
  const reset = useCallback(() => {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    imageUrlRef.current = null;
    imgDataRef.current = null;
    selectionRef.current = null;
    dragRef.current = null;
    cropRectRef.current = null;
    setCropRect(null);

    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  return { cropRect, loadFile, canvasRef, cropToBase64, resetCrop, reset, confirmCrop };
};

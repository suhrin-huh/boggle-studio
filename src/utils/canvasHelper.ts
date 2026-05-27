import { ThemeConfig, PhotoSlot } from '@/types';

/**
 * 이미지 소스를 HTMLImageElement로 로드하는 함수
 */
export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`));
    img.src = src;
  });

/**
 * 메모리 상에서만 가상으로 동작하는 백그라운드 오프스크린 캔버스와 2D 컨텍스트를 생성
 * @param width       - 캔버스 너비 (px)
 * @param height      - 캔버스 높이 (px)
 * @returns canvas    - 생성된 HTMLCanvasElement 객체
 * @returns ctx       - 2D 렌더링 컨텍스트
 */
export const createAssemblyCanvas = (
  width: number,
  height: number,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context를 가져올 수 없습니다.');
  return { canvas, ctx };
};

/**
 * 단일 이미지(또는 비디오)를 캔버스에 그리는 함수
 * - rotate 값이 존재할 경우, 슬롯 중심을 기준으로 이미지(또는 비디오)를 회전
 * @param ctx         - 2D 렌더링 컨텍스트
 * @param source      - 그릴 HTMLImageElement 또는 HTMLVideoElement
 * @param slotConfig  - 슬롯 좌표·크기·회전 정보
 */
export const drawSingleSlot = (
  ctx: CanvasRenderingContext2D,
  source: HTMLImageElement | HTMLVideoElement,
  slotConfig: PhotoSlot,
): void => {
  const { x, y, width, height, rotate } = slotConfig;

  // 회전이 없는 경우 변환 없이 바로 그리기
  if (!rotate) {
    ctx.drawImage(source, x, y, width, height);
    return;
  }

  // 슬롯 중심 좌표
  const cx = x + width / 2;
  const cy = y + height / 2;

  ctx.save();
  ctx.translate(cx, cy);
  // rotate 상수는 반시계방향 기준 → Canvas는 시계방향 양수이므로 부호 반전
  ctx.rotate(-rotate * (Math.PI / 180));
  ctx.drawImage(source, -width / 2, -height / 2, width, height);
  ctx.restore();
};

/**
 * 모든 사진 소스를 병렬로 선행 로드한 후, 각각의 슬롯 좌표에 일괄 합성하는 함수
 * @param ctx         - 2D 렌더링 컨텍스트 (CanvasRenderingContext2D)
 * @param photoSrcs   - 슬롯에 배치할 사진 소스(Base64 또는 URL) 배열
 * @param slotConfigs - 프레임 규격에 정의된 개별 슬롯 설정 정보 배열
 * @param scale       - 캔버스 컨텍스트에 적용할 스케일 배율 (default 1, 미리보기 축소 시 PREVIEW_SCALE 활용)
 */
export const batchDrawPhotoSlots = async (
  ctx: CanvasRenderingContext2D,
  photoSrcs: string[],
  slotConfigs: PhotoSlot[],
  scale = 1,
): Promise<void> => {
  // 모든 이미지 소스를 미리 완벽하게 로드 (I/O 작업 격리)
  const loadedImages = await Promise.all(
    slotConfigs.map((_, i) => {
      const src = photoSrcs[i];
      if (!src) return Promise.resolve(null);
      return loadImage(src).catch(() => null); // 로드 실패 시 조용히 null 반환
    }),
  );

  // 캔버스 상태 스케일 제어권을 파이프라인 상단으로 일임
  ctx.save();
  if (scale !== 1) ctx.scale(scale, scale);

  // 이미 준비된 메모리 상의 이미지 객체들을 동기적으로 순식간에 드로잉
  loadedImages.forEach((img, i) => {
    const slotConfig = slotConfigs[i];
    if (!img || !slotConfig) return; // 이미지 로드 실패 및 빈 슬롯 방어
    drawSingleSlot(ctx, img, slotConfig);
  });

  ctx.restore();
};

/**
 * 배경 프레임 이미지를 캔버스 전체에 그리는 함수
 * @param ctx           - 2D 렌더링 컨텍스트
 * @param frameImageUrl - 배경 프레임 이미지 URL
 * @param width         - 캔버스 너비
 * @param height        - 캔버스 높이
 */
export const drawBackground = async (
  ctx: CanvasRenderingContext2D,
  frameImageUrl: string,
  width: number,
  height: number,
): Promise<void> => {
  const img = await loadImage(frameImageUrl);
  ctx.drawImage(img, 0, 0, width, height);
};

/**
 * 오버레이 이미지를 캔버스 최상단에 합성
 * @param ctx            - 2D 렌더링 컨텍스트
 * @param overlayImageUrl - 오버레이 이미지 URL
 * @param width          - 캔버스 너비
 * @param height         - 캔버스 높이
 */
export const drawOverlay = async (
  ctx: CanvasRenderingContext2D,
  overlayImageUrl: string,
  width: number,
  height: number,
): Promise<void> => {
  const img = await loadImage(overlayImageUrl);
  ctx.drawImage(img, 0, 0, width, height);
};

/**
 * ThemeConfig와 photoSlots를 기반으로 프레임 합성 이미지를 생성하는 함수
 * - 합성 순서: 배경 프레임 → 슬롯 사진(회전 적용) → 오버레이(있을 경우)
 * @param themeConfig - 프레임 크기·슬롯·배경·오버레이 정보
 * @param photoSlots  - 슬롯에 배치할 사진 소스(Base64 또는 URL) 배열
 * @returns 합성된 이미지의 Base64 문자열을 담은 Promise
 */
export const assembleFrame = async (
  themeConfig: ThemeConfig,
  photoSlots: string[],
): Promise<string> => {
  const { width, height, frameImageUrl, slots, overlayImageUrl } = themeConfig;

  // 1단계: 캔버스 생성
  const { canvas, ctx } = createAssemblyCanvas(width, height);

  // 2단계: 배경 그리기
  await drawBackground(ctx, frameImageUrl, width, height);

  // 3단계: 사용자 사진 레이어 일괄 회전 및 적층
  await batchDrawPhotoSlots(ctx, photoSlots, slots);

  // 4단계: 오버레이
  if (overlayImageUrl) await drawOverlay(ctx, overlayImageUrl, width, height);

  return canvas.toDataURL('image/png');
};

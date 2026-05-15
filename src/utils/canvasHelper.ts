import { FrameConfig } from '@/types';

/**
 * 이미지 소스를 HTMLImageElement로 로드합니다.
 */
const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`));
    img.src = src;
  });

/**
 * FrameConfig와 photoSlots를 기반으로 프레임 합성 이미지를 생성
 * 합성 순서: 배경 프레임 → 슬롯 사진들 → 오버레이(있을 경우)
 * @param frameConfig - FRAMES에서 선택된 프레임 설정
 * @param photoSlots - 슬롯에 배치할 사진 소스(Base64 또는 URL) 배열
 * @returns 합성된 이미지의 Base64 문자열을 담은 Promise
 */
export const assembleFrame = async (
  frameConfig: FrameConfig,
  photoSlots: string[],
): Promise<string> => {
  const { width, height, frameImageUrl, overlayImageUrl, slots } = frameConfig;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context를 가져올 수 없습니다.');

  // 1단계: 배경 프레임 이미지를 도화지 크기에 맞게 그리기
  const frameImage = await loadImage(frameImageUrl);
  ctx.drawImage(frameImage, 0, 0, width, height);

  // 2단계: 각 슬롯 좌표에 사진 합성
  const photoImages = await Promise.all(photoSlots.map(loadImage));
  photoImages.forEach((img, index) => {
    const slot = slots[index];
    if (!slot) return;
    ctx.drawImage(img, slot.x, slot.y, slot.width, slot.height);
  });

  // 3단계: 오버레이 이미지가 있으면 최상단에 합성
  if (overlayImageUrl) {
    const overlayImage = await loadImage(overlayImageUrl);
    ctx.drawImage(overlayImage, 0, 0, width, height);
  }

  return canvas.toDataURL('image/png');
};

/**
 * 여러 장의 이미지(현재에는 4장)를 수직으로 조립하여 하나의 Base64 이미지로 반환합니다.
 * @param images - 합성할 이미지 소스(Base64 또는 URL) 배열
 * @param frameWidth - 합성될 이미지의 너비
 * @param frameHeight - 각 개별 프레임의 높이
 * @returns 합성된 이미지의 Base64 문자열을 담은 Promise
 */
export const assembleVertical = (
  images: string[],
  frameWidth: number,
  frameHeight: number,
): Promise<string> => {
  // 이미지 로딩은 브라우저의 I/O 작업이므로 비동기 처리
  // 모든 임미지가 로드된 시점을 정확히 제어하기 위해 Promise 반환
  return new Promise((resolve, reject) => {
    // 메모리 상에서만 동작하는 오프스크린 버퍼 역할을 위해 캔버스 생성
    const canvas = document.createElement('canvas');
    canvas.width = frameWidth;
    canvas.height = frameHeight * images.length;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context를 가져올 수 없습니다.'));
      return;
    }

    /**
     * 병렬 로딩 전략
     * 모든 이미지 소스를 HTMLImageElement 객체로 변환
     * 순차적으로 하나씩 로드하면 시간이 오래 걸리므로,
     * 모든 로드 요청을 동시에 던져 네트워크 대역폭을 최대로 활용
     */
    const loadedImages = images.map(
      (src) =>
        new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = () => rej(new Error('이미지 로드 실패'));
          img.src = src;
        }),
    );

    // 배열 내의 모든 Promise가 '성공'했을 때만 다음 단계 진입
    Promise.all(loadedImages)
      .then((imgs) => {
        imgs.forEach((img, index) => {
          ctx.drawImage(img, 0, frameHeight * index, frameWidth, frameHeight);
        });
        resolve(canvas.toDataURL('image/png'));
      })
      .catch(reject);
  });
};

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

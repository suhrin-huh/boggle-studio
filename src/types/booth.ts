/**
 * 사진의 위치 좌표 및 크기 정보
 * 좌표 : 사진의 좌측 상단의 위치 좌표
 */
export interface PhotoSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**합성 이미지 제작에 필요한 Theme 정보 */
export interface ThemeConfig {
  width: number; // 프레임의 가로 길이
  height: number; // 프레임의 세로 길이
  frameImageUrl: string; // 배경 레이어
  slots: PhotoSlot[]; // 사진 슬롯 좌표 및 크기 정보 배열 (requiredPhotoCount의 개수와 일치)
}

export type CameraPhase = 'loading' | 'idle' | 'capturing' | 'done';

/**
 * 프레임 내 단일 슬롯의 위치·크기·회전 설정 정보
 */
export interface PhotoSlotConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number; // 반시계방향 기준 회전 각도 (도 단위, WIDE 프레임에만 존재)
}

/**
 * 합성 이미지 제작에 필요한 Theme 정보
 */
export interface ThemeConfig {
  width: number; // 프레임의 가로 길이
  height: number; // 프레임의 세로 길이
  frameImageUrl: string; // 배경 레이어
  slots: PhotoSlotConfig[]; // 사진 슬롯 좌표 및 크기 정보 배열 (requiredPhotoCount의 개수와 일치)
  overlayImageUrl?: string; // 슬롯 사진 위에 합성할 오버레이 이미지 경로 (선택)
}

export type CameraPhase = 'loading' | 'idle' | 'capturing' | 'done';

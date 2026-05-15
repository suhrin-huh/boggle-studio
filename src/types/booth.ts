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

/** 프레임 관련 config
 * id, label, width, height, sampleImageUrl, frameImageUrl, overlayImageUrl, slots
 */
export interface FrameConfig {
  id: string; //
  label: string; //
  width: number; // 프레임의 가로 길이
  height: number; // 프레임의 세로 길이
  sampleImageUrl: string; // 예시 이미지, 작은 사이즈
  frameImageUrl: string; // 배경 레이어
  overlayImageUrl: string | null; // 데코 레이어
  slots: PhotoSlot[]; // 사진 슬롯 좌표 및 크기 정보 배열 (requiredPhotoCount의 개수와 일치)
}

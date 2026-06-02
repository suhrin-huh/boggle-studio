/* ════════════════════════════════════════
미디어 촬영 및 생성 필요한 config 및 상수 정의
════════════════════════════════════════ */

/** 촬영 모드 옵션 (카메라 직접 촬영 / 이미지 업로드) */
export const CAPTURE_MODE = {
  camera: {
    id: 'camera',
    label: 'Camera',
    path: '/capture/camera',
  },
  upload: {
    id: 'upload',
    label: 'Upload',
    path: '/capture/upload',
  },
} as const;

/** CAPTURE_MODE 값에서 추출한 유니온 타입 */
export type CaptureMode = (typeof CAPTURE_MODE)[keyof typeof CAPTURE_MODE];

/** IndexedDB에 녹화 영상 Blob을 저장할 때 사용하는 키 접두사 */
export const VIDEO_SLOT_KEY_PREFIX = 'booth-video';

/** 촬영 버튼 클릭 후 슬롯당 카운트다운 시간 (ms) */
export const CAPTURE_INTERVAL_MS = 3000;

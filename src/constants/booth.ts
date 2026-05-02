/**
 * 서비스에 필요한 config
 */

import { FrameConfig } from '@/types/booth';

export const CAPTURE_MODE = {
  camera: {
    id: 'camera',
    label: '촬영하기',
    path: 'capture/camera',
  },
  upload: {
    id: 'upload',
    label: '업로드하기',
    path: 'capture/upload',
  },
} as const;

// 특정 속성의 값들만 타입으로 추출
export type CaptureMode = (typeof CAPTURE_MODE)[keyof typeof CAPTURE_MODE]['id'];
// 결과: 'camera' | 'upload';

/**
 * 현재 프레임 미완성으로 모두 동일한 sample image를 보여준다.
 * => next/image + Config 데이터의 width, height 활용하여 CLS 방지
 * id, label, width, height, requiredPhotoCount, sampleImageUrl, frameImageUrl, overlayImageUrl, slots
 */
export const FRAMES = {
  basic_black: {
    id: 'basic_black',
    label: '기본 블랙',
    width: 600,
    height: 1800,
    requiredPhotoCount: 4,
    frameImageUrl: '/images/frames/basic-black.png',
    sampleImageUrl: '/images/frames/basic-black.png',
    overlayImageUrl: null,
    slots: [
      { x: 30, y: 110, width: 540, height: 405 }, // 첫 번째 사진
      { x: 30, y: 525, width: 540, height: 405 }, // 두 번째 사진
      { x: 30, y: 940, width: 540, height: 405 }, // 세 번째 사진
      { x: 30, y: 1355, width: 540, height: 405 }, // 네 번째 사진
    ],
  },
  basic_white: {
    id: 'basic_white',
    label: '기본 화이트',
    width: 600,
    height: 1800,
    requiredPhotoCount: 4,
    frameImageUrl: '/images/frames/basic-white.png',
    sampleImageUrl: '/images/frames/basic-white.png',
    overlayImageUrl: null,
    slots: [
      { x: 30, y: 110, width: 540, height: 405 }, // 첫 번째 사진
      { x: 30, y: 525, width: 540, height: 405 }, // 두 번째 사진
      { x: 30, y: 940, width: 540, height: 405 }, // 세 번째 사진
      { x: 30, y: 1355, width: 540, height: 405 }, // 네 번째 사진
    ],
  },
  dark_denim: {
    id: 'dark_denim',
    label: '다크 데님',
    width: 600,
    height: 1800,
    requiredPhotoCount: 4,
    frameImageUrl: '/images/frames/dark-denim.png',
    sampleImageUrl: '/images/frames/dark-denim.png',
    overlayImageUrl: '/images/overlays/blue-silver-1.png',
    slots: [
      { x: 30, y: 110, width: 540, height: 405 }, // 첫 번째 사진
      { x: 30, y: 525, width: 540, height: 405 }, // 두 번째 사진
      { x: 30, y: 940, width: 540, height: 405 }, // 세 번째 사진
      { x: 30, y: 1355, width: 540, height: 405 }, // 네 번째 사진
    ],
  },
  light_denim: {
    id: 'light_denim',
    label: '라이트 데님',
    width: 600,
    height: 1800,
    requiredPhotoCount: 4,
    frameImageUrl: '/images/frames/light-denim.png',
    sampleImageUrl: '/images/frames/light-denim.png',
    overlayImageUrl: '/images/overlays/blue-silver-1.png',
    slots: [
      { x: 30, y: 110, width: 540, height: 405 }, // 첫 번째 사진
      { x: 30, y: 525, width: 540, height: 405 }, // 두 번째 사진
      { x: 30, y: 940, width: 540, height: 405 }, // 세 번째 사진
      { x: 30, y: 1355, width: 540, height: 405 }, // 네 번째 사진
    ],
  },
  // basic_white: {
  //   id: 'basic_white',
  //   label: '기본 화이트',
  //   width: 600,
  //   height: 1800,
  //   requiredPhotoCount: 4,
  //   backgroundColor: '#FFFFFF',
  //   frameImageUrl: null,
  //   sampleImageUrl: '/images/frames/frame.png',
  // },
} satisfies Record<string, FrameConfig>;

export type FrameId = keyof typeof FRAMES;
// 결과: 'basic_black' | 'basic_white';

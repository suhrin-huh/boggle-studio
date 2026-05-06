/**
 * 서비스에 필요한 config
 */

import { FrameConfig } from '@/types/booth';

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

// 타입 추출
export type CaptureMode = (typeof CAPTURE_MODE)[keyof typeof CAPTURE_MODE];

/*
 * 결과:
 * type CaptureMode =
 * { readonly id: "camera"; readonly label: "Camera"; readonly path: "/capture/camera" }
 * { readonly id: "upload"; readonly label: "Upload"; readonly path: "/capture/upload" }
 */

/**
 * 현재 프레임 미완성으로 모두 동일한 sample image를 보여준다.
 * => next/image + Config 데이터의 width, height 활용하여 CLS 방지
 * id, label, width, height, requiredPhotoCount, sampleImageUrl, frameImageUrl, overlayImageUrl, slots
 */
export const FRAMES = {
  basic_black: {
    id: 'basic_black',
    label: 'Basic Black',
    width: 600,
    height: 1800,
    requiredPhotoCount: 4,
    frameImageUrl: '/images/frames/basic-black.png',
    sampleImageUrl: '/images/samples/basic-black.png',
    overlayImageUrl: null,
    slots: [
      { x: 50, y: 180, width: 500, height: 375 }, // SLOT 1
      { x: 50, y: 565, width: 500, height: 375 }, // SLOT 2
      { x: 50, y: 950, width: 500, height: 375 }, // SLOT 3
      { x: 50, y: 1335, width: 500, height: 375 }, // SLOT 4
    ],
  },
  basic_white: {
    id: 'basic_white',
    label: 'Basic White',
    width: 600,
    height: 1800,
    requiredPhotoCount: 4,
    frameImageUrl: '/images/frames/basic-white.png',
    sampleImageUrl: '/images/samples/basic-white.png',
    overlayImageUrl: null,
    slots: [
      { x: 50, y: 180, width: 500, height: 375 }, // SLOT 1
      { x: 50, y: 565, width: 500, height: 375 }, // SLOT 2
      { x: 50, y: 950, width: 500, height: 375 }, // SLOT 3
      { x: 50, y: 1335, width: 500, height: 375 }, // SLOT 4
    ],
  },
  dark_denim: {
    id: 'dark_denim',
    label: 'Dark Denim',
    width: 600,
    height: 1800,
    requiredPhotoCount: 4,
    frameImageUrl: '/images/frames/dark-denim.png',
    sampleImageUrl: '/images/samples/dark-denim.png',
    overlayImageUrl: '/images/overlays/blue-silver-1.png',
    slots: [
      { x: 50, y: 180, width: 500, height: 375 }, // SLOT 1
      { x: 50, y: 565, width: 500, height: 375 }, // SLOT 2
      { x: 50, y: 950, width: 500, height: 375 }, // SLOT 3
      { x: 50, y: 1335, width: 500, height: 375 }, // SLOT 4진
    ],
  },
  light_denim: {
    id: 'light_denim',
    label: 'Light Denim',
    width: 600,
    height: 1800,
    requiredPhotoCount: 4,
    frameImageUrl: '/images/frames/light-denim.png',
    sampleImageUrl: '/images/samples/light-denim.png',
    overlayImageUrl: '/images/overlays/blue-silver-1.png',
    slots: [
      { x: 50, y: 180, width: 500, height: 375 }, // SLOT 1
      { x: 50, y: 565, width: 500, height: 375 }, // SLOT 2
      { x: 50, y: 950, width: 500, height: 375 }, // SLOT 3
      { x: 50, y: 1335, width: 500, height: 375 }, // SLOT 4
    ],
  },
} satisfies Record<string, FrameConfig>;

export type FrameId = keyof typeof FRAMES;
// 결과: 'basic_black' | 'basic_white';

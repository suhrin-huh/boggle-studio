/**
 * 서비스에 필요한 config
 */

import { FrameConfig } from '@/types';

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

export const TOTAL_SLOTS = 4;

/*
 * 결과:
 * type CaptureMode =
 * { readonly id: "camera"; readonly label: "Camera"; readonly path: "/capture/camera" }
 * { readonly id: "upload"; readonly label: "Upload"; readonly path: "/capture/upload" }
 */

// 4*1 4:3 비율의 basic frame slot
const BASIC_SLOTS = [
  { x: 70, y: 200, width: 460, height: 345 }, // SLOT 1
  { x: 70, y: 575, width: 460, height: 345 }, // SLOT 2
  { x: 70, y: 950, width: 460, height: 345 }, // SLOT 3
  { x: 70, y: 1325, width: 460, height: 345 }, // SLOT 4
];

/**
 * 프레임 정보를 모아놓은 config
 * => next/image + Config 데이터의 width, height 활용하여 CLS 방지
 * @keys basic_black, basic_white, dark_denim, light_denim
 * @values id, label, width, height sampleImageUrl, frameImageUrl, overlayImageUrl, slots
 */
export const FRAMES = {
  basic_black: {
    id: 'basic_black',
    label: 'Basic Black',
    width: 600,
    height: 1800,
    frameImageUrl: '/images/frames/basic-black.png',
    sampleImageUrl: '/images/samples/basic-black.png',
    overlayImageUrl: null,
    slots: BASIC_SLOTS,
  },
  basic_white: {
    id: 'basic_white',
    label: 'Basic White',
    width: 600,
    height: 1800,
    frameImageUrl: '/images/frames/basic-white.png',
    sampleImageUrl: '/images/samples/basic-white.png',
    overlayImageUrl: null,
    slots: BASIC_SLOTS,
  },
  dark_denim: {
    id: 'dark_denim',
    label: 'Dark Denim',
    width: 600,
    height: 1800,
    frameImageUrl: '/images/frames/dark-denim.png',
    sampleImageUrl: '/images/samples/dark-denim.png',
    overlayImageUrl: '/images/overlays/blue-silver-1.png',
    slots: BASIC_SLOTS,
  },
  light_denim: {
    id: 'light_denim',
    label: 'Light Denim',
    width: 600,
    height: 1800,
    frameImageUrl: '/images/frames/light-denim.png',
    sampleImageUrl: '/images/samples/light-denim.png',
    overlayImageUrl: '/images/overlays/blue-silver-1.png',
    slots: BASIC_SLOTS,
  },
} satisfies Record<string, FrameConfig>;

export type FrameId = keyof typeof FRAMES;
// 결과: 'basic_black' | 'basic_white';

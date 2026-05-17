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

/* ════════════════════════════════════════
프레임 사이즈에 따른 슬롯 좌표 정의
════════════════════════════════════════ */

// 600 * 1800 사이즈
const BASIC_SLOTS = [
  { x: 70, y: 200, width: 460, height: 345 }, // SLOT 1
  { x: 70, y: 575, width: 460, height: 345 }, // SLOT 2
  { x: 70, y: 950, width: 460, height: 345 }, // SLOT 3
  { x: 70, y: 1325, width: 460, height: 345 }, // SLOT 4
];

// 1200 * 1800 사이즈
const WIDE_SLOTS = [
  { x: 670, y: 200, width: 460, height: 345 }, // SLOT 1
  { x: 670, y: 575, width: 460, height: 345 }, // SLOT 2
  { x: 670, y: 950, width: 460, height: 345 }, // SLOT 3
  { x: 670, y: 1325, width: 460, height: 345 }, // SLOT 4
];

// 프레임 설정: 크기/슬롯 정보 담당
export const FRAME_OPTIONS = {
  basic: {
    id: 'basic',
    label: 'BASIC',
    width: 600,
    height: 1800,
    slots: BASIC_SLOTS,
  },
  wide: {
    id: 'wide',
    label: 'WIDE',
    width: 1200,
    height: 1800,
    slots: WIDE_SLOTS,
  },
};

// 배경 설정: 프레임 크기별 실제 매핑될 배경 이미지 정보
export const BACKGROUND_OPTIONS = {
  black: {
    id: 'black',
    label: 'Black',
    sampleImageUrl: '/images/samples/bg-black.png', // UI에서 한 줄로 보여줄 샘플
    // 💡 핵심: 프레임 크기에 따라 다른 이미지 적용
    images: {
      basic: '/images/backgrounds/basic-black.png',
      wide: '/images/backgrounds/wide-black.png',
    },
  },
  white: {
    id: 'white',
    label: 'White',
    sampleImageUrl: '/images/samples/bg-white.png',
    images: {
      basic: '/images/backgrounds/basic-white.png',
      wide: '/images/backgrounds/wide-white.png',
    },
  },
  'dark-denim': {
    id: 'dark-denim',
    label: 'Dark Denim',
    sampleImageUrl: '/images/samples/bg-dark-denim.png',
    images: {
      basic: '/images/backgrounds/basic-dark-denim.png',
      wide: '/images/backgrounds/wide-dark-denim.png',
    },
  },
  'light-denim': {
    id: 'light-denim',
    label: 'Light Denim',
    sampleImageUrl: '/images/samples/bg-light-denim.png',
    images: {
      basic: '/images/backgrounds/basic-light-denim.png',
      wide: '/images/backgrounds/wide-light-denim.png',
    },
  },
  'the-starry-night': {
    id: 'the-starry-night',
    label: 'The Starry Night',
    sampleImageUrl: '/images/samples/bg-the-starry-night.png',
    images: {
      basic: '/images/backgrounds/basic-the-starry-night.png',
      wide: '/images/backgrounds/wide-the-starry-night.png',
    },
  },
  sunflower: {
    id: 'sunflower',
    label: 'Sunflower',
    sampleImageUrl: '/images/samples/bg-sunflower.png',
    images: {
      basic: '/images/backgrounds/basic-sunflower.png',
      wide: '/images/backgrounds/wide-sunflower.png',
    },
  },
  narcissism: {
    id: 'narcissism',
    label: 'Narcissism',
    sampleImageUrl: '/images/samples/bg-narcissism.png',
    images: {
      basic: '/images/backgrounds/basic-narcissism.png',
      wide: '/images/backgrounds/wide-narcissism.png',
    },
  },
} as const;

export type FrameType = keyof typeof FRAME_OPTIONS;
export type Background = keyof typeof BACKGROUND_OPTIONS;
export type ThemeId = `${FrameType}-${Background}`; // 'basic-black', 'wide-black' 등

// 기존 코드 동작을 위해 잠시 보류
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

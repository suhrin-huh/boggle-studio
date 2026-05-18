/* ════════════════════════════════════════
서비스에 필요한 config 및 상수 정의
════════════════════════════════════════ */

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

/**ResultView의 원본 사진에 대한 Preview 사진(비디오)의 비율 */
export const PREVIEW_SCALE = 1 / 6;

/** IndexedDB에 녹화 영상 Blob을 저장할 때 사용하는 키 접두사 */
export const VIDEO_SLOT_KEY_PREFIX = 'booth-video';

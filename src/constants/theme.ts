/** 프레임 한 장에 배치되는 사진 슬롯 수 */
export const TOTAL_SLOTS = 4;

/** BASIC 프레임(600×1800) 슬롯 좌표 및 크기 정보 */
const BASIC_SLOT_CONFIGS = [
  { x: 70, y: 200, width: 460, height: 345 }, // SLOT 1
  { x: 70, y: 575, width: 460, height: 345 }, // SLOT 2
  { x: 70, y: 950, width: 460, height: 345 }, // SLOT 3
  { x: 70, y: 1325, width: 460, height: 345 }, // SLOT 4
];

/**
 * WIDE 프레임(1200×1800) 슬롯 좌표, 크기, 회전 정보
 * @param x,y : 슬롯의 좌표, figma 기준 회전 전의 좌표
 * @param rotate - 반시계방향 기준 회전 각도 (도 단위)
 */
const WIDE_SLOT_CONFIGS = [
  { x: 93.88, y: 235.48, width: 550, height: 412.5, rotate: 9 }, // SLOT 1
  { x: 541.87, y: 457.67, width: 550, height: 412.5, rotate: -12 }, // SLOT 2
  { x: 150.42, y: 814.11, width: 550, height: 412.5, rotate: 3 }, // SLOT 3
  { x: 511.64, y: 1059.62, width: 550, height: 412.5, rotate: 10 }, // SLOT 4
];

/** 프레임 타입별 크기와 슬롯 배치 정보 */
export const FRAME_OPTIONS = {
  basic: {
    id: 'basic',
    label: 'BASIC',
    width: 600,
    height: 1800,
    slots: BASIC_SLOT_CONFIGS,
  },
  // wide: {
  //   id: 'wide',
  //   label: 'WIDE',
  //   width: 1200,
  //   height: 1800,
  //   slots: WIDE_SLOT_CONFIGS,
  // },
};

/** 프레임 타입 식별자 */
export type FrameType = keyof typeof FRAME_OPTIONS;

// overlays가 모든 FrameType 키를 포함하도록 강제하는 형태 타입
// - images  : 모든 프레임 타입에 배경 이미지가 반드시 존재
// - overlays: null이면 해당 프레임 타입에 오버레이 없음을 의미
type BackgroundOptionShape = {
  id: string;
  label: string;
  sampleImageUrl: string;
  images: Record<FrameType, string>;
  overlays: Record<FrameType, string | null>;
};

/**
 * 프레임에 합성될 배경 옵션별 정보
 * - overlays: wide 프레임에만 오버레이 이미지가 존재하며, basic은 null로 표기
 */
export const BACKGROUND_OPTIONS = {
  black: {
    id: 'black',
    label: 'Black',
    sampleImageUrl: '/images/samples/bg-black.png',
    images: {
      basic: '/images/backgrounds/basic-black.png',
      // wide: '/images/backgrounds/wide-black.png',
    },
    overlays: {
      basic: null,
      // wide: '/images/overlays/wide-black.png',
    },
  },
  white: {
    id: 'white',
    label: 'White',
    sampleImageUrl: '/images/samples/bg-white.png',
    images: {
      basic: '/images/backgrounds/basic-white.png',
      // wide: '/images/backgrounds/wide-white.png',
    },
    overlays: {
      basic: null,
      // wide: '/images/overlays/wide-white.png',
    },
  },
  'dark-denim': {
    id: 'dark-denim',
    label: 'Dark Denim',
    sampleImageUrl: '/images/samples/bg-dark-denim.png',
    images: {
      basic: '/images/backgrounds/basic-dark-denim.png',
      // wide: '/images/backgrounds/wide-dark-denim.png',
    },
    overlays: {
      basic: null,
      // wide: '/images/overlays/wide-dark-denim.png',
    },
  },
  'light-denim': {
    id: 'light-denim',
    label: 'Light Denim',
    sampleImageUrl: '/images/samples/bg-light-denim.png',
    images: {
      basic: '/images/backgrounds/basic-light-denim.png',
      // wide: '/images/backgrounds/wide-light-denim.png',
    },
    overlays: {
      basic: null,
      // wide: '/images/overlays/wide-light-denim.png',
    },
  },
  // 'the-starry-night': {
  //   id: 'the-starry-night',
  //   label: 'The Starry Night',
  //   sampleImageUrl: '/images/samples/bg-the-starry-night.png',
  //   images: {
  //     basic: '/images/backgrounds/basic-the-starry-night.png',
  //     wide: '/images/backgrounds/wide-the-starry-night.png',
  //   },
  // },
  // sunflower: {
  //   id: 'sunflower',
  //   label: 'Sunflower',
  //   sampleImageUrl: '/images/samples/bg-sunflower.png',
  //   images: {
  //     basic: '/images/backgrounds/basic-sunflower.png',
  //     wide: '/images/backgrounds/wide-sunflower.png',
  //   },
  // },
  // narcissism: {
  //   id: 'narcissism',
  //   label: 'Narcissism',
  //   sampleImageUrl: '/images/samples/bg-narcissism.png',
  //   images: {
  //     basic: '/images/backgrounds/basic-narcissism.png',
  //     wide: '/images/backgrounds/wide-narcissism.png',
  //   },
  // },
} as const satisfies Record<string, BackgroundOptionShape>;

/** 배경 식별자*/
export type Background = keyof typeof BACKGROUND_OPTIONS;

/** 테마 식별자 — 프레임 타입과 배경을 조합 */
export type ThemeId = `${FrameType}-${Background}`;

/**ResultView의 원본에 대한 Preview의 비율 */
export const PREVIEW_SCALE = 1 / 6;

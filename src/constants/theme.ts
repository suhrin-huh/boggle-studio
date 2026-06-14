/** 프레임 한 장에 배치되는 사진 슬롯 수 */
export const TOTAL_SLOTS = 4;

/** 프레임 타입별 크기와 슬롯 배치 정보 */
export const FRAME_OPTIONS = {
  basic: {
    id: 'basic',
    width: 600,
    height: 1800,
    slots: [
      {
        x: 50,
        y: 225,
        width: 500,
        height: 375,
      },
      {
        x: 50,
        y: 615,
        width: 500,
        height: 375,
      },
      {
        x: 50,
        y: 1005,
        width: 500,
        height: 375,
      },
      {
        x: 50,
        y: 1395,
        width: 500,
        height: 375,
      },
    ],
  },
};

/** 프레임 타입 식별자 */
export type FrameType = keyof typeof FRAME_OPTIONS;

// overlays가 모든 FrameType 키를 포함하도록 강제하는 형태 타입
// - images  : 모든 프레임 타입에 배경 이미지가 반드시 존재
// - overlays: null이면 해당 프레임 타입에 오버레이 없음을 의미
type BackgroundOptionShape = {
  id: string;
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
    sampleImageUrl: '/images/samples/bg-black.png',
    images: {
      basic: '/images/backgrounds/basic-black.png',
    },
    overlays: {
      basic: null,
    },
  },
  white: {
    id: 'white',
    sampleImageUrl: '/images/samples/bg-white.png',
    images: {
      basic: '/images/backgrounds/basic-white.png',
    },
    overlays: {
      basic: null,
    },
  },
  'dark-denim': {
    id: 'dark-denim',
    sampleImageUrl: '/images/samples/bg-dark-denim.png',
    images: {
      basic: '/images/backgrounds/basic-dark-denim.png',
    },
    overlays: {
      basic: null,
    },
  },
  'light-denim': {
    id: 'light-denim',
    sampleImageUrl: '/images/samples/bg-light-denim.png',
    images: {
      basic: '/images/backgrounds/basic-light-denim.png',
    },
    overlays: {
      basic: null,
    },
  },
  cat: {
    id: 'cat',
    sampleImageUrl: '/images/samples/bg-cat.png',
    images: {
      basic: '/images/backgrounds/basic-cat.png',
    },
    overlays: {
      basic: '/images/overlays/basic-cat.png',
    },
  },
  frog: {
    id: 'frog',
    sampleImageUrl: '/images/samples/bg-frog.png',
    images: {
      basic: '/images/backgrounds/basic-frog.png',
    },
    overlays: {
      basic: '/images/overlays/basic-frog.png',
    },
  },
  vangogh: {
    id: 'vangogh',
    sampleImageUrl: '/images/samples/bg-vangogh.png',
    images: {
      basic: '/images/backgrounds/basic-vangogh.png',
    },
    overlays: {
      basic: '/images/overlays/basic-vangogh.png',
    },
  },
} as const satisfies Record<string, BackgroundOptionShape>;

/** 배경 식별자*/
export type Background = keyof typeof BACKGROUND_OPTIONS;

/** 테마 식별자 — 프레임 타입과 배경을 조합 */
export type ThemeId = `${FrameType}-${Background}`;

/**ResultView의 원본에 대한 Preview의 비율 */
export const PREVIEW_SCALE = 1 / 6;

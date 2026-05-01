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
 */
export const FRAMES = {
  basic_black: {
    id: 'basic_black',
    label: '기본 블랙',
    width: 1000,
    height: 3000,
    requiredPhotoCount: 4,
    backgroundColor: '#000000',
    frameImageUrl: null,
    sampleImageUrl: '/images/frames/frame.png',
  },
  basic_white: {
    id: 'basic_white',
    label: '기본 화이트',
    width: 1000,
    height: 3000,
    requiredPhotoCount: 4,
    backgroundColor: '#FFFFFF',
    frameImageUrl: null,
    sampleImageUrl: '/images/frames/frame.png',
  },
  // fish_theme: {
  //   id: 'fish_theme',
  //   label: '물고기 테마',
  //   width: 2000,
  //   height: 3000,
  //   requiredPhotoCount: 4,
  //   backgroundColor: null,
  //   frameImageUrl: '/images/frames/fish_overlay.png',
  //   sampleImageUrl: '/images/frames/frame.png', // 미리보기용 샘플 이미지
  // },
} satisfies Record<string, FrameConfig>;

export type FrameId = keyof typeof FRAMES;
// 결과: 'basic_black' | 'basic_white';

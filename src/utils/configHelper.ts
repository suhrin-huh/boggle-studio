import {
  FRAME_OPTIONS,
  BACKGROUND_OPTIONS,
  FrameType,
  Background,
  ThemeId,
} from '@/constants/booth';

import { ThemeConfig } from '@/types';

export const buildThemeConfig = (themeId: ThemeId): ThemeConfig => {
  const dashIndex = themeId.indexOf('-');
  const frameType = themeId.slice(0, dashIndex) as FrameType;
  const background = themeId.slice(dashIndex + 1) as Background;

  const frameOpt = FRAME_OPTIONS[frameType];
  const bgOpt = BACKGROUND_OPTIONS[background];

  const overlayPath = bgOpt.overlays[frameType];

  return {
    width: frameOpt.width,
    height: frameOpt.height,
    frameImageUrl: bgOpt.images[frameType],
    slots: frameOpt.slots,
    // 오버레이 경로가 있을 때만 포함 (빈 문자열 제외)
    ...(overlayPath ? { overlayImageUrl: overlayPath } : {}),
  };
};

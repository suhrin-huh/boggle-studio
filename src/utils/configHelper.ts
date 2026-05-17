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

  return {
    width: frameOpt.width,
    height: frameOpt.height,
    frameImageUrl: bgOpt.images[frameType],
    slots: frameOpt.slots,
  };
};

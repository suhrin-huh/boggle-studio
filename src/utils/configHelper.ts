import { FRAME_OPTIONS, BACKGROUND_OPTIONS, FrameType, Background, ThemeId } from '@/constants';

import { ThemeConfig } from '@/types';

export function buildThemeConfig(themeId: ThemeId): ThemeConfig {
  // themeId를 파싱하여 프레임 타입과 배경 키 추출
  const dashIndex = themeId.indexOf('-');
  const frameType = themeId.slice(0, dashIndex) as FrameType;
  const background = themeId.slice(dashIndex + 1) as Background;

  // 상수에서 프레임·배경 옵션 조회
  const frameOpt = FRAME_OPTIONS[frameType];
  const bgOpt = BACKGROUND_OPTIONS[background];

  // 프레임 크기
  const { width, height } = frameOpt;

  // 슬롯 좌표·크기·회전 정보
  const { slots } = frameOpt;

  // 배경 이미지 URL (프레임 타입에 맞는 이미지 선택)
  const frameImageUrl = bgOpt.images[frameType];

  // 오버레이 이미지 URL (null이면 해당 프레임에 오버레이 없음 → undefined로 변환)
  const overlayImageUrl = bgOpt.overlays[frameType] ?? undefined;

  return {
    width,
    height,
    frameImageUrl,
    slots,
    ...(overlayImageUrl ? { overlayImageUrl } : {}),
  };
}

import Image from 'next/image';
import {
  FRAME_OPTIONS,
  BACKGROUND_OPTIONS,
  PREVIEW_SCALE,
  FrameType,
  Background,
} from '@/constants/booth';

const FRAME_KEYS = Object.keys(FRAME_OPTIONS) as FrameType[];
const BG_KEYS = Object.keys(BACKGROUND_OPTIONS) as Background[];

/**
 * 테마 이미지 사전 로드 컴포넌트
 * 모든 프레임 × 배경 조합의 배경·오버레이 이미지를 화면에 보이지 않게(invisible) 미리 렌더링하여
 * 테마 전환 시 발생하는 이미지 깜빡임(FOUI)을 방지
 */
export default function ThemeImagePreloader() {
  return (
    <div className="invisible absolute" aria-hidden>
      {FRAME_KEYS.flatMap((frameKey, frameIndex) =>
        BG_KEYS.map((bgKey, bgIndex) => {
          const w = Math.round(FRAME_OPTIONS[frameKey].width * PREVIEW_SCALE);
          const h = Math.round(FRAME_OPTIONS[frameKey].height * PREVIEW_SCALE);
          const overlayUrl = BACKGROUND_OPTIONS[bgKey].overlays[frameKey];
          // 초기 렌더 시 가장 먼저 보이는 조합(0번째 프레임 × 0번째 배경)만 high priority 부여
          const isInitial = frameIndex === 0 && bgIndex === 0;
          return (
            <div key={`${frameKey}-${bgKey}`} className="relative" style={{ width: w, height: h }}>
              <Image
                src={BACKGROUND_OPTIONS[bgKey].images[frameKey]}
                alt={`bg-${frameKey}-${bgKey}`}
                width={w}
                height={h}
                priority={isInitial}
              />
              {overlayUrl && (
                <Image
                  src={overlayUrl}
                  alt={`overlay-${frameKey}-${bgKey}`}
                  width={w}
                  height={h}
                  priority={isInitial}
                />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}

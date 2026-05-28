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
      {FRAME_KEYS.flatMap((frameKey) =>
        BG_KEYS.map((bgKey) => {
          const w = Math.round(FRAME_OPTIONS[frameKey].width * PREVIEW_SCALE);
          const h = Math.round(FRAME_OPTIONS[frameKey].height * PREVIEW_SCALE);
          const overlayUrl = BACKGROUND_OPTIONS[bgKey].overlays[frameKey];

          return (
            <div key={`${frameKey}-${bgKey}`} className="relative" style={{ width: w, height: h }}>
              {/* 배경 이미지 사전 로드 */}
              <Image
                src={BACKGROUND_OPTIONS[bgKey].images[frameKey]}
                alt=""
                width={w}
                height={h}
                priority
              />
              {/* 오버레이 이미지 사전 로드 (wide 프레임에만 존재) */}
              {overlayUrl && <img src={overlayUrl} alt="" className="hidden" />}
            </div>
          );
        }),
      )}
    </div>
  );
}

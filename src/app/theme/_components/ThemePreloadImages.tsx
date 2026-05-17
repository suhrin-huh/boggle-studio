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

export default function ThemePreloadImages() {
  return (
    <div className="invisible absolute" aria-hidden>
      {FRAME_KEYS.flatMap((frameKey) =>
        BG_KEYS.map((bgKey) => {
          const w = Math.round(FRAME_OPTIONS[frameKey].width * PREVIEW_SCALE);
          const h = Math.round(FRAME_OPTIONS[frameKey].height * PREVIEW_SCALE);

          return (
            <div key={`${frameKey}-${bgKey}`} className="relative" style={{ width: w, height: h }}>
              <Image
                src={BACKGROUND_OPTIONS[bgKey].images[frameKey]}
                alt=""
                width={w}
                height={h}
                priority
              />
            </div>
          );
        }),
      )}
    </div>
  );
}

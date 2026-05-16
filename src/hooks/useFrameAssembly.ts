import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAME_OPTIONS, BACKGROUND_OPTIONS, FrameType, Background, ThemeId } from '@/constants/booth';
import { FrameConfig } from '@/types';
import { assembleFrame } from '@/utils/canvasHelper';
import { generateFileName } from '@/utils/fileHelper';

function buildFrameConfig(themeId: ThemeId): FrameConfig {
  const dashIndex = themeId.indexOf('-');
  const frameType = themeId.slice(0, dashIndex) as FrameType;
  const background = themeId.slice(dashIndex + 1) as Background;

  const frameOpt = FRAME_OPTIONS[frameType];
  const bgOpt = BACKGROUND_OPTIONS[background];

  return {
    id: themeId,
    label: `${frameOpt.label} ${bgOpt.label}`,
    width: frameOpt.width,
    height: frameOpt.height,
    sampleImageUrl: bgOpt.sampleImageUrl,
    frameImageUrl: bgOpt.images[frameType],
    overlayImageUrl: null,
    slots: frameOpt.slots,
  };
}

export default function useFrameAssembly() {
  const router = useRouter();
  const themeId = useBoothStore((state) => state.themeId);
  const photoSlots = useBoothStore((state) => state.photoSlots);

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 방어 로직
    if (photoSlots.length === 0 || !themeId) {
      router.replace('/');
      return;
    }

    // 캔버스 합성 로직
    const assemble = async () => {
      try {
        setIsLoading(true);
        const frameConfig = buildFrameConfig(themeId);
        const assembled = await assembleFrame(frameConfig, photoSlots);

        setResultImage(assembled);
        setFileName(generateFileName('Studio'));
      } catch {
        setError('Failed to create your cut.');
      } finally {
        setTimeout(() => setIsLoading(false), 3000);
      }
    };

    assemble();
  }, [photoSlots, themeId, router]);

  return { resultImage, fileName, isLoading, error };
}

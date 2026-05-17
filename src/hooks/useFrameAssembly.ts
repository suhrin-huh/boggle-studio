import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { assembleFrame } from '@/utils/canvasHelper';
import { generateFileName } from '@/utils/fileHelper';
import { buildThemeConfig } from '@/utils/configHelper';

interface UseFrameAssemblyProps {
  loadingTime: number;
}

export default function useFrameAssembly({ loadingTime }: UseFrameAssemblyProps) {
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
        const themeConfig = buildThemeConfig(themeId);
        const assembled = await assembleFrame(themeConfig, photoSlots);

        setResultImage(assembled);
        setFileName(generateFileName('Studio'));
      } catch {
        setError('Failed to create your cut.');
      } finally {
        setTimeout(() => setIsLoading(false), loadingTime);
      }
    };

    assemble();
  }, [photoSlots, themeId, router]);

  return { resultImage, fileName, isLoading, error };
}

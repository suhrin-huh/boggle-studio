import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';
import { FrameConfig } from '@/types';
import { assembleFrame } from '@/utils/canvasHelper';
import { generateFileName } from '@/utils/fileHelper';

export default function useFrameAssembly() {
  const router = useRouter();
  const frameId = useBoothStore((state) => state.frameId);
  const photoSlots = useBoothStore((state) => state.photoSlots);

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 방어 로직
    if (photoSlots.length === 0 || !frameId) {
      router.replace('/');
      return;
    }

    // 캔버스 합성 로직
    const assemble = async () => {
      try {
        setIsLoading(true);
        const frameConfig = FRAMES[frameId] as FrameConfig;
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
  }, [photoSlots, frameId, router]);

  return { resultImage, fileName, isLoading, error };
}

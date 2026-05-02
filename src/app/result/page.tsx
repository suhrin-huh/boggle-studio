'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';
import { assembleFrame } from '@/utils/canvasHelper';
import Image from 'next/image';

export default function ResultPage() {
  const router = useRouter();
  const frameId = useBoothStore((state) => state.frameId);
  const photoSlots = useBoothStore((state) => state.photoSlots);
  const resetBooth = useBoothStore((state) => state.resetBooth);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사진 또는 프레임 없이 직접 접근한 경우 홈으로 리다이렉트
  useEffect(() => {
    if (photoSlots.length === 0 || !frameId) {
      router.replace('/');
    }
  }, [photoSlots, frameId, router]);

  // 선택한 프레임 설정에 따라 사진 합성
  useEffect(() => {
    if (photoSlots.length === 0 || !frameId) return;
    const assemble = async () => {
      try {
        setIsLoading(true);
        const frameConfig = FRAMES[frameId];
        const assembled = await assembleFrame(frameConfig, photoSlots);
        const name = 'BOGGLE BOGGLE STUDIO';
        setResultImage(assembled);
        setFileName(name);
      } catch {
        setError('이미지 합성 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    assemble();
  }, [photoSlots, frameId]);

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = fileName;
    link.click();
  };

  const handleRetry = () => {
    resetBooth();
    router.push('/');
  };

  if (isLoading) return <p>이미지를 합성하는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>완성된 사진</h1>
      {resultImage && (
        <div className="relative aspect-1/3 w-[150]">
          <Image src={resultImage} alt="완성된 인생네컷" fill />
        </div>
      )}
      <br />
      <button onClick={handleDownload}>다운로드</button>
      <button onClick={handleRetry}>처음부터 다시하기</button>
    </div>
  );
}

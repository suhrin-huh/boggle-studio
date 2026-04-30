'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { assembleVertical } from '@/utils/canvasHelper';

// 개별 사진 크기, 임시로 설정, 후에 assemble 로직 수정하면서 frame 적용 예정
const FRAME_WIDTH = 400;
const FRAME_HEIGHT = 300;

export default function ResultPage() {
  const router = useRouter();
  const capturedCuts = useBoothStore((state) => state.capturedCuts);
  const resetBooth = useBoothStore((state) => state.resetBooth);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사진 없이 직접 접근한 경우 홈으로 리다이렉트
  useEffect(() => {
    if (capturedCuts.length === 0) {
      router.replace('/');
    }
  }, [capturedCuts, router]);

  // 4장 사진을 세로 조립
  useEffect(() => {
    if (capturedCuts.length === 0) return;
    const assemble = async () => {
      try {
        setIsLoading(true);
        const assembled = await assembleVertical(capturedCuts, FRAME_WIDTH, FRAME_HEIGHT);
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
  }, [capturedCuts]);

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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resultImage}
          alt="완성된 인생네컷"
          style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT * capturedCuts.length }}
        />
      )}
      <br />
      <button onClick={handleDownload}>다운로드</button>
      <button onClick={handleRetry}>처음부터 다시하기</button>
    </div>
  );
}

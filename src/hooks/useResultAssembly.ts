'use client';

// libraries & frameworks
import { useState, useEffect, useRef } from 'react';

// global stores, hoos & utils
import { useBoothStore } from '@/store/useBoothStore';
import { assembleFrame } from '@/utils/canvasHelper';
import { assembleVideo } from '@/utils/videoAssemblyHelper';
import { generateFileName } from '@/utils/fileHelper';
import { buildThemeConfig } from '@/utils/configHelper';

interface UseResultAssemblyProps {
  loadingTime: number;
}

/**
 * 정적 이미지와 합성 비디오를 모두 생성하는 결과물 조립 훅
 * - 이미지 합성: assembleFrame (canvasHelper)
 * - 비디오 합성: assembleVideo (videoAssemblyHelper) — 실패해도 에러 전파 없이 null 유지
 * @param loadingTime - ResultLoading view가 보이는 최소 시간 (ms)
 */
export default function useResultAssembly({ loadingTime }: UseResultAssemblyProps) {
  const themeId = useBoothStore((state) => state.themeId);
  const photoSlots = useBoothStore((state) => state.photoSlots);
  const videoSlotKeys = useBoothStore((state) => state.videoSlotKeys);

  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 언마운트 시 비디오 objectURL 해제를 위한 ref
  const videoUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // 사진 4장이 모두 채워지지 않았거나 테마가 없으면 결과 생성 불가
    if (photoSlots.length !== 4 || !themeId) return;

    const themeConfig = buildThemeConfig(themeId);
    const controller = new AbortController();

    /**사진 및 비디오 생성 */
    const assemble = async () => {
      try {
        setIsLoading(true);

        // 1단계: 정적 합성 이미지 생성
        const assembled = await assembleFrame(themeConfig, photoSlots);
        setResultImage(assembled);
        setFileName(generateFileName('LUCKY'));

        // 비디오 슬롯이 모두 채워지지 않았으면 이미지만 생성하고 종료
        if (videoSlotKeys.length !== 4) return;

        // 2단계: 스케치 영상 합성 — 실패해도 이미지 결과물은 유지
        try {
          const videoBlob = await assembleVideo(themeConfig, videoSlotKeys, controller.signal);
          const url = URL.createObjectURL(videoBlob);
          videoUrlRef.current = url;
          setResultVideoUrl(url);
        } catch (videoError) {
          // AbortError는 언마운트에 의한 정상 취소이므로 무시
          if ((videoError as DOMException).name === 'AbortError') return;
          console.warn('스케치 영상 생성에 실패하였습니다.', videoError);
        }
      } catch (mainError) {
        setError('사진을 생성하는 데 실패했습니다.');
      } finally {
        setTimeout(() => setIsLoading(false), loadingTime);
      }
    };

    assemble();

    return () => {
      // 언마운트 시 진행 중인 비디오 합성 취소 및 objectURL 해제
      controller.abort();
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
        videoUrlRef.current = null;
      }
    };
  }, [photoSlots]);

  return { resultVideoUrl, resultImage, fileName, isLoading, error };
}

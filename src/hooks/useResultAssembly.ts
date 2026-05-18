'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { assembleFrame } from '@/utils/canvasHelper';
import { generateFileName } from '@/utils/fileHelper';
import { buildThemeConfig } from '@/utils/configHelper';
import { loadVideoBlob } from '@/utils/idbHelper';

/** 브라우저 지원 여부에 따라 최적 MediaRecorder mimeType을 반환
 *  vp9 → vp8 → generic webm 순으로 fallback합니다.
 */
const getSupportedMimeType = (): string => {
  const candidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
};

/**
 * <video> 요소가 재생 가능한 상태(canplay)가 될 때까지 대기
 * @param el - 대기할 HTMLVideoElement
 */
const waitForCanPlay = (el: HTMLVideoElement): Promise<void> =>
  new Promise((resolve, reject) => {
    if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      resolve();
      return;
    }
    el.oncanplay = () => resolve();
    el.onerror = () => reject(new Error('비디오 버퍼링 실패'));
  });

interface UseResultAssemblyProps {
  loadingTime: number;
}

/**
 * 정적 이미지와 합성 비디오를 모두 생성하는 결과물 조립 훅.
 * 비디오 생성 실패 시 UI에 에러를 던지지 않고 조용히 resultVideoUrl을 null로 유지
 * @param loadingTime : Loading view가 보이는 최소 시간
 */
export default function useResultAssembly({ loadingTime }: UseResultAssemblyProps) {
  const router = useRouter();
  const themeId = useBoothStore((state) => state.themeId);
  const photoSlots = useBoothStore((state) => state.photoSlots);
  const videoSlotKeys = useBoothStore((state) => state.videoSlotKeys);

  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 사진 제작 실패 에러용

  const videoUrlRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (photoSlots.length === 0 || !themeId) {
      router.replace('/');
      return;
    }

    const themeConfig = buildThemeConfig(themeId);

    const assemble = async () => {
      try {
        setIsLoading(true);

        // 정적 합성 이미지 생성
        const assembled = await assembleFrame(themeConfig, photoSlots);
        setResultImage(assembled);
        setFileName(generateFileName('Studio'));

        if (videoSlotKeys.length === 0) return;

        // 스케치 영상 합성
        let objectUrls: string[] = []; // 메모리 정리를 위해 상단 선언

        try {
          const blobs = await Promise.all(videoSlotKeys.map(loadVideoBlob));

          const canvas = document.createElement('canvas');
          canvas.width = themeConfig.width;
          canvas.height = themeConfig.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context 없음');

          const bgImage = await new Promise<HTMLImageElement>((res, rej) => {
            const img = new Image();
            img.onload = () => res(img);
            img.onerror = () => rej(new Error('배경 로드 실패'));
            img.src = themeConfig.frameImageUrl;
          });

          const videoEls = blobs.map((blob) => {
            const el = document.createElement('video');
            el.muted = true;
            el.playsInline = true;
            el.preload = 'auto';
            if (blob) {
              const url = URL.createObjectURL(blob);
              objectUrls.push(url);
              el.src = url;
              el.load();
            }
            return el;
          });

          await Promise.all(videoEls.map(waitForCanPlay));

          const mimeType = getSupportedMimeType();
          const stream = canvas.captureStream(30);
          const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
          const chunks: Blob[] = [];

          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };
          recorder.start();

          // iOS 자동 재생 차단 등이 발생하면 여기서 catch로 던져짐
          await Promise.all(videoEls.map((el) => el.play()));

          // 정상 재생 시 RAF 루프 시작
          const drawFrame = () => {
            ctx.drawImage(bgImage, 0, 0, themeConfig.width, themeConfig.height);
            videoEls.forEach((el, i) => {
              const slot = themeConfig.slots[i];
              if (slot) ctx.drawImage(el, slot.x, slot.y, slot.width, slot.height);
            });
            rafRef.current = requestAnimationFrame(drawFrame);
          };
          rafRef.current = requestAnimationFrame(drawFrame);

          // 비디오 종료 대기
          await Promise.all(
            videoEls.map(
              (el) =>
                new Promise<void>((resolve, reject) => {
                  el.onended = () => resolve();
                  el.onerror = () => reject(new Error('비디오 재생 에러'));
                }),
            ),
          );

          cancelAnimationFrame(rafRef.current);
          recorder.stop();

          await new Promise<void>((res) => {
            recorder.onstop = () => res();
          });

          // 최종 비디오 URL 상태 업데이트
          const finalBlob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(finalBlob);
          videoUrlRef.current = url;
          setResultVideoUrl(url);
        } catch (videoError) {
          console.warn('스케치 영상 생성에 실패하였습니다.', videoError);
        } finally {
          // 비디오 성공/실패 여부와 상관없이 임시 생성했던 objectURL 즉시 청소
          objectUrls.forEach((url) => URL.revokeObjectURL(url));
        }
      } catch (mainError) {
        // 사진 합성 실패 시
        setError('사진을 생성하는 데 실패했습니다.');
      } finally {
        setTimeout(() => setIsLoading(false), loadingTime);
      }
    };

    assemble();

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
        videoUrlRef.current = null;
      }
    };
  }, []);

  return { resultVideoUrl, resultImage, fileName, isLoading, error };
}

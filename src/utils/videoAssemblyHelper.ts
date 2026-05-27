'use client';

import { ThemeConfig } from '@/types';
import { loadVideoBlob } from '@/utils/idbHelper';
import { getSupportedMimeType } from '@/utils/videoHelper';
import { loadImage, createAssemblyCanvas, drawSingleSlot } from '@/utils/canvasHelper';

/**
 * <video> 요소가 재생 가능한 상태(canplay)가 될 때까지 대기합니다.
 * src가 없는 슬롯(녹화 실패)은 즉시 resolve합니다.
 */
const waitForCanPlay = (el: HTMLVideoElement): Promise<void> =>
  new Promise((resolve, reject) => {
    // src가 없으면 재생할 영상이 없으므로 즉시 통과
    if (!el.src) {
      resolve();
      return;
    }
    if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      resolve();
      return;
    }
    el.oncanplay = () => resolve();
    el.onerror = () => reject(new Error('비디오 버퍼링 실패'));
  });

/**
 * 비디오 슬롯들을 프레임에 합성하여 최종 Blob을 반환합니다.
 * 합성 순서: 배경 → 슬롯 비디오(회전 적용) → 오버레이(있을 경우)
 *
 * 반환된 Blob의 objectURL 생명주기는 호출자(훅)가 관리합니다.
 *
 * @param themeConfig   - 프레임 크기·슬롯·배경·오버레이 정보
 * @param videoSlotKeys - IndexedDB 비디오 키 배열
 * @param signal        - 컴포넌트 언마운트 시 취소를 위한 AbortSignal (선택)
 * @returns 합성 완료된 비디오 Blob
 */
export const assembleVideo = async (
  themeConfig: ThemeConfig,
  videoSlotKeys: string[],
  signal?: AbortSignal,
): Promise<Blob> => {
  // 취소 여부를 확인하는 헬퍼 — 주요 비동기 작업 완료 후 체크
  const checkAborted = () => {
    if (signal?.aborted) throw new DOMException('assembleVideo 취소됨', 'AbortError');
  };

  // 비디오 요소에 할당한 임시 objectURL 목록 — finally에서 일괄 해제
  const tempObjectUrls: string[] = [];
  let rafId = 0;
  let recorder: MediaRecorder | null = null;

  try {
    // 1단계: IndexedDB에서 비디오 Blob 로드
    const blobs = await Promise.all(videoSlotKeys.map(loadVideoBlob));
    checkAborted();

    // 2단계: Canvas 생성 및 배경·오버레이 이미지 로드
    const { canvas, ctx } = createAssemblyCanvas(themeConfig.width, themeConfig.height);

    const bgImage = await loadImage(themeConfig.frameImageUrl);
    // 오버레이는 매 프레임마다 그리므로 루프 시작 전에 미리 로드
    const overlayImage = themeConfig.overlayImageUrl
      ? await loadImage(themeConfig.overlayImageUrl)
      : null;

    // 3단계: 비디오 요소 생성 및 임시 objectURL 등록
    const videoEls = blobs.map((blob) => {
      const el = document.createElement('video');
      el.muted = true;
      el.playsInline = true;
      el.preload = 'auto';
      if (blob) {
        const url = URL.createObjectURL(blob);
        tempObjectUrls.push(url);
        el.src = url;
        el.load();
      }
      return el;
    });

    await Promise.all(videoEls.map(waitForCanPlay));
    checkAborted();

    // 4단계: MediaRecorder 설정 및 녹화 시작
    const mimeType = getSupportedMimeType();
    const stream = canvas.captureStream(30);
    recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.start();

    // iOS 자동 재생 차단 등이 발생하면 여기서 catch로 던져짐
    await Promise.all(videoEls.map((el) => el.play()));

    // 5단계: RAF 루프로 매 프레임 합성 (배경 → 슬롯 비디오(회전) → 오버레이)
    const drawFrame = () => {
      ctx.drawImage(bgImage, 0, 0, themeConfig.width, themeConfig.height);
      videoEls.forEach((el, i) => {
        const slot = themeConfig.slots[i];
        if (slot) drawSingleSlot(ctx, el, slot);
      });
      if (overlayImage) {
        ctx.drawImage(overlayImage, 0, 0, themeConfig.width, themeConfig.height);
      }
      rafId = requestAnimationFrame(drawFrame);
    };
    rafId = requestAnimationFrame(drawFrame);

    // 6단계: 모든 비디오 종료 대기
    await Promise.all(
      videoEls.map(
        (el) =>
          new Promise<void>((resolve, reject) => {
            el.onended = () => resolve();
            el.onerror = () => reject(new Error('비디오 재생 에러'));
          }),
      ),
    );

    cancelAnimationFrame(rafId);
    recorder.stop();

    // recorder.stop() 이후 onstop 이벤트 발생까지 대기
    await new Promise<void>((res) => {
      recorder!.onstop = () => res();
    });

    return new Blob(chunks, { type: mimeType ?? 'video/webm' });
  } catch (err) {
    // 에러·취소 시 진행 중인 RAF와 recorder 안전하게 정리
    cancelAnimationFrame(rafId);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    throw err;
  } finally {
    // 비디오 요소용 임시 objectURL은 성공·실패 무관하게 즉시 해제
    tempObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  }
};

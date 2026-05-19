'use client';

import { useRef } from 'react';
import type { RefObject } from 'react';
import type Webcam from 'react-webcam';
import { getSupportedMimeType } from '@/utils/videoHelper';

/**
 * 웹캠 스트림을 MediaRecorder로 녹화하는 훅.
 * 슬롯별로 startSlotRecording → stopSlotRecording을 쌍으로 호출
 * @param webcamRef - react-webcam의 Webcam 인스턴스 ref
 * @returns startSlotRecording, stopSlotRecording
 */
export default function useVideoRecorder(webcamRef: RefObject<Webcam | null>) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  /**
   * 현재 슬롯 녹화를 시작합니다. async/await로 호출 가능
   * 웹캠 스트림이 없으면 즉시 resolve
   * @returns MediaRecorder가 start 상태가 된 후 resolve되는 Promise
   */
  const startSlotRecording = (): Promise<void> =>
    new Promise((resolve) => {
      const stream = webcamRef.current?.stream;
      if (!stream) {
        resolve();
        return;
      }

      chunksRef.current = [];

      // 지원하는 최적의 MIME Type 반환
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      recorderRef.current = recorder;
      resolve();
    });

  /**
   * 현재 슬롯 녹화를 중지하고 수집된 청크로 Blob을 반환
   * recorder가 없으면 빈 Blob을 반환
   * @returns 녹화된 webm Blob
   */
  const stopSlotRecording = (): Promise<Blob> =>
    new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(new Blob([], { type: 'video/webm' }));
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
        recorderRef.current = null;
        resolve(blob);
      };

      recorder.stop();
    });

  return { startSlotRecording, stopSlotRecording };
}

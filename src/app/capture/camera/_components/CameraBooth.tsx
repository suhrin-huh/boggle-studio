'use client';

// library
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// hooks
import useCamera from '@/hooks/useCamera';
import useLocalPhotoSlots from '@/hooks/useLocalPhotoSlots';
import useVideoRecorder from '@/hooks/useVideoRecorder';

// component
import CameraScreen from './CameraScreen';
import CameraControls from './CameraControls';

// global state
import { useBoothStore } from '@/store/useBoothStore';

// util
import { saveVideoBlob, generateVideoKey } from '@/utils/idbHelper';

// constant
import { TOTAL_SLOTS, CAPTURE_INTERVAL_MS } from '@/constants/booth';

export default function CameraBooth() {
  const router = useRouter();

  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);
  const setVideoSlotKeys = useBoothStore((state) => state.setVideoSlotKeys);

  const { localSlots, addNextPhoto, isAllFilled, filledCount } = useLocalPhotoSlots({
    totalSlots: TOTAL_SLOTS,
  });

  const { webcamRef, capture, isCameraReady, setIsCameraReady } = useCamera();
  const { startSlotRecording, stopSlotRecording } = useVideoRecorder(webcamRef);

  const [isFlashing, setIsFlashing] = useState(false);
  /** 자동 촬영 시퀀스 진행 중 여부 — true일 때 버튼 비활성화 */
  const [isCapturing, setIsCapturing] = useState(false);
  /** 현재 카운트다운 숫자 (null이면 카운트다운 비표시) */
  const [countdown, setCountdown] = useState<number | null>(null);
  /** 이번 세션에서 IndexedDB에 저장된 비디오 키 목록 */
  const [localVideoKeys, setLocalVideoKeys] = useState<string[]>([]);

  /**
   * "Capture" 버튼 클릭 시 실행되는 자동 순차 촬영 함수.
   * 남은 슬롯 수만큼 녹화 → 카운트다운 → 스냅샷 → IndexedDB 저장을 반복합니다.
   */
  const handleCapture = async () => {
    if (isCapturing || !isCameraReady) return;
    setIsCapturing(true);

    for (let i = filledCount; i < TOTAL_SLOTS; i++) {
      // 녹화 시작
      await startSlotRecording();

      // 카운트다운
      const seconds = CAPTURE_INTERVAL_MS / 1000;
      for (let c = seconds; c > 0; c--) {
        setCountdown(c);
        await new Promise<void>((r) => setTimeout(r, 1000));
      }
      setCountdown(null);

      // 사진 캡처 + 플래시 효과
      const screenshot = capture();
      if (!screenshot) break;
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 350);

      // 녹화 중지 → 반환된 Blob IndexedDB 저장
      const blob = await stopSlotRecording();
      const key = generateVideoKey(i);
      await saveVideoBlob(key, blob);

      // 로컬 상태에 추가
      addNextPhoto(screenshot);
      setLocalVideoKeys((prev) => [...prev, key]);
    }

    setIsCapturing(false);
  };

  /**
   * 촬영 데이터를 전역 스토어에 저장하고 테마 선택 페이지('/frame')로 이동합니다.
   */
  const handlePrint = () => {
    setPhotoSlots(localSlots as string[]);
    setVideoSlotKeys(localVideoKeys);
    router.push('/theme');
  };

  return (
    <>
      <CameraScreen
        isCameraReady={isCameraReady}
        setIsCameraReady={setIsCameraReady}
        filledCount={filledCount}
        totalSlots={TOTAL_SLOTS}
        webcamRef={webcamRef}
        isFlashing={isFlashing}
      >
        {/* 카운트다운 오버레이 */}
        {countdown !== null && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <span className="text-[120px] font-bold text-white drop-shadow-lg">{countdown}</span>
          </div>
        )}
      </CameraScreen>

      <CameraControls
        isAllFilled={isAllFilled}
        isCapturing={isCapturing}
        onCapture={handleCapture}
        onPrint={handlePrint}
      />
    </>
  );
}

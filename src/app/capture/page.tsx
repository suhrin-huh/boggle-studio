'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import useBoothStore from '@/store/useBoothStore';
import useCamera from '@/hooks/useCamera';
import { MAX_PHOTO_COUNT } from '@/constants/themes';
import { CaptureMode } from '@/types/booth';

// 카메라 해상도: 4:3 비율
const VIDEO_CONSTRAINTS = {
  width: 800,
  height: 600,
  facingMode: 'user',
} as const;

export default function CapturePage() {
  const router = useRouter();
  const addCapture = useBoothStore((state) => state.addCapture);
  const capturedCuts = useBoothStore((state) => state.capturedCuts);

  const [mode, setMode] = useState<CaptureMode | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [confirmedSlots, setConfirmedSlots] = useState<string[]>([]);
  const { webcamRef, capture } = useCamera();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allFilled =
    mode === 'camera'
      ? capturedCuts.length >= MAX_PHOTO_COUNT
      : confirmedSlots.filter(Boolean).length >= MAX_PHOTO_COUNT;

  // 4장 완성 시 3초 카운트다운 후 result 페이지로 이동
  useEffect(() => {
    if (!allFilled) return;

    setCountdown(3);
    let remaining = 3;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        router.push('/result');
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [allFilled, router]);

  const handleCameraCapture = useCallback(() => {
    if (capturedCuts.length >= MAX_PHOTO_COUNT) return;
    const screenshot = capture();
    if (screenshot) addCapture(screenshot);
  }, [capture, addCapture, capturedCuts.length]);

  // 모드 선택 전
  if (!mode) {
    return (
      <div>
        <h1>촬영 방법 선택</h1>
        <button onClick={() => setMode('camera')}>촬영하기</button>
        <button onClick={() => setMode('upload')}>사진 업로드 하기</button>
      </div>
    );
  }

  return (
    <div>
      <h1>촬영</h1>
      <p>
        {mode === 'camera' ? capturedCuts.length : confirmedSlots.filter(Boolean).length} /{' '}
        {MAX_PHOTO_COUNT}
      </p>

      {/* 카메라 모드 */}
      {mode === 'camera' && (
        <div>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={VIDEO_CONSTRAINTS}
            mirrored
            style={{ width: 400, height: 300 }}
          />
          <br />
          <button onClick={handleCameraCapture} disabled={capturedCuts.length >= MAX_PHOTO_COUNT}>
            촬영하기
          </button>
          {/* 촬영된 사진 미리보기 */}
          {capturedCuts.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`촬영 ${i + 1}`} style={{ width: 100, height: 75 }} />
          ))}
        </div>
      )}

      {/* 4장 완성 시 버튼 + 카운트다운 */}
      {allFilled && (
        <div>
          <button disabled>사진을 모두 선택하였습니다</button>
          {countdown !== null && <p>{countdown}초 후 결과 페이지로 이동합니다</p>}
        </div>
      )}
    </div>
  );
}

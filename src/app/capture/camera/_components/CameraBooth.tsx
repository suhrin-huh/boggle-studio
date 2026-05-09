'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';
import { FrameConfig } from '@/types';
import useCamera from '@/hooks/useCamera';
import useLocalPhotoSlots from '@/hooks/useLocalPhotoSlots';
import useCanvasEffect from '@/hooks/useCanvasEffect';
import NeumorphicButton from '@/components/common/NeumorphicButton';

const VIDEO_CONSTRAINTS = {
  width: { ideal: 1920 },
  height: { ideal: 1440 },
  // 4:3 비율을 카메라 스트림 단계에서 강제 → 브라우저가 16:9 기본값으로 fallback하는 것을 방지
  aspectRatio: 4 / 3,
  facingMode: { ideal: 'user' },
};

export default function CameraBooth() {
  const router = useRouter();

  // global states
  const frameId = useBoothStore((state) => state.frameId);
  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);
  const setEffectSlots = useBoothStore((state) => state.setEffectSlots);

  // frameId를 바탕으로 totalSlots 계산
  const totalSlots = frameId ? FRAMES[frameId].requiredPhotoCount : 4;

  // local states
  const { localSlots, addNextPhoto, isAllFilled, filledCount } = useLocalPhotoSlots({ totalSlots });

  const { webcamRef, capture, isCameraReady, setIsCameraReady } = useCamera();

  // 애니메이션 재생/일시정지 상태 (기본값: 재생 중)
  const [isPlaying, setIsPlaying] = useState(true);

  // 캔버스 오버레이 ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 캡처 순간마다 저장하는 이펙트 스냅샷 로컬 배열 (localSlots와 1:1 대응)
  const [localEffectSlots, setLocalEffectSlots] = useState<(string | null)[]>(
    Array(totalSlots).fill(null),
  );

  // satisfies 연산자로 좁혀진 타입을 FrameConfig로 캐스팅하여 optional 필드 접근
  const frameConfig = frameId ? (FRAMES[frameId] as FrameConfig) : null;
  const effectType = frameConfig?.effectType;

  // 캔버스 이펙트 엔진 훅: effectType이 있을 때만 RAF 루프 실행
  useCanvasEffect(canvasRef, effectType, isPlaying);

  useEffect(() => {
    // 프레임 선택 없이 카메라 페이지로 바로 접근한 경우 방어
    if (!frameId) {
      router.replace('/');
    }
  }, [frameId, router]);

  // frameId가 없으면 빈 화면을 반환하여 에러 방지
  if (!frameId) return null;

  const handleCapture = () => {
    const screenshot = capture();
    if (!screenshot) return;

    // 현재 채워진 슬롯 수 = 방금 찍힌 사진이 들어갈 인덱스
    const nextIndex = filledCount;
    addNextPhoto(screenshot);

    // 이펙트가 있으면 캡처 순간의 캔버스 상태를 같은 인덱스에 로컬 저장
    if (effectType && canvasRef.current) {
      const snapshot = canvasRef.current.toDataURL('image/png');
      setLocalEffectSlots((prev) => {
        const updated = [...prev];
        updated[nextIndex] = snapshot;
        return updated;
      });
    }
  };

  const handlePrint = () => {
    setPhotoSlots(localSlots as string[]);
    // localSlots와 동일한 타이밍에 effectSlots도 한 번에 스토어에 반영
    setEffectSlots(localEffectSlots.map((s) => s ?? ''));
    router.push('/result');
  };

  return (
    <>
      <div className="relative aspect-4/3">
        {/* 웹캠 연결 전 로딩 스피너 */}
        {!isCameraReady && (
          <div className="absolute flex h-full w-full flex-col items-center justify-center gap-4">
            <div className="border-muted h-10 w-10 animate-spin rounded-full border-8 border-t-white" />
            <p className="text-mute-dark text-body-md">Setting...</p>
          </div>
        )}

        {/* 촬영 카운트 */}
        <span className="absolute top-[5%] right-[5%] z-10 text-[16px] font-semibold text-white tabular-nums">
          {filledCount} / {totalSlots}
        </span>

        {/* 웹캠 */}
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/png"
          videoConstraints={VIDEO_CONSTRAINTS}
          onUserMedia={() => setIsCameraReady(true)}
          className="h-full w-full rounded-lg object-cover shadow-lg"
        />

        {/* 이펙트 캔버스: effectType이 있는 프레임에서만 렌더 */}
        {effectType && (
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-30 h-full w-full rounded-lg"
          />
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="grid w-full grid-cols-2 gap-3">
        {/* 이펙트 토글 버튼: effectType이 있는 프레임에서만 노출 */}
        {effectType && (
          <div className="w-full">
            <NeumorphicButton className="w-full" onClick={() => setIsPlaying((prev) => !prev)}>
              {isPlaying ? 'Pause Effect' : 'Play Effect'}
            </NeumorphicButton>
          </div>
        )}
        {!isAllFilled ? (
          <NeumorphicButton className="w-full" onClick={handleCapture}>
            Capture
          </NeumorphicButton>
        ) : (
          <NeumorphicButton onClick={handlePrint} className="w-full text-red-800">
            Create Your Print!
          </NeumorphicButton>
        )}
      </div>
    </>
  );
}

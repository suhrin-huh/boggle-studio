'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES, CAPTURE_MODE, CaptureMode } from '@/constants/booth';
import CameraCapture from './_components/CameraCapture';
import UploadCapture from './_components/UploadCapture';
import PixelButton from '@/components/common/PixelButton';

export default function CapturePage() {
  const router = useRouter();
  const { addCapture, capturedCuts, frameId } = useBoothStore();
  const requiredPhotoCount = frameId ? FRAMES[frameId].requiredPhotoCount : 0;

  const [mode, setMode] = useState<CaptureMode | null>(null);
  const [confirmedSlots, setConfirmedSlots] = useState<string[]>([]);
  const captureMode = Object.values(CAPTURE_MODE);
  const allFilled =
    mode === 'camera'
      ? capturedCuts.length >= requiredPhotoCount
      : confirmedSlots.filter(Boolean).length >= requiredPhotoCount;

  const handleUploadConfirm = useCallback(
    (index: number, data: string) => {
      setConfirmedSlots((prev) => {
        const next = [...prev];
        next[index] = data;
        return next;
      });
      addCapture(data);
    },
    [addCapture],
  );

  if (!mode) {
    return (
      <>
        <h1 className="text-center">촬영 방법 선택</h1>
        <div className="gap-md flex justify-center">
          {captureMode.map((mode) => (
            <button className="p-lg rounded-lg border-2" onClick={() => setMode(mode.id)}>
              {mode.label}
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <h1>촬영</h1>
      <p>
        {mode === 'camera' ? capturedCuts.length : confirmedSlots.filter(Boolean).length} /{' '}
        {requiredPhotoCount}
      </p>

      {mode === 'camera' && <CameraCapture capturedCuts={capturedCuts} onCapture={addCapture} />}

      {mode === 'upload' && (
        <UploadCapture confirmedSlots={confirmedSlots} onConfirm={handleUploadConfirm} />
      )}

      <div>
        <PixelButton
          variant={allFilled ? 'primary' : 'ghost'}
          disabled={!allFilled}
          onClick={() => router.push('/result')}
          className="scale-110"
        >
          사진 출력하기
        </PixelButton>
      </div>
    </div>
  );
}

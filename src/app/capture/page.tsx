'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { MAX_PHOTO_COUNT } from '@/constants/themes';
import { CaptureMode } from '@/types/booth';
import CameraCapture from './_components/CameraCapture';
import UploadCapture from './_components/UploadCapture';
import PixelButton from '@/components/common/PixelButton';

export default function CapturePage() {
  const router = useRouter();
  const { addCapture, capturedCuts } = useBoothStore();

  const [mode, setMode] = useState<CaptureMode | null>(null);
  const [confirmedSlots, setConfirmedSlots] = useState<string[]>([]);

  const allFilled =
    mode === 'camera'
      ? capturedCuts.length >= MAX_PHOTO_COUNT
      : confirmedSlots.filter(Boolean).length >= MAX_PHOTO_COUNT;

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
          <button className="p-lg rounded-lg border-2" onClick={() => setMode('camera')}>
            촬영하기
          </button>
          <button className="p-lg rounded-lg border-2" onClick={() => setMode('upload')}>
            사진 업로드 하기
          </button>
        </div>
      </>
    );
  }

  return (
    <div>
      <h1>촬영</h1>
      <p>
        {mode === 'camera' ? capturedCuts.length : confirmedSlots.filter(Boolean).length} /{' '}
        {MAX_PHOTO_COUNT}
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

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';
import UploadCapture from './_components/UploadCapture';
import PixelButton from '@/components/common/PixelButton';
interface UploadPageProps {}

/**
 * 업로드하기 모드
 */
export default function UploadPage({}: UploadPageProps) {
  const router = useRouter();
  const { addCapture, frameId } = useBoothStore();
  const requiredPhotoCount = frameId ? FRAMES[frameId].requiredPhotoCount : 0;
  const [confirmedSlots, setConfirmedSlots] = useState<string[]>([]);
  const allFilled = confirmedSlots.filter(Boolean).length >= requiredPhotoCount;

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

  return (
    <div>
      <h1>촬영</h1>
      <p>
        {confirmedSlots.filter(Boolean).length} / {requiredPhotoCount}
      </p>
      <UploadCapture confirmedSlots={confirmedSlots} onConfirm={handleUploadConfirm} />
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FRAMES, FrameId } from '@/constants/booth';
import { useBoothStore } from '@/store/useBoothStore';
import type { FrameConfig } from '@/types/booth';
import Carousel from '@/components/common/Carousel';
import PixelButton from '@/components/common/PixelButton';

const frameList = Object.values(FRAMES);
const frameKeys = Object.keys(FRAMES) as FrameId[];

export default function FramePage() {
  const router = useRouter();
  const setFrameId = useBoothStore((state) => state.setFrameId);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleNext = () => {
    setFrameId(frameKeys[focusedIndex]);
    router.push('/capture');
  };

  const renderFrameItem = (frame: FrameConfig) => (
    <div>
      <div className="relative h-100 w-50">
        <Image src={frame.sampleImageUrl} alt={frame.label} fill />
      </div>
      <p className="text-center">{frame.label}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <h1>프레임 선택</h1>
      <div className="mx-auto w-full">
        <Carousel
          items={frameList}
          renderItem={renderFrameItem}
          infinite={false}
          onIndexChange={setFocusedIndex}
        />
      </div>
      <PixelButton onClick={handleNext}>Take a photo!</PixelButton>
    </div>
  );
}

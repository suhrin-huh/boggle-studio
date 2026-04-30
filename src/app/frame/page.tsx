'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FRAME_THEMES } from '@/constants/themes';
import { useBoothStore } from '@/store/useBoothStore';
import type { ThemeOption } from '@/types/booth';
import Carousel from '@/components/common/Carousel';
import frameImg from '@/assets/image/frame.png';
import PixelButton from '@/components/common/PixelButton';

export default function FramePage() {
  const router = useRouter();
  const setTheme = useBoothStore((state) => state.setTheme);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleNext = () => {
    setTheme(FRAME_THEMES[focusedIndex]);
    router.push('/capture');
  };

  const renderThemeItem = (theme: ThemeOption) => (
    <div>
      <Image src={frameImg} alt={theme.label} width={200} height={150} />
      <p className="text-center">{theme.label}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <h1>프레임 선택</h1>
      <div className="mx-auto w-full">
        <Carousel
          items={FRAME_THEMES}
          renderItem={renderThemeItem}
          infinite={false}
          onIndexChange={setFocusedIndex}
        />
      </div>
      <PixelButton onClick={handleNext}>Take a photo!</PixelButton>
    </div>
  );
}

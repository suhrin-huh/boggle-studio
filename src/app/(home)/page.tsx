'use client';

import PixelButton from '@/components/common/PixelButton';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="p-sm flex flex-1 flex-col items-center justify-center gap-2">
      <p className="font-pixel text-primary text-body-sm md:text-body-lg">BOGGLE BOGGLE STUDIO</p>
      <p>집에서 편리하게 촬영하는 인생네컷</p>
      <PixelButton onClick={() => router.push('/frame')}>START</PixelButton>
    </div>
  );
}

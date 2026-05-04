'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import serviceDemo from '@/assets/image/service-demo.gif';
import introText from '@/assets/image/inrto-text.png';
import PhotoFrame from './_components/PhotoFrame';
import NeumorphicButton from '@/components/common/NeumorphicButton';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="p-md flex flex-1 flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
      {/* 텍스트 컨텐츠 */}
      <div className="font-unbounded flex flex-col gap-2 text-center md:gap-3">
        <div className="relative h-35 w-80">
          <Image src={introText} alt="서비스 소개글" fill loading="eager" className="rounded-sm" />
        </div>
        <p className="text-muted-dark text-[10px] md:text-[12px] lg:text-[14px]">
          capture the unexpected.
        </p>
      </div>
      <PhotoFrame className="aspect-3/4 w-60 md:w-70 lg:w-90">
        <Image
          src={serviceDemo}
          alt="서비스 소개 GIF"
          fill
          loading="eager"
          className="rounded-sm"
          unoptimized
        />
      </PhotoFrame>
      <p className="text-muted-dark font-unbounded text-[9px] md:text-[11px] lg:text-[13px]">
        PLAYFUL · PHOTO · PIECES
      </p>
      <NeumorphicButton className="z-10" onClick={() => router.push('/frame')}>
        START
      </NeumorphicButton>
    </main>
  );
}

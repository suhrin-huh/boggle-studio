// libraries & frameworks
import Image from 'next/image';
import Link from 'next/link';

// components
import PhotoFrame from './PhotoFrame';
import NeumorphicButton from '@/components/common/NeumorphicButton';

// assets & types
import introText from '@/assets/image/intro-text.png';
import serviceDemo from '@/assets/image/service-demo.gif';

export default function ServiceIntro() {
  return (
    <>
      <div className="gap-sm flex flex-col text-center">
        <Image src={introText} alt="서비스 소개글" width={240} height={60} priority />
        <p className="text-muted-dark text-body-xs font-unbounded">capture the unexpected.</p>
      </div>
      <PhotoFrame className="aspect-3/4 w-60">
        <img
          src={serviceDemo.src}
          alt="서비스 소개 GIF"
          className="rounded-sm"
          width="240"
          height="320"
        />
      </PhotoFrame>
      <p className="text-muted-dark font-unbounded text-body-xs">PLAYFUL · PHOTO · PIECES</p>

      <Link href="/capture" className="z-10">
        <NeumorphicButton className="hover:cursor-pointer">START</NeumorphicButton>
      </Link>
    </>
  );
}

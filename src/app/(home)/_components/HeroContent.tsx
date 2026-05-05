import Image from 'next/image';
import introText from '@/assets/image/intro-text.png';

export default function HeroContent() {
  return (
    <div className="font-unbounded gap-sm md:gap-md flex flex-col text-center">
      <div className="relative aspect-4/1 h-15 md:h-30">
        <Image src={introText} alt="서비스 소개글" fill loading="eager" className="rounded-sm" />
      </div>
      <p className="text-muted-dark text-[12px] md:text-[14px]">capture the unexpected.</p>
    </div>
  );
}

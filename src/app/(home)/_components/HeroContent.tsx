import Image from 'next/image';
import introText from '@/assets/image/intro-text.png';

export default function HeroContent() {
  return (
    <div className="font-unbounded gap-sm md:gap-md flex flex-col text-center">
      <Image
        src={introText}
        alt="서비스 소개글"
        width={240}
        height={60}
        className="rounded-sm"
        priority
      />
      <p className="text-muted-dark text-caption">capture the unexpected.</p>
    </div>
  );
}

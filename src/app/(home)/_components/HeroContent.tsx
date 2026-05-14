import Image from 'next/image';
import introText from '@/assets/image/intro-text.png';

export default function HeroContent() {
  return (
    <div className="gap-sm flex flex-col text-center">
      <Image src={introText} alt="서비스 소개글" width={240} height={60} priority />
      <p className="text-muted-dark text-caption font-unbounded">capture the unexpected.</p>
    </div>
  );
}

import Link from 'next/link';
import HeroContent from './_components/HeroContent';
import ServiceDemo from './_components/ServiceDemo';
import NeumorphicButton from '@/components/common/NeumorphicButton'; // 직접 불러옵니다!

export default function HomePage() {
  return (
    <main className="p-md flex flex-1 flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
      <HeroContent />
      <ServiceDemo />
      <p className="text-muted-dark font-unbounded text-[9px] md:text-[11px] lg:text-[13px]">
        PLAYFUL · PHOTO · PIECES
      </p>

      {/* ✨ 컴포넌트 따로 만들 필요 없이 여기서 바로 조립 (합성 패턴) */}
      <Link href="/frame" className="z-10">
        <NeumorphicButton className="hover:cursor-pointer">START</NeumorphicButton>
      </Link>
    </main>
  );
}

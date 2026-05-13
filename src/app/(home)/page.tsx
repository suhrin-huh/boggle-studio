import Link from 'next/link';
import HeroContent from './_components/HeroContent';
import ServiceDemo from './_components/ServiceDemo';
import NeumorphicButton from '@/components/common/NeumorphicButton'; // 직접 불러옵니다!
import VisitorLogger from '@/components/common/VisitorLogger';

export default function HomePage() {
  return (
    <main className="p-md gap-lg flex flex-1 flex-col items-center justify-center">
      <VisitorLogger />
      <HeroContent />
      <ServiceDemo />
      <p className="text-muted-dark font-unbounded text-[10px]">PLAYFUL · PHOTO · PIECES</p>

      {/* ✨ 컴포넌트 따로 만들 필요 없이 여기서 바로 조립 (합성 패턴) */}
      <Link href="/frame" className="z-10">
        <NeumorphicButton className="hover:cursor-pointer">START</NeumorphicButton>
      </Link>
    </main>
  );
}

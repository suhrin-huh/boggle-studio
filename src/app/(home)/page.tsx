import HeroContent from './_components/HeroContent';
import ServiceDemo from './_components/ServiceDemo';
import HomeStartButton from './_components/HomeStartButton';

export default function HomePage() {
  return (
    <main className="p-md flex flex-1 flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
      <HeroContent />
      <ServiceDemo />
      <p className="text-muted-dark font-unbounded text-[9px] md:text-[11px] lg:text-[13px]">
        PLAYFUL · PHOTO · PIECES
      </p>
      <HomeStartButton />
    </main>
  );
}

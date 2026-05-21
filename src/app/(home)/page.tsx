import VisitorLogger from '@/components/common/VisitorLogger';
import BoothReset from '@/components/common/BoothReset';
import ServiceIntro from './_components/ServiceIntro';

export default function HomePage() {
  return (
    <main className="p-md gap-lg flex flex-1 flex-col items-center justify-center">
      {/* 이용 로그 기록용 */}
      <VisitorLogger />
      {/* 메인 홈페이지 접근 시 전역 스토어 초기화 */}
      <BoothReset />
      {/* 서비스 소개 및 진입 라우팅  */}
      <ServiceIntro />
    </main>
  );
}

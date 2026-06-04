import PageContainer from '@/components/common/PageContainer';
import VisitorLogger from '@/components/common/VisitorLogger';
import BoothReset from '@/components/common/BoothReset';
import ServiceIntro from './_components/ServiceIntro';

/**
 * 서비스 메인 홈페이지 컴포넌트
 */
export default function HomePage() {
  return (
    <PageContainer>
      <VisitorLogger />
      <BoothReset />
      <ServiceIntro />
    </PageContainer>
  );
}

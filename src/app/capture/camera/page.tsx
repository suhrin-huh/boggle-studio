import PageContainer from '@/components/common/PageContainer';
import CameraBooth from './_components/CameraBooth';

/**
 * 카메라 촬영 모드 페이지
 */
export default function CameraPage() {
  return (
    <PageContainer className="justify-stretch">
      <CameraBooth />
    </PageContainer>
  );
}

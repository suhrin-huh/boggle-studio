// components
import PageContainer from '@/components/common/PageContainer';
import PageTitle from '@/components/common/PageTitle';
import CameraBooth from './_components/CameraBooth';

export default function CameraPage() {
  return (
    <PageContainer className="justify-stretch">
      <PageTitle title="Camera" />
      <CameraBooth />
    </PageContainer>
  );
}

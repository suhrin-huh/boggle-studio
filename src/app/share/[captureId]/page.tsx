// components
import PageContainer from '@/components/common/PageContainer';
import ShareExpired from './_components/ShareExpired';
import ShareView from './_components/ShareView';

// actions
import { getCaptureDetail } from '@/actions/captures';

interface SharePageProps {
  params: Promise<{ captureId: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { captureId } = await params;
  const result = await getCaptureDetail(captureId);

  if (!result.success || !result.data) {
    return (
      <PageContainer>
        <ShareExpired />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ShareView
        imageUrl={result.data.imageUrl}
        videoUrl={result.data.videoUrl}
        fileName={result.data.fileName}
      />
    </PageContainer>
  );
}

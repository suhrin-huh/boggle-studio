import { getCaptureDetail } from '@/actions/captures';
import ShareExpired from './_components/ShareExpired';
import ShareView from './_components/ShareView';

interface SharePageProps {
  params: Promise<{ captureId: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { captureId } = await params;
  const result = await getCaptureDetail(captureId);

  if (!result.success || !result.data) {
    return (
      <main className="p-md gap-xl flex flex-1 flex-col items-center justify-center">
        <ShareExpired />
      </main>
    );
  }

  return (
    <main className="p-md gap-xl flex flex-1 flex-col items-center justify-center">
      <ShareView
        imageUrl={result.data.imageUrl}
        videoUrl={result.data.videoUrl}
        fileName={result.data.fileName}
      />
    </main>
  );
}

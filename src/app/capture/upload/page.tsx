// components
import PageTitle from '@/components/common/PageTitle';
import UploadBooth from './_components/UploadBooth';

/**
 * 업로드 모드
 */
export default function UploadPage() {
  return (
    <main className="p-md gap-lg flex flex-1 flex-col items-center justify-center">
      <PageTitle title="Upload" />
      {/* 업로드 로직과 상태 관리를 전담 */}
      <UploadBooth />
    </main>
  );
}

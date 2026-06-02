// components
import PageContainer from '@/components/common/PageContainer';
import UploadBooth from './_components/UploadBooth';

/**
 * 업로드 모드
 */
export default function UploadPage() {
  return (
    <PageContainer>
      {/* 업로드 로직과 상태 관리를 전담 */}
      <UploadBooth />
    </PageContainer>
  );
}

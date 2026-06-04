import PageContainer from '@/components/common/PageContainer';
import CaptureModeButton from './_components/CaptureModeButton';

import { CAPTURE_MODE } from '@/constants';

/**
 * 촬영 모드를 선택하는 페이지 컴포넌트
 */
export default function CapturePage() {
  const captureModes = Object.values(CAPTURE_MODE);

  return (
    <PageContainer>
      <div className="gap-lg p-lg flex w-full flex-col items-center">
        {captureModes.map((mode) => (
          <CaptureModeButton key={mode.id} mode={mode} />
        ))}
      </div>
    </PageContainer>
  );
}

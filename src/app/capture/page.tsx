// components (common -> local)
import PageContainer from '@/components/common/PageContainer';
import PageTitle from '@/components/common/PageTitle';
import CaptureModeButton from './_components/CaptureModeButton';

// assets & types
import { CAPTURE_MODE } from '@/constants/booth';

export default function CapturePage() {
  const captureModes = Object.values(CAPTURE_MODE);

  return (
    <PageContainer>
      <PageTitle title="Select an Option." />
      <div className="gap-lg p-lg flex w-full flex-col items-center">
        {captureModes.map((mode) => (
          <CaptureModeButton key={mode.id} mode={mode} />
        ))}
      </div>
    </PageContainer>
  );
}

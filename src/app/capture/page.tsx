import { CAPTURE_MODE } from '@/constants/booth';
import PageTitle from '@/components/common/PageTitle';
import CaptureModeButton from './_components/CaptureModeButton';

export default function CapturePage() {
  const captureModes = Object.values(CAPTURE_MODE);

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <PageTitle title="SELECT A MODE" />
      {/* 모드 선택 버튼 */}
      <div className="gap-lg p-lg flex w-full shrink-0 flex-col">
        {captureModes.map((mode) => (
          <CaptureModeButton key={mode.id} mode={mode} />
        ))}
      </div>
    </main>
  );
}

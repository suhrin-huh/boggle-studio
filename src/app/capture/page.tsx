import { CAPTURE_MODE } from '@/constants/booth';
import Link from 'next/link';
import PageTitle from '@/components/common/PageTitle';
import CaptureModeButton from './_components/CaptureModeButton';

export default function CapturePage() {
  const captureModes = Object.values(CAPTURE_MODE);

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <PageTitle title="SELECT A MODE" />

      {/* 모드 선택 버튼 리스트 */}
      <div className="gap-lg p-lg flex w-full shrink-0 flex-col">
        {captureModes.map((mode) => (
          /* Link를 밖으로 빼서 제어권을 부모가 가짐 */
          <Link key={mode.id} href={mode.path} className="w-full">
            <CaptureModeButton mode={mode} />
          </Link>
        ))}
      </div>
    </main>
  );
}

// libraries & frameworks
import Link from 'next/link';

// components (common -> local)
import PageTitle from '@/components/common/PageTitle';
import CaptureModeButton from './_components/CaptureModeButton';

// assets & types
import { CAPTURE_MODE } from '@/constants/booth';

export default function CapturePage() {
  const captureModes = Object.values(CAPTURE_MODE);

  return (
    <main className="hide-scrollbar py-md flex h-full w-full flex-col items-center justify-center overflow-y-auto">
      <PageTitle title="Select an Option." />
      <div className="gap-lg p-lg flex w-full flex-col">
        {captureModes.map((mode) => (
          <Link key={mode.id} href={mode.path} className="w-full">
            <CaptureModeButton mode={mode} />
          </Link>
        ))}
      </div>
    </main>
  );
}

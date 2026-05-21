// components
import PageTitle from '@/components/common/PageTitle';
import CameraBooth from './_components/CameraBooth';

export default function CameraPage() {
  return (
    <main className="p-md gap-lg flex flex-1 flex-col">
      <PageTitle title="Camera" />
      <CameraBooth />
    </main>
  );
}

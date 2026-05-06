import PageTitle from '@/components/common/PageTitle';
import FrameSelector from './_components/FrameSelector';

/**
 * 프레임 선택 페이지
 */
export default function FramePage() {
  return (
    <main className="p-md flex flex-1 flex-col items-center justify-center gap-8 font-sans">
      <PageTitle title="SELECT A FRAME" />
      <FrameSelector />
    </main>
  );
}

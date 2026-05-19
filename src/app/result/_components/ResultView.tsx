import PageTitle from '@/components/common/PageTitle';
import ResultActionButtons from './ResultActionButtons';

import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';

interface ResultViewProps {
  resultImage: string;
  resultVideoUrl: string | null;
  fileName: string;
}

/**
 * 사진 및 스케치 영상 합성 완료 시 보이는 결과 페이지
 * @param resultImage 정적 합성 PNG DataURL
 * @param resultVideoUrl : 합성 비디오 objectURL
 * @param fileName : 파일명
 */
export default function ResultView({ resultImage, resultVideoUrl, fileName }: ResultViewProps) {
  const router = useRouter();
  const resetBooth = useBoothStore((state) => state.resetBooth);

  // 스케치 영상이 있으면 .webm으로, 없으면 .png로 다운로드 : TODO: 둘 다 다운로드할 수 있도록 UI 수정 필요
  const handleDownload = () => {
    const link = document.createElement('a');
    if (resultVideoUrl) {
      link.href = resultVideoUrl;
      link.download = fileName.replace('.png', '.webm');
    } else {
      link.href = resultImage;
      link.download = fileName;
    }
    link.click();
  };

  const handleRestart = () => {
    resetBooth();
    router.push('/');
  };
  return (
    <>
      <PageTitle title="Done!" />
      {resultVideoUrl ? (
        <video src={resultVideoUrl} className="h-90 w-auto" autoPlay loop muted playsInline />
      ) : (
        <img src={resultImage} alt="Generated cut" className="h-90 w-auto" />
      )}
      <ResultActionButtons
        onDownload={handleDownload}
        onCreateQR={() => {}}
        onRestart={handleRestart}
      />
    </>
  );
}

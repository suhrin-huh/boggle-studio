// libraries & frameworks
import { useRouter } from 'next/navigation';

// global stores, hoos & utils
import { useBoothStore } from '@/store/useBoothStore';
import { useQrUpload } from '@/hooks/useQrUpload';

// components
import ResultActionButtons from './ResultActionButtons';
import QrCodeButton from './QrCodeButton';

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
  const { qrState, handleQrCreate } = useQrUpload({ resultImage, resultVideoUrl, fileName });

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = fileName;
    link.click();
  };

  const handleDownloadVideo = () => {
    if (!resultVideoUrl) return;
    const link = document.createElement('a');
    link.href = resultVideoUrl;
    link.download = fileName.replace('.png', '.webm');
    link.click();
  };

  const handleRestart = () => {
    resetBooth();
    router.push('/');
  };

  return (
    <>
      {resultVideoUrl ? (
        <video src={resultVideoUrl} className="h-90 w-auto" autoPlay loop muted playsInline />
      ) : (
        <img src={resultImage} alt="Generated cut" className="h-90 w-auto" />
      )}
      <ResultActionButtons
        onDownloadImage={handleDownloadImage}
        onDownloadVideo={handleDownloadVideo}
        isVideoAvailable={!!resultVideoUrl}
        qrButton={<QrCodeButton state={qrState} onClick={handleQrCreate} />}
        onRestart={handleRestart}
      />
    </>
  );
}

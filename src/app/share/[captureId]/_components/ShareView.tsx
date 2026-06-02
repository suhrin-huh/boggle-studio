'use client';

import DownloadIcon from '@/assets/icon/DownloadIcon';
import NeumorphicButton from '@/components/common/NeumorphicButton';

interface ShareViewProps {
  imageUrl: string;
  videoUrl: string | null;
  fileName: string;
}

/**저장 만료 등의 이유로 데이터 조회에 실패한 경우 보여지는 UI
 * @property imageUrl
 * @property videoUrl
 * @property fileName : QR 다운로드시에도 동일한 파일명 가지도록 DB에 저장
 */
export default function ShareView({ imageUrl, videoUrl, fileName }: ShareViewProps) {
  const downloadFile = async (url: string, extension: 'png' | 'webm') => {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${fileName}.${extension}`;
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  const handleDownloadImage = () => downloadFile(imageUrl, 'png');
  const handleDownloadVideo = () => {
    if (videoUrl) downloadFile(videoUrl, 'webm');
  };

  return (
    <>
      {videoUrl ? (
        <video src={videoUrl} className="h-90 w-auto" autoPlay loop muted playsInline />
      ) : (
        <img src={imageUrl} alt="Shared capture" className="h-90 w-auto" />
      )}
      {/* 파일 다운로드 버튼 */}
      <div className="gap-md flex w-full flex-col justify-center sm:flex-row">
        <NeumorphicButton onClick={handleDownloadImage}>
          <div className="text-muted-dark flex flex-col items-center gap-1.5">
            <DownloadIcon />
            <p className="tracking-wide">Image</p>
          </div>
        </NeumorphicButton>
        <NeumorphicButton onClick={handleDownloadVideo} disabled={!videoUrl}>
          <div className="text-muted-dark flex flex-col items-center gap-1.5">
            <DownloadIcon />
            <p className="tracking-wide">Video</p>
          </div>
        </NeumorphicButton>
      </div>
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';

import DownloadIcon from '@/assets/icon/DownloadIcon';
import QrCodeIcon from '@/assets/icon/QrCodeIcon';
import RestartIcon from '@/assets/icon/RestartIcon';
import NeumorphicButton from '@/components/common/NeumorphicButton';

interface ResultActionButtons {
  resultImage: string;
  fileName: string;
}

export default function ResultActionButtons({ resultImage, fileName }: ResultActionButtons) {
  const router = useRouter();
  const resetBooth = useBoothStore((state) => state.resetBooth);

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = fileName;
    link.click();
  };

  const handleRetry = () => {
    resetBooth();
    router.push('/');
  };

  return (
    <>
      <div className="gap-md flex w-full flex-col md:flex-row">
        <NeumorphicButton onClick={handleDownload}>
          <div className="text-muted-dark flex flex-col items-center gap-1.5">
            <DownloadIcon />
            <p className="tracking-wide">Download</p>
          </div>
        </NeumorphicButton>
        <NeumorphicButton onClick={() => {}}>
          <div className="flex flex-col items-center gap-1.5">
            <QrCodeIcon />
            <p className="tracking-wide">QR Code</p>
          </div>
        </NeumorphicButton>
        <NeumorphicButton onClick={handleRetry}>
          <div className="flex flex-col items-center gap-1.5">
            <RestartIcon />
            <p className="tracking-wide">Restart</p>
          </div>
        </NeumorphicButton>
      </div>
    </>
  );
}

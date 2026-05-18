import DownloadIcon from '@/assets/icon/DownloadIcon';
import QrCodeIcon from '@/assets/icon/QrCodeIcon';
import RestartIcon from '@/assets/icon/RestartIcon';
import NeumorphicButton from '@/components/common/NeumorphicButton';

interface ResultActionButtonsProps {
  onDownload: () => void;
  onCreateQr: () => void;
  onRestart: () => void;
}

/**
 * 결과 페이지의 하단 액션 버튼 그룹 컴포넌트
 * @param onDownload 최종 합성된 결과물(사진 및 스케치 영상)을 다운로드하는 함수
 * @param onCreateQr 결과물을 클라우드 업로드 및 공유용 QR 모달을 띄우는 함수
 * @param onRestart 현재 세션 데이터 초기화 및 첫 화면으로 돌아가는 함수
 */
export default function ResultActionButtons({
  onDownload,
  onCreateQr,
  onRestart,
}: ResultActionButtonsProps) {
  return (
    <>
      <div className="gap-md flex w-full flex-col justify-center md:flex-row">
        <NeumorphicButton onClick={onDownload}>
          <div className="text-muted-dark flex flex-col items-center gap-1.5">
            <DownloadIcon />
            <p className="tracking-wide">Download</p>
          </div>
        </NeumorphicButton>
        <NeumorphicButton onClick={onCreateQr}>
          <div className="flex flex-col items-center gap-1.5">
            <QrCodeIcon />
            <p className="tracking-wide">QR Code</p>
          </div>
        </NeumorphicButton>
        <NeumorphicButton onClick={onRestart}>
          <div className="flex flex-col items-center gap-1.5">
            <RestartIcon />
            <p className="tracking-wide">Restart</p>
          </div>
        </NeumorphicButton>
      </div>
    </>
  );
}

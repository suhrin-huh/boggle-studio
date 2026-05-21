import DownloadIcon from '@/assets/icon/DownloadIcon';
import RestartIcon from '@/assets/icon/RestartIcon';
import NeumorphicButton from '@/components/common/NeumorphicButton';

interface ResultActionButtonsProps {
  onDownload: () => void;
  qrButton: React.ReactNode;
  onRestart: () => void;
}

/**
 * 결과 페이지의 하단 액션 버튼 그룹 컴포넌트
 * @param onDownload 최종 합성된 결과물(사진 및 스케치 영상)을 다운로드하는 함수
 * @param qrButton QR 코드 버튼 컴포넌트 (상태에 따라 스피너/QR 이미지 표시)
 * @param onRestart 현재 세션 데이터 초기화 및 첫 화면으로 돌아가는 함수
 */
export default function ResultActionButtons({
  onDownload,
  qrButton,
  onRestart,
}: ResultActionButtonsProps) {
  return (
    <div className="gap-md flex w-full flex-col justify-center md:flex-row">
      <NeumorphicButton onClick={onDownload}>
        <div className="text-muted-dark flex flex-col items-center gap-1.5">
          <DownloadIcon />
          <p className="tracking-wide">Download</p>
        </div>
      </NeumorphicButton>

      {qrButton}

      <NeumorphicButton onClick={onRestart}>
        <div className="flex flex-col items-center gap-1.5">
          <RestartIcon />
          <p className="tracking-wide">Restart</p>
        </div>
      </NeumorphicButton>
    </div>
  );
}

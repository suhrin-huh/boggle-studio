import DownloadIcon from '@/assets/icon/DownloadIcon';
import RestartIcon from '@/assets/icon/RestartIcon';
import NeumorphicButton from '@/components/common/NeumorphicButton';

interface ResultActionButtonsProps {
  onDownloadImage: () => void;
  onDownloadVideo: () => void;
  isVideoAvailable: boolean;
  qrButton: React.ReactNode;
  onRestart: () => void;
}

/**
 * 결과 페이지의 하단 액션 버튼 그룹 컴포넌트
 * @param onDownloadImage  합성 이미지(PNG)를 다운로드하는 함수
 * @param onDownloadVideo  합성 비디오(WebM)를 다운로드하는 함수
 * @param isVideoAvailable 비디오 생성 여부 — false이면 비디오 버튼 disabled
 * @param qrButton         QR 코드 버튼 컴포넌트
 * @param onRestart        세션 초기화 후 첫 화면으로 이동하는 함수
 */
export default function ResultActionButtons({
  onDownloadImage,
  onDownloadVideo,
  isVideoAvailable,
  qrButton,
  onRestart,
}: ResultActionButtonsProps) {
  return (
    <div className="gap-md grid w-full grid-cols-4 justify-center">
      {/* 이미지 다운로드 */}
      <NeumorphicButton onClick={onDownloadImage}>
        <div className="flex flex-col items-center gap-1.5">
          <DownloadIcon />
          <p className="tracking-wide">Image</p>
        </div>
      </NeumorphicButton>

      {/* 비디오 다운로드 — 비디오 생성 실패 시 disabled */}
      <NeumorphicButton onClick={onDownloadVideo} disabled={!isVideoAvailable}>
        <div className="flex flex-col items-center gap-1.5">
          <DownloadIcon />
          <p className="tracking-wide">Video</p>
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

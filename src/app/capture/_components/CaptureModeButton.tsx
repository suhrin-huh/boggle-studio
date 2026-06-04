import NeumorphicButton from '@/components/common/NeumorphicButton';
import CameraIcon from '@/assets/icon/CameraIcon';
import UploadIcon from '@/assets/icon/UploadIcon';

import type { CaptureMode } from '@/constants';

const MODE_ICONS: Record<string, React.ReactNode> = {
  camera: <CameraIcon size={28} />,
  upload: <UploadIcon size={28} />,
};

interface CaptureModeButtonProps {
  mode: CaptureMode;
  disabled?: boolean;
}

/**
 * 촬영 모드 선택 버튼 컴포넌트
 * @param mode - 모드 정보
 * @param disabled - 버튼 비활성화 여부
 */
export default function CaptureModeButton({ mode, disabled = false }: CaptureModeButtonProps) {
  return (
    <NeumorphicButton
      href={disabled ? undefined : mode.path}
      disabled={disabled}
      className={`gap-md flex h-30 w-1/2 flex-col items-center justify-center sm:h-60 ${disabled ? 'cursor-not-allowed' : 'hover:cursor-pointer'}`}
    >
      {MODE_ICONS[mode.id]}
      <p>{mode.label}</p>
    </NeumorphicButton>
  );
}

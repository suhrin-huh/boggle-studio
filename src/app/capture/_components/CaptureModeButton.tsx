import NeumorphicButton from '@/components/common/NeumorphicButton';
import CameraIcon from '@/assets/icon/CameraIcon';
import UploadIcon from '@/assets/icon/UploadIcon';

import type { CaptureMode } from '@/constants/booth';

const MODE_ICONS: Record<string, React.ReactNode> = {
  camera: <CameraIcon size={28} />,
  upload: <UploadIcon size={28} />,
};

interface CaptureModeButtonProps {
  mode: CaptureMode;
  disabled?: boolean;
}

/**
 * 모드 선택 버튼 UI
 * @param mode 모드의 id와 컴포넌트 내의 icon 대응
 * @param disabled 버튼 비활성화 여부 (이펙트 프레임 선택 시 Upload 버튼 비활성화에 사용)
 */
export default function CaptureModeButton({ mode, disabled = false }: CaptureModeButtonProps) {
  return (
    <NeumorphicButton
      disabled={disabled}
      className={`h-60 w-full ${disabled ? 'cursor-not-allowed' : 'hover:cursor-pointer'}`}
    >
      <div className="flex flex-col items-center gap-2">
        {MODE_ICONS[mode.id]}
        <span>{mode.label}</span>
      </div>
    </NeumorphicButton>
  );
}

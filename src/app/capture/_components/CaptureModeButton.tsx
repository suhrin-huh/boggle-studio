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
 * href를 받아 NeumorphicButton이 <a>로 렌더링되므로 외부에서 Link로 감쌀 필요 없음
 * @param mode 모드의 id, path, label 포함
 * @param disabled 버튼 비활성화 여부 (이펙트 프레임 선택 시 Upload 버튼 비활성화에 사용)
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

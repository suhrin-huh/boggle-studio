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
}

/**
 * 모드 선택 버튼 UI
 * @param mode
 * 모드의 id과 컴포넌트 내의 icon 대응
 */
export default function CaptureModeButton({ mode }: CaptureModeButtonProps) {
  return (
    <NeumorphicButton className="h-60 w-full hover:cursor-pointer">
      <div className="flex flex-col items-center gap-2">
        {MODE_ICONS[mode.id]}
        <span>{mode.label}</span>
      </div>
    </NeumorphicButton>
  );
}

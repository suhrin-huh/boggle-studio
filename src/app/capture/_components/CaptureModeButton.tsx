import Link from 'next/link';
import NeumorphicButton from '@/components/common/NeumorphicButton';
import CameraIcon from '@/assets/icon/CameraIcon';
import UploadIcon from '@/assets/icon/UploadIcon';
import type { CaptureMode } from '@/constants/booth';

const MODE_ICONS: Record<string, React.ReactNode> = {
  camera: <CameraIcon size={28} />,
  upload: <UploadIcon size={28} />,
};

interface CaptureModeItemProps {
  mode: CaptureMode;
}

export default function CaptureModeItem({ mode }: CaptureModeItemProps) {
  return (
    <Link href={mode.path} className="w-full">
      <NeumorphicButton className="h-60 w-full hover:cursor-pointer">
        <div className="flex flex-col items-center gap-2">
          {MODE_ICONS[mode.id]}
          <span>{mode.label}</span>
        </div>
      </NeumorphicButton>
    </Link>
  );
}

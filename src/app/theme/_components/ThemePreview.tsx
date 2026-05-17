import Image from 'next/image';
import { FrameType } from '@/constants/booth';
import PhotoCompositeCanvas from './PhotoCompositeCanvas';

interface ThemePreviewProps {
  src: string;
  width: number;
  height: number;
  selectedFrame: FrameType;
}

export default function ThemePreview({ src, width, height, selectedFrame }: ThemePreviewProps) {
  return (
    <div className="flex justify-center">
      <div className="relative overflow-hidden">
        <Image
          src={src}
          alt="theme preview"
          width={width}
          height={height}
          className="object-cover"
          priority
        />
        <PhotoCompositeCanvas selectedFrame={selectedFrame} />
      </div>
    </div>
  );
}

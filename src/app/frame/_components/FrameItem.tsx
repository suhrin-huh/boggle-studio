import Image from 'next/image';
import type { FrameConfig } from '@/types/booth';

interface FrameItemProps {
  frame: FrameConfig;
}

export default function FrameItem({ frame }: FrameItemProps) {
  return (
    <div className="gap-md flex flex-col items-center justify-center">
      <div className="relative aspect-1/3 w-30">
        <Image src={frame.sampleImageUrl} alt={frame.label} fill />
      </div>
      <p className="text-caption font-sans">{frame.label}</p>
    </div>
  );
}

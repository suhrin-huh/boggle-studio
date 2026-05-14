import Image from 'next/image';
import type { FrameConfig } from '@/types';

interface FrameItemProps {
  frame: FrameConfig;
  index: number;
}

export default function FrameItem({ frame, index }: FrameItemProps) {
  return (
    <div className="gap-md flex flex-col items-center justify-center">
      <p className="text-body-sm text-muted-dark font-unbounded">{frame.label}</p>
      <Image
        src={frame.sampleImageUrl}
        alt={frame.label}
        width={120}
        height={360}
        priority={index === 0}
        loading={index !== 0 ? 'eager' : undefined}
      />
    </div>
  );
}

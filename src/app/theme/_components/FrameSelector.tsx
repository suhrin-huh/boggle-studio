'use client';

import { FRAMES } from '@/constants/booth';
import { useThemeSelection } from '@/hooks/useThemeSelection';
import Carousel from '@/components/common/Carousel';
import NeumorphicButton from '@/components/common/NeumorphicButton';
import FrameItem from './FrameItem';

export default function FrameSelector() {
  const frameList = Object.values(FRAMES);
  const { handleConfirm } = useThemeSelection();

  return (
    <>
      <div className="w-full">
        <Carousel
          items={frameList}
          renderItem={(frame, index) => <FrameItem frame={frame} index={index} />}
          infinite={false}

        />
      </div>
      <NeumorphicButton onClick={handleConfirm}>Create Your Print!</NeumorphicButton>
    </>
  );
}

'use client';

import { FRAMES } from '@/constants/booth';
import { useFrameSelection } from '@/hooks/useFrameSelection';
import Carousel from '@/components/common/Carousel';
import NeumorphicButton from '@/components/common/NeumorphicButton';
import FrameItem from './FrameItem';

export default function FrameSelector() {
  const frameList = Object.values(FRAMES);
  const { setFocusedIndex, handleConfirm } = useFrameSelection();

  return (
    <>
      <div className="w-full">
        <Carousel
          items={frameList}
          renderItem={(frame) => <FrameItem frame={frame} />}
          infinite={false}
          onIndexChange={setFocusedIndex}
        />
      </div>
      <NeumorphicButton onClick={handleConfirm}>Take a photo</NeumorphicButton>
    </>
  );
}

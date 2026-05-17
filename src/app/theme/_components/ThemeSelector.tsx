'use client';

import { FRAME_OPTIONS, BACKGROUND_OPTIONS, FrameType, Background } from '@/constants/booth';
import { useThemeSelection } from '@/hooks/useThemeSelection';
import NeumorphicButton from '@/components/common/NeumorphicButton';
import ThemePreview from './ThemePreview';
import FrameTypeButtons from './FrameTypeButtons';
import BackgroundPicker from './BackgroundPicker';

const FRAME_KEYS = Object.keys(FRAME_OPTIONS) as FrameType[];
const BG_KEYS = Object.keys(BACKGROUND_OPTIONS) as Background[];

interface ThemeSelectorProps {
  children: React.ReactNode;
}

export default function ThemeSelector({ children }: ThemeSelectorProps) {
  const { selectedFrame, selectedBg, setSelectedFrame, setSelectedBg, handleConfirm } =
    useThemeSelection();

  const previewSrc = BACKGROUND_OPTIONS[selectedBg].images[selectedFrame];
  const previewWidth = selectedFrame === 'basic' ? 100 : 200;
  const previewHeight = 300;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      {children}
      <ThemePreview
        src={previewSrc}
        width={previewWidth}
        height={previewHeight}
        selectedFrame={selectedFrame}
      />
      <FrameTypeButtons
        frameKeys={FRAME_KEYS}
        selected={selectedFrame}
        onSelect={setSelectedFrame}
      />
      <BackgroundPicker bgKeys={BG_KEYS} selected={selectedBg} onSelect={setSelectedBg} />
      <NeumorphicButton onClick={handleConfirm}>Create a Photo</NeumorphicButton>
    </div>
  );
}

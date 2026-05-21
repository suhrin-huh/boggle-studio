'use client';

import { FRAME_OPTIONS, BACKGROUND_OPTIONS, FrameType, Background } from '@/constants/booth';
import { useThemeSelection } from '@/hooks/useThemeSelection';
import NeumorphicButton from '@/components/common/NeumorphicButton';
import ThemePreview from './ThemePreview';
import FrameTypePicker from './FrameTypePicker';
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
    <div className="gap-lg flex flex-1 flex-col items-center">
      {children}
      <ThemePreview
        src={previewSrc}
        width={previewWidth}
        height={previewHeight}
        selectedFrame={selectedFrame}
      />
      {/* 프레임 타입 선택 */}
      <FrameTypePicker
        frameKeys={FRAME_KEYS}
        selected={selectedFrame}
        onSelect={setSelectedFrame}
      />
      {/* 배경 선택 */}
      <BackgroundPicker bgKeys={BG_KEYS} selected={selectedBg} onSelect={setSelectedBg} />
      {/*  */}
      <NeumorphicButton onClick={handleConfirm}>Create a Photo</NeumorphicButton>
    </div>
  );
}

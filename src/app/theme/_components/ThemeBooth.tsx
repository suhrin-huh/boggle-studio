'use client';

import { useThemeSelection } from '@/hooks/useThemeSelection';

import NeumorphicButton from '@/components/common/NeumorphicButton';
import ThemePreview from './ThemePreview';
import FrameTypePicker from './FrameTypePicker';
import BackgroundPicker from './BackgroundPicker';

import {
  FRAME_OPTIONS,
  BACKGROUND_OPTIONS,
  PREVIEW_SCALE,
  FrameType,
  Background,
} from '@/constants';

interface ThemeBoothProps {
  children: React.ReactNode;
}

/**
 * 테마 선택 UI 컨테이너 컴포넌트
 */
export default function ThemeBooth({ children }: ThemeBoothProps) {
  const FRAME_KEYS = Object.keys(FRAME_OPTIONS) as FrameType[];
  const BG_KEYS = Object.keys(BACKGROUND_OPTIONS) as Background[];
  const { selectedFrame, selectedBg, setSelectedFrame, setSelectedBg, handleConfirm } =
    useThemeSelection();

  const { width, height } = FRAME_OPTIONS[selectedFrame];
  const previewWidth = Math.round(width * PREVIEW_SCALE);
  const previewHeight = Math.round(height * PREVIEW_SCALE);
  const backgroundUrl = `/images/previews/backgrounds/${selectedFrame}-${selectedBg}.png`;
  const overlayUrl = BACKGROUND_OPTIONS[selectedBg].overlays[selectedFrame]
    ? `/images/previews/overlays/${selectedFrame}-${selectedBg}.png`
    : null;

  return (
    <div className="gap-lg flex flex-col items-center sm:scale-120">
      {children}
      <ThemePreview
        width={previewWidth}
        height={previewHeight}
        selectedFrame={selectedFrame}
        backgroundUrl={backgroundUrl}
        overlayUrl={overlayUrl}
      />
      <FrameTypePicker
        frameKeys={FRAME_KEYS}
        selected={selectedFrame}
        onSelect={setSelectedFrame}
      />
      <BackgroundPicker bgKeys={BG_KEYS} selected={selectedBg} onSelect={setSelectedBg} />
      <NeumorphicButton onClick={handleConfirm}>Create a Photo</NeumorphicButton>
    </div>
  );
}

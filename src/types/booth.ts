export interface ThemeOption {
  id: string;
  label: string;
  value: string;
}

export type CaptureMode = 'camera' | 'upload';

export interface FrameConfig {
  id: string;
  label: string;
  width: number;
  height: number;
  requiredPhotoCount: number;
  backgroundColor: string | null;
  frameImageUrl: string | null;
  sampleImageUrl: string;
}

export interface ThemeOption {
  id: string;
  label: string;
  value: string;
}

export interface BoothState {
  selectedTheme: ThemeOption | null;
  capturedCuts: string[];
  finalImageName: string;
}

export interface BoothActions {
  setTheme: (theme: ThemeOption) => void;
  addCapture: (imageData: string) => void;
  resetBooth: () => void;
}

export type BoothStore = BoothState & BoothActions;

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

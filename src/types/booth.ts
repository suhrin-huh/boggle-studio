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

export type ThemeColorConfig = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
};

export type ThemeConfig = {
  id: string;
  name: string;
  fontFamily: string;
  fontUrl: string;
  colors: ThemeColorConfig;
  tagline: string;
  desc: string;
  // When true the preview is rendered with a flat, gradientless, brutalist
  // surface. Kept for backwards compatibility — equivalent to variant 'flat'.
  flat?: boolean;
  // The visual style of the preview surface. Defaults to 'gradient'.
  variant?: ThemeVariant;
};

// The ten preview surface styles a theme can use.
export type ThemeVariant =
  | 'gradient'
  | 'flat'
  | 'glass'
  | 'neu'
  | 'outline'
  | 'mesh'
  | 'grid'
  | 'duotone'
  | 'scanline'
  | 'spotlight';

export type ViewMode = 'jukebox' | 'grid';

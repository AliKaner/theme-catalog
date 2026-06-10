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
  // surface instead of the default soft theme-colored gradient.
  flat?: boolean;
};

export type ViewMode = 'jukebox' | 'grid';

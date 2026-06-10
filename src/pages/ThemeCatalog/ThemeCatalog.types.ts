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
};

export type ViewMode = 'jukebox' | 'grid';

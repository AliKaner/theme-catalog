// Canonical theme types — the single source of truth for both the showcase app
// and the publishable library. App code re-exports these from
// pages/ThemeCatalog/ThemeCatalog.types.ts for backwards compatibility.

export type ThemeColorConfig = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
};

// The ten preview/surface styles a theme can use.
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

export type ThemeConfig = {
  id: string;
  name: string;
  fontFamily: string;
  fontUrl: string;
  colors: ThemeColorConfig;
  tagline: string;
  desc: string;
  // Backwards-compatible flag, equivalent to variant: 'flat'.
  flat?: boolean;
  // The visual style of the preview surface. Defaults to 'gradient'.
  variant?: ThemeVariant;
};

// Frameworks the code generator can target.
export type Framework = 'css' | 'scss' | 'tailwind' | 'nextjs' | 'nuxtjs' | 'json';

// A single generated file ready to be written into a user's project.
export type GeneratedFile = {
  filename: string;
  path: string;
  language: string;
  content: string;
};

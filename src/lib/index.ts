// theme-catalog-kit — pick a preset palette or craft a custom one, then
// generate ready-to-paste theme code for your framework of choice.
//
// This module is framework-agnostic (no React) so it can be consumed from any
// JS/TS project or a CLI.

import rawThemes from '../constants/themes.json';
import { darken, lighten } from './colors.js';
import { generateThemeCode } from './generate.js';
import type {
  Framework,
  GeneratedFile,
  ThemeColorConfig,
  ThemeConfig,
  ThemeVariant,
} from './types.js';

export type {
  Framework,
  GeneratedFile,
  ThemeColorConfig,
  ThemeConfig,
  ThemeVariant,
} from './types.js';
export { generateThemeCode, resolveVariant } from './generate.js';
export { lighten, darken } from './colors.js';

/** All built-in preset themes. */
export const themes: ThemeConfig[] = rawThemes as ThemeConfig[];

/** Every surface variant a theme can use. */
export const variants: ThemeVariant[] = [
  'gradient',
  'flat',
  'glass',
  'neu',
  'outline',
  'mesh',
  'grid',
  'duotone',
  'scanline',
  'spotlight',
];

/** Every framework the generator can target. */
export const frameworks: Framework[] = ['css', 'scss', 'tailwind', 'nextjs', 'nuxtjs', 'json'];

/** Look up a preset theme by its id. */
export const getTheme = (id: string): ThemeConfig | undefined =>
  themes.find((theme) => theme.id === id);

/** Filter preset themes by surface variant. */
export const getThemesByVariant = (variant: ThemeVariant): ThemeConfig[] =>
  themes.filter((theme) => (theme.variant ?? (theme.flat ? 'flat' : 'gradient')) === variant);

const slug = (s: string): string =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export type CreateThemeInput = {
  name: string;
  // Base colors. Light/dark shades are auto-derived when omitted.
  primary: string;
  secondary: string;
  colors?: Partial<ThemeColorConfig>;
  id?: string;
  fontFamily?: string;
  fontUrl?: string;
  variant?: ThemeVariant;
  tagline?: string;
  desc?: string;
};

/**
 * Build a full theme from a minimal custom config. Any light/dark shades not
 * provided are derived from the base primary/secondary colors, so the smallest
 * valid input is just `{ name, primary, secondary }`.
 */
export const createTheme = (input: CreateThemeInput): ThemeConfig => {
  const c = input.colors ?? {};
  const colors: ThemeColorConfig = {
    primary: c.primary ?? input.primary,
    primaryLight: c.primaryLight ?? lighten(input.primary),
    primaryDark: c.primaryDark ?? darken(input.primary),
    secondary: c.secondary ?? input.secondary,
    secondaryLight: c.secondaryLight ?? lighten(input.secondary),
    secondaryDark: c.secondaryDark ?? darken(input.secondary),
  };

  return {
    id: input.id ?? slug(input.name),
    name: input.name,
    fontFamily: input.fontFamily ?? "'Inter', sans-serif",
    fontUrl:
      input.fontUrl ??
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap',
    colors,
    tagline: input.tagline ?? '',
    desc: input.desc ?? '',
    variant: input.variant ?? 'gradient',
  };
};

/**
 * Convenience: generate code straight from a custom config without first
 * building the theme object yourself.
 */
export const generateCustomThemeCode = (
  input: CreateThemeInput,
  framework: Framework = 'css',
): GeneratedFile[] => generateThemeCode(createTheme(input), framework);

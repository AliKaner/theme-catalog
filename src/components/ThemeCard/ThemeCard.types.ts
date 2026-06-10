import type { ThemeConfig } from '../../pages/ThemeCatalog/ThemeCatalog.types';

export type ThemeCardProps = {
  theme: ThemeConfig;
  isActive?: boolean;
  onClick?: () => void;
  isApplied?: boolean;
  onApply?: (themeId: string) => void;
  locale?: 'en' | 'tr';
};

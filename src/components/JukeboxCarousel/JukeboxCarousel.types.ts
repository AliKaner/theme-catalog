import type { ThemeConfig } from '../../pages/ThemeCatalog/ThemeCatalog.types';

export type JukeboxCarouselProps = {
  themes: ThemeConfig[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  appliedThemeId: string;
  onApplyTheme: (themeId: string) => void;
};

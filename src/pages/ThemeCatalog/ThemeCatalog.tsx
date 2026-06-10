import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, Disc, BookOpen } from 'lucide-react';
import classNames from 'classnames';
import JukeboxCarousel from '../../components/JukeboxCarousel';
import ThemeCard from '../../components/ThemeCard';
import CodeExportPanel from '../../components/CodeExportPanel';
import themesData from '../../constants/themes.json';
import type { ThemeConfig, ViewMode } from './ThemeCatalog.types';
import styles from './ThemeCatalog.module.scss';

type ThemeCatalogProps = {
  // Opens the documentation page from the navbar.
  onOpenDocs?: () => void;
};

const ThemeCatalog = (props: ThemeCatalogProps) => {
  const { onOpenDocs } = props;
  // Explicitly type the loaded theme array
  const themes: ThemeConfig[] = themesData as ThemeConfig[];

  // Type inferred from useTranslation hook as per standard library return values.
  const { t } = useTranslation();

  // State definitions with explicit type signatures
  const [viewMode, setViewMode] = useState<ViewMode>('jukebox');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [appliedThemeId, setAppliedThemeId] = useState<string>('ocean-breeze');

  // Explicit typing for computed active theme objects
  const activeTheme: ThemeConfig = themes[activeIndex];
  const appliedTheme: ThemeConfig = themes.find((t: ThemeConfig) => t.id === appliedThemeId) || themes[0];
  // Toggle View Handler
  const handleViewChange = (mode: ViewMode): void => {
    setViewMode(mode);
  };

  // Theme application callback
  const handleApplyTheme = (themeId: string): void => {
    setAppliedThemeId(themeId);
  };

  // Explicit typing for page styling variables mapped to CSS properties
  const pageStyle: React.CSSProperties = {
    '--app-primary': appliedTheme.colors.primary,
    '--app-primary-light': appliedTheme.colors.primaryLight,
    '--app-primary-dark': appliedTheme.colors.primaryDark,
    '--app-secondary': appliedTheme.colors.secondary,
    '--app-secondary-light': appliedTheme.colors.secondaryLight,
    '--app-secondary-dark': appliedTheme.colors.secondaryDark,
    '--app-font-family': appliedTheme.fontFamily,
  } as React.CSSProperties;

  return (
    <div className={styles.pageContainer} style={pageStyle}>
      {/* Load selected app font dynamically */}
      <link rel="stylesheet" href={appliedTheme.fontUrl} />

      {/* Header bar */}
      <header className={styles.navbar}>
        <div className={styles.logoGroup}>
          <div className={styles.brandLogo} style={{ fontFamily: appliedTheme.fontFamily }}>
            {appliedTheme.name.split(' ')[0]}
          </div>
          <span className={styles.logoLabel}>{t('catalog.activeTheme')}: {appliedTheme.name}</span>
        </div>

        <div className={styles.controlsGroup}>
          {/* Layout switcher */}
          <div className={styles.segmentControl}>
            <button
              type="button"
              className={classNames(styles.segmentBtn, { [styles.activeSegment]: viewMode === 'jukebox' })}
              onClick={(): void => handleViewChange('jukebox')}
            >
              <Disc size={16} />
              <span>{t('catalog.jukebox')}</span>
            </button>
            <button
              type="button"
              className={classNames(styles.segmentBtn, { [styles.activeSegment]: viewMode === 'grid' })}
              onClick={(): void => handleViewChange('grid')}
            >
              <LayoutGrid size={16} />
              <span>{t('catalog.grid')}</span>
            </button>
          </div>

          {/* Documentation link */}
          <button type="button" className={styles.docsBtn} onClick={onOpenDocs}>
            <BookOpen size={16} />
            <span>{t('catalog.docs')}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.heroHeader}>
          <h1 className={styles.pageTitle} style={{ fontFamily: appliedTheme.fontFamily }}>
            {t('catalog.title')}
          </h1>
          <p className={styles.pageSubtitle}>{t('catalog.subtitle')}</p>
        </div>

        {/* View Switcher rendering logic */}
        {viewMode === 'jukebox' ? (
          <div className={styles.jukeboxWrapper}>
            <JukeboxCarousel
              themes={themes}
              activeIndex={activeIndex}
              onChangeIndex={(index: number): void => setActiveIndex(index)}
              appliedThemeId={appliedThemeId}
              onApplyTheme={handleApplyTheme}
            />

            {/* Showcase details of current highlighted theme in Jukebox */}
            <div className={styles.themeDetailsShowcase}>
              <div className={styles.detailsHeader}>
                <h2 style={{ fontFamily: activeTheme.fontFamily }}>
                  {activeTheme.name}
                </h2>
                <span className={styles.fontFamilyValue}>{activeTheme.fontFamily}</span>
              </div>

              <div className={styles.colorPaletteGrid}>
                <div className={styles.colorGroup}>
                  <span className={styles.colorGroupLabel}>{t('catalog.primary')}</span>
                  <div className={styles.colorList}>
                    <div className={styles.colorItem}>
                      <span className={styles.swatch} style={{ backgroundColor: activeTheme.colors.primaryDark }} />
                      <span className={styles.colorCodeLabel}>{activeTheme.colors.primaryDark} ({t('catalog.dark')})</span>
                    </div>
                    <div className={styles.colorItem}>
                      <span className={styles.swatch} style={{ backgroundColor: activeTheme.colors.primary }} />
                      <span className={styles.colorCodeLabel}>{activeTheme.colors.primary}</span>
                    </div>
                    <div className={styles.colorItem}>
                      <span className={styles.swatch} style={{ backgroundColor: activeTheme.colors.primaryLight }} />
                      <span className={styles.colorCodeLabel}>{activeTheme.colors.primaryLight} ({t('catalog.light')})</span>
                    </div>
                  </div>
                </div>

                <div className={styles.colorGroup}>
                  <span className={styles.colorGroupLabel}>{t('catalog.secondary')}</span>
                  <div className={styles.colorList}>
                    <div className={styles.colorItem}>
                      <span className={styles.swatch} style={{ backgroundColor: activeTheme.colors.secondaryDark }} />
                      <span className={styles.colorCodeLabel}>{activeTheme.colors.secondaryDark} ({t('catalog.dark')})</span>
                    </div>
                    <div className={styles.colorItem}>
                      <span className={styles.swatch} style={{ backgroundColor: activeTheme.colors.secondary }} />
                      <span className={styles.colorCodeLabel}>{activeTheme.colors.secondary}</span>
                    </div>
                    <div className={styles.colorItem}>
                      <span className={styles.swatch} style={{ backgroundColor: activeTheme.colors.secondaryLight }} />
                      <span className={styles.colorCodeLabel}>{activeTheme.colors.secondaryLight} ({t('catalog.light')})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.gridWrapper}>
            <div className={styles.themeGrid}>
              {themes.map((theme, index: number) => (
                <div key={theme.id} className={styles.gridItem}>
                  <ThemeCard
                    theme={theme}
                    isActive={theme.id === appliedThemeId}
                    isApplied={theme.id === appliedThemeId}
                    onClick={(): void => setActiveIndex(index)}
                    onApply={handleApplyTheme}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Copy-to-your-project code export panel (VSCode-like tabbed view) */}
        <div id="theme-export">
          <CodeExportPanel theme={appliedTheme} />
        </div>
      </main>

      {/* Mini App Preview Banner at Bottom showing dynamic styling */}
      <footer className={styles.appBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerText}>
            <h3 style={{ fontFamily: appliedTheme.fontFamily }}>
              {t('catalog.activeTheme')}: {appliedTheme.name}
            </h3>
            <p>{appliedTheme.desc}</p>
          </div>
          <button
            type="button"
            className={styles.bannerActionButton}
            onClick={(): void => {
              document.getElementById('theme-export')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          >
            {t('catalog.getCode')}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ThemeCatalog;

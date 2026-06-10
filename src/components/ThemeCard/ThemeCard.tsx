import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import type { ThemeCardProps } from './ThemeCard.types';
import styles from './ThemeCard.module.scss';

const ThemeCard = (props: ThemeCardProps) => {
  // Props destructuring
  const { theme, isActive = false, onClick, isApplied = false, onApply } = props;

  // Type inferred from useTranslation hook as per standard library return values.
  const { t } = useTranslation();

  // Explicit typing for all theme fields
  const name: string = theme.name;
  const tagline: string = theme.tagline;
  const desc: string = theme.desc;

  // Inline styling object to map color variables to this specific card's context
  // Type explicitly cast to React.CSSProperties
  const cardStyle: React.CSSProperties = {
    '--theme-primary': theme.colors.primary,
    '--theme-primary-light': theme.colors.primaryLight,
    '--theme-primary-dark': theme.colors.primaryDark,
    '--theme-secondary': theme.colors.secondary,
    '--theme-secondary-light': theme.colors.secondaryLight,
    '--theme-secondary-dark': theme.colors.secondaryDark,
    '--theme-font-family': theme.fontFamily,
  } as React.CSSProperties;

  // Click handler wrapper
  const handleCardClick = (): void => {
    if (onClick) {
      onClick();
    }
  };

  // Apply button handler
  const handleApplyClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (onApply) {
      onApply(theme.id);
    }
  };

  return (
    <div
      className={classNames(styles.cardWrapper, { [styles.active]: isActive })}
      style={cardStyle}
      onClick={handleCardClick}
    >
      {/* Load theme font dynamically */}
      <link rel="stylesheet" href={theme.fontUrl} />

      {/* Browser Mock Window Bar */}
      <div className={styles.browserHeader}>
        <div className={styles.windowControls}>
          <span className={classNames(styles.dot, styles.red)} />
          <span className={classNames(styles.dot, styles.yellow)} />
          <span className={classNames(styles.dot, styles.green)} />
        </div>
        <div className={styles.browserUrl}>{name.toLowerCase().replace(/\s+/g, '-')}.com</div>
      </div>

      {/* Mock Website Preview Area */}
      <div className={classNames(styles.previewContainer, { [styles.flat]: theme.flat })}>
        {/* Mock Navigation Bar */}
        <header className={styles.mockHeader}>
          <div className={styles.mockLogo} style={{ fontFamily: theme.fontFamily }}>
            {name.split(' ')[0]}
          </div>
          <nav className={styles.mockNav}>
            <span className={styles.mockNavLink} />
            <span className={styles.mockNavLink} />
          </nav>
        </header>

        {/* Mock Hero Section */}
        <main className={styles.mockHero}>
          <h1 className={styles.mockTitle} style={{ fontFamily: theme.fontFamily }}>
            {tagline}
          </h1>
          <p className={styles.mockDesc}>{desc}</p>

          <div className={styles.mockButtons}>
            <button
              type="button"
              className={styles.gradientButton}
              onClick={handleApplyClick}
            >
              {isApplied ? t('catalog.selected') : t('catalog.selectTheme')}
            </button>
            <button type="button" className={styles.outlineButton}>
              {t('catalog.previewButton')}
            </button>
          </div>
        </main>
      </div>

      {/* Theme Info & Palette Footer */}
      <footer className={styles.cardFooter}>
        <div className={styles.themeNameSection}>
          <span className={styles.themeNameLabel}>{name}</span>
          <span className={styles.fontFamilyName}>{theme.fontFamily.split(',')[0].replace(/'/g, '')}</span>
        </div>
        
        {/* 6 Theme Color Dots */}
        <div className={styles.colorPalette}>
          <span className={styles.colorDot} style={{ backgroundColor: theme.colors.primaryDark }} title={`${t('catalog.primary')} ${t('catalog.dark')}`} />
          <span className={styles.colorDot} style={{ backgroundColor: theme.colors.primary }} title={t('catalog.primary')} />
          <span className={styles.colorDot} style={{ backgroundColor: theme.colors.primaryLight }} title={`${t('catalog.primary')} ${t('catalog.light')}`} />
          <span className={styles.colorDot} style={{ backgroundColor: theme.colors.secondaryDark }} title={`${t('catalog.secondary')} ${t('catalog.dark')}`} />
          <span className={styles.colorDot} style={{ backgroundColor: theme.colors.secondary }} title={t('catalog.secondary')} />
          <span className={styles.colorDot} style={{ backgroundColor: theme.colors.secondaryLight }} title={`${t('catalog.secondary')} ${t('catalog.light')}`} />
        </div>
      </footer>
    </div>
  );
};

export default ThemeCard;

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import classNames from 'classnames';
import ThemeCard from '../ThemeCard';
import type { JukeboxCarouselProps } from './JukeboxCarousel.types';
import styles from './JukeboxCarousel.module.scss';

// Indicator window geometry. The viewport is sized to show a bounded set of
// dots; the track slides by INDICATOR_STEP px per item to keep the active dot
// centered. Keep these in sync with the SCSS dot size + gap.
const INDICATOR_DOT: number = 8; // dot diameter (px)
const INDICATOR_GAP: number = 8; // gap between dots (px)
const INDICATOR_STEP: number = INDICATOR_DOT + INDICATOR_GAP; // 16px per dot
const INDICATOR_WINDOW: number = 4; // dots shown on each side of the active dot
// Viewport shows (2*window + 1) dots; keep in sync with SCSS .indicatorViewport.
const INDICATOR_VIEWPORT: number = (2 * INDICATOR_WINDOW + 1) * INDICATOR_STEP; // 144px
// Half the viewport minus half a dot, so the active dot lands dead center.
const INDICATOR_CENTER: number = INDICATOR_VIEWPORT / 2 - INDICATOR_DOT / 2; // 68px

const JukeboxCarousel = (props: JukeboxCarouselProps) => {
  const { themes, activeIndex, onChangeIndex, appliedThemeId, onApplyTheme } = props;
  const { t } = useTranslation();

  // Total count of themes
  const n: number = themes.length;

  // Navigate to previous slide
  const handlePrev = (): void => {
    const prevIndex: number = (activeIndex - 1 + n) % n;
    onChangeIndex(prevIndex);
  };

  // Navigate to next slide
  const handleNext = (): void => {
    const nextIndex: number = (activeIndex + 1) % n;
    onChangeIndex(nextIndex);
  };

  // Setup keyboard controls for left/right arrows
  useEffect((): (() => void) => {
    // Explicit function type for event listener
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, n]);

  return (
    <div className={styles.carouselContainer}>
      {/* 3D Scene Wrapper */}
      <div className={styles.scene}>
        <div className={styles.carouselTrack}>
          {themes.map((theme, index: number) => {
            // Calculate relative distance on a circle
            let diff: number = index - activeIndex;
            if (diff < -n / 2) {
              diff += n;
            } else if (diff > n / 2) {
              diff -= n;
            }

            const isCardActive: boolean = diff === 0;
            const diffAbs: number = Math.abs(diff);

            // Dynamically set CSS variables for transitions and spacing
            const inlineStyles: React.CSSProperties = {
              '--diff': diff,
              '--diff-abs': diffAbs,
              zIndex: 10 - diffAbs,
              opacity: diffAbs > 2 ? 0 : 1 - diffAbs * 0.35,
              pointerEvents: diffAbs > 2 ? 'none' : 'auto',
            } as React.CSSProperties;

            return (
              <div
                key={theme.id}
                className={classNames(styles.carouselItem, {
                  [styles.activeItem]: isCardActive,
                })}
                style={inlineStyles}
              >
                <ThemeCard
                  theme={theme}
                  isActive={isCardActive}
                  isApplied={appliedThemeId === theme.id}
                  onClick={(): void => {
                    if (!isCardActive) {
                      onChangeIndex(index);
                    }
                  }}
                  onApply={onApplyTheme}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <button
        type="button"
        className={classNames(styles.navButton, styles.prev)}
        onClick={handlePrev}
        aria-label={t('a11y.prevTheme')}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        className={classNames(styles.navButton, styles.next)}
        onClick={handleNext}
        aria-label={t('a11y.nextTheme')}
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators Dots — a fixed-size sliding window so the dot count stays
          bounded no matter how many themes there are. The track slides to keep
          the active dot centered, and dots shrink toward the edges. */}
      <div className={styles.indicatorViewport}>
        <div
          className={styles.indicatorTrack}
          style={{ transform: `translateX(${INDICATOR_CENTER - activeIndex * INDICATOR_STEP}px)` }}
        >
          {themes.map((theme, index: number) => {
            const distance: number = Math.abs(index - activeIndex);
            // Scale dots down the further they are from the active one; dots
            // beyond the window collapse to zero so only a handful are visible.
            let scale: number = 1;
            if (distance > INDICATOR_WINDOW) {
              scale = 0;
            } else if (distance === INDICATOR_WINDOW) {
              scale = 0.35;
            } else if (distance === INDICATOR_WINDOW - 1) {
              scale = 0.6;
            }

            const dotStyle: React.CSSProperties = {
              '--dot-scale': scale,
            } as React.CSSProperties;

            return (
              <button
                key={theme.id}
                type="button"
                style={dotStyle}
                className={classNames(styles.indicatorDot, {
                  [styles.activeDot]: index === activeIndex,
                })}
                onClick={(): void => onChangeIndex(index)}
                aria-label={t('a11y.goToSlide', { n: index + 1 })}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JukeboxCarousel;

import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import classNames from 'classnames';
import ThemeCard from '../ThemeCard';
import type { JukeboxCarouselProps } from './JukeboxCarousel.types';
import styles from './JukeboxCarousel.module.scss';

const JukeboxCarousel = (props: JukeboxCarouselProps) => {
  const { themes, activeIndex, onChangeIndex, appliedThemeId, onApplyTheme } = props;
  
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
        aria-label="Previous Theme"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        className={classNames(styles.navButton, styles.next)}
        onClick={handleNext}
        aria-label="Next Theme"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators Dots */}
      <div className={styles.indicators}>
        {themes.map((theme, index: number) => (
          <button
            key={theme.id}
            type="button"
            className={classNames(styles.indicatorDot, {
              [styles.activeDot]: index === activeIndex,
            })}
            onClick={(): void => onChangeIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default JukeboxCarousel;

import { useMemo } from 'react';
import type { PreloaderTheme, SystemThemeConfig } from '@aazucena/types';
import { mergeTheme, getThemeConfig } from '@aazucena/design-system';

export interface UseThemeOptions {
  theme?: PreloaderTheme;
  customTheme?: Partial<SystemThemeConfig>;
  mode?: 'light' | 'dark';
}

export interface ThemeStyles {
  config: SystemThemeConfig;

  // Pre-computed style objects for convenience
  backgroundStyle: React.CSSProperties;
  overlayStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  titleStyle: React.CSSProperties;
  subtitleStyle: React.CSSProperties;

  // Utility functions
  getProgressStyle: (progress?: number) => React.CSSProperties;
  getButtonStyle: (variant?: 'primary' | 'secondary') => React.CSSProperties;
  getBadgeStyle: () => React.CSSProperties;
  getSpinnerStyle: (isComplete?: boolean) => React.CSSProperties;
  getIconStyle: (type: 'success' | 'error' | 'info') => React.CSSProperties;

  // CSS classes
  overlayClasses: string;
  cardClasses: string;
}

export function usePreloaderTheme({
  theme = 'default',
  customTheme,
  mode = 'dark',
}: UseThemeOptions = {}): ThemeStyles {
  const config = useMemo(
    () => mergeTheme(getThemeConfig(theme, mode), customTheme),
    [theme, customTheme, mode],
  );

  const styles = useMemo(() => {
    const { colors, effects, typography } = config;

    return {
      config,

      // Overlay styles
      overlayStyle: {
        background: colors.overlayBackground,
        backdropFilter: effects.backdropBlur,
      } as React.CSSProperties,

      // Bacground styles
      backgroundStyle: {
        background: colors.background,
      } as React.CSSProperties,

      // Card styles
      cardStyle: {
        background: colors.cardBackground,
        borderColor: colors.border,
        borderRadius: effects.borderRadius.card,
        boxShadow: effects.shadow,
        backdropFilter: effects.cardBlur || effects.backdropBlur,
      } as React.CSSProperties,

      // Title styles
      titleStyle: {
        fontSize: typography.titleSize,
        fontWeight: typography.titleWeight,
        color: colors.foreground,
        fontFamily: typography.fontFamily,
      } as React.CSSProperties,

      // Subtitle styles
      subtitleStyle: {
        fontSize: typography.subtitleSize,
        color: colors.mutedForeground,
        fontFamily: typography.fontFamily,
      } as React.CSSProperties,

      // Progress bar styles
      getProgressStyle: (progress = 0) => {
        return {
          backgroundColor: progress >= 100 ? colors.success : colors.primary,
          borderRadius: effects.borderRadius.progress,
          transition: `all ${300 * effects.animationSpeed}ms ${effects.animationEasing}`,
        } as React.CSSProperties;
      },

      // Button styles
      getButtonStyle: (variant: 'primary' | 'secondary' = 'primary') => {
        // Use brighter, more contrasting colors for buttons to prevent blending
        const primaryBg = colors.accent || colors.success || colors.primary;
        const primaryBorder = colors.accent || colors.success || colors.primary;

        return {
          background: variant === 'primary' ? primaryBg : 'transparent',
          color:
            variant === 'primary'
              ? colors.accentForeground || colors.successForeground || colors.primaryForeground
              : colors.foreground,
          borderRadius: effects.borderRadius.button,
          border:
            variant === 'primary' ? `2px solid ${primaryBorder}` : `2px solid ${colors.border}`,
          transition: `all ${300 * effects.animationSpeed}ms ${effects.animationEasing}`,
          fontWeight: '600',
          padding: '0.75rem 1.5rem',
        } as React.CSSProperties;
      },

      // Badge styles
      getBadgeStyle: () =>
        ({
          borderRadius: effects.borderRadius.badge,
          borderColor: colors.border,
          color: colors.mutedForeground,
        }) as React.CSSProperties,

      // Spinner styles
      getSpinnerStyle: (isComplete = false) =>
        ({
          color: isComplete ? colors.success : colors.primary,
        }) as React.CSSProperties,

      // Icon styles by type
      getIconStyle: (type: 'success' | 'error' | 'info') => {
        const colorMap = {
          success: colors.success,
          error: colors.error,
          info: colors.accent,
        };
        return {
          color: colorMap[type],
        } as React.CSSProperties;
      },

      // CSS classes
      overlayClasses: config.customClass || '',
      cardClasses: config.customClass || '',
    };
  }, [config]);

  return styles;
}

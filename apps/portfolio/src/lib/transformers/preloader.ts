import type { StrapiPreloaderConfigValidated } from '../validators/preloader';
import { transformCtaButton } from './utils';
import type { LoadingStep } from '../validators/components';
import type { PreloaderTheme } from '~/components/preloader';
import type { TransitionType } from '../validators/enums';

export interface PreloaderConfig {
  enabled: boolean;
  variant: 'interactive' | 'simple';
  theme: PreloaderTheme;
  title: string;
  subtitle?: string;
  readyTitle: string;
  readySubtitle: string;
  readyFooterNote?: string;
  continueButton: ReturnType<typeof transformCtaButton>;
  minDisplayTime: number;
  maxDisplayTime: number;
  animationDuration: number;
  autoStart: boolean;
  enableSkip: boolean;
  showOnce: boolean;
  lazyLoad: boolean;
  preloadAssets: boolean;
  enableAnimations: boolean;
  transitionType: TransitionType;
  showCard: boolean;
  loadingSteps: LoadingStep[];
  debug: boolean;
}

export const DEFAULT_PRELOADER: PreloaderConfig = {
  enabled: true,
  variant: 'interactive',
  theme: 'default',
  title: 'Preparing Your Experience',
  readyTitle: 'Ready to Explore!',
  readySubtitle: 'Your experience is fully optimized and ready',
  continueButton: {
    label: 'Enter Website',
    url: '#main-content',
    variant: 'primary',
    size: 'md',
    openInNewTab: false,
    icon: undefined
  },
  minDisplayTime: 1500,
  maxDisplayTime: 10000,
  animationDuration: 600,
  autoStart: true,
  enableSkip: false,
  showOnce: false,
  lazyLoad: false,
  preloadAssets: false,
  enableAnimations: true,
  transitionType: 'fade',
  showCard: false,
  loadingSteps: [],
  debug: false,
};

export function transformPreloader(data: StrapiPreloaderConfigValidated): PreloaderConfig {
  if (!data) return DEFAULT_PRELOADER;

  return {
    enabled: !!data.enabled,
    variant: data.variant,
    theme: data.theme,
    title: data.title,
    subtitle: data.subtitle || undefined,
    readyTitle: data.readyTitle,
    readySubtitle: data.readySubtitle,
    readyFooterNote: data.readyFooterNote || undefined,
    continueButton: transformCtaButton(data.continueButton),
    minDisplayTime: data.minDisplayTime,
    maxDisplayTime: data.maxDisplayTime,
    animationDuration: data.animationDuration,
    autoStart: !!data.autoStart,
    enableSkip: !!data.enableSkip,
    showOnce: !!data.showOnce,
    lazyLoad: !!data.lazyLoad,
    preloadAssets: !!data.preloadAssets,
    enableAnimations: !!data.enableAnimations,
    transitionType: data.transitionType,
    showCard: !!data.showCard,
    loadingSteps: (data.loadingSteps || []) as LoadingStep[],
    debug: !!data.debug,
  };
}

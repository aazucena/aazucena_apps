import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Avra theme names (the `@theme inline` block in packages/ui/src/styles/globals.css, prefix
 * stripped). tailwind-merge can't see them, so without these `p-panel` and `p-0` both survive.
 * A test keeps the colour list equal to the theme.
 */
export const AVRA_TOKENS = {
  spacing: ['panel', 'panel-header', 'gutter', 'row', 'control', 'control-sm', 'control-lg'],
  radius: ['card', 'control', 'badge'],
  color: [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'success',
    'success-foreground',
    'border',
    'input',
    'ring',
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
    'sidebar',
    'sidebar-foreground',
    'sidebar-primary',
    'sidebar-primary-foreground',
    'sidebar-accent',
    'sidebar-accent-foreground',
    'sidebar-border',
    'sidebar-ring',
    'panel',
    'panel-raised',
    'state',
    'rule',
    'rule-strong',
    'signal',
    'signal-foreground',
    'signal-faint',
    'signal-subtle',
    'signal-line',
    'alert',
    'alert-foreground',
    'warning',
    'warning-foreground',
    'warning-subtle',
    'success-subtle',
    'scrim',
    'panel-glass',
    'series-1',
    'series-2',
    'series-3',
    'series-4',
    'chart-grid',
    'chart-axis',
  ],
} as const;

const twMergeAvra = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [...AVRA_TOKENS.spacing],
      radius: [...AVRA_TOKENS.radius],
      color: [...AVRA_TOKENS.color],
    },
  },
});

/**
 * High-performance Tailwind class merger that knows Avra's token classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMergeAvra(clsx(inputs));
}

/**
 * Safe Window/Document check for SSR environments
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Smooth scroll to top helper
 */
export function scrollToTop(smooth = true) {
  if (!isBrowser) return;
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

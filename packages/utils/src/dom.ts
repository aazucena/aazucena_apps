import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * High-performance Tailwind class merger
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

import { useEffect, useState } from 'react';

type PreloaderMode = 'light' | 'dark';

/**
 * Resolves the preloader's light/dark mode on the client. The page's resolved
 * theme (`dark` class on `<html>`) wins; the `mode` prop is the fallback for
 * SSR or pages that don't set the class.
 */
export function useResolvedPreloaderMode(mode: PreloaderMode): PreloaderMode {
  const [resolved] = useState<PreloaderMode>(() => {
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
    return mode;
  });
  return resolved;
}

/**
 * Paints `background` on `<body>` while `active`, then gives back whatever
 * the body had before: when the preloader hides and on unmount.
 */
export function usePreloaderBodyBackground(background: string | undefined, active: boolean): void {
  useEffect(() => {
    const body = document.body;
    if (!body || !background || !active) return;

    const originalBackground = body.style.background;
    body.style.background = background;

    return () => {
      body.style.background = originalBackground;
    };
  }, [background, active]);
}

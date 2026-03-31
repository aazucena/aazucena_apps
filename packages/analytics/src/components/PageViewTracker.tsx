/**
 * PageViewTracker Component
 * Global side-effect component for automated telemetry tracking.
 */

import { useEffect, type JSX } from 'react';
import {
  sendPageViewTelemetry,
  sendClientErrorTelemetry,
  sendInteractionTelemetry,
} from '../services/telemetry';
import { initPerformanceTracking } from '../services/performance';

export function PageViewTracker(): JSX.Element | null {
  useEffect(() => {
    // 1. Send Initial Page View Telemetry
    sendPageViewTelemetry();
    initPerformanceTracking();

    // 2. Handle SPA-like Page Transitions (Astro/Next.js)
    const handlePageLoad = () => {
      sendPageViewTelemetry();
    };

    // Support Astro SPA transitions
    document.addEventListener('astro:page-load', handlePageLoad);
    // Support standard SPA transitions (e.g., Next.js)
    window.addEventListener('popstate', handlePageLoad);

    // 3. Automated Interaction Tracking
    const handleGlobalClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest('[data-track-id]') as HTMLElement;

      if (target) {
        const id = target.getAttribute('data-track-id') || 'unknown';
        const action = target.getAttribute('data-track-action') || 'click';

        const metadata: Record<string, string> = {};
        Array.from(target.attributes).forEach((attr) => {
          if (
            attr.name.startsWith('data-track-') &&
            attr.name !== 'data-track-id' &&
            attr.name !== 'data-track-action'
          ) {
            const key = attr.name.replace('data-track-', '');
            metadata[key] = attr.value;
          }
        });

        sendInteractionTelemetry(id, action, metadata);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    // 4. Global Client-Side Error Tracking
    const handleError = (event: ErrorEvent) => {
      sendClientErrorTelemetry(event.message, event.error?.stack, event.filename);
      return false;
    };
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad);
      window.removeEventListener('popstate', handlePageLoad);
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}

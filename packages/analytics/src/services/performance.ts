/**
 * Performance Tracking Service
 * Wraps web-vitals to report core performance metrics.
 */

import { onLCP, onINP, onCLS, onFCP, onTTFB, type Metric } from 'web-vitals';
import { sendTelemetry } from './telemetry';

function reportWebVitals(metric: Metric) {
  sendTelemetry({
    type: 'telemetry_event',
    event: 'PerformanceMetric',
    data: {
      metric_name: metric.name,
      value: metric.value.toString(),
      metric_id: metric.id,
      rating: metric.rating,
      navigation_type: metric.navigationType,
    },
  });
}

/**
 * Initializes performance tracking listeners.
 */
export function initPerformanceTracking() {
  if (typeof window === 'undefined') return;

  onLCP(reportWebVitals);
  onINP(reportWebVitals);
  onCLS(reportWebVitals);
  onFCP(reportWebVitals);
  onTTFB(reportWebVitals);
}

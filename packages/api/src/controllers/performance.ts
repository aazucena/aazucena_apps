import { onLCP, onINP, onCLS, onFCP, onTTFB, type Metric } from 'web-vitals';
import { sendTelemetry } from './telemetry.js';

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

export function initPerformanceTracking() {
  onLCP(reportWebVitals);
  onINP(reportWebVitals);
  onCLS(reportWebVitals);
  onFCP(reportWebVitals);
  onTTFB(reportWebVitals);
}

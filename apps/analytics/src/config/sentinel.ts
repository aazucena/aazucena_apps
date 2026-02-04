/**
 * 🔒 AZUCENA_LYTICS // Sentinel Threshold Configuration
 * Defines the warning and critical boundaries for system health monitoring.
 */

export const SENTINEL_THRESHOLDS = {
  // AI INFRASTRUCTURE
  AI_COST_DAILY: {
    WARNING: 2.50, // USD
    CRITICAL: 5.00, // USD
    LABEL: 'AI_COST_EXPOSURE',
  },
  AI_LATENCY_AVG: {
    WARNING: 2000, // ms
    CRITICAL: 5000, // ms
    LABEL: 'AI_RESPONSE_LATENCY',
  },

  // PERFORMANCE (Core Web Vitals)
  LCP_P75: {
    WARNING: 1500, // ms
    CRITICAL: 2500, // ms
    LABEL: 'EXPERIENCE_LATENCY_LCP',
  },
  CLS_AVG: {
    WARNING: 0.1,
    CRITICAL: 0.25,
    LABEL: 'VISUAL_STABILITY_CLS',
  },

  // SYSTEM INTEGRITY
  ERROR_RATE_HOURLY: {
    WARNING: 5,
    CRITICAL: 20,
    LABEL: 'EXCEPTION_VELOCITY',
  },
  FATAL_INCIDENTS_24H: {
    WARNING: 1,
    CRITICAL: 3,
    LABEL: 'FATAL_CORE_INTERRUPT',
  }
};

export type SentinelAlertLevel = 'NOMINAL' | 'WARNING' | 'CRITICAL';

export interface SentinelAlert {
  id: string;
  metric: string;
  value: number | string;
  threshold: number;
  level: SentinelAlertLevel;
  timestamp: string;
}

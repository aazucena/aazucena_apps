import React, { createContext, useContext, useMemo } from 'react';
import type { JSX } from 'react';

export interface TelemetryEndpoints {
  summary?: string;
  trends?: string;
  logs?: string;
  performance?: string;
  traffic?: string;
  music?: string;
  sentinel?: string;
  ai?: string;
  finance?: string;
  health?: string;
  ingest?: string;
}

export interface TelemetryConfig {
  /** Base URL for telemetry stats API (e.g., https://analytics.aazucena.com) */
  baseUrl: string;
  /** Optional secret key for protected stats */
  secretKey?: string;
  /**
   * Override individual API endpoint paths.
   * Each defaults to '/api/stats/<name>' when omitted.
   * Pass a stable object (useMemo or module-level constant) to avoid re-renders.
   */
  endpoints?: TelemetryEndpoints;
  /**
   * Default polling interval in milliseconds for live hooks.
   * @default 15000
   */
  defaultPollingInterval?: number;
}

const TelemetryContext = createContext<TelemetryConfig | null>(null);

/**
 * TelemetryProvider - Injects API configuration for monitoring hooks.
 */
export function TelemetryProvider({
  config,
  children,
}: {
  config: TelemetryConfig;
  children: React.ReactNode;
}): JSX.Element {
  const value = useMemo(
    () => config,
    // Consumers should pass a stable config object (useMemo or module-level const).
    [config.baseUrl, config.secretKey, config.defaultPollingInterval],
  );

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
}

/**
 * useTelemetryConfig - Hook to access telemetry configuration.
 * Must be used inside a TelemetryProvider.
 */
export function useTelemetryConfig(): TelemetryConfig {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error(
      'useTelemetryConfig must be used within a TelemetryProvider. ' +
        'Wrap your component tree with <TelemetryProvider config={...}>.',
    );
  }
  return context;
}

import React, { createContext, useContext, useMemo } from 'react';
import type { JSX } from 'react';

export interface TelemetryConfig {
  /** Base URL for telemetry stats API (e.g., https://analytics.aazucena.com) */
  baseUrl: string;
  /** Optional secret key for protected stats */
  secretKey?: string;
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
  const value = useMemo(() => config, [config.baseUrl, config.secretKey]);

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
}

/**
 * useTelemetryConfig - Hook to access telemetry configuration.
 */
export function useTelemetryConfig(): TelemetryConfig {
  const context = useContext(TelemetryContext);
  // Default to same-origin if no provider is present
  return context || { baseUrl: '' };
}

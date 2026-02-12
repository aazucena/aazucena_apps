/**
 * Telemetry Service
 * Core logic for sending structured events to the ingestion API.
 *
 * Meta-Framework Agnostic: Works with Next.js, Astro, Remix, etc.
 * Configuration must be provided via setTelemetryConfig() or per-function call.
 */

import type { IngestionPayload } from '@aazucena/types';

const SESSION_ID_KEY = 'az_analytics_session_id';

/**
 * Telemetry Configuration Interface
 * Must be provided by the consuming application (Next.js, Astro, etc.)
 */
export interface TelemetryConfig {
  /** Analytics API base URL (e.g., https://analytics.aazucena.com) */
  apiUrl: string;
  /** Secret key for ingestion authentication */
  secretKey: string;
}

/**
 * Global telemetry configuration (singleton)
 * Set once at application initialization via setTelemetryConfig()
 */
let globalConfig: TelemetryConfig | null = null;

/**
 * Set global telemetry configuration
 * Call this once at app initialization with environment variables from your framework.
 *
 * @example Next.js
 * ```ts
 * setTelemetryConfig({
 *   apiUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL!,
 *   secretKey: process.env.NEXT_PUBLIC_INGESTION_SECRET_KEY!,
 * });
 * ```
 *
 * @example Astro
 * ```ts
 * setTelemetryConfig({
 *   apiUrl: import.meta.env.PUBLIC_ANALYTICS_API_URL,
 *   secretKey: import.meta.env.PUBLIC_INGESTION_SECRET_KEY,
 * });
 * ```
 */
export function setTelemetryConfig(config: TelemetryConfig): void {
  globalConfig = config;
}

/**
 * Get current telemetry configuration
 * Returns null if not initialized
 */
export function getTelemetryConfig(): TelemetryConfig | null {
  return globalConfig;
}

/**
 * Retrieves or generates a unique session ID for the user.
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-side';

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Validates that necessary configuration is present
 * Checks provided config or falls back to global config
 */
export function validateTelemetry(config?: TelemetryConfig | null): boolean {
  const activeConfig = config || globalConfig;

  if (!activeConfig) {
    console.error('Telemetry config is not set. Call setTelemetryConfig() at app initialization.');
    return false;
  }

  if (!activeConfig.apiUrl) {
    console.error('Telemetry API URL is not defined in config');
    return false;
  }
  if (!activeConfig.secretKey) {
    console.error('Telemetry Secret Key is not defined in config');
    return false;
  }
  return true;
}

/**
 * Sends telemetry data to the ingestion endpoint.
 * Uses global config if no config provided.
 *
 * @param payload - Telemetry data to send
 * @param config - Optional config override (uses global config if not provided)
 */
export async function sendTelemetry(
  payload: IngestionPayload,
  config?: TelemetryConfig,
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  const activeConfig = config || globalConfig;
  if (!validateTelemetry(activeConfig)) {
    return;
  }

  const sessionId = getOrCreateSessionId();
  const currentUrl = window.location.href;

  const fullPayload = {
    ...payload,
    sessionId: (payload as unknown as Record<string, string>).sessionId || sessionId,
    url: payload.url || currentUrl,
  };

  try {
    const response = await fetch(`${activeConfig!.apiUrl}/api/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': activeConfig!.secretKey,
      },
      body: JSON.stringify(fullPayload),
      keepalive: true,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to send telemetry: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }
  } catch (error) {
    console.error('Error sending telemetry:', error);
  }
}

/**
 * Helper to send a page view telemetry event.
 */
export function sendPageViewTelemetry(url?: string): void {
  sendTelemetry({
    type: 'telemetry_event',
    event: 'PageView',
    url: url,
    data: {
      pathname: typeof window !== 'undefined' ? window.location.pathname : '',
      search: typeof window !== 'undefined' ? window.location.search : '',
      hash: typeof window !== 'undefined' ? window.location.hash : '',
    },
  });
}

/**
 * Helper to send an interaction telemetry event.
 */
export function sendInteractionTelemetry(
  elementName: string,
  action: string,
  additionalData?: Record<string, string>,
): void {
  sendTelemetry({
    type: 'telemetry_event',
    event: 'Interaction',
    data: {
      element: elementName,
      action: action,
      ...additionalData,
    },
  });
}

/**
 * Helper to send an AI intelligence event.
 */
export function sendAiTelemetry(params: {
  agentName: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  formType?: string;
  traceId?: string;
}): void {
  sendTelemetry({
    type: 'ai_event',
    trace_id: params.traceId || crypto.randomUUID(),
    agent_name: params.agentName,
    model: params.model,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    latency_ms: params.latencyMs,
    form_type: params.formType,
  });
}

/**
 * Helper to send a client-side error telemetry event.
 */
export function sendClientErrorTelemetry(message: string, stack?: string, url?: string): void {
  sendTelemetry({
    type: 'telemetry_event',
    event: 'ClientError',
    url: url,
    data: {
      message: message,
      stack: stack || 'N/A',
    },
  });
}

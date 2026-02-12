// Define a type for the telemetry event payload, matching the server-side schema
// This should ideally be shared or derived from a shared package for type safety.
// For now, we'll define a basic shape that aligns with `TelemetryEventPayload` in ingest.t
interface TelemetryPayload {
  type: 'telemetry_event' | 'ai_event' | 'music_playback' | 'system_integrity';
  sessionId?: string;
  url?: string;
  event?: string; // For telemetry_event type
  data?: Record<string, string>; // For telemetry_event type
  // ... other fields for ai_event, music_playback, system_integrity types as needed
}

const SESSION_ID_KEY = 'az_analytics_session_id';

const {
  PUBLIC_ANALYTICS_API_URL: ANALYTICS_API_URL,
  PUBLIC_INGESTION_SECRET_KEY: INGESTION_SECRET_KEY,
} = process.env;

/**
 * Retrieves or generates a unique session ID for the user.
 * Persists the session ID in localStorage.
 * @returns {string} The current session ID.
 */
function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    // Generate a simple UUID-like string for demonstration.
    // For production, consider a more robust UUID library.
    sessionId = crypto.randomUUID(); // Modern browsers support crypto.randomUUID()
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

export function validateTelemetry(
  url: string | undefined = ANALYTICS_API_URL,
  secretKey: string | undefined = INGESTION_SECRET_KEY,
): boolean {
  if (!url) {
    console.error('Telementry URL is not defined');
    return false;
  }
  if (!secretKey) {
    console.error('Telementry Ingestion Secret Key is not defined');
    return false;
  }
  return true;
}

/**
 * Sends telemetry data to the /api/ingest endpoint.
 * @param {TelemetryPayload} payload - The telemetry data to send.
 */
export async function sendTelemetry(payload: TelemetryPayload): Promise<void> {
  if (typeof window === 'undefined' || !validateTelemetry()) {
    // Do not send telemetry from server-side rendering
    return;
  }

  const sessionId = getOrCreateSessionId();
  const currentUrl = window.location.href;

  const fullPayload = {
    ...payload,
    sessionId: payload.sessionId || sessionId,
    url: payload.url || currentUrl,
  };

  try {
    const response = await fetch(`${ANALYTICS_API_URL}/api/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': INGESTION_SECRET_KEY || '', // Accessing Astro public env
      },
      body: JSON.stringify(fullPayload),
      keepalive: true, // Crucial for sending data reliably during page navigation
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to send telemetry: ${response.status} ${response.statusText} - ${errorText}`,
      );
    } else {
      // console.log('Telemetry sent successfully:', fullPayload.type);
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
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
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
  } as any);
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

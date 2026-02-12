/**
 * ClickHouse Telemetry Types
 */

export interface TelemetryEvent {
  event_id: string;
  session_id: string;
  event_type: 'page_view' | 'click' | 'ai_inference' | 'error' | 'performance';
  event_name: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface IngestionRequest {
  type: string;
  session_id?: string;
  [key: string]: unknown;
}

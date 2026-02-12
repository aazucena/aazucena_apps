/**
 * Log and Telemetry UI types
 */

export interface LogEntry {
  id: string;
  event: string;
  timestamp: string;
  url: string;
  sessionId: string;
  country?: string;
  data?: Record<string, any>;
}

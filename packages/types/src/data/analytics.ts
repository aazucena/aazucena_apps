/**
 * [Types] : Telemetry_Ingestion_Contracts
 * Aligned with ClickHouse schema and Zod ingestion logic.
 */

export type Telemetry_EventType =
  | 'PageView'
  | 'Interaction'
  | 'ClientError'
  | 'PerformanceMetric'
  | 'Heartbeat'
  | 'CustomEvent';

export interface Telemetry_BasePayload {
  sessionId?: string;
  url?: string;
}

export interface Telemetry_EventPayload extends Telemetry_BasePayload {
  type: 'telemetry_event';
  event: Telemetry_EventType;
  data?: Record<string, string>;
}

export interface AI_EventPayload extends Telemetry_BasePayload {
  type: 'ai_event';
  trace_id?: string;
  agent_name: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd?: number;
  latency_ms: number;
  form_type?: string;
}

export interface Music_PlaybackPayload extends Telemetry_BasePayload {
  type: 'music_playback';
  track_id: string;
  track_title: string;
  artist_name?: string;
  genre?: string;
  completion_pct: number;
  is_download: boolean;
}

export interface System_IntegrityPayload extends Telemetry_BasePayload {
  type: 'system_integrity';
  service: string;
  status: 'UP' | 'DOWN' | 'DEGRADED' | 'RESPONDING';
  latency_ms?: number;
  error_count?: number;
  payload_size?: number;
  message?: string;
}

export interface AI_TrajectoryPayload extends Telemetry_BasePayload {
  type: 'ai_trajectory';
  trajectory_id: string;
  step_index: number;
  state: Record<string, any>;
  observation?: string;
  action: string;
  reward: number;
  metadata?: Record<string, any>;
}

export interface FormSubmission_Payload extends Telemetry_BasePayload {
  type: 'form_submission';
  form_type: string;
  source: string;
  intent?: string;
  sentiment?: string;
  summary?: string;
  tags?: string;
}

export interface EasterEgg_CompletionPayload extends Telemetry_BasePayload {
  type: 'easter_egg_completion';
  egg_id: string;
  egg_name: string;
  trigger_type:
    | 'konami'
    | 'click_sequence'
    | 'terminal_command'
    | 'idle'
    | 'cursor_pattern'
    | 'rive';
  completion_time_ms?: number;
  attempt_count?: number;
  metadata?: Record<string, unknown>;
}

export type IngestionPayload =
  | Telemetry_EventPayload
  | AI_EventPayload
  | Music_PlaybackPayload
  | System_IntegrityPayload
  | AI_TrajectoryPayload
  | FormSubmission_Payload
  | EasterEgg_CompletionPayload;

// --- WEBHOOK TYPES ---

export interface SentryWebhookPayload {
  event_id: string;
  url: string;
  type: string;
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  message: string;
  culprit?: string | null;
  project_slug: string;
  issue_id: string;
  release?: string | null;
  environment?: string | null;
  tags?: Record<string, string>;
  user?: {
    id?: string | null;
    email?: string | null;
    ip_address?: string | null;
  } | null;
}

export interface VercelLogEntry {
  id?: string;
  timestamp?: number;
  message?: string;
  projectId?: string;
  source?: string;
  host?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  proxy?: {
    timestamp?: number;
    clientIp?: string;
    userAgent?: string[];
    referer?: string;
    vercel?: any;
    geo?: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: number;
      longitude?: number;
    };
  };
}

export interface StripeEvent {
  id: string;
  object: 'event';
  type: string;
  created: number;
  data: {
    object: any;
  };
}

export interface KofiEvent {
  message_id: string;
  timestamp: string;
  type: string;
  is_public?: boolean;
  from_name?: string;
  message?: string;
  amount: string | number;
  currency: string;
  email?: string;
  url?: string;
  kofi_transaction_id?: string;
  verification_token?: string;
}

// --- DASHBOARD UI TYPES ---

export type SystemStatus = 'OPERATIONAL' | 'DEGRADED' | 'UNKNOWN' | 'LOADING';

export type Telemetry_TimeRange = '1h' | '24h' | '7d' | '30d' | 'all';

export interface Dashboard_State {
  filters: {
    timeRange: Telemetry_TimeRange;
    startDate: string | null;
    endDate: string | null;
    searchQuery: string;
    visibleCategories: string[];
  };
  ui: {
    isSidebarCollapsed: boolean;
    navMode: string;
    activeTab: string;
    refreshInterval: number;
  };
  status: {
    isLive: boolean;
    lastUpdated: string | null;
  };
}

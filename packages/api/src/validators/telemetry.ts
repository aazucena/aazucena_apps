import { z } from 'zod';

const BaseEventSchema = z.object({
  sessionId: z.string().uuid().optional().describe('Unique ID for the user session, UUID format'),
  url: z.string().url().optional().describe('URL where the event occurred'),
});

export const TelemetryEventPayloadSchema = BaseEventSchema.extend({
  type: z.literal('telemetry_event'),
  event: z.enum([
    'PageView',
    'Interaction',
    'ClientError',
    'PerformanceMetric',
    'Heartbeat',
    'CustomEvent',
  ]),
  data: z.record(z.string(), z.string()).optional(),
});

export const AiEventPayloadSchema = BaseEventSchema.extend({
  type: z.literal('ai_event'),
  trace_id: z.string().optional(),
  agent_name: z.string(),
  model: z.string(),
  input_tokens: z.number().int().min(0),
  output_tokens: z.number().int().min(0),
  cost_usd: z.number().min(0).optional(),
  latency_ms: z.number().int().min(0),
  form_type: z.string().optional(),
});

export const MusicPlaybackPayloadSchema = BaseEventSchema.extend({
  type: z.literal('music_playback'),
  track_id: z.string(),
  track_title: z.string(),
  artist_name: z.string().optional(),
  genre: z.string().optional(),
  completion_pct: z.number().int().min(0).max(100),
  is_download: z.boolean(),
});

export const SystemIntegrityPayloadSchema = BaseEventSchema.extend({
  type: z.literal('system_integrity'),
  service: z.string(),
  status: z.enum(['UP', 'DOWN', 'DEGRADED', 'RESPONDING']),
  latency_ms: z.number().int().min(0).optional(),
  error_count: z.number().int().min(0).optional(),
  payload_size: z.number().int().min(0).optional(),
  message: z.string().optional(),
});

export const AiTrajectoryPayloadSchema = BaseEventSchema.extend({
  type: z.literal('ai_trajectory'),
  trajectory_id: z.string(),
  step_index: z.number().int().min(0),
  state: z.record(z.string(), z.any()),
  observation: z.string().optional(),
  action: z.string(),
  reward: z.number(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const IngestionPayloadSchema = z.discriminatedUnion('type', [
  TelemetryEventPayloadSchema,
  AiEventPayloadSchema,
  MusicPlaybackPayloadSchema,
  SystemIntegrityPayloadSchema,
  AiTrajectoryPayloadSchema,
]);

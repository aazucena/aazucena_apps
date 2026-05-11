/**
 * Agentic Telemetry Types
 * Defines the MG/EG (Midgame/Endgame) performance structure.
 */

export type AgentPhase = 'MG' | 'EG';

export interface TokenStats {
  input: number;
  output: number;
  cache_hit?: boolean;
  total_cost?: number;
}

export interface CallStats {
  latency_ms: number;
  provider: string;
  model: string;
  tokens_per_second?: number;
}

/**
 * Packed Performance Score
 * conceptually: (Endgame_Score << 16) + Midgame_Score
 */
export type PackedScore = number;

export interface AgenticEvent {
  trace_id: string;
  agent_name: string;
  phase: AgentPhase;
  score: PackedScore;
  token_stats: TokenStats;
  call_stats: CallStats;
  success: boolean;
  timestamp: string;
}

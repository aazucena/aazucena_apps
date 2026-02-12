/**
 * [Types] : AI_Intelligence_Contracts
 */

export type AI_Role = 'user' | 'assistant' | 'system' | 'data';

export interface AI_MessagePart {
  type: 'text' | 'reasoning' | 'image' | 'tool_call';
  text: string;
}

export interface AI_TerminalMessage {
  id: string;
  role: AI_Role;
  parts: AI_MessagePart[];
  parentId: string | null;
  metadata?: Record<string, unknown>;
}

export interface AI_Conversation {
  id: string;
  title: string;
  messages: Record<string, AI_TerminalMessage>;
  activeNodeId: string | null;
  updatedAt: number;
}

export interface AI_TrajectoryStep {
  step: number;
  observation: string;
  action: string;
  reward: number;
  probability: number;
  metadata: Record<string, unknown>;
}

export interface AI_Trajectory {
  id: string;
  agent: string;
  timestamp: string;
  totalReward: number;
  length: number;
  steps: AI_TrajectoryStep[];
}

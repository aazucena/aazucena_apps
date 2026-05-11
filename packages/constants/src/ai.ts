/**
 * [Constants] : Intelligence_Model_Registry
 * Centralized pricing and metadata for LLM providers.
 */

export const AI_MODELS = {
  BRAIN: 'local/brain',
  GPT_4O: 'openai/gpt-4o',
  GPT_4O_MINI: 'openai/gpt-4o-mini',
  GPT_4_TURBO: 'openai/gpt-4-turbo',
  CLAUDE_3_SONNET: 'anthropic/claude-3-5-sonnet',
  CLAUDE_3_OPUS: 'anthropic/claude-3-opus',
  CLAUDE_3_HAIKU: 'anthropic/claude-3-haiku',
  GEMINI_PRO: 'google/gemini-1.5-pro',
  GEMINI_FLASH: 'google/gemini-1.5-flash',
} as const;

/**
 * Pricing per 1,000,000 (1M) tokens in USD
 */
export const AI_PRICING = {
  [AI_MODELS.GPT_4O]: { in: 5.0, out: 15.0 },
  [AI_MODELS.GPT_4O_MINI]: { in: 0.15, out: 0.6 },
  [AI_MODELS.GPT_4_TURBO]: { in: 10.0, out: 30.0 },
  [AI_MODELS.CLAUDE_3_SONNET]: { in: 3.0, out: 15.0 },
  [AI_MODELS.CLAUDE_3_OPUS]: { in: 15.0, out: 75.0 },
  [AI_MODELS.CLAUDE_3_HAIKU]: { in: 0.25, out: 1.25 },
  [AI_MODELS.GEMINI_PRO]: { in: 3.5, out: 10.5 },
  [AI_MODELS.GEMINI_FLASH]: { in: 0.075, out: 0.3 },
  default: { in: 0, out: 0 },
} as const;

export const SAVINGS_BASELINE_MODEL = AI_MODELS.GPT_4O;

/**
 * Default cognitive flow nodes for the NeuralMap visualization
 */
export const NEURAL_MAP_FALLBACK_NODES = [
  { id: 'analyze_intent', label: 'Intent_Analysis' },
  { id: 'expert_dispatcher', label: 'Expert_Dispatcher' },
  { id: 'retrieve_knowledge', label: 'Knowledge_RAG' },
  { id: 'generate_response', label: 'Cognitive_Gen' },
  { id: 'validate_response', label: 'Truth_Validator' },
] as const;

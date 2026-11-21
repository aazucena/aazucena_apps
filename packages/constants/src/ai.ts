/**
 * [Constants] : Intelligence_Model_Registry
 * AI metadata. Models and prices: see ./ai-models.
 */

// Chat models, prices and the savings baseline live in ./ai-models (one catalogue).
export * from './ai-models';

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

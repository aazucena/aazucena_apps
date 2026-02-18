import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * AI Provider Identities
 * Official brand colors for LLM providers used in the AAZUCENA ecosystem.
 * Used to distinguish responses in the Intelligence Terminal.
 */
export const aiBranding = {
  /** Anthropic Claude (Primary LLM) */
  anthropic: {
    brand: '#D97757', // Official Claude brand color
    accent: toHex(colors.primary[500]),
  },
  
  /** Google Gemini (Vertex AI) */
  google: {
    brand: '#4E86F8', // Gemini Blue
    accent: toHex(colors.primary[400]),
  },
  
  /** OpenAI (Embeddings & GPT) */
  openai: {
    brand: '#10A37F', // OpenAI Green
    accent: toHex(colors.success[500]),
  },
  
  /** Cohere (Rerank & Embed) */
  cohere: {
    brand: '#3D3D3D', // Cohere Dark Grey
    accent: toHex(colors.zinc[400]),
  },
  
  /** Voyage AI (Embeddings) */
  voyage: {
    brand: toHex(colors.primary[600]), // Custom mapping
    accent: toHex(colors.primary[500]),
  },
} as const;

export type AiBranding = typeof aiBranding;

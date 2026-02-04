import { createGateway } from 'ai';

/**
 * Vercel AI Gateway Provider
 * 
 * When deployed on Vercel, this uses OIDC for automatic authentication.
 * For local development, it uses the AI_GATEWAY_API_KEY environment variable.
 */
export const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

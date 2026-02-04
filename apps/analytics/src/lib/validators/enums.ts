import { z } from 'zod';

export const PromptTypeEnum = z.enum([
  'intent_analyst',
  'assistant',
  'expert',
  'tool',
  'evaluation'
]);

export type PromptType = z.infer<typeof PromptTypeEnum>;

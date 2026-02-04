import type { StrapiPrompt } from '../validators/prompt';
import type { PromptType } from '../validators/enums';

export interface Prompt {
  id: string;
  name: string;
  slug: string;
  description?: string;
  systemMessage: string;
  humanTemplate?: string;
  type: PromptType;
  locale: string;
  tags: string[];
  metadata: Record<string, any>;
  lastUpdated: string;
}

export function transformPrompt(prompt: StrapiPrompt): Prompt {
  return {
    id: prompt.documentId || prompt.id?.toString() || '',
    name: prompt.name,
    slug: prompt.slug,
    description: prompt.description || undefined,
    systemMessage: prompt.system_message,
    humanTemplate: prompt.human_template || undefined,
    type: prompt.type,
    locale: prompt.locale || 'en',
    tags: prompt.tags?.map(t => t.label) || [],
    metadata: prompt.metadata || {},
    lastUpdated: prompt.updatedAt || prompt.createdAt || '',
  };
}

export function transformPrompts(prompts: StrapiPrompt[]): Prompt[] {
  return prompts.map(transformPrompt);
}

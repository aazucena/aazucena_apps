import type { StrapiAbout } from '../validators/about.js';
import { transformStats, transformCtaButton } from '@aazucena/utils';
import type {
  AboutData,
  FocusArea,
  NarrativeItem,
  WorkflowItem,
  LanguageItem,
  WorkingStyleItem,
} from '@aazucena/types';

export const DEFAULT_ABOUT: AboutData = {
  tagline: 'Building Products That Drive Impact',
  descriptions: [],
  highlights: [],
  stats: [],
  learnMoreCards: [],
  focusAreas: [],
  roots: [],
  interests: [],
  coreValues: [],
  workflow: [],
  languages: [],
  workingStyle: [],
};

export function transformAbout(data: StrapiAbout): AboutData {
  if (!data) return DEFAULT_ABOUT;

  return {
    tagline: data.tagline,
    descriptions: data.descriptions,
    highlights: data.highlights,
    stats: (data.stats || []).map(transformStats),
    learnMoreCards: (data.learnMoreCards || []).map((card) => ({
      title: card.title,
      variant: card.variant || undefined,
      description: card.description || undefined,
      icon: card.icon,
      button: transformCtaButton(card.button),
    })),
    focusAreas: (data.focusAreas || []) as FocusArea[],
    roots: (data.roots || []) as NarrativeItem[],
    interests: (data.interests || []) as NarrativeItem[],
    coreValues: (data.coreValues || []) as NarrativeItem[],
    workflow: (data.workflow || []) as WorkflowItem[],
    languages: (data.languages || []) as LanguageItem[],
    workingStyle: (data.workingStyle || []) as WorkingStyleItem[],
  };
}

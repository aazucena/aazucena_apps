import type { StrapiAbout } from '../validators/about';
import {
  transformStats,
  transformCtaButton,
} from './utils';
import type {
  FocusArea,
  NarrativeItem,
  WorkflowItem,
  LanguageItem,
  WorkingStyleItem
} from '../validators/components';

export interface AboutData {
  tagline: string;
  descriptions: any;
  highlights: any;
  stats: ReturnType<typeof transformStats>[];
  learnMoreCards: {
    title: string;
    variant?: string;
    description?: string;
    icon?: any;
    button: ReturnType<typeof transformCtaButton>;
  }[];
  
  // Managed narrative sections
  focusAreas: FocusArea[];
  roots: NarrativeItem[];
  interests: NarrativeItem[];
  coreValues: NarrativeItem[];
  workflow: WorkflowItem[];
  languages: LanguageItem[];
  workingStyle: WorkingStyleItem[];
}

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
    learnMoreCards: (data.learnMoreCards || []).map(card => ({
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
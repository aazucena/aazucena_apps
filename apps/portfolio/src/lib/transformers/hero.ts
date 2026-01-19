import type { StrapiHero } from '~/lib/validators/hero';

export interface HeroData {
  flipWords: string[];
  taglineTemplate: string;
  primaryButtonText?: string;
  showDropdown: boolean;
  secondaryButtonText?: string;
  showSecondaryButton: boolean;
}

/**
 * Transform Strapi hero to frontend format
 */
export function transformHero(strapiHero: StrapiHero): HeroData {
  // Parse flipWords (sortable-list returns array of strings or JSON)
  let flipWords: string[] = [];
  if (Array.isArray(strapiHero.flipWords)) {
    flipWords = strapiHero.flipWords;
  } else if (typeof strapiHero.flipWords === 'string') {
    try {
      flipWords = JSON.parse(strapiHero.flipWords);
    } catch {
      flipWords = [strapiHero.flipWords];
    }
  }

  return {
    flipWords,
    taglineTemplate: strapiHero.taglineTemplate,
    primaryButtonText: strapiHero.primaryButtonText,
    showDropdown: strapiHero.showDropdown ?? true,
    secondaryButtonText: strapiHero.secondaryButtonText,
    showSecondaryButton: strapiHero.showSecondaryButton ?? true,
  };
}

/**
 * Default fallback hero data
 */
export const DEFAULT_HERO: HeroData = {
  flipWords: ['ideas', 'concepts', 'visions', 'dreams'],
  taglineTemplate: 'Turning {flipWord} into elegant code, one pixel at a time.',
  primaryButtonText: 'Get Started',
  showDropdown: true,
  secondaryButtonText: 'View Resume',
  showSecondaryButton: true,
};

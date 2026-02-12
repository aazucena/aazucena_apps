import type { StrapiHero } from '../validators/hero.js';
import type { HeroData } from '@aazucena/types';

export const DEFAULT_HERO: HeroData = {
  flipWords: ['ideas', 'concepts', 'visions', 'dreams'],
  taglineTemplate: 'Turning {{flipWord}} into elegant code, one pixel at a time.',
  showDropdown: true,
  showSecondaryButton: true,
};

export function transformHero(data: StrapiHero): HeroData {
  if (!data) return DEFAULT_HERO;

  return {
    flipWords: data.flipWords || DEFAULT_HERO.flipWords,
    taglineTemplate: data.taglineTemplate,
    primaryButtonText: data.primaryButtonText || undefined,
    showDropdown: !!data.showDropdown,
    secondaryButtonText: data.secondaryButtonText || undefined,
    showSecondaryButton: !!data.showSecondaryButton,
  };
}

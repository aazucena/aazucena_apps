import type { BlocksContent } from '@strapi/blocks-react-renderer';
import type { StrapiAbout, Stats, CardLink } from '~/lib/validators/about';

export interface AboutData {
  tagline: string;
  descriptions: BlocksContent;
  highlights: BlocksContent;
  stats: Stats[];
  learnMoreCards: CardLink[];
}

/**
 * Transform Strapi about section to frontend format
 */
export function transformAbout(strapiAbout: StrapiAbout): AboutData {
  return {
    tagline: strapiAbout.tagline,
    descriptions: strapiAbout.descriptions,
    highlights: strapiAbout.highlights,
    stats: strapiAbout.stats || [],
    learnMoreCards: strapiAbout.learnMoreCards || [],
  };
}

/**
 * Default fallback about section data
 */
export const DEFAULT_ABOUT: AboutData = {
  tagline: 'Building Products That Drive Impact',
  descriptions: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'Full-stack professional who transforms ideas into market-ready products.',
        },
      ],
    },
  ],
  highlights: [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Full-Stack Development & Architecture' }],
    },
  ],
  stats: [],
  learnMoreCards: [],
};

import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiTestimonialsResponseSchema } from '../validators/testimonials.js';
import { transformTestimonials, DEFAULT_TESTIMONIALS } from '../transformers/testimonials.js';
import type { Testimonial } from '@aazucena/types';

/**
 * Fetches testimonials from Strapi CMS
 * @param featuredOnly - Only return featured testimonials
 */
export async function getTestimonials(featuredOnly: boolean = false): Promise<Testimonial[]> {
  try {
    const response = await fetchStrapi('testimonials', {
      query: {
        populate: ['avatar'],
        filters: {
          approvalStatus: { $eq: 'Approved' },
        },
        sort: ['publishedAt:desc'],
        pagination: {
          pageSize: 100,
        },
        publicationState: 'live',
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiTestimonialsResponseSchema.parse(response);
    return transformTestimonials(validatedData.data, featuredOnly);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Testimonials] Invalid CMS data:', error.issues);
    } else {
      console.error('[Testimonials] Failed to fetch:', error);
    }
    return DEFAULT_TESTIMONIALS;
  }
}

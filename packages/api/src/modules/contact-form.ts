import { z } from 'zod';
import { fetchStrapi } from '../services/strapi';
import { StrapiContactFormSchema } from '../validators/contact-form';
import { transformContactForm, DEFAULT_CONTACT_FORM } from '../transformers/contact-form';
import type { ContactFormConfig } from '@aazucena/types';

/**
 * Fetch contact form configuration
 */
export async function getContactForm(): Promise<ContactFormConfig> {
  try {
    const response = await fetchStrapi('contact-form', {
      query: { populate: ['header'] },
    });

    const validated = StrapiContactFormSchema.parse(response.data);
    return transformContactForm(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[ContactForm API] Invalid CMS data:', error.issues);
    } else {
      console.error('[ContactForm API] Failed to fetch contact form:', error);
    }
    return DEFAULT_CONTACT_FORM;
  }
}

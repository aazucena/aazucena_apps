import type { ServicesData } from '@aazucena/types';
import { z } from 'zod';
import { fetchStrapi } from '../services/strapi';
import { DEFAULT_SERVICES, transformServices } from '../transformers/services';
import { StrapiServicesResponseSchema } from '../validators/services';

export async function getServices(): Promise<ServicesData> {
  try {
    const response = await fetchStrapi('services', {
      query: {
        populate: ['cta'],
        sort: ['sort:asc'],
        pagination: { pageSize: 20 },
      },
    });

    const validated = StrapiServicesResponseSchema.parse(response);
    const services = transformServices(validated.data);
    if (services.length <= 0) return DEFAULT_SERVICES;
    return { services };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Services API] Invalid CMS data:', error.issues);
    } else {
      console.error('[Services API] Failed to fetch services:', error);
    }
    return DEFAULT_SERVICES;
  }
}

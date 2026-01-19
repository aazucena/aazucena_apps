import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiMaintenanceSchema } from '~/lib/validators/maintenance';
import { transformMaintenance, DEFAULT_MAINTENANCE } from '~/lib/transformers/maintenance';
import type { MaintenanceData } from '~/lib/transformers/maintenance';

/**
 * Fetches maintenance mode configuration from Strapi CMS
 */
export async function getMaintenance(): Promise<MaintenanceData> {
  try {
    const response = await fetchStrapi('maintenance', {
      cache: 'no-cache', // Don't cache maintenance status - needs real-time check
    });

    const validatedData = StrapiMaintenanceSchema.parse(response.data);
    return transformMaintenance(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Maintenance] Invalid CMS data:', error.issues);
    } else {
      console.error('[Maintenance] Failed to fetch:', error);
    }
    return DEFAULT_MAINTENANCE;
  }
}

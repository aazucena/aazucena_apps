import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiMaintenanceSchema } from '../validators/maintenance.js';
import {
  transformMaintenance,
  DEFAULT_MAINTENANCE,
  type MaintenanceData,
} from '../transformers/maintenance.js';

/**
 * Fetch maintenance mode configuration
 */
export async function getMaintenance(): Promise<MaintenanceData> {
  try {
    const response = await fetchStrapi('maintenance');

    const validated = StrapiMaintenanceSchema.parse(response.data);
    return transformMaintenance(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Maintenance API] Invalid CMS data:', error.issues);
    } else {
      console.error('[Maintenance API] Failed to fetch maintenance mode:', error);
    }
    return DEFAULT_MAINTENANCE;
  }
}

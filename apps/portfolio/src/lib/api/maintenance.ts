import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiMaintenanceSchema } from "../validators/maintenance";
import {
  transformMaintenance,
  DEFAULT_MAINTENANCE,
  type MaintenanceData,
} from "../transformers/maintenance";

/**
 * Fetch maintenance mode configuration
 */
export async function getMaintenance(): Promise<MaintenanceData> {
  try {
    const response = await fetchStrapi("maintenance");

    const validated = StrapiMaintenanceSchema.parse(response.data);
    return transformMaintenance(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Maintenance API] Invalid CMS data:", error.issues);
    } else {
      console.error(
        "[Maintenance API] Failed to fetch maintenance mode:",
        error,
      );
    }
    return DEFAULT_MAINTENANCE;
  }
}

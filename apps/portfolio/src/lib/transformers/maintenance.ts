import type { StrapiMaintenance } from "../validators/maintenance";

export interface MaintenanceConfig {
  enabled: boolean;
  message: any;
  heroSubtitle: string;
  reachOutLabel: string;
}

// Backward compatibility alias
export type MaintenanceData = MaintenanceConfig;

export const DEFAULT_MAINTENANCE: MaintenanceConfig = {
  enabled: false,
  message: [],
  heroSubtitle: "Refining the Experience",
  reachOutLabel: "Reach out directly",
};

export function transformMaintenance(
  data: StrapiMaintenance,
): MaintenanceConfig {
  if (!data) return DEFAULT_MAINTENANCE;

  return {
    enabled: !!data.enabled,
    message: data.message,
    heroSubtitle: data.heroSubtitle,
    reachOutLabel: data.reachOutLabel,
  };
}

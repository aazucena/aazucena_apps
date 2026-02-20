import type { StrapiJourney } from "../validators/journey";
import { transformPageHeader, transformCtaButton } from "./utils";
import type { PhaseItem } from "../validators/components";

export interface JourneyPageConfig {
  header?: ReturnType<typeof transformPageHeader>;
  phases: PhaseItem[];
  callToAction?: {
    title: string;
    description?: string;
    buttons: ReturnType<typeof transformCtaButton>[];
  };
}

export const DEFAULT_JOURNEY: JourneyPageConfig = {
  phases: [],
};

export function transformJourney(data: StrapiJourney): JourneyPageConfig {
  if (!data) return DEFAULT_JOURNEY;

  return {
    header: transformPageHeader(data.header),
    phases: (data.phases || []).filter((p) => !!p.enabled),
    callToAction: data.callToAction
      ? {
          title: data.callToAction.title,
          description: data.callToAction.description || undefined,
          buttons: data.callToAction.buttons.map(transformCtaButton),
        }
      : undefined,
  };
}

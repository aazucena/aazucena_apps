import type { StrapiJourney } from '../validators/journey';
import { transformPageHeader, transformCtaButton } from '@aazucena/utils';
import type { JourneyPageConfig, PhaseItem } from '@aazucena/types';

export const DEFAULT_JOURNEY: JourneyPageConfig = {
  phases: [],
};

export function transformJourney(data: StrapiJourney): JourneyPageConfig {
  if (!data) return DEFAULT_JOURNEY;

  return {
    header: transformPageHeader(data.header),
    phases: (data.phases || []).filter((p) => !!p.enabled) as PhaseItem[],
    callToAction: data.callToAction
      ? {
          title: data.callToAction.title,
          description: data.callToAction.description || undefined,
          buttons: data.callToAction.buttons.map(transformCtaButton),
        }
      : undefined,
  };
}

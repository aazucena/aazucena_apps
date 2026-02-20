import type { StrapiHomepage } from "../validators/homepage";
import { transformSeo } from "./utils";
import type { Section } from "../validators/components";

export type HomepageSection = Section;

export interface HomepageData {
  title: string;
  sections: HomepageSection[];
  seo?: ReturnType<typeof transformSeo>;
}

export const DEFAULT_HOMEPAGE: HomepageData = {
  title: "Welcome",
  sections: [],
};

export function transformHomepage(data: StrapiHomepage): HomepageData {
  if (!data) return DEFAULT_HOMEPAGE;

  return {
    title: data.title,
    sections: (data.sections || []).filter((s) => !!s.enabled),
    seo: transformSeo(data.seo),
  };
}

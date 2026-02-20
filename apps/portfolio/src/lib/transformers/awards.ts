import type { StrapiAward } from "../validators/awards";
import { getMediaUrl } from "./utils";

export interface Award {
  id: string;
  type: "certification" | "award";
  title: string;
  shortTitle: string;
  organization: string;
  issuer?: string;
  year: number;
  credentialId?: string;
  description?: any;
  category?: string;
  verificationUrl?: string;
  badgeUrl?: string;
  certificateUrl?: string;
  featured: boolean;
  createdAt: string;
}

export const DEFAULT_AWARDS: Award[] = [];

export function transformAward(data: StrapiAward): Award {
  return {
    id: data.id.toString(),
    type: data.type as "certification" | "award",
    title: data.title,
    shortTitle: data.shortTitle || data.title.substring(0, 30),
    organization: data.organization,
    issuer: data.issuer || undefined,
    year: data.year,
    credentialId: data.credentialId || undefined,
    description: data.description,
    category: data.category || undefined,
    verificationUrl: data.verificationUrl || undefined,
    badgeUrl: getMediaUrl(data.badge),
    certificateUrl: getMediaUrl(data.certificate),
    featured: !!data.featured,
    createdAt: data.createdAt,
  };
}

export function transformAwards(items: StrapiAward[]): Award[] {
  if (!items || items.length === 0) return DEFAULT_AWARDS;

  return items
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .map(transformAward);
}

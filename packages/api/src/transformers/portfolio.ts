import type { StrapiPortfolio } from '../validators/portfolio';
import { transformImage, transformSocialLink } from '@aazucena/utils';
import type { PortfolioData } from '@aazucena/types';

export type PortfolioContent = PortfolioData;

export const DEFAULT_PORTFOLIO: PortfolioData = {
  fullName: 'Aldrin Azucena',
  occupation: 'Full Stack Software Developer',
  email: 'contact@aazucena.com',
  availabilityStatus: 'Open to Opportunities',
  timezone: 'America/Edmonton',
  socialLinks: [],
};

export function transformPortfolio(data: StrapiPortfolio): PortfolioData {
  if (!data) return DEFAULT_PORTFOLIO;

  return {
    fullName: data.fullName,
    occupation: data.occupation,
    profileImage: transformImage(data.profileImage),
    resumeUrl: data.resumeFile?.url ? data.resumeFile.url : undefined,
    bio: data.bio,
    email: data.email,
    emailDescription: data.emailDescription || undefined,
    phone: data.phone || undefined,
    availabilityStatus: data.availabilityStatus,
    timezone: data.timezone,
    socialLinks: (data.socialLinks || []).map(transformSocialLink),
    yearsOfExperience: data.yearsOfExperience || undefined,
    location: data.location || undefined,
  };
}

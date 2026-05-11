/**
 * [API] : Portfolio_Data_Fetchers
 * Specialized high-level functions for extracting portfolio DNA from Strapi.
 */

import { fetchStrapi } from '../services/strapi';
import type { Domain_Project, Domain_Experience, Domain_Skill } from '@aazucena/types';

export async function getPortfolioProjects() {
  return fetchStrapi<Domain_Project[]>('projects', {
    query: { populate: ['tags', 'coverImage'], sort: ['sort:asc'] },
  });
}

export async function getPortfolioExperiences() {
  return fetchStrapi<Domain_Experience[]>('experiences', {
    query: {
      populate: ['technologies', 'companyLogo'],
      sort: ['startDate:desc'],
    },
  });
}

export async function getPortfolioSkills() {
  return fetchStrapi<Domain_Skill[]>('skills', {
    query: { populate: ['categories'], sort: ['sort:asc'] },
  });
}

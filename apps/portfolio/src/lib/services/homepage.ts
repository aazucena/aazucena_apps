import { getPortfolio } from '../api/portfolio';
import { getAbout } from '../api/about';
import { getHero } from '../api/hero';
import { getProjects } from '../api/projects';
import { getExperiences } from '../api/experiences';
import { getPosts } from '../api/posts';
import { getTestimonials } from '../api/testimonials';
import { getAwards } from '../api/awards';
import { getSkills } from '../api/skills';
import { getHomepage } from '../api/homepage';
import { getShowcaseConfig } from '../api/project-showcase';
import { getWebsiteConfig } from '../api/website-config';

/**
 * Orchestrates fetching of all data required for the homepage
 * Fetches everything in parallel for optimal performance
 */
export async function getHomepageData() {
  try {
    const [
      portfolio,
      about,
      hero,
      projects,
      experiences,
      posts,
      testimonials,
      awards,
      skills,
      homepage,
      showcase,
      websiteConfig
    ] = await Promise.all([
      getPortfolio(),
      getAbout(),
      getHero(),
      getProjects('home'),
      getExperiences(),
      getPosts(true, 3), // Featured only, limit 3
      getTestimonials(),
      getAwards(),
      getSkills('core'),
      getHomepage(),
      getShowcaseConfig(),
      getWebsiteConfig()
    ]);

    return {
      portfolio,
      about,
      hero,
      projects,
      experiences,
      posts,
      testimonials,
      awards,
      skills,
      homepage,
      showcase,
      websiteConfig
    };
  } catch (error) {
    console.error('[HomepageData] Failed to fetch aggregate data:', error);
    throw error;
  }
}
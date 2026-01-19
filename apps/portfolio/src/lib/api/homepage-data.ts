import { getPortfolio } from './portfolio';
import { getSkills } from './skills';
import { getProjects } from './projects';
import { getExperiences } from './experiences';
import { getTestimonials } from './testimonials';
import { getAwards } from './awards';
import { getPosts } from './posts';
import { getHomepage } from './homepage';
import { getHero } from './hero';
import { getAnimationConfig } from './animation';
import { getAbout } from './about';
import { getBlogConfig } from './blog-config';
import { getShowcaseConfig } from './showcase';
import type { PortfolioData } from '~/types/portfolio';

export interface HomepageDataResponse {
  data: PortfolioData;
  homepage: Awaited<ReturnType<typeof getHomepage>>;
  portfolio: Awaited<ReturnType<typeof getPortfolio>>;
  animationConfig: Awaited<ReturnType<typeof getAnimationConfig>>;
}

/**
 * Fetches all homepage data from Strapi CMS in parallel
 * Falls back to defaults if CMS is unavailable (built into each API client)
 */
export async function getHomepageData(): Promise<HomepageDataResponse> {
  const [
    portfolio,
    about,
    skills,
    projects,
    experiences,
    testimonials,
    awards,
    posts,
    homepage,
    hero,
    animationConfig,
    blog,
    showcase,
  ] = await Promise.all([
    getPortfolio(),
    getAbout(),
    getSkills('all'), // Get all skills (not filtered by display)
    getProjects('home'), // Get projects marked for home display
    getExperiences(),
    getTestimonials(false), // Get all approved testimonials
    getAwards(),
    getPosts(true, 6), // Get 6 featured posts
    getHomepage(), // Get homepage section configuration
    getHero(), // Get hero section configuration
    getAnimationConfig(), // Get animation system configuration
    getBlogConfig(), // Get blog configuration
    getShowcaseConfig(), // Get project showcase configuration
  ]);

  const data: PortfolioData = {
    hero,
    about,
    skills,
    projects,
    experiences,
    testimonials,
    awards,
    posts,
    blog,
    showcase,
  };

  // Log data fetching status in development
  if (import.meta.env.DEV) {
    console.log('✅ CMS data fetched successfully');
    console.log('📄 Homepage sections:', homepage.sections.length);
    console.log('🎯 Hero flip words:', hero.flipWords);
    console.log('🎨 Animation config:', animationConfig.enabled ? 'Enabled' : 'Disabled');
    console.log('📝 Blog config:', `${blog.postsPerPage} posts/page, path: /${blog.paths.main}`);
  }

  return {
    data,
    homepage,
    portfolio,
    animationConfig,
  };
}

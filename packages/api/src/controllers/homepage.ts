import { getPortfolio } from '../modules/portfolio';
import { getAbout } from '../modules/about';
import { getHero } from '../modules/hero';
import { getProjects } from '../modules/projects';
import { getExperiences } from '../modules/experiences';
import { getPosts } from '../modules/posts';
import { getTestimonials } from '../modules/testimonials';
import { getAwards } from '../modules/awards';
import { getSkills } from '../modules/skills';
import { getHomepage } from '../modules/homepage';
import { getProjectShowcaseConfig } from '../modules/project-showcase';
import { getExperienceShowcase } from '../modules/experience-showcase';
import { getSkillShowcase } from '../modules/skill-showcase';
import { getWebsiteConfig } from '../modules/website-config';
import { getAnimationConfig } from '../modules/animation';
import { getBlogConfig } from '../modules/blog-config';
import type {
  HeroData,
  AboutData,
  Project,
  Experience,
  BlogPost,
  Testimonial,
  Award,
  SkillCategory,
  ProjectShowcaseConfig,
  ExperienceShowcaseConfig,
  SkillShowcaseConfig,
  BlogConfigData,
} from '@aazucena/types';

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  projects: Project[];
  experiences: Experience[];
  blog: BlogConfigData;
  posts: BlogPost[];
  testimonials: Testimonial[];
  awards: Award[];
  skills: SkillCategory[];
  projectShowcase: ProjectShowcaseConfig;
  experienceShowcase: ExperienceShowcaseConfig;
  skillShowcase: SkillShowcaseConfig;
}

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
      blog,
      posts,
      testimonials,
      awards,
      skills,
      homepage,
      projectShowcase,
      experienceShowcase,
      skillShowcase,
      websiteConfig,
      animationConfig,
    ] = await Promise.all([
      getPortfolio(),
      getAbout(),
      getHero(),
      getProjects('home'),
      getExperiences(),
      getBlogConfig(),
      getPosts(true, 3), // Featured only, limit 3
      getTestimonials(),
      getAwards(),
      getSkills('featured'),
      getHomepage(),
      getProjectShowcaseConfig(),
      getExperienceShowcase(),
      getSkillShowcase(),
      getWebsiteConfig(),
      getAnimationConfig(),
    ]);

    const portfolioData: PortfolioData = {
      hero,
      about,
      projects,
      experiences,
      blog,
      posts,
      testimonials,
      awards,
      skills,
      projectShowcase,
      experienceShowcase,
      skillShowcase,
    };

    return {
      data: portfolioData,
      portfolio,
      homepage,
      websiteConfig,
      animationConfig,
    };
  } catch (error) {
    console.error('[HomepageData] Failed to fetch aggregate data:', error);
    throw error;
  }
}

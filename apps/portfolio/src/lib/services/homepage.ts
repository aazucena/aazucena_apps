import { getPortfolio } from "@aazucena/api";
import { getAbout } from "@aazucena/api";
import { getHero } from "@aazucena/api";
import { getProjects } from "@aazucena/api";
import { getExperiences } from "@aazucena/api";
import { getPosts } from "@aazucena/api";
import { getTestimonials } from "@aazucena/api";
import { getAwards } from "@aazucena/api";
import { getSkills } from "@aazucena/api";
import { getHomepage } from "@aazucena/api";
import { getProjectShowcaseConfig } from "@aazucena/api";
import { getExperienceShowcase } from "@aazucena/api";
import { getSkillShowcase } from "@aazucena/api";
import { getWebsiteConfig } from "@aazucena/api";
import { getAnimationConfig } from "@aazucena/api";
import { getBlogConfig } from "@aazucena/api";
import { getServices } from "@aazucena/api";
import type { HeroData } from "@aazucena/types";
import type { AboutData } from "@aazucena/types";
import type { Project } from "@aazucena/types";
import type { Experience } from "@aazucena/types";
import type { BlogPost } from "@aazucena/types";
import type { Testimonial } from "~/components/ui/InfiniteMovingCards";
import type { Award } from "@aazucena/types";
import type { SkillCategory } from "@aazucena/types";
import type { ProjectShowcaseConfig } from "@aazucena/types";
import type { ExperienceShowcaseConfig } from "@aazucena/types";
import type { SkillShowcaseConfig } from "@aazucena/types";
import type { BlogConfigData } from "@aazucena/types";
import type { ServicesData } from "@aazucena/types";

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
  services: ServicesData;
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
      services,
    ] = await Promise.all([
      getPortfolio(),
      getAbout(),
      getHero(),
      getProjects("home"),
      getExperiences(),
      getBlogConfig(),
      getPosts(true, 3), // Featured only, limit 3
      getTestimonials(),
      getAwards(),
      getSkills("featured"),
      getHomepage(),
      getProjectShowcaseConfig(),
      getExperienceShowcase(),
      getSkillShowcase(),
      getWebsiteConfig(),
      getAnimationConfig(),
      getServices(),
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
      services,
    };

    return {
      data: portfolioData,
      portfolio,
      homepage,
      websiteConfig,
      animationConfig,
    };
  } catch (error) {
    console.error("[HomepageData] Failed to fetch aggregate data:", error);
    throw error;
  }
}

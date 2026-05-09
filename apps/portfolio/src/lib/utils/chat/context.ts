import {
  getAbout,
  getPortfolio,
  getSkills,
  getExperiences,
  getProjects,
  getServices,
  getPromptBySlug,
} from "@aazucena/api";
import { buildSystemPrompt } from "./prompt";

export interface ChatContext {
  systemPrompt: string;
}

export async function fetchChatContext(pathname: string): Promise<ChatContext> {
  const [about, portfolio, skills, experiences, projects, services, cmsPrompt] =
    await Promise.allSettled([
      getAbout(),
      getPortfolio(),
      getSkills("core"),
      getExperiences(),
      getProjects("featured"),
      getServices(),
      getPromptBySlug("portfolio-assistant"),
    ]);

  const aboutData = about.status === "fulfilled" ? about.value : ({} as any);
  const portfolioData =
    portfolio.status === "fulfilled" ? portfolio.value : ({} as any);
  const skillsData = skills.status === "fulfilled" ? skills.value : [];
  const experiencesData =
    experiences.status === "fulfilled" ? experiences.value : [];
  const projectsData = projects.status === "fulfilled" ? projects.value : [];
  const servicesData =
    services.status === "fulfilled" ? services.value : { services: [] };
  const cmsPromptData =
    cmsPrompt.status === "fulfilled" ? cmsPrompt.value : null;

  const systemPrompt =
    cmsPromptData?.systemMessage ||
    buildSystemPrompt(
      aboutData,
      portfolioData,
      skillsData,
      experiencesData,
      projectsData,
      servicesData,
      pathname,
    );

  return { systemPrompt };
}

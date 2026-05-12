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

export async function fetchRagContext(query: string): Promise<string> {
  const engineUrl = import.meta.env.INTEL_ENGINE_URL;
  if (!engineUrl || !query) return "";
  const apiKey = import.meta.env.INTEL_ENGINE_API_KEY;
  try {
    const res = await fetch(
      `${engineUrl}/knowledge/search?q=${encodeURIComponent(query)}&top_k=5`,
      {
        signal: AbortSignal.timeout(3000),
        headers: apiKey ? { "X-API-Key": apiKey } : {},
      },
    );
    if (!res.ok) return "";
    const { results } = await res.json();
    return (results as Array<{ source: string; content: string }>)
      .map((r) => `SOURCE: ${r.source}\n${r.content}`)
      .join("\n\n");
  } catch {
    return "";
  }
}

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

  const dataPrompt = buildSystemPrompt(
    aboutData,
    portfolioData,
    skillsData,
    experiencesData,
    projectsData,
    servicesData,
    pathname,
  );

  // Strapi persona prepends the built data prompt rather than replacing it.
  // This keeps dynamic CMS data (skills, projects, etc.) available to Rin
  // regardless of whether the persona record exists in Strapi.
  const systemPrompt = cmsPromptData?.systemMessage
    ? `${cmsPromptData.systemMessage}\n\n${dataPrompt}`
    : dataPrompt;

  return { systemPrompt };
}

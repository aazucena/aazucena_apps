import type {
  getAbout,
  getSkills,
  getExperiences,
  getProjects,
  getServices,
} from "@aazucena/api";

export function formatAbout(about: Awaited<ReturnType<typeof getAbout>>) {
  return {
    focusAreas:
      about.focusAreas?.map((f: any) => f.title || f).join(", ") || "",
    coreValues:
      about.coreValues?.map((v: any) => v.title || v).join(", ") || "",
    workingStyle:
      about.workingStyle
        ?.map((w: any) => w.title || w.description || w)
        .join(", ") || "",
  };
}

export function formatSkills(
  skills: Awaited<ReturnType<typeof getSkills>>,
): string {
  return skills
    .slice(0, 10)
    .map((s: any) => s.name || s)
    .join(", ");
}

export function formatExperiences(
  experiences: Awaited<ReturnType<typeof getExperiences>>,
): string {
  return experiences
    .map((e: any) => {
      const end = e.isCurrent
        ? "Present"
        : e.endDate
          ? new Date(e.endDate).getFullYear()
          : "";
      const start = e.startDate ? new Date(e.startDate).getFullYear() : "";
      const period = end ? `${start}–${end}` : start;
      const skillNames = (e.skills || [])
        .map((s: any) => s.name)
        .filter(Boolean)
        .join(", ");
      const lines = [
        `**${e.position} at ${e.company}** (${period})${e.location ? ` — ${e.location}` : ""}`,
        e.description ? `  ${e.description}` : "",
        e.responsibilities ? `  Responsibilities: ${e.responsibilities}` : "",
        skillNames ? `  Skills: ${skillNames}` : "",
        e.slug ? `  Page: /experiences/${e.slug}` : "",
      ].filter(Boolean);
      return lines.join("\n");
    })
    .join("\n\n");
}

export function formatProjects(
  projects: Awaited<ReturnType<typeof getProjects>>,
): string {
  return projects
    .slice(0, 5)
    .map((p: any) => {
      const stack = p.techStack?.map((t: any) => t.name || t).join(", ") || "";
      const slug = p.slug ? `  Page: /projects/${p.slug}` : "";
      return `**${p.title}**: ${p.shortDescription || p.description || ""} [${stack}]\n${slug}`;
    })
    .join("\n\n");
}

export function formatServices(
  servicesData: Awaited<ReturnType<typeof getServices>>,
): string {
  return (servicesData.services || [])
    .map((s: any) => {
      const features = (s.features || []).join(", ");
      const price = s.price ? `  Rate: ${s.price}` : "";
      const cta = s.cta ? `  CTA: ${s.cta.label} → ${s.cta.url}` : "";
      const lines = [
        `**${s.title}** [${s.category}]`,
        s.shortDescription ? `  ${s.shortDescription}` : "",
        features ? `  Includes: ${features}` : "",
        price,
        cta,
      ].filter(Boolean);
      return lines.join("\n");
    })
    .join("\n\n");
}

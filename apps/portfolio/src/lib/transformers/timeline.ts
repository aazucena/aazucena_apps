/**
 * Timeline Transformers
 * Converts experience and education into timeline nodes
 */

import type { SkillWithCategory } from "@aazucena/api";
import type { Education } from "@aazucena/types";
import type { Experience } from "@aazucena/types";
import type { TimelineEvent } from "@aazucena/visualizations";
import { calculateMonthsDuration } from "./base";
import { getCompanyLogoGradient } from "@aazucena/utils";

export interface TimelineNode extends TimelineEvent {
  date: Date;
  endDate: Date;
  type: "experience" | "education";
  company?: string;
  position?: string;
  logo?: string;
  logoGradient?: string;
  slug?: string;
  skills?: (string | SkillWithCategory)[];
  institution?: string;
  degree?: string;
  field?: string;
  educationType?: string;
  honors?: string | null;
  gpa?: number | null;
  duration: number;
  isCurrent: boolean;
  title: string;
  subtitle: string;
}

export function transformExperiencesToTimeline(
  experiences: Experience[],
): TimelineNode[] {
  return experiences.map((exp, index) => {
    const startDate = new Date(exp.startDate);
    const validStartDate = !isNaN(startDate.getTime())
      ? startDate
      : new Date(new Date().getFullYear() - index, 0, 1);

    let endDate: Date;
    if (exp.isCurrent) {
      endDate = new Date();
    } else if (exp.endDate) {
      const parsedEndDate = new Date(exp.endDate);
      endDate = !isNaN(parsedEndDate.getTime()) ? parsedEndDate : new Date();
    } else {
      endDate = new Date();
    }

    return {
      id: exp.slug || `exp-${index}`,
      name: exp.position,
      type: "experience",
      date: validStartDate,
      endDate: endDate,
      title: exp.position,
      subtitle: exp.company,
      company: exp.company,
      position: exp.position,
      logo: exp.companyLogo?.url,
      logoGradient: getCompanyLogoGradient(exp.company),
      duration: calculateMonthsDuration(validStartDate, endDate),
      slug: exp.slug,
      isCurrent: exp.isCurrent,
      skills: exp.skills,
    } satisfies TimelineNode;
  });
}

export function transformEducationToTimeline(
  education: Education[],
): TimelineNode[] {
  return education.map((edu, index) => {
    const startDate = new Date(edu.startDate);
    const validStartDate = !isNaN(startDate.getTime())
      ? startDate
      : new Date(new Date().getFullYear() - index - 5, 0, 1);

    let endDate: Date;
    if (edu.current) {
      endDate = new Date();
    } else if (edu.graduationDate) {
      const parsedEndDate = new Date(edu.graduationDate);
      endDate = !isNaN(parsedEndDate.getTime()) ? parsedEndDate : new Date();
    } else {
      endDate = new Date();
    }

    const DEGREE_ICONS: Record<Education["type"], string> = {
      "high-school": "📜",
      diploma: "📜",
      associate: "🎓",
      bachelor: "🎓",
      master: "🎓",
      doctorate: "🎓",
      certificate: "📜",
      bootcamp: "📜",
      "online-course": "📜",
    };

    const degreeIcon: string = DEGREE_ICONS[edu.type] || "🎓";
    const degreeTitle = `${degreeIcon} ${edu.degree}`;

    return {
      id: edu.institution
        ? `edu-${edu.institution.toLowerCase().replace(/\s+/g, "-")}-${index}`
        : `edu-${index}`,
      name: degreeTitle,
      type: "education",
      date: validStartDate,
      endDate: endDate,
      title: degreeTitle,
      subtitle: edu.institution,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      educationType: edu.type,
      gpa: edu.gpa,
      honors: edu.honors || null,
      skills: (edu.skills as SkillWithCategory[]) || [],
      duration: calculateMonthsDuration(validStartDate, endDate),
      isCurrent: edu.current,
    } satisfies TimelineNode;
  });
}

export function transformToTimelineData(
  experiences: Experience[],
  education: Education[] = [],
): TimelineNode[] {
  const experienceNodes = transformExperiencesToTimeline(experiences);
  const educationNodes = transformEducationToTimeline(education);
  return [...experienceNodes, ...educationNodes].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
}

/**
 * Timeline Transformers
 * Converts experience and education into timeline nodes
 */

import type { SkillWithCategory, Education, Experience, TimelineNode } from '@aazucena/types';
import { calculateMonthsDuration } from '../datetime.js';
import { getCompanyLogoGradient } from '../experiences.js';

export function transformExperiencesToTimeline(experiences: Experience[]): TimelineNode[] {
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
      type: 'experience',
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

export function transformEducationToTimeline(education: Education[]): TimelineNode[] {
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

    const DEGREE_ICONS: Record<Education['type'], string> = {
      'high-school': '📜',
      diploma: '📜',
      associate: '🎓',
      bachelor: '🎓',
      master: '🎓',
      doctorate: '🎓',
      certificate: '📜',
      bootcamp: '📜',
      'online-course': '📜',
    };

    const degreeIcon: string = DEGREE_ICONS[edu.type] || '🎓';

    return {
      type: 'education',
      date: validStartDate,
      endDate: endDate,
      title: `${degreeIcon} ${edu.degree}`,
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

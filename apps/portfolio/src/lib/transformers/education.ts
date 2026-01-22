/**
 * Transformer for Education collection type
 * Converts Strapi API response to clean Education type
 */

import type { Education, StrapiEducation } from '../validators/education';
import { transformWebLinks } from './web-link';

/**
 * Transform a single education entry from Strapi format
 */
export function transformEducation(rawEducation: Education): StrapiEducation {
  const achievements = rawEducation.achievements || [];

  // Extract skills with category information
  const skills = rawEducation.skills?.map((skill: any) => {
    // If skill is just a string, return it as-is (fallback)
    if (typeof skill === 'string') return skill;

    // Strapi v5 wraps relations in a 'data' property
    // Try: skill.category.data.label (v5) or skill.category.label (v4)
    const categoryData = skill.category?.data || skill.category;
    const categoryName = categoryData?.label || categoryData?.name || 'Other';

    // Return skill object with name and category
    return {
      name: skill.name,
      category: categoryName,
    };
  }) || [];

  return {
    id: rawEducation.id,
    documentId: rawEducation.documentId,
    type: rawEducation.type || 'bachelor',
    degree: rawEducation.degree || '',
    field: rawEducation.field || '',
    slug: rawEducation.slug || '',
    institution: rawEducation.institution || '',
    institutionLogo: rawEducation.institutionLogo
      ? {
          url: rawEducation.institutionLogo.url || '',
          alternativeText: rawEducation.institutionLogo.alternativeText || null,
          width: rawEducation.institutionLogo.width,
          height: rawEducation.institutionLogo.height,
        }
      : null,
    institutionWebsite: rawEducation.institutionWebsite || null,
    startDate: rawEducation.startDate || '',
    graduationDate: rawEducation.graduationDate || null,
    expectedGraduationDate: rawEducation.expectedGraduationDate || null,
    current: rawEducation.current ?? false,
    location: rawEducation.location || null,
    gpa: rawEducation.gpa ?? null,
    gpaScale: rawEducation.gpaScale ?? 4,
    description: rawEducation.description || null,
    honors: rawEducation.honors || null,
    thesis: rawEducation.thesis || null,
    thesisDescription: rawEducation.thesisDescription || null,
    sort: rawEducation.sort ?? 0,
    achievements: achievements,
    courses: Array.isArray(rawEducation.courses) ? rawEducation.courses : [],
    skills: skills,
    extracurriculars: rawEducation.extracurriculars || null,
    credentialUrl: rawEducation.credentialUrl || null,
    credentialId: rawEducation.credentialId || null,
    featured: rawEducation.featured ?? false,
    display: rawEducation.display || 'standard',
    relatedLinks: transformWebLinks(rawEducation.relatedLinks),
    publishedAt: rawEducation.publishedAt || null,
    createdAt: rawEducation.createdAt,
    updatedAt: rawEducation.updatedAt,
  };
}

/**
 * Transform an array of education entries
 */
export function transformEducationList(rawEducation: Education[]): StrapiEducation[] {
  if (!Array.isArray(rawEducation)) {
    return [];
  }

  return rawEducation
    .map(transformEducation)
    .sort((a, b) => {
      // Sort by sort field first, then by startDate (most recent first)
      if (a.sort !== b.sort) {
        return b.sort - a.sort;
      }
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
}

import type { StrapiEducation } from '@aazucena/types';
import { transformWebLink as utilTransformWebLink, getMediaUrl } from '@aazucena/utils';
import type { Education, Achievement } from '@aazucena/types';

export function transformEducation(data: StrapiEducation): Education {
  const skills = (data.skills || []).map((skill: any) => ({
    name: skill.name,
    category: skill.category?.label || skill.category?.name || 'Other',
  }));

  return {
    id: data.id,
    slug: data.slug,
    type: data.type,
    degree: data.degree,
    field: data.field,
    institution: data.institution,
    institutionLogoUrl: getMediaUrl(data.institutionLogo),
    startDate: data.startDate,
    graduationDate: data.graduationDate || undefined,
    current: !!data.current,
    location: data.location || undefined,
    gpa: data.gpa || undefined,
    description: data.description || undefined,
    achievements: (data.achievements || []) as Achievement[],
    skills,
    relatedLinks: (data.relatedLinks || []).map(utilTransformWebLink),
  };
}

export function transformEducationList(items: StrapiEducation[]): Education[] {
  if (!items || items.length === 0) return [];

  return items
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .map(transformEducation);
}

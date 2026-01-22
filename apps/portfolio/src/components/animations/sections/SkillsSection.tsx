/**
 * SkillsSection Component
 * Skills and technologies with tabbed interface
 */

import { PhoneDialTabs } from '@/components/ui/phone-dial-tabs';
import type { JSX } from 'react';
import { useAnimation, useSectionData } from '../contexts';
import { getBadgeClasses } from '../utilities/colors';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';
import { IconRenderer } from '~/components/blocks/IconRenderer';

export interface SkillsSectionProps extends SectionProps {}

export function SkillsSection({ title = 'Skills & Technologies', subtitle = 'Tools I Use to Build Great Products' }: SkillsSectionProps): JSX.Element {
  const { skills: data } = useSectionData();
  const { isSoundMuted } = useAnimation();
  const tabs = data.map(category => ({
    id: category.id,
    label: category.label,
    gradient: category.gradient,
    icon: (<IconRenderer icon={category.icon} />),
    content: (
      <div className="flex flex-wrap gap-3 justify-center">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className={getBadgeClasses(category.gradient)}
          >
            {skill}
          </span>
        ))}
      </div>
    )
  }));

  return (
    <div className="w-full">
      <SectionLayout
        title={title}
        subtitle={subtitle}
        contentWidth="medium"
      >
        <PhoneDialTabs
          tabs={tabs}
          defaultTab="frontend"
          isSoundMuted={isSoundMuted}
        />
      </SectionLayout>
    </div>
  );
}

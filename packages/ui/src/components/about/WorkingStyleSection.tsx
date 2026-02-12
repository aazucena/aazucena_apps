import React from 'react';
import { Users } from '@aazucena/icons';
import { InteractiveCard } from '../misc/InteractiveCard.js';
import { IconRenderer } from '../blocks/IconRenderer.js';
import { cn } from '@aazucena/utils';
import type { WorkingStyleItem } from '@aazucena/types';
import { WORKING_STYLE_FALLBACKS } from '@aazucena/constants';

export interface WorkingStyleSectionProps {
  workingStyle?: WorkingStyleItem[];
  className?: string;
  variantColors?: Record<string, string>;
}

// Map string icon to React component
const getIconComponent = (iconString?: string | unknown) => {
  if (!iconString) return Users;
  if (typeof iconString === 'function') return iconString;

  if (typeof iconString === 'string' && iconString.includes('<svg')) {
    return ({ size }: { size: number }) => <IconRenderer icon={iconString} size={size} />;
  }

  return Users;
};

export function WorkingStyleSection({
  workingStyle,
  className,
  variantColors = {},
}: WorkingStyleSectionProps) {
  const items =
    workingStyle && workingStyle.length > 0
      ? workingStyle.map((style) => ({
          title: style.title,
          subtitle: style.subtitle,
          description: style.description,
          icon: getIconComponent(style.icon),
          color:
            variantColors[style.variant || 'blue-cyan'] ||
            'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
        }))
      : WORKING_STYLE_FALLBACKS.map((f) => ({
          ...f,
          icon: getIconComponent(f.iconId),
        }));

  return (
    <div className={cn('grid grid-cols-1 gap-4', className)}>
      {items.map((style, index) => (
        <InteractiveCard
          key={index}
          title={style.title}
          subtitle={style.subtitle}
          description={style.description}
          icon={style.icon as any}
          color={style.color}
        />
      ))}
    </div>
  );
}

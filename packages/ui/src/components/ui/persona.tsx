'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Robot, User } from '@aazucena/icons'; // Assuming these icons are available
import { Avatar, AvatarFallback, AvatarImage } from './avatar'; // Assuming Avatar components are available

const personaVariants = cva(
  'flex flex-col gap-3 rounded-md border p-4 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface PersonaProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof personaVariants> {
  name: string;
  description?: string;
  avatarSrc?: string;
  icon?: React.ElementType;
}

const Persona = React.forwardRef<HTMLDivElement, PersonaProps>(
  ({ className, variant, name, description, avatarSrc, icon: CustomIcon, ...props }, ref) => {
    const PersonaIcon = CustomIcon as React.ComponentType<{ className?: string }> | undefined;
    return (
      <div ref={ref} className={cn(personaVariants({ variant }), className)} {...props}>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarSrc} alt={`${name} avatar`} />
            <AvatarFallback className="text-lg font-semibold">
              {PersonaIcon ? <PersonaIcon className="h-6 w-6" /> : <Robot className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h4 className="font-semibold">{name}</h4>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
        </div>
      </div>
    );
  },
);
Persona.displayName = 'Persona';

export { Persona, personaVariants };

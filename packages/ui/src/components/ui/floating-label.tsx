'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const floatingLabelVariants = cva('relative', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const inputClasses: Record<string, Record<string, string>> = {
  variant: {
    default:
      'border-input bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-ring',
    glass: 'glass-m border-white/10 text-foreground focus:border-white/30',
    cyber:
      'border-cyan-500/30 bg-black/50 text-cyan-50 font-mono focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
  },
  size: {
    sm: 'h-8 pt-3 px-2 text-xs',
    md: 'h-10 pt-4 px-3 text-sm',
    lg: 'h-12 pt-5 px-4 text-base',
  },
};

const labelClasses: Record<string, Record<string, string>> = {
  variant: {
    default: 'text-muted-foreground peer-focus:text-primary',
    glass: 'text-foreground/50 peer-focus:text-foreground/80',
    cyber: 'text-cyan-500/50 peer-focus:text-cyan-400 font-mono',
  },
  size: {
    sm: 'left-2 text-xs peer-focus:text-[9px] peer-[:not(:placeholder-shown)]:text-[9px] peer-focus:top-0.5 peer-[:not(:placeholder-shown)]:top-0.5 top-1.5',
    md: 'left-3 text-sm peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-focus:top-1 peer-[:not(:placeholder-shown)]:top-1 top-2.5',
    lg: 'left-4 text-base peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs peer-focus:top-1 peer-[:not(:placeholder-shown)]:top-1 top-3',
  },
};

export interface FloatingLabelProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof floatingLabelVariants> {
  label: string;
  multiline?: boolean;
  rows?: number;
}

const FloatingLabel = React.forwardRef<HTMLInputElement, FloatingLabelProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      label,
      multiline,
      rows = 3,
      id: providedId,
      ...props
    },
    ref,
  ) => {
    const autoId = React.useId();
    const id = providedId ?? autoId;
    const v = variant ?? 'default';
    const s = size ?? 'md';

    const fieldCn = cn(
      'peer w-full rounded-md border outline-none transition-all',
      inputClasses.variant?.[v],
      inputClasses.size?.[s],
      className,
    );

    const labelCn = cn(
      'pointer-events-none absolute transition-all duration-200',
      labelClasses.variant?.[v],
      labelClasses.size?.[s],
    );

    return (
      <div className={cn(floatingLabelVariants({ variant, size }))}>
        {multiline ? (
          <textarea
            id={id}
            ref={ref as unknown as React.Ref<HTMLTextAreaElement>}
            placeholder=" "
            rows={rows}
            className={cn(fieldCn, 'resize-none pt-6')}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id}
            ref={ref}
            placeholder=" "
            className={fieldCn}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        <label htmlFor={id} className={labelCn}>
          {label}
        </label>
      </div>
    );
  },
);
FloatingLabel.displayName = 'FloatingLabel';

export { FloatingLabel, floatingLabelVariants };

import React, { forwardRef, useRef } from 'react';
import { cn } from '@aazucena/utils';
import { useRadialGauge } from '../hooks/useRadialGauge.js';

export interface RadialGaugeProps extends React.SVGAttributes<SVGSVGElement> {
  /** Current value (0 to max) */
  value: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Label shown in the center */
  label?: string;
  /** Color of the active arc */
  color?: string;
  /** Size of the gauge */
  size?: number;
  /** Thickness of the ring */
  thickness?: number;
}

export const RadialGauge = forwardRef<SVGSVGElement, RadialGaugeProps>(
  (
    {
      value,
      max = 100,
      label,
      color = 'var(--color-primary, #3b82f6)',
      size = 200,
      thickness = 20,
      className,
      ...props
    },
    ref,
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const percentage = Math.min(Math.max(value / max, 0), 1);

    useRadialGauge(svgRef, {
      size,
      thickness,
      percentage,
      color,
      label,
    });

    return (
      <svg
        ref={(node) => {
          // Handle both refs
          (svgRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        width={size}
        height={size}
        className={cn('text-foreground transition-all', className)}
        {...props}
      />
    );
  },
);

RadialGauge.displayName = 'RadialGauge';

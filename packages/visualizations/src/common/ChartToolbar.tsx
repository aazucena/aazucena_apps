/**
 * Chart Toolbar Component
 * Wrapper for standard chart interaction tools
 */

import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@aazucena/utils';
import { ChartExportControl } from './ChartExportControl.js';

export interface ChartToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Reference to the SVG for exporting */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /** Data for CSV export */
  data?: any[];
  /** Filename for exports */
  fileName?: string;
  /** Children (custom control buttons) */
  children?: React.ReactNode;
  /** Whether to render as a child slot */
  asChild?: boolean;
}

export const ChartToolbar = forwardRef<HTMLDivElement, ChartToolbarProps>(
  ({ svgRef, data, fileName, children, className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp ref={ref} className={cn('flex items-center gap-2 p-1', className)} {...props}>
        <div className="flex items-center gap-1">{children}</div>

        <div className="h-4 w-px bg-border/50 mx-1" />

        <ChartExportControl svgRef={svgRef} data={data} fileName={fileName} />
      </Comp>
    );
  },
);

ChartToolbar.displayName = 'ChartToolbar';

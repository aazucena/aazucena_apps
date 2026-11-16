/**
 * Export Controls Component
 * Small overlay with download options for visualizations
 */

import React, { useState, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { downloadSVG, downloadPNG, downloadCSV, cn } from '@aazucena/utils';
import { Download, Image, Vector, File } from '@aazucena/icons';
import { chartControl } from '../theme';

const menuItemClass =
  'flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-(--foreground) hover:bg-(--state) focus-visible:bg-(--state) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--signal)';

export interface ChartExportControlProps extends React.HTMLAttributes<HTMLDivElement> {
  svgRef: React.RefObject<SVGSVGElement | null>;
  data?: any[];
  fileName?: string;
  asChild?: boolean;
}

export const ChartExportControl = forwardRef<HTMLDivElement, ChartExportControlProps>(
  (
    { svgRef, data, fileName = 'visualization', className = '', asChild = false, ...props },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const Comp = asChild ? Slot : 'div';

    const handleDownloadSVG = () => {
      if (svgRef.current) {
        downloadSVG(svgRef.current, fileName);
        setIsOpen(false);
      }
    };

    const handleDownloadPNG = () => {
      if (svgRef.current) {
        downloadPNG(svgRef.current, fileName);
        setIsOpen(false);
      }
    };

    const handleDownloadCSV = () => {
      if (data) {
        downloadCSV(data, fileName);
        setIsOpen(false);
      }
    };

    return (
      <Comp
        ref={ref}
        className={cn('relative', className)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Escape') setIsOpen(false);
        }}
        {...props}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className={cn(chartControl, 'border border-(--rule) px-2.5')}
          title="Export visualization"
        >
          <Download size={14} aria-hidden="true" />
          Export
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              role="presentation"
            />
            <div className="absolute right-0 z-20 mt-1 w-48 rounded-[var(--radius-control,4px)] border border-(--rule) bg-(--panel-raised) py-1">
              <button type="button" onClick={handleDownloadPNG} className={menuItemClass}>
                <Image size={14} aria-hidden="true" />
                Download as PNG
              </button>
              <button type="button" onClick={handleDownloadSVG} className={menuItemClass}>
                <Vector size={14} aria-hidden="true" />
                Download as SVG
              </button>
              {data && (
                <button type="button" onClick={handleDownloadCSV} className={menuItemClass}>
                  <File size={14} aria-hidden="true" />
                  Download Data (CSV)
                </button>
              )}
            </div>
          </>
        )}
      </Comp>
    );
  },
);

ChartExportControl.displayName = 'ChartExportControl';

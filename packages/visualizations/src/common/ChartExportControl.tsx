/**
 * Export Controls Component
 * Small overlay with download options for visualizations
 */

import React, { useState, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { downloadSVG, downloadPNG, downloadCSV, cn } from '@aazucena/utils';
import { Download, Image, Vector, File } from '@aazucena/icons';

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
      <Comp ref={ref} className={cn('relative', className)} {...props}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-all shadow-sm"
          title="Export Visualization"
        >
          <Download size={14} strokeWidth={2.5} />
          Export
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              role="presentation"
            />
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-700 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={handleDownloadPNG}
                className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2 transition-colors"
              >
                <Image size={14} />
                Download as PNG
              </button>
              <button
                onClick={handleDownloadSVG}
                className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2 transition-colors"
              >
                <Vector size={14} />
                Download as SVG
              </button>
              {data && (
                <button
                  onClick={handleDownloadCSV}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2 transition-colors"
                >
                  <File size={14} />
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

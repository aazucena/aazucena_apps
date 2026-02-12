/**
 * Export Controls Component
 * Small overlay with download options for visualizations
 */

import React, { useState } from 'react';
import { downloadSVG, downloadPNG } from '@aazucena/utils';
import { DownloadIcon, ImageIcon, VectorIcon } from '@aazucena/icons';

interface ExportControlsProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  fileName?: string;
  className?: string;
}

export function ExportControls({
  svgRef,
  fileName = 'visualization',
  className = '',
}: ExportControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm"
        title="Export Visualization"
      >
        <DownloadIcon size={14} strokeWidth={2.5} />
        Export
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            role="presentation"
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={handleDownloadPNG}
              className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              <ImageIcon size={14} />
              Download as PNG
            </button>
            <button
              onClick={handleDownloadSVG}
              className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              <VectorIcon size={14} />
              Download as SVG
            </button>
          </div>
        </>
      )}
    </div>
  );
}

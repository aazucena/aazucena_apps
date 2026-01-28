/**
 * Export Controls Component
 * Small overlay with download options for visualizations
 */

import React, { useState } from 'react';
import { downloadSVG, downloadPNG } from '@/lib/utils';

interface ExportControlsProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  fileName?: string;
  className?: string;
}

export function ExportControls({ svgRef, fileName = 'journey-visualization', className = '' }: ExportControlsProps) {
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
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={handleDownloadPNG}
              className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Download as PNG
            </button>
            <button
              onClick={handleDownloadSVG}
              className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              Download as SVG
            </button>
          </div>
        </>
      )}
    </div>
  );
}

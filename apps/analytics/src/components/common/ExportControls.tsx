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

export function ExportControls({
  svgRef,
  fileName = 'journey-visualization',
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
        className="micro-label flex h-control-sm items-center gap-2 rounded-control border border-rule bg-panel px-3 text-muted-foreground hover:bg-state hover:text-foreground"
        title="Export Visualization"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-card border border-rule-strong bg-panel-raised py-1">
            <button
              onClick={handleDownloadPNG}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-foreground hover:bg-state"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Download as PNG
            </button>
            <button
              onClick={handleDownloadSVG}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-foreground hover:bg-state"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              Download as SVG
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Export Controls Component
 * Small overlay with download options for visualizations
 */

import React from "react";
import { downloadSVG, downloadPNG } from "@aazucena/utils";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@aazucena/ui";

interface ExportControlsProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  fileName?: string;
  className?: string;
}

export function ExportControls({
  svgRef,
  fileName = "journey-visualization",
  className = "",
}: ExportControlsProps) {
  const handleDownloadSVG = () => {
    if (svgRef.current) downloadSVG(svgRef.current, fileName);
  };

  const handleDownloadPNG = () => {
    if (svgRef.current) downloadPNG(svgRef.current, fileName);
  };

  return (
    <div className={`relative ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" title="Export visualization">
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
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleDownloadPNG}>
            Download as PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadSVG}>
            Download as SVG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

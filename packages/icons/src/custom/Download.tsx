import React from 'react';

interface DownloadProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

export const Download = React.forwardRef<SVGSVGElement, DownloadProps>(
  ({ size = 24, strokeWidth = 2.5, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path key="base" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline key="arrow" points="7 10 12 15 17 10" />
      <line key="stem" x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
);

Download.displayName = 'DownloadAlt';

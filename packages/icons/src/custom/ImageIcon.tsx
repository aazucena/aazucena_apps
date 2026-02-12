import React from 'react';
import type { JSX } from 'react';
import type { MynaIconsProps as IconProps } from '@mynaui/icons-react';

export const ImageIcon = ({
  size = 24,
  className = '',
  stroke = 2,
  ...props
}: IconProps): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

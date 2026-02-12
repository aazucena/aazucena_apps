import React from 'react';
import type { JSX } from 'react';
import type { MynaIconsProps as IconProps } from '@mynaui/icons-react';

export const VectorIcon = ({
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
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

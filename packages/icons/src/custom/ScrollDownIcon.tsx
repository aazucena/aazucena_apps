import React from 'react';
import type { MynaIconsProps } from '../types.js';

export const ScrollDownIcon = ({
  size = 24,
  className = '',
  color = 'currentColor',
  stroke = '2',
}: MynaIconsProps) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="absolute top-0 left-0 opacity-70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13L12 18L17 13"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="absolute top-2 left-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13L12 18L17 13"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

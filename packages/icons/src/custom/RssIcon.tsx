import type { MynaIconsProps as IconProps } from '@mynaui/icons-react';

export const RssIcon = ({ size = 24, stroke, className = '', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    strokeWidth={stroke}
    {...props}
  >
    <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-8.18v4.831c10.555.062 19.121 8.505 19.183 19.001h4.817c-.062-13.209-7.118-23.77-24-23.832z" />
  </svg>
);

import type { JSX } from 'react';
import type { MynaIconsProps as IconProps } from '@mynaui/icons-react';

export const ViewportsIcon = ({
  size = 24,
  className = '',
  stroke,
  ...props
}: IconProps): JSX.Element => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      strokeWidth={stroke}
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path
          d="M1.5 5.2h4.8c.3 0 .5.2.5.4v5.1c-.1.2-.3.3-.4.3H1.4a.5.5 0 01-.5-.4V5.7c0-.3.2-.5.5-.5zm0-2.1h6.9c.3 0 .5.2.5.4v7a.5.5 0 01-1 0V4H1.5a.5.5 0 010-1zm0-2.1h9c.3 0 .5.2.5.4v9.1a.5.5 0 01-1 0V2H1.5a.5.5 0 010-1zm4.3 5.2H2V10h3.8V6.2z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

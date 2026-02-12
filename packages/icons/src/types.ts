import type { SVGProps } from 'react';

export interface MynaIconsProps extends Omit<SVGProps<SVGSVGElement>, 'stroke'> {
  size?: number | string;
  stroke?: number | string;
  color?: string;
  className?: string;
}

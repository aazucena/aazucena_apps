import { createReactComponent } from '@mynaui/icons-react';

export const Image = createReactComponent('image-alt', 'ImageAlt', [
  [
    'rect',
    {
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      x: '3',
      y: '3',
      width: '18',
      height: '18',
      rx: '2',
      ry: '2',
    },
  ],
  [
    'circle',
    {
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      cx: '8.5',
      cy: '8.5',
      r: '1.5',
    },
  ],
  [
    'polyline',
    {
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      points: '21 15 16 10 5 21',
    },
  ],
]);

import { createReactComponent } from '@mynaui/icons-react';

export const Vector = createReactComponent('vector', 'Vector', [
  [
    'polygon',
    {
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      points: '12 2 2 7 12 12 22 7 12 2',
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
      points: '2 17 12 22 22 17',
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
      points: '2 12 12 17 22 12',
    },
  ],
]);

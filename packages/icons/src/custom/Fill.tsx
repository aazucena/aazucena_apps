import { createReactComponent } from '@mynaui/icons-react';

/**
 * Fill Icon (Outline)
 */
export const Fill = createReactComponent('fill', 'Fill', [
  [
    'path',
    {
      d: 'M12 22c4.42 0 8-3.58 8-8 0-4.42-8-12-8-12s-8 7.58-8 12c0 4.42 3.58 8 8 8z',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
  ],
  [
    'path',
    {
      d: 'M12 22v-8',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
  ],
]);

/**
 * Fill Icon (Solid)
 */
export const FillSolid = createReactComponent('fill-solid', 'FillSolid', [
  [
    'path',
    {
      d: 'M12 2s-8 7.58-8 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-8-12-8-12z',
      fill: 'currentColor',
    },
  ],
]);

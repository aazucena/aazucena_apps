import { createReactComponent } from '@mynaui/icons-react';

/**
 * Eraser Icon (Outline)
 */
export const Eraser = createReactComponent('eraser', 'Eraser', [
  [
    'path',
    {
      d: 'M20 20H7L3 16c-1.1-1.1-1.1-2.9 0-4l9-9c1.1-1.1 2.9-1.1 4 0l5 5c1.1 1.1 1.1 2.9 0 4l-5 5',
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
      d: 'M18 13l-5-5',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
  ],
]);

/**
 * Eraser Icon (Solid)
 */
export const EraserSolid = createReactComponent('eraser-solid', 'EraserSolid', [
  [
    'path',
    {
      d: 'M20 18H7.4l-4.7-4.7c-1-1-1-2.6 0-3.5l9.2-9.2c1-1 2.6-1 3.5 0l5.3 5.3c1 1 1 2.6 0 3.5L15.4 14.7 20 18z',
      fill: 'currentColor',
    },
  ],
]);

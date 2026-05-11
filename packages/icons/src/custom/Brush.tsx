import { createReactComponent } from '@mynaui/icons-react';

/**
 * Brush Icon (Outline)
 */
export const Brush = createReactComponent('brush', 'Brush', [
  [
    'path',
    {
      d: 'M6 21c.3-2 1.5-3.5 3-4.5 1.5-1 3.5-1.5 5.5-1.5 2 0 4 .5 5.5 1.5 1.5 1 2.7 2.5 3 4.5',
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
      d: 'M14 15V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v12',
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
      d: 'M6 11h8M10 1v14',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
  ],
]);

/**
 * Brush Icon (Solid)
 */
export const BrushSolid = createReactComponent('brush-solid', 'BrushSolid', [
  [
    'path',
    {
      d: 'M14 15V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v12h8zM6 21c.3-2 1.5-3.5 3-4.5 1.5-1 3.5-1.5 5.5-1.5 2 0 4 .5 5.5 1.5 1.5 1 2.7 2.5 3 4.5H6z',
      fill: 'currentColor',
    },
  ],
]);

import { createReactComponent } from '@mynaui/icons-react';

/**
 * Type Icon (Outline)
 * Stylized "T" representing typography or text.
 */
export const Type = createReactComponent('type', 'Type', [
  [
    'path',
    {
      d: 'M4 7V4h16v3M9 20h6M12 4v16',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
  ],
]);

/**
 * Type Icon (Solid)
 */
export const TypeSolid = createReactComponent('type-solid', 'TypeSolid', [
  [
    'path',
    {
      d: 'M5 3a1 1 0 0 0 0 2h6v14H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2V5h6a1 1 0 1 0 0-2H5z',
      fill: 'currentColor',
    },
  ],
]);

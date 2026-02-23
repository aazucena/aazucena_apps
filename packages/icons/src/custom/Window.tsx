import { createReactComponent } from '@mynaui/icons-react';

/**
 * Window Icon (Outline)
 */
export const Window = createReactComponent('window', 'Window', [
  [
    'path',
    {
      d: 'M3 9h18M9 6v3m-3-3v3M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
  ],
]);

/**
 * Window Icon (Solid)
 */
export const WindowSolid = createReactComponent('window-solid', 'WindowSolid', [
  [
    'path',
    {
      d: 'M5 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H5zm0 2h14a1 1 0 0 1 1 1v2H4V6a1 1 0 0 1 1-1z',
      fill: 'currentColor',
    },
  ],
]);

import { createReactComponent } from '@mynaui/icons-react';

/**
 * DotGrid Icon — 2×3 dot grid for section navigation
 */
export const DotGrid = createReactComponent('dot-grid', 'DotGrid', [
  ['circle', { key: 'tl', cx: '7', cy: '4', r: '2.25', fill: 'currentColor' }],
  ['circle', { key: 'tr', cx: '17', cy: '4', r: '2.25', fill: 'currentColor' }],
  ['circle', { key: 'ml', cx: '7', cy: '12', r: '2.25', fill: 'currentColor' }],
  ['circle', { key: 'mr', cx: '17', cy: '12', r: '2.25', fill: 'currentColor' }],
  ['circle', { key: 'bl', cx: '7', cy: '20', r: '2.25', fill: 'currentColor' }],
  ['circle', { key: 'br', cx: '17', cy: '20', r: '2.25', fill: 'currentColor' }],
]);

/**
 * Writes the committed CSS subsets for apps that don't load the full css-vars.css
 * (tests keep both current):
 * - packages/ui/src/styles/structure.css: vibe-independent tokens ui components read through var()
 * - packages/visualizations/src/chart.css: the color roles chartTheme references
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateChartCss, generateStructuralCss } from '../src/utils/generate-css';

const here = dirname(fileURLToPath(import.meta.url));
for (const [file, css] of [
  ['../../ui/src/styles/structure.css', generateStructuralCss()],
  ['../../visualizations/src/chart.css', generateChartCss()],
] as const) {
  const target = join(here, file);
  writeFileSync(target, css);
  console.log(`Wrote ${target}`);
}

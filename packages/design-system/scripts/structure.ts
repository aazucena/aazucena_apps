/**
 * Writes the vibe-independent tokens ui components read through var() to
 * packages/ui/src/styles/structure.css (committed; a test keeps it current).
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateStructuralCss } from '../src/utils/generate-css';

const target = join(dirname(fileURLToPath(import.meta.url)), '../../ui/src/styles/structure.css');
writeFileSync(target, generateStructuralCss());
console.log(`Wrote ${target}`);

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['scripts/cli.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  shims: true,
  // Mark native modules and dependencies as external
  external: ['sharp', 'png-to-ico', '@clack/prompts', 'picocolors', 'culori'],
  // Don't bundle node_modules
  noExternal: [],
});

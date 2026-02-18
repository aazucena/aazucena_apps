#!/usr/bin/env node
/* eslint-disable no-console */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname, isAbsolute, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as p from '@clack/prompts';
import color from 'picocolors';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { formatHex, parse } from 'culori';

// Import our internal generators and data
import { generateCssVariables } from '../src/utils/generate-css.js';
import { generateFigmaTokens } from '../src/utils/generate-figma.js';
import { vibes, getThemeConfig } from '../src/themes/registry.js';
import * as assets from '../src/assets/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Display CLI help information
 */
function displayHelp() {
  console.log('');
  console.log(color.bgCyan(color.black(' AZDS - Azucena Design System CLI ')));
  console.log('');
  console.log(color.bold('USAGE'));
  console.log(
    '  azds                                       ' +
      color.dim('# Interactive mode (after install)'),
  );
  console.log(
    '  pnpm ds                                    ' + color.dim('# Interactive mode (dev)'),
  );
  console.log('  pnpm ds:sync                               ' + color.dim('# Sync everything'));
  console.log('  pnpm ds:css                                ' + color.dim('# Generate CSS only'));
  console.log('  pnpm ds:figma                              ' + color.dim('# Generate Figma only'));
  console.log('  azds <action> <vibe> <asset> <output>      ' + color.dim('# Non-interactive'));
  console.log('');
  console.log(color.bold('ACTIONS'));
  console.log('  ' + color.cyan('all') + '       Sync everything (CSS + Figma + Favicons)');
  console.log('  ' + color.cyan('tokens') + '    Sync all tokens (CSS + Figma)');
  console.log('  ' + color.cyan('css') + '       Generate CSS variables only');
  console.log('  ' + color.cyan('figma') + '     Generate Figma design tokens only');
  console.log('  ' + color.cyan('favicons') + '  Generate favicons and logos only');
  console.log('');
  console.log(color.bold('VIBES (THEMES)'));
  console.log('  ' + color.green('default') + '     Clean, professional (recommended)');
  console.log('  ' + color.magenta('cyberpunk') + '   Neon pink and cyan');
  console.log('  ' + color.cyan('glass') + '       Glassmorphism with blur');
  console.log('  ' + color.gray('minimal') + '     Monochrome minimalist');
  console.log('  ' + color.yellow('nature') + '      Earth tones');
  console.log('  ' + color.dim('...and 13 more (seasonal, special)'));
  console.log('');
  console.log(color.bold('ASSET KEYS'));
  console.log('  FAVICON_MAIN    Brand Blue (primary color)');
  console.log('  FAVICON_ALT     Clean White (neutral)');
  console.log('');
  console.log(color.bold('EXAMPLES'));
  console.log('  ' + color.dim('# Interactive mode (recommended)'));
  console.log('  azds');
  console.log('');
  console.log('  ' + color.dim('# Quick CSS regeneration after theme changes'));
  console.log('  azds css');
  console.log('  ' + color.dim('# or during development:'));
  console.log('  pnpm ds:css');
  console.log('');
  console.log('  ' + color.dim('# Generate cyberpunk theme CSS'));
  console.log('  azds css cyberpunk FAVICON_MAIN ./dist');
  console.log('');
  console.log('  ' + color.dim('# Full sync with Halloween theme'));
  console.log('  azds all halloween FAVICON_ALT ./dist');
  console.log('');
  console.log(color.bold('OUTPUT'));
  console.log('  dist/css-vars.css         ' + color.dim('CSS custom properties (33KB)'));
  console.log('  figma.json                ' + color.dim('Figma design tokens (DTCG format)'));
  console.log('  dist/favicons/*           ' + color.dim('Favicon suite + manifest'));
  console.log('  dist/logo*.svg            ' + color.dim('Brand logos'));
  console.log('');
  console.log(color.bold('FLAGS'));
  console.log('  -h, --help                Show this help message');
  console.log('  -v, --version             Show version information');
  console.log('');
  console.log(
    color.dim('For detailed documentation, see: packages/design-system/docs/cli-usage.md'),
  );
  console.log('');
}

/**
 * Helper to ensure colors are in Hex for the manifest
 */
function toHex(colorStr: string): string {
  const parsed = parse(colorStr);
  return parsed ? formatHex(parsed) : '#000000';
}

/**
 * 1a. Logic for Syncing CSS Tokens Only
 */
async function syncCssTokens(vibeId: string, outputDir: string) {
  const s = p.spinner();
  s.start(`Generating CSS variables for vibe: ${vibeId}`);

  try {
    const css = generateCssVariables(vibeId);
    const cssPath = join(outputDir, 'css-vars.css');
    writeFileSync(cssPath, css);

    s.stop(`CSS variables synced successfully to ${color.dim(cssPath)}`);
  } catch (error) {
    s.stop('Failed to generate CSS');
    throw error;
  }
}

/**
 * 1b. Logic for Syncing Figma Tokens Only
 */
async function syncFigmaTokens() {
  const s = p.spinner();
  s.start('Generating Figma design tokens');

  try {
    const figma = generateFigmaTokens();
    const figmaPath = join(__dirname, '../figma.json');
    writeFileSync(figmaPath, figma);

    s.stop(`Figma tokens synced successfully to ${color.dim(figmaPath)}`);
  } catch (error) {
    s.stop('Failed to generate Figma tokens');
    throw error;
  }
}

/**
 * 1c. Logic for Syncing All Tokens (CSS + Figma)
 */
async function syncTokens(vibeId: string, outputDir: string) {
  await syncCssTokens(vibeId, outputDir);
  await syncFigmaTokens();
}

/**
 * 2. Logic for Generating Favicons
 */
async function generateFavicons(assetKey: string, outputDir: string, vibeId: string = 'default') {
  const s = p.spinner();
  s.start(`Generating favicons from ${assetKey} [Vibe: ${vibeId}]`);

  try {
    const theme = getThemeConfig(vibeId, 'dark'); // Use dark mode for manifest
    const SVG_SOURCE = assets[assetKey as keyof typeof assets];
    if (!SVG_SOURCE) throw new Error(`Asset ${assetKey} not found`);

    const svgBuffer = Buffer.from(SVG_SOURCE);
    const favDir = join(outputDir, 'favicons');

    mkdirSync(favDir, { recursive: true });

    // 1. Favicon Suite
    writeFileSync(join(favDir, 'favicon.svg'), SVG_SOURCE);

    // 2. Pure Brand Logos (Output to root of destination)
    writeFileSync(join(outputDir, 'logo.svg'), assets.LOGO_MAIN);
    writeFileSync(join(outputDir, 'logo-alt.svg'), assets.LOGO_ALT);
    console.log(`✅ Generated brand logos in ${color.dim(outputDir)}`);

    // 3. PNGs
    const sizes = [
      { name: 'favicon-16x16.png', size: 16 },
      { name: 'favicon-32x32.png', size: 32 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'android-chrome-192x192.png', size: 192 },
      { name: 'android-chrome-512x512.png', size: 512 },
    ];

    const icoBuffers: Buffer[] = [];

    for (const { name, size } of sizes) {
      const buffer = await sharp(svgBuffer).resize(size, size).png().toBuffer();
      writeFileSync(join(favDir, name), buffer);
      if (size === 16 || size === 32) icoBuffers.push(buffer);
    }

    // 3. ICO
    const icoBuffer = await pngToIco(icoBuffers);
    writeFileSync(join(favDir, 'favicon.ico'), icoBuffer);

    // 4. Manifest - Standardized to HEX for broad compatibility
    const manifest = {
      name: assets.BRAND_NAME,
      short_name: assets.BRAND_NAME,
      icons: [
        {
          src: '/favicons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/favicons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      theme_color: toHex(theme.colors.primary),
      background_color: toHex(theme.colors.background),
      display: 'standalone',
    };
    writeFileSync(join(favDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));

    s.stop(`Favicons generated successfully in ${color.dim(favDir)}`);
  } catch (error) {
    s.stop('Failed to generate favicons');
    throw error;
  }
}

/**
 * Main CLI Wizard
 */
async function main() {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('-h') || args.includes('--help') || args[0] === 'help') {
    displayHelp();
    return;
  }

  // Check for version flag
  if (args.includes('-v') || args.includes('--version')) {
    const pkg = await import('../package.json', { assert: { type: 'json' } });
    console.log(color.cyan(`azds (Azucena Design System) v${pkg.default.version}`));
    return;
  }

  // Non-interactive mode
  if (args.length >= 4) {
    const [action, vibeId, assetKey, destination] = args;

    if (!destination || !vibeId || !assetKey) {
      console.error(
        color.red(
          '❌ Error: vibeId, assetKey, and destination are required for non-interactive mode.',
        ),
      );
      process.exit(1);
    }

    const resolvedPath = isAbsolute(destination)
      ? destination
      : resolve(process.cwd(), destination);

    console.log(color.cyan('🚀 Design System CLI (Non-Interactive)'));

    if (action === 'all' || action === 'tokens') {
      await syncTokens(vibeId, resolvedPath);
    } else if (action === 'css') {
      await syncCssTokens(vibeId, resolvedPath);
    } else if (action === 'figma') {
      await syncFigmaTokens();
    }

    if (action === 'all' || action === 'favicons') {
      await generateFavicons(assetKey, resolvedPath, vibeId);
    }
    console.log(color.green('✨ Done!'));
    return;
  }

  // Interactive mode
  console.log('');
  p.intro(color.bgCyan(color.black(' AAZUCENA DESIGN SYSTEM ')));

  const action = await p.select({
    message: 'What would you like to do?',
    options: [
      {
        value: 'all',
        label: '🚀 Sync Everything (Tokens + Favicons)',
        hint: 'Recommended',
      },
      { value: 'tokens', label: '🎨 Sync All Tokens', hint: 'CSS & Figma' },
      { value: 'css', label: '📄 Generate CSS Only', hint: 'css-vars.css' },
      { value: 'figma', label: '🎭 Generate Figma Only', hint: 'figma.json' },
      { value: 'favicons', label: '🖼️  Generate Favicons Only' },
    ],
  });

  if (p.isCancel(action)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  let vibeId = 'default';
  // Only ask for vibe if we're generating CSS (which is theme-specific)
  if (action === 'all' || action === 'tokens' || action === 'css' || action === 'favicons') {
    const vibeResult = await p.select({
      message: 'Select a visual vibe for assets:',
      options: Object.keys(vibes).map((id) => ({
        value: id,
        label: vibes[id]?.name,
        hint: vibes[id]?.type === 'holiday' ? 'Holiday' : undefined,
      })),
    });
    if (p.isCancel(vibeResult)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }
    vibeId = vibeResult;
  }

  let assetKey = 'FAVICON_MAIN';
  if (action === 'all' || action === 'favicons') {
    const assetResult = await p.select({
      message: 'Select favicon style:',
      options: [
        { value: 'FAVICON_MAIN', label: 'Main (Brand Blue)' },
        { value: 'FAVICON_ALT', label: 'Alt (Clean White)' },
      ],
    });
    if (p.isCancel(assetResult)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }
    assetKey = assetResult;
  }

  const destination = await p.text({
    message: 'Where should I output the assets?',
    placeholder: './dist',
    initialValue: './dist',
    validate(value) {
      if (!value || value.length === 0) return 'Value is required!';
    },
  });

  if (p.isCancel(destination)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const resolvedPath = isAbsolute(destination) ? destination : resolve(process.cwd(), destination);

  try {
    if (action === 'all' || action === 'tokens') {
      await syncTokens(vibeId, resolvedPath);
    } else if (action === 'css') {
      await syncCssTokens(vibeId, resolvedPath);
    } else if (action === 'figma') {
      await syncFigmaTokens();
    }

    if (action === 'all' || action === 'favicons') {
      await generateFavicons(assetKey, resolvedPath, vibeId);
    }

    p.outro(color.green('✨ Design System is in sync!'));
  } catch {
    p.cancel('An error occurred during execution.');
    process.exit(1);
  }
}

main().catch(console.error);

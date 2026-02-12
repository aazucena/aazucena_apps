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
 * Helper to ensure colors are in Hex for the manifest
 */
function toHex(colorStr: string): string {
  const parsed = parse(colorStr);
  return parsed ? formatHex(parsed) : '#000000';
}

/**
 * 1. Logic for Syncing Tokens (CSS + Figma)
 */
async function syncTokens(vibeId: string, outputDir: string) {
  const s = p.spinner();
  s.start(`Syncing tokens for vibe: ${vibeId}`);

  try {
    const css = generateCssVariables(vibeId);
    const figma = generateFigmaTokens();

    const cssPath = join(outputDir, 'css-vars.css');
    const figmaPath = join(__dirname, '../figma.json');

    writeFileSync(cssPath, css);
    writeFileSync(figmaPath, figma);

    s.stop(`Tokens synced successfully to ${color.dim(outputDir)}`);
  } catch (error) {
    s.stop('Failed to sync tokens');
    throw error;
  }
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
      { value: 'tokens', label: '🎨 Sync Tokens Only', hint: 'CSS & Figma' },
      { value: 'favicons', label: '🖼️  Generate Favicons Only' },
    ],
  });

  if (p.isCancel(action)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  let vibeId = 'default';
  if (action === 'all' || action === 'tokens' || action === 'favicons') {
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

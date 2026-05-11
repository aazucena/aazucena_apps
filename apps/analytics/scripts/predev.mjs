#!/usr/bin/env node
/**
 * predev.mjs
 * Runs before `pnpm dev` to keep the local dev environment healthy.
 *
 * Current checks:
 *   1. Clears .next/ if it exceeds 2 GB — prevents Turbopack cache bloat
 *      from causing ENOSPC errors and slow cold-start compilation.
 */

import { existsSync, readdirSync, statSync, rmSync } from 'fs';
import { join } from 'path';

const NEXT_DIR = '.next';
const SIZE_LIMIT_BYTES = 2_000_000_000; // 2 GB

function getDirSize(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (total > SIZE_LIMIT_BYTES) break;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      total += getDirSize(fullPath);
    } else {
      total += statSync(fullPath).size;
    }
  }
  return total;
}

if (existsSync(NEXT_DIR)) {
  try {
    const bytes = getDirSize(NEXT_DIR);
    if (bytes > SIZE_LIMIT_BYTES) {
      rmSync(NEXT_DIR, { recursive: true, force: true });
      console.log(`[predev] .next cleared (was ${Math.round(bytes / 1e6)} MB)`);
    }
  } catch (err) {
    console.warn('[predev] Could not check .next size:', err.message);
  }
}

// Screenshots routes in both themes and two widths, and reports horizontal overflow.
// Run from apps/analytics with the dev server on :8080:
//   node --env-file=.env scripts/visual-check.mjs / /traffic
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:8080';
const THEMES = ['light', 'dark'];
const WIDTHS = [1440, 1024];
const HEIGHT = 900;

const routes = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (routes.length === 0) {
  console.error('usage: node --env-file=.env scripts/visual-check.mjs <route...>');
  process.exit(2);
}

const secret = process.env.ADMIN_SECRET;
if (!secret) {
  console.error('ADMIN_SECRET is not set; run with node --env-file=.env');
  process.exit(2);
}

const slug = (route) =>
  route === '/' ? 'root' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-');

mkdirSync('.shots', { recursive: true });
const browser = await chromium.launch();
let failed = false;
let first = true;

try {
  for (const route of routes) {
    for (const theme of THEMES) {
      for (const width of WIDTHS) {
        const context = await browser.newContext({ viewport: { width, height: HEIGHT } });
        await context.addCookies([{ name: 'az_session', value: secret, url: BASE }]);
        await context.addInitScript((t) => localStorage.setItem('theme', t), theme);
        const page = await context.newPage();
        const errors = [];
        page.on('console', (m) => {
          if (m.type() === 'error') errors.push(m.text());
        });
        page.on('pageerror', (e) => errors.push(String(e)));
        let overflow = 0;
        try {
          await page.goto(BASE + route, { waitUntil: 'load' });
          await page.waitForLoadState('networkidle').catch(() => {});
          overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
          await page.screenshot({ path: `.shots/${slug(route)}-${theme}-${width}.png` });
        } catch (e) {
          const msg = String(e);
          if (first && /ERR_CONNECTION|ECONNREFUSED/.test(msg)) {
            console.error('server not reachable on :8080');
            await context.close();
            await browser.close();
            process.exit(2);
          }
          errors.push(`navigation failed: ${msg.split('\n')[0]}`);
          failed = true;
        }
        first = false;
        console.log(`${route} ${theme} ${width} overflow=${overflow} errors=${errors.length}`);
        for (const e of errors) console.log(`  ${e.split('\n')[0]}`);
        if (overflow > 0) failed = true;
        await context.close();
      }
    }
  }
} finally {
  await browser.close().catch(() => {});
}

process.exit(failed ? 1 : 0);

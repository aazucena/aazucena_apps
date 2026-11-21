// Screenshots routes in both themes and two widths, and reports horizontal overflow.
// Run from apps/portfolio with the dev server (pnpm web:dev) on :4321:
//   node scripts/visual-check.mjs / /about
// Exits 1 on horizontal overflow, failed navigation or an uncaught page exception, 2 when the
// server can't be reached. Failed fetches and console errors are printed but do not fail the run.
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = "http://localhost:4321";
const THEMES = ["light", "dark"];
const SIZES = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

const routes = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (routes.length === 0) {
  console.error("usage: node scripts/visual-check.mjs <route...>");
  process.exit(2);
}

const slug = (route) =>
  route === "/" ? "root" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-");

mkdirSync(".shots", { recursive: true });
const browser = await chromium.launch();
let failed = false;
let first = true;
let unreachable = false;

try {
  outer: for (const route of routes) {
    for (const theme of THEMES) {
      for (const { width, height } of SIZES) {
        const context = await browser.newContext({
          viewport: { width, height },
        });
        await context.addInitScript(
          (t) => localStorage.setItem("aazucena-theme", t),
          theme,
        );
        const page = await context.newPage();
        const errors = [];
        const uncaught = [];
        page.on("console", (m) => {
          if (m.type() === "error") errors.push(m.text());
        });
        page.on("requestfailed", (r) =>
          errors.push(`request failed: ${r.url()}`),
        );
        page.on("pageerror", (e) => {
          errors.push(String(e));
          uncaught.push(String(e));
        });
        let overflow = 0;
        try {
          await page.goto(BASE + route, { waitUntil: "load" });
          // Three.js and Pixi keep the network busy; wait for it briefly, then let scenes settle.
          await page
            .waitForLoadState("networkidle", { timeout: 8000 })
            .catch(() => {});
          await page.waitForTimeout(1500);
          overflow = await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          );
          await page.screenshot({
            path: `.shots/${slug(route)}-${theme}-${width}.png`,
          });
        } catch (e) {
          const msg = String(e);
          if (first && /ERR_CONNECTION|ECONNREFUSED/.test(msg)) {
            unreachable = true;
            await context.close();
            break outer;
          }
          errors.push(`navigation failed: ${msg.split("\n")[0]}`);
          failed = true;
        }
        first = false;
        console.log(
          `${route} ${theme} ${width} overflow=${overflow} errors=${errors.length}`,
        );
        for (const e of errors) console.log(`  ${e.split("\n")[0]}`);
        if (overflow > 0) failed = true;
        if (uncaught.length > 0) {
          failed = true;
          console.log(
            `  UNCAUGHT EXCEPTION on ${route} (${theme} ${width}): ${uncaught.length}`,
          );
        }
        await context.close();
      }
    }
  }
} finally {
  await browser.close().catch(() => {});
}

if (unreachable) {
  console.error("server not reachable on :4321");
  process.exit(2);
}
process.exit(failed ? 1 : 0);

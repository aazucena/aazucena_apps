// Screenshots routes in both themes and two widths, and reports horizontal overflow.
// Run from apps/portfolio with the dev server (pnpm web:dev) on :4321:
//   node scripts/visual-check.mjs / /about
// Flags:
//   --with-preloader   keep the first-visit preloader (by default it is skipped by setting
//                      sessionStorage 'portfolio-preloader-seen' so the page underneath is shot)
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

const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
const withPreloader = flags.has("--with-preloader");
const routes = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (routes.length === 0) {
  console.error("usage: node scripts/visual-check.mjs <route...>");
  process.exit(2);
}

const slug = (route) =>
  route === "/" ? "root" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-");

mkdirSync(".shots", { recursive: true });
const browser = await chromium.launch({
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
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
          ({ t, skipPreloader }) => {
            // Init scripts also run in cross-origin iframes (Ko-fi embed), where touching storage
            // throws a SecurityError; only the top frame needs the theme and preloader flags.
            if (window.top !== window) return;
            localStorage.setItem("aazucena-theme", t);
            if (skipPreloader) {
              sessionStorage.setItem("portfolio-preloader-seen", "true");
            }
          },
          { t: theme, skipPreloader: !withPreloader },
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
        let failedNav = false;
        try {
          await page.goto(BASE + route, { waitUntil: "load" });
          if (!withPreloader) {
            // BrandIconLoader only lifts after brand-loader-complete; pages without async
            // content wait for its 8s timeout, so release it here.
            await page.evaluate(() =>
              document.dispatchEvent(new CustomEvent("brand-loader-complete")),
            );
          }
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
        } catch (e) {
          const msg = String(e);
          if (first && /ERR_CONNECTION|ECONNREFUSED/.test(msg)) {
            unreachable = true;
            await context.close();
            break outer;
          }
          errors.push(`navigation failed: ${msg.split("\n")[0]}`);
          failed = true;
          failedNav = true;
        }
        first = false;
        if (!failedNav) {
          try {
            await page.screenshot({
              path: `.shots/${slug(route)}-${theme}-${width}.png`,
              animations: "disabled",
              caret: "hide",
              timeout: 60_000,
            });
          } catch (e) {
            console.log(
              `screenshot failed: ${route} ${theme} ${width} (${String(e).split("\n")[0]})`,
            );
            failed = true;
          }
        }
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

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Ratcheting guard for the portfolio's Avra token usage. Every .astro, .tsx and .ts file under
 * apps/portfolio/src must stay free of stock palette classes, glass, big radii and literal colours.
 * PENDING lists files not yet restyled; remove an entry when its file is clean (test 2 enforces it).
 * SCENE_EXEMPT lists files whose literal colours are scene imagery (path -> reason); it never
 * covers panel or text styling.
 */
const ROOT = join(__dirname, '../../../..');
const SRC = join(ROOT, 'apps/portfolio/src');

const RULES: Array<[name: string, re: RegExp]> = [
  [
    'stock palette',
    /\b(?:bg|text|border|ring|fill|stroke|from|via|to|divide|outline|placeholder|decoration|accent|caret|shadow)-(?:zinc|slate|gray|neutral|stone|rose|red|emerald|green|amber|yellow|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|orange|teal|lime|primary|secondary|destructive|success|warning|info)-\d{2,3}\b/g,
  ],
  [
    'white/black',
    /\b(?:bg|text|border|ring|fill|stroke|outline|divide|shadow|from|via|to)-(?:white|black)\b/g,
  ],
  ['glass', /\bbackdrop-blur\b/g],
  ['legacy variant', /variant=["'](?:cyber|glass|gradient)["']/g],
  ['big radius', /\brounded-(?:2xl|3xl|\[[^\]]+\])/g],
  ['surface shadow', /(?<!drop-)\bshadow-(?:sm|md|lg|xl|2xl)\b/g],
  ['width cap', /\bmax-w-7xl\b/g],
  ['literal colour', /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\brgba?\(/g],
  ['three hex', /\b0x[0-9a-fA-F]{6}\b/g],
];

/** Files not yet on Avra tokens (paths relative to apps/portfolio/src). */
const PENDING: string[] = [
  'components/BrandIconLoader.astro',
  'components/Button.astro',
  'components/Footer.astro',
  'components/IntegrityBadge.tsx',
  'components/JourneyDashboard.tsx',
  'components/assistant/AssistantInput.tsx',
  'components/assistant/AssistantIntro.tsx',
  'components/assistant/AssistantMessageList.tsx',
  'components/assistant/AssistantTriggerPopover.tsx',
  'components/assistant/variants.ts',
  'components/blocks/BlockRenderers.tsx',
  'components/blocks/SimpleRichTextRenderer.tsx',
  'components/common/Breadcrumbs.astro',
  'components/common/DetailNavigation.astro',
  'components/common/GradientAccent.astro',
  'components/homepage/overlays/AtmosphericOverlays.tsx',
  'components/homepage/overlays/NavigationToolbar.tsx',
  'components/homepage/overlays/UIOverlays.tsx',
  'components/homepage/sections/ExitSection.tsx',
  'components/homepage/sections/HeroSection.tsx',
  'components/homepage/sections/ProjectsSection.tsx',
  'components/homepage/sections/SectionLayout.tsx',
  'components/homepage/sections/ServicesSection.tsx',
  'components/homepage/sections/SkillsSection.tsx',
  'components/ui/AskMeAbout.tsx',
  'components/ui/AwardModal.tsx',
  'components/ui/ChangelogSections.tsx',
  'components/ui/ChangelogTimeline.astro',
  'components/ui/EducationItem.tsx',
  'components/ui/InfiniteMovingCards.tsx',
  'components/ui/InfoPanel.tsx',
  'components/ui/InteractiveCard.tsx',
  'components/ui/MetricCard.astro',
  'components/ui/Navbar.tsx',
  'components/ui/PhoneDialTabs.tsx',
  'components/ui/RelatedLinks.tsx',
  'components/ui/ScrollIndicators.tsx',
  'components/ui/SectionNavFAB.tsx',
  'components/ui/ServiceCard.tsx',
  'components/ui/ServiceTabs.tsx',
  'components/ui/SettingsPanel.tsx',
  'components/ui/SocialMenu.tsx',
  'components/ui/StatusBadge.astro',
  'components/ui/TechStackDistribution.tsx',
  'components/ui/TestimonialCard.tsx',
  'components/ui/WorkingStyleSection.tsx',
  'components/ui/about/HighlightsPanel.tsx',
  'components/ui/about/LearnMoreCard.tsx',
  'components/ui/about/StatCard.tsx',
  'components/ui/awards/HexagonCard.tsx',
  'components/ui/awards/SectionLabel.tsx',
  'components/ui/blog/BlogCard.tsx',
  'components/ui/blog/NewspaperStack.tsx',
  'components/ui/blog/ViewAllButton.tsx',
  'components/ui/common/Badge.tsx',
  'components/ui/common/GlassCard.tsx',
  'components/ui/common/Panel.tsx',
  'components/ui/common/Popover.tsx',
  'components/ui/experience/CompanyLogo.tsx',
  'components/ui/experience/ExperienceActions.tsx',
  'components/ui/experience/ExperienceCard.tsx',
  'components/ui/hero/NavigationButton.tsx',
  'components/ui/hero/ResumeButton.tsx',
  'components/ui/journey/CareerStats.tsx',
  'components/ui/journey/ChronologyTimeline.tsx',
  'components/ui/journey/DetailsModal.tsx',
  'components/ui/journey/ExportControls.tsx',
  'components/ui/journey/GrowthMetrics.tsx',
  'components/ui/journey/HeatmapInfoPanel.tsx',
  'components/ui/journey/SankeyWithSemantics.tsx',
  'components/ui/journey/TimelineEventTooltip.tsx',
  'components/ui/journey/Toolbar.tsx',
  'components/ui/projects/PageIndicators.tsx',
  'components/ui/projects/ProjectCard.tsx',
  'components/ui/projects/ViewMoreCard.tsx',
  'config/animations.ts',
  'layouts/DetailLayout.astro',
  'layouts/ListLayout.astro',
  'pages/404.astro',
  'pages/500.astro',
  'pages/about.astro',
  'pages/blog/[slug].astro',
  'pages/blog/index.astro',
  'pages/changelog.astro',
  'pages/contact.astro',
  'pages/experiences/[slug].astro',
  'pages/experiences/index.astro',
  'pages/journey.astro',
  'pages/maintenance.astro',
  'pages/projects/[slug].astro',
  'pages/projects/index.astro',
  'pages/skills/index.astro',
  'pages/support.astro',
  'templates/EditorialTemplate.astro',
  'templates/LandingTemplate.astro',
  'templates/LegalTemplate.astro',
];

/** Files whose literal colours are scene imagery. path -> one-line reason. */
const SCENE_EXEMPT: Record<string, string> = {};

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      return full === join(SRC, 'pages/api') ? [] : sourceFiles(full);
    }
    return /\.(?:astro|tsx?)$/.test(name) && !/\.d\.ts$|\.test\.tsx?$/.test(name) ? [full] : [];
  });
}

const rel = (file: string) => relative(SRC, file).split(sep).join('/');

/**
 * Drops block comments, HTML/Astro comments, whole-line `//` comments and trailing ` // ...`
 * after code. Astro frontmatter is code, so it is kept and only its comments go.
 * `//` inside URLs has no leading space, so it survives.
 */
function stripComments(src: string): string {
  return src
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .split('\n')
    .map((line) => (/^\s*\/\//.test(line) ? '' : line.replace(/\s\/\/[^'"`]*$/, '')))
    .join('\n');
}

export function violations(file: string): string[] {
  const code = stripComments(readFileSync(join(SRC, file), 'utf8'));
  return RULES.flatMap(([name, re]) => Array.from(code.matchAll(re), (m) => `${name}: ${m[0]}`));
}

const ALL = sourceFiles(SRC).map(rel).sort();
const pending = new Set(PENDING);
const CHECKED = ALL.filter((f) => !pending.has(f) && !(f in SCENE_EXEMPT));

describe('portfolio Avra token usage', () => {
  it('uses Avra tokens in every file outside PENDING and SCENE_EXEMPT', () => {
    for (const file of CHECKED) {
      expect({ file, hits: violations(file) }).toEqual({ file, hits: [] });
    }
  });

  it('keeps PENDING honest: each entry exists and still has a violation', () => {
    for (const file of PENDING) {
      expect({ file, exists: existsSync(join(SRC, file)) }).toEqual({ file, exists: true });
      expect({ file, dirty: violations(file).length > 0 }).toEqual({ file, dirty: true });
    }
  });

  it('gives every SCENE_EXEMPT entry an existing file and a reason', () => {
    for (const [file, reason] of Object.entries(SCENE_EXEMPT)) {
      expect({ file, exists: existsSync(join(SRC, file)) }).toEqual({ file, exists: true });
      expect({ file, reason: reason.trim().length > 0 }).toEqual({ file, reason: true });
    }
  });

  it('loads Avra through ui globals', () => {
    const css = readFileSync(join(SRC, 'styles/globals.css'), 'utf8');
    expect(css).toMatch(/@import ['"]@aazucena\/ui\/globals\.css['"]/);
    expect(css).not.toMatch(/--(?:primary|secondary|neutral|destructive|success)-\d{2,3}\s*:/);
    expect(css).not.toMatch(/@theme inline/);
  });

  it('keeps the homepage content dark', () => {
    const layout = readFileSync(join(SRC, 'layouts/HomeLayout.astro'), 'utf8');
    expect(layout).toMatch(/class(?::list)?=[^>]*\bdark\b/);
  });
});

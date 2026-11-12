# Portfolio visual identity

Status: **proposal, awaiting owner review** (2026-11-12). Figma: [Avra Design System → Portfolio page](https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G?node-id=45-2).

## Problem

The portfolio's scenes (space → troposphere → treeline) give it an identity. The content laid over them does not:

- Glass cards and gradient buttons.
- Stock blue and purple chips.
- A coral "CHAT" pill.

The content layer also runs on its own token island. `apps/portfolio/src/styles/globals.css` defines a separate oklch palette and imports nothing from `@aazucena/design-system`. Counts across `src/` (2026-11-12): about 420 gray and 143 white/black utilities in `pages/`, and 362 stock blue utilities.

## Proposal

**The instrument language owns the content layer. The scenes stay.**

| Layer                                 | Treatment                                                                                                                                                                  |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Three.js / PixiJS scenes, GSAP motion | Unchanged. Particle colors move to the signal and series hues (`config/animations.ts` `PARTICLE_PRESETS`), read from the tokens once at scene init.                        |
| Cards, lists, menus                   | Panels: `panel` surface, 1px `rule`, 6px radius, micro-caps header strip (`BIO // 6+ YEARS`). No blur, no shadow.                                                          |
| Type                                  | Fira Sans headings, Fira Code for labels, dates and data. Values use `Display/Value`.                                                                                      |
| Actions                               | Instrument buttons (4px). The Rin trigger is a signal outline button, not coral: coral is reserved for alerts.                                                             |
| Tags and chips                        | Square outline badges; the active filter uses the cyber badge.                                                                                                             |
| Expertise                             | Keeps its kanban board: one lane per domain, scrolling horizontally. Proficiency badges are Expert = cyber, Proficient = outline, Competent = secondary, Learning = glass. |
| Journey and Blog pages                | The same panels in light and dark; D3 charts read `chartTheme` (series order cyan → olive → violet → rose).                                                                |

## Availability status (decided 2026-11-12)

`availabilityStatus` (Strapi enum) drives the footer, About Vital Stats and Contact Presence. Today `getAvailabilityIndicator` in `packages/utils/src/content.ts` maps it to stock palette classes (`bg-green-500` … `bg-red-500`). In the redesign it maps to status tokens, so coral stays reserved for alerts:

| Status                     | Today        | Redesign                |
| -------------------------- | ------------ | ----------------------- |
| Open to Opportunities      | green, pulse | `success` ●, pulse ring |
| Looking for Collaborations | blue, pulse  | `signal` ●, pulse ring  |
| Busy / Working on Projects | yellow       | `warning` ◆             |
| On Break / Personal Time   | orange       | `warning` ◆             |
| Unavailable                | red          | `muted-foreground` ●    |
| Unknown (fallback)         | gray         | `muted-foreground` ●    |

Busy and On Break share amber, and the label tells them apart. Unavailable goes muted grey rather than red, because coral would read as an error. Figma: `Shared / Availability` on the Portfolio page, one variant per status. Phase 5 changes `getAvailabilityIndicator` to return these tokens.

## Decision needed

1. **How far into the homepage?** The recommendation is the table above: content layer only, with scenes unchanged apart from particle hues. The alternative is to also replace the gradient scene backdrops with flat ink surfaces, which is closer to the dashboard but loses the altitude story.
2. **Rin trigger color.** Signal (recommended, matches the alert rule) or keep the warm accent as a brand exception.

## Frames

- **Homepage, dark:** Hero, About, Projects, Experience, What I do, Skills, Blog, What's next.
- **Blog index:** dark and light.
- **Journey, dark and light (rebuilt 2026-11-12):** the full three-phase report.
  - Career at a Glance
  - Chronology gantt, with dates read from the live D3 chart
  - Technical DNA: insights, chart tabs, domain filter, and the spider chart without the total spoke
  - Distilled Wisdom
  - Explore band
- **Pages, dark and light (added 2026-11-12):**
  - About
  - Projects and the Portfolio Website case study
  - Experience and the Tangle Media case study
  - Blog post
  - Technical Expertise
  - Contact
  - Support
  - Changelog
  - 404

  Content comes from the running site, with real project images. Every page uses two shared components: `Shared / Navbar` (one variant per active page, plus `None` for Contact, Support, Changelog and 404) and `Shared / Footer`. Edit the component to update every page.

- **Overlays and mobile, dark:**
  - Rin chat open over About, with the trigger as a signal outline button
  - Preloader gate
  - Mobile Home hero, menu open and Blog post at 390px

Not drawn: `/maintenance`, `/500` and the legal template. Their content wasn't reachable locally.

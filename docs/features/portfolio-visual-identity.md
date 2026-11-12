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

| Layer                                 | Treatment                                                                                                                                           |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Three.js / PixiJS scenes, GSAP motion | Unchanged. Particle colors move to the signal and series hues (`config/animations.ts` `PARTICLE_PRESETS`), read from the tokens once at scene init. |
| Cards, lists, menus                   | Panels: `panel` surface, 1px `rule`, 6px radius, micro-caps header strip (`BIO // 6+ YEARS`). No blur, no shadow.                                   |
| Type                                  | Fira Sans headings, Fira Code for labels, dates and data. Values use `Display/Value`.                                                               |
| Actions                               | Instrument buttons (4px). The Rin trigger is a signal outline button, not coral: coral is reserved for alerts.                                      |
| Tags and chips                        | Square outline badges; the active filter uses the cyber badge.                                                                                      |
| Journey and Blog pages                | The same panels in light and dark; D3 charts read `chartTheme` (series order cyan → olive → violet → rose).                                         |

## Decision needed

1. **How far into the homepage?** The recommendation is the table above: content layer only, with scenes unchanged apart from particle hues. The alternative is to also replace the gradient scene backdrops with flat ink surfaces, which is closer to the dashboard but loses the altitude story.
2. **Rin trigger color.** Signal (recommended, matches the alert rule) or keep the warm accent as a brand exception.

## Frames

- **Homepage, dark:** Hero, About, Projects, Experience, What I do, Skills, Blog, What's next.
- **Journey and Blog index:** dark and light.
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

  Content comes from the running site, with real project images. Every page shares one instrument footer (`Shared / Footer`).

- **Overlays and mobile, dark:**
  - Rin chat open over About, with the trigger as a signal outline button
  - Preloader gate
  - Mobile Home hero, menu open and Blog post at 390px

Not drawn: `/maintenance`, `/500` and the legal template. Their content wasn't reachable locally.

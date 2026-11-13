# Portfolio visual identity

Status: **proposal; homepage reach, Rin color and availability decided 2026-11-12; Figma review gate still open**. Figma: [Avra Design System → Portfolio page](https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G?node-id=45-2).

## Problem

The portfolio's scenes (space → troposphere → treeline) give it an identity. The content laid over them does not:

- Glass cards and gradient buttons.
- Stock blue and purple chips.
- A coral "CHAT" pill.

The content layer also runs on its own token island. `apps/portfolio/src/styles/globals.css` defines a separate oklch palette and imports nothing from `@aazucena/design-system`. Counts across `src/` (2026-11-12): about 420 gray and 143 white/black utilities in `pages/`, and 362 stock blue utilities.

## Proposal

**The instrument language owns the content layer. The scenes stay.**

| Layer                                 | Treatment                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Three.js / PixiJS scenes, GSAP motion | Unchanged. Particle colors move to the signal and series hues (`config/animations.ts` `PARTICLE_PRESETS`), read from the tokens once at scene init.                                                                                                                                                                                                                            |
| Cards, lists, menus                   | Panels: `panel` surface, 1px `rule`, 6px radius, micro-caps header strip (`BIO // 6+ YEARS`). No blur, no shadow.                                                                                                                                                                                                                                                              |
| Type                                  | Fira Sans headings, Fira Code for labels, dates and data. Values use `Display/Value`.                                                                                                                                                                                                                                                                                          |
| Actions                               | Instrument buttons (4px). The Rin trigger is Rin's face (the live `RinCharacter`, `RinMark` until the .riv is hosted) plus "Chat" ("Close" when open), on a signal outline, not coral: coral is reserved for alerts. Figma: `Shared / Rin trigger`, `Shared / Rin greeting`.                                                                                                   |
| Logo                                  | The real AA bolt marks from `apps/portfolio/public/` (Figma `Brand/*`), never a typed "A/A". Brand-colour marks (`icon`, `favicon`, `favicon-alt`) keep #027fcc / #ffd42a and are not retinted to tokens; the one-colour marks (`logo`, `logo-alt`) take `foreground`, which is what their `prefers-color-scheme` CSS does. The navbar uses `icon.svg`, as the live site does. |
| Tags and chips                        | Square outline badges; the active filter uses the cyber badge.                                                                                                                                                                                                                                                                                                                 |
| Expertise                             | Keeps its kanban board: one lane per domain, scrolling horizontally. Proficiency badges are Expert = cyber, Proficient = outline, Competent = secondary, Learning = glass.                                                                                                                                                                                                     |
| Journey and Blog pages                | The same panels in light and dark; D3 charts read `chartTheme` (series order cyan → olive → violet → rose).                                                                                                                                                                                                                                                                    |

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

## Decisions (owner, 2026-11-12)

1. **Homepage reach: content layer only, scenes stay.** The space → treeline scenes keep their imagery; panels, type and actions take the instrument language, and particle colors move to the signal and series hues.
   - **Text on a scene uses `foreground`; signal stays inside panels.** The cyan subtitles failed contrast on the bright blue sky scenes (Projects, Experience, What I do). Rejected: a scrim behind each heading block (adds a translucent layer the instrument rules avoid) and flat ink backdrops (loses the altitude story).
2. **Rin trigger: signal cyan outline, with Rin's face and "Chat"** (owner, 2026-11-12: the face is Rin's identity on the button, and "Chat" is the clearest label for first-time visitors). The open state reads ✕ "Close". Coral stays reserved for alerts. Rejected: coral as a brand exception and a dedicated Rin accent.

3. **The homepage is always dark (owner, 2026-11-12).** Its content sits on the Three.js / Pixi scenes, and the live sections already hard-code light-on-dark, so it looks the same whichever theme the visitor picked. In Phase 5, bind the homepage content layer to the Dark mode of the tokens instead of following the site theme. Inner pages, the Rin chat and mobile inner pages follow the theme and have light frames.

## Frames

- **Homepage, dark:** Hero, About, Projects, Experience, What I do, Skills, Blog, What's next. Revised 2026-11-12:
  - Each frame sits on a capture of its live scene.
  - Copy matches the live site.
  - Chrome comes from `Shared / Control dock` and `Shared / Section dots`.
  - Projects is a carousel, Skills a radial orbit selector, and Blog a card deck, as on the live site.
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
  - Rin chat, built from the live assistant (`Shared / Rin chat`, six states):
    - Notice: Transparency, shown on first open
    - Empty: portrait, intro and page-aware suggestions
    - Conversation: with the loading status
    - Menu: About Rin, Transparency, Export transcript, Clear conversation
    - About Rin
    - Clear confirm

    The chat appears in floating, side-panel and full-screen modes.

  - Preloader gate
  - Mobile Home hero, menu open and Blog post at 390px

- **RAD Intel role, preview (2026-11-12):** Front End Developer, RAD Intel · Lickly, Jun 22, 2026 – present, remote, full-time. It appears in five places:
  - the homepage hero badge
  - the homepage Experience list (current, 4 of 7)
  - the Experience timeline
  - a new case study, `Page / Experience detail (RAD Intel)`
  - Journey: timeline extended to 2027, Companies 6 → 7

  Content comes only from the public bio at lickly.com/our-team/aldrin-azucena, with no invented outcomes. The live site doesn't list the role yet; each frame carries a canvas note until the Strapi entry exists.

Not drawn: `/maintenance`, `/500` and the legal template. Their content wasn't reachable locally.

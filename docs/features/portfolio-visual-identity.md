# Portfolio visual identity

Status: **R5 built on `phase-5/next-release`, final whole-branch review pending; decisions of 2026-11-12 and 2026-11-21 below; four owner questions open**. Figma: [Avra Design System → Portfolio page](https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G?node-id=45-2).

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
| Expertise                             | Keeps its kanban board: one lane per domain, scrolling horizontally. Proficiency badges are Expert = signal tint (the cyber look), Proficient = outline, Competent = raised, Learning = quiet outline (no glass in Avra). Built in the final fix wave (2026-11-22) as token classes on the Astro page.                                                                         |
| Journey and Blog pages                | The same panels in light and dark; D3 charts read `chartTheme` (series order cyan → olive → violet → rose).                                                                                                                                                                                                                                                                    |

## Availability status (decided 2026-11-12)

`availabilityStatus` (Strapi enum) drives the footer, About Vital Stats and Contact Presence. `getAvailabilityIndicator` in `packages/utils/src/content.ts` still returns the stock `color` class (`bg-green-500` … `bg-red-500`) and a `pulse` flag, and now also returns a `marker` (● or ◆) and a `tone` token class. The footer, About and Contact render the marker in the tone class and draw the ring when `pulse` is set; `color` is unused. The final fix wave (2026-11-22) restored the ring through `AvailabilityIndicator.astro` (`motion-safe:animate-ping`, steady under reduced motion; it shows only when the status pulses, and the CMS status read "Unavailable" when it was checked, so the ring was not seen in a browser). The mapping below is what the tones implement, so coral stays reserved for alerts:

| Status                     | Old          | Redesign                |
| -------------------------- | ------------ | ----------------------- |
| Open to Opportunities      | green, pulse | `success` ●, pulse ring |
| Looking for Collaborations | blue, pulse  | `signal` ●, pulse ring  |
| Busy / Working on Projects | yellow       | `warning` ◆             |
| On Break / Personal Time   | orange       | `warning` ◆             |
| Unavailable                | red          | `muted-foreground` ●    |
| Unknown (fallback)         | gray         | `muted-foreground` ●    |

Busy and On Break share amber, and the label tells them apart. Unavailable goes muted grey rather than red, because coral would read as an error. Figma: `Shared / Availability` on the Portfolio page, one variant per status. The status comes from the CMS `portfolio.availabilityStatus`; the owner has yet to review it.

## Decisions (owner, 2026-11-12)

1. **Homepage reach: content layer only, scenes stay.** The space → treeline scenes keep their imagery; panels, type and actions take the instrument language, and particle colors move to the signal and series hues.
   - **Text on a scene uses `foreground`; signal stays inside panels.** The cyan subtitles failed contrast on the bright blue sky scenes (Projects, Experience, What I do). Rejected: a scrim behind each heading block (adds a translucent layer the instrument rules avoid) and flat ink backdrops (loses the altitude story).
2. **Rin trigger: signal cyan outline, with Rin's face and "Chat"** (owner, 2026-11-12: the face is Rin's identity on the button, and "Chat" is the clearest label for first-time visitors). The open state reads ✕ "Close". Coral stays reserved for alerts. Rejected: coral as a brand exception and a dedicated Rin accent.

3. **The homepage is always dark (owner, 2026-11-12).** Its content sits on the Three.js / Pixi scenes, and the live sections already hard-code light-on-dark, so it looks the same whichever theme the visitor picked. R5 binds the homepage content layer to the Dark mode of the tokens with a `.dark` wrapper in `HomeLayout.astro`, so it no longer follows the site theme. Inner pages, the Rin chat and mobile inner pages follow the theme and have light frames. Until 2026-11-22 `<body>` carried `dark` on the homepage, which forced Rin dark on `/`; the final fix wave removed it (re-shot in a browser: Rin is light on `/` in the light theme, dark in the dark theme).

## Decisions (owner, 2026-11-21)

1. **Watermark.** Header watermarks stay everywhere they existed (list, detail, Journey with its CMS field, 404, 500); the footer keeps its own. Recipe: Fira Sans Black, `rule` colour at 28%, -4% tracking, fitted to 94% of the header's width and height (404 capped at 480px). Option 2, a panel band under the navbar, for list, detail, About and Journey; 404 and 500 have no band. 500 has no frame and follows the 404 treatment. About's word is ALDRIN. The mark is hidden below 640px on blog posts and project details. One component, `WatermarkBackground.astro`, serves headers and footer.
2. **A frame that omits existing decoration or content is not a decision to remove it.** Such removals go to the owner (the band was removed once on that reading and restored).
3. **Navbar:** hamburger menu below 1024px (D1).
4. **Journey (D2):** keeps the coded milestone timeline. Figma now shows it: dark `207:7379`, light `207:7483`; the superseded layers are hidden, not deleted.
5. **Home Experience (D4):** keeps the logo cards on a timeline rail. Figma: `207:7587`. RAD Intel stays as the frames' preview content, not in the CMS.
6. **After R5 (backlog):** the blog post Contents rail and mobile Contents bar (D3); mobile menu counts and Dark/Light control, footer link style and preloader panel and rings (D5). See `docs/next-release-backlog.md`.
7. **Footer** follows the same watermark recipe; the code had drifted to bold foreground at 4%.

## Decisions (owner, 2026-11-22): the 69 removals

The R5 pass found 69 things the old portfolio had that the Avra rebuild dropped. The owner took the recommendation for each: 47 restored, 18 dropped, 4 kept (two with a detail restored). Restores use Avra tokens, motion only behind `motion-safe:`, and the same affordance on focus-visible as on hover. Shared classes in `apps/portfolio/src/styles/globals.css`: `press`, `hover-grow`, `hover-nudge`, `hover-lift`, `hover-spin`, `spin-slow`, `bar-grow`, `linked-card`.

**Restored.**

- Chrome and menus: C1 swipe right closes the mobile menu, C3 and C4 menu icons, C6 logo hover (size kept), C7 "Let's Talk" nudge, C9 press-in on buttons and cards, C20 hamburger to X, C21 section dot growth (tooltip pointer dropped), C23 shield pulse.
- Error and maintenance pages: C52 compass and underline, C54 hover motion on the buttons, C55 static alert and terminal icons, C56 wrench, C57 "Checks every 30 seconds".
- Inner pages: C10 card lift, C11 and C12 photo zoom, C14 icon growth (About, Contact, Journey, skills, awards, experience), C15 arrows that slide, C16 titles that turn signal, C22 working-style cards open on click, C26 ping on the Latest changelog node, C37 to C42 About and Contact icons, h2 heading and send icon, C44 placeholder art, C47 metadata icons, C49 skill usage icons, C50 edge-to-edge skill board, C51 stack bars grow.
- Homepage, Journey and Rin: C13 cards grow 2% (cards only, buttons keep press), C17 resume icon pulse (shine sweep dropped), C19 award outline thickens, C27 pulsing dot on Currently only, C28 alternate panel bands (badge hues dropped), C29 stat icons, C31 growth icons as line icons (checks dropped), C33 chart explanation line, C34 search and filter icons, C36 honours icon in the tooltip (the award badge line icon; the icon set has no trophy), C60 project initials and service icons on flat series hues, C63 white stars (the foreground token), C65 four series borders on Rin's chips, C66 chat window size transition.

**Dropped (18).** C2, C5, C8, C18, C24, C25, C30, C32, C35, C43, C46, C53, C58, C59, C61 (the cream blog paper was personality, but a literal colour), C67, C68, C69.

**Kept (4).** C45 badges stay below the cover, with the Featured star restored; C48 the experience rail stays, with node growth restored; C62 the loader mark stays at 132px; C64 the rewritten Rin lore copy stands (owner to confirm the wording).

**Marks and titles.** Below 640px the header watermark is hidden on About, Journey, Changelog and Experience detail (the band stays); every other page keeps it. Legal and Editorial titles are 56px (md and up), weight 700, tracking -0.02em, and 36px below md so they fit 390; Landing is unchanged.

**Stack bars.** The bars hold their real width in the markup, so the share shows with script off or blocked. `BarGrowObserver` marks a bar when it is on screen, and only then does CSS hold it at zero and grow it; reduced motion shows it full.

**Contrast.** Muted and signal text are 3.6:1 on `bg-state` in dark, so neither goes on it. Glass cards keep `bg-panel` on hover and strengthen the border instead.

## Frames compared

Fira Sans and Fira Code did not render on the branch from `d0e46dc4` (Task 3) to `432e64ae`: the font variables went through `define:vars` and never resolved. **Every comparison made in that span used the fallback system font's metrics**, including each per-task review. The 2026-11-21 frame pass in 11b was one of them, and its report wrongly blamed the missing font on the machine being offline.

Compared in that pass (fallback font), by outcome:

- Re-shot 2026-11-22 after the chart-CSS fix (the earlier Journey comparisons predate it and never saw the chart controls' real styles): the five Journey tabs and the timeline in light and dark at 1440 and 390 were re-run in a browser for errors and sizes, and the timeline was viewed in dark at 1440 and the Heatmap tab in light at 1440. They were not re-compared against the Figma frames.
- Match: About `77:521` (CMS copy differs), 404 `77:2015`, Journey `113:4022` (top of the page only), Blog `47:413`, Home hero `77:429`, menus `77:453` and `155:5108`, Toolbar `145:3904`, Home About `46:67` (after a fix).
- Changed to match: Contact, Support, Changelog, Projects, Project detail, Experience, Experience detail (spacing, quote tint, Support two columns), Expertise (alignment), Blog post mobile `77:490` (title size).
- Left on purpose: Blog post `77:1374` (frame has an inline Contents rail), Home Experience `46:175`, preloader Splash, Loading and Ready in dark and light.
- Never compared: the two Error preloader frames `121:3638` and `121:3732` (not reachable locally), `155:5074` beyond the menu shot, the full length of the Journey page, light frames in Tasks 5, 7 and 10 (fetched or skipped), 390px frames in Task 10, and a full-length check of every route against its frame in any mode.

At most 26 frames were compared in the 11b pass; an earlier figure of 28 of 29 was wrong.

Redone after `432e64ae`, with the real font:

- Computed fonts on 16 routes at two widths in both themes (body, headings and watermark Fira Sans; labels and code Fira Code; six Sans weights and two Code weights loaded).
- Watermark matrix: 16 routes at 390, 768 and 1440, light and dark; no overflow and no cropped word.
- Page titles set from the Figma text styles and measured on nine routes at 1440 and 390 (About 56, Contact 56, Blog post 52, Journey 64, List 56; tracking -0.02em).
- Navbar clear of clipping from 768 to 1280.

Not redone: the per-frame side-by-side comparisons of the pass above. Legal, Editorial and Landing templates got tracking only; their title sizes were not compared. Printing, real CMS watermark words other than current data and the Astro build output were not checked, and no production build was run.

## Open owner questions

- **RAD Intel entry.** Owner task: add the role to the Strapi data (the frames already show it). It is a CMS entry, not a code change.

Decided 2026-11-26 (owner): images in Rin's replies show as links and never load on their own;
Enter that confirms an IME composition doesn't send; closing Rin from the side panel or full screen
returns focus to the Chat button; the server finishing a reply after Clear is in the backlog. The
branch is pushed after each reviewed batch, with the owner's approval.

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

Not drawn: `/maintenance`, `/500` (follows the 404 treatment) and the legal template. Their content wasn't reachable locally.

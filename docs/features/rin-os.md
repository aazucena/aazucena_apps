# Rin OS — Mobile Companion App

📍 **Related:** [Rin Integration](./rin-integration.md) | [AZUCENA_LYTICS Plan](./azucena-lytics-plan.md) | [Rin OS Auth](./rin-os-auth.md)

## Status: 💡 **IDEATION** (Blocked — prerequisites incomplete)

**Estimated Effort:** TBD — auth screen MVP is ~2 weeks  
**Priority:** LOW — begins only after all prerequisites are met

## 🚦 Prerequisites (in order)

All four must be complete before any Rin OS code is written:

| #   | Prerequisite                            | Why it matters for Rin OS                                                                                                                                                                                                                                   |
| --- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Phase 5 — Testing & Quality**         | Shared packages (`@aazucena/types`, `@aazucena/utils`, `@aazucena/stores`) need Vitest coverage before being imported into a new native app. Regressions in shared code cascade into mobile.                                                                |
| 2   | **Rive animations for Rin**             | Rin's motion language — how Rin moves, emotes, and reacts — must be defined on the web first. The mobile auth screen needs Rin's sprite/animation set. Building the game around placeholder Rin and retrofitting a Rive character later is the wrong order. |
| 3   | **Phaser error page games (Portfolio)** | Establishes the pixel art visual language and 8-bit sound design that the mobile retro corridor game shares. Build the web games first, extract the shared aesthetic, then carry it into mobile. The two features must look like the same universe.         |
| 4   | **Persona Selection feature**           | Rin OS is Rin — but Rin's personality, voice, and persona rules are defined by the persona selection system. Without that foundation locked, Rin's dialogue lines and emotion states in the app have no source of truth to draw from.                       |

---

## 🎯 Vision Statement

> "The portfolio is what the world sees. The app is what you see."

Rin OS is a **private mobile intelligence companion** — not a port of the portfolio, not a public product. It is the owner's cockpit: a native app that extends the portfolio system into the physical world using capabilities the web cannot provide.

The portfolio (aazucena.com) handles the public story — projects, Rin for visitors, NFC/QR landing, easter eggs, music, contact. Rin OS handles what happens after the portfolio visitor leaves: real-time intelligence, personal dev activity, ambient awareness, and a living character that reacts to what's happening across the entire system.

---

## 🏗️ Architecture — Three Layers

```
┌─────────────────────────────────┐
│           Rin (shell)           │  personality, voice, dialogue, emotion
├─────────────────────────────────┤
│      LYTICS (intelligence)      │  real-time data, telemetry, AI costs
├─────────────────────────────────┤
│     Device (entry layer)        │  haptics, widgets, Dynamic Island, biometric
└─────────────────────────────────┘
```

Rin is not a tab or a screen. Rin is the OS layer — the interface metaphor for the entire system. Data doesn't live in tables; it lives in Rin. Rin speaks it, reacts to it, and carries it.

---

## 📱 Distribution Decision — Path B (Private)

**TestFlight (iOS) / APK sideload (Android) — never published to App Store.**

### Why not the App Store

The portfolio already handles:

- Public project showcase
- Rin for visitors
- NFC/QR landing experience
- Easter eggs
- Music player
- Contact / inquiry

Publishing to the App Store would duplicate what the portfolio already does, adding distribution friction (App Store review cycles, privacy manifests, public bug exposure, $99/year) without expanding what the app can actually do.

### What native gives that the web cannot

| Native capability             | What it unlocks                                                         |
| ----------------------------- | ----------------------------------------------------------------------- |
| Background push notifications | Rin alerts you when something happens — you're not watching a dashboard |
| Home screen widgets           | Live visitor count, AI spend, now playing — no app open required        |
| Dynamic Island (iOS)          | Rin's face reacts to portfolio events while you use other apps          |
| Haptics                       | Different rumble patterns per event type — a language only you feel     |
| Biometric lock                | Face ID / fingerprint gating financial and telemetry data               |
| Always-on presence            | The portfolio is somewhere you visit. The app lives with you.           |
| Camera / AR                   | AR business card — point at physical card, Rin appears                  |

---

## 🖥️ Screens

### Home — Rin

Rin as the primary interface. Rin's mood is data-driven:

- High traffic day → energetic
- 3am, no visitors → sleepy
- Easter egg found on the web → excited before you even open the app

Surfaces key intelligence as natural language, not charts.

### Intelligence — LYTICS

The owner-only analytics terminal:

- Live visitor count + geographic map (lat/lon already in ClickHouse)
- AI spend today / this month
- Core Web Vitals (LCP, INP, CLS)
- System integrity feed
- Rin narrates anomalies: _"Someone in Osaka has been on your music section for 6 minutes."_

### Music — Compositions

- Now playing card with waveform (existing Howler.js / wavesurfer.js data)
- Track history
- Simplified Strudel pattern editor — write a beat on the train
- Setlist mode for live performances (stage-ready, tap to cue)

### Dev Feed — Activity

- WakaTime coding streak + languages used today
- GitHub recent commits and activity
- Rin frames it: _"You wrote 1,847 lines today. Mostly TypeScript. That tracks."_

### Egg Codex — Easter Eggs

Cross-platform easter egg tracker:

- Web eggs (already tracked in `analytics.easter_egg_completions`)
- Mobile-only eggs
- Unified discovery state — find all web + mobile eggs to unlock a hidden Rin interaction
- Leaderboard of discovery timestamps

### Stage Mode — Presenting

Full-screen companion for conference talks:

- Live visitor counter visible while on stage
- Real-time telemetry ticker
- Rin quiet but animated in corner
- One-tap QR share for the audience

### Settings

- Trust tier status (see Auth doc)
- Notification preferences
- Rin's personality intensity dial
- Biometric re-enrollment

---

## 🎭 Rin's Emotion System (Mobile Extension)

The existing `set_emotion` pipeline carries over. Mobile adds physical expression:

| Trigger               | Rin state                    | Haptic               |
| --------------------- | ---------------------------- | -------------------- |
| Portfolio traffic up  | Energetic, faster animations | Light pulse sequence |
| 3am, no visitors      | Sleepy, slower blink rate    | None                 |
| Easter egg found      | Excited, bouncy              | Medium burst         |
| AI cost spike         | Concerned expression         | Two short taps       |
| New GitHub push       | Focused                      | Single light tick    |
| System integrity DOWN | Alert                        | Strong double pulse  |

---

## 🗺️ Geographic Visitor Map

ClickHouse already stores `country`, `city`, `latitude`, `longitude` on every telemetry event. The Intelligence screen renders a live globe showing where portfolio visitors are coming from. Rendered with `react-three-fiber` (Three.js — already in the monorepo) or `react-native-maps`.

Rin narrates live: _"Someone in Berlin just landed on your projects page."_

---

## 📡 AR Business Card

Point phone camera at physical business card → Rin appears in AR above it. Rin delivers your elevator pitch. Built with `react-native-vision-camera` + ViroReact or `@react-three/fiber` with AR session.

Use case: conferences, networking events — the card holder experiences the portfolio through Rin rather than typing a URL.

---

## 📦 Monorepo Integration

New additions to the repo:

```
apps/
  mobile/              ← new Expo app (apps/mobile/)
packages/
  ui-native/           ← React Native component library
  hooks-native/        ← RN versions of DOM hooks
```

### Packages reusable without changes

| Package                     | Notes                                       |
| --------------------------- | ------------------------------------------- |
| `@aazucena/types`           | 100% portable — pure TypeScript             |
| `@aazucena/constants`       | 100% portable                               |
| `@aazucena/utils`           | ~80% — luxon, lodash-es, zod all work in RN |
| `@aazucena/api`             | ~90% — uses fetch; verify no window refs    |
| `@aazucena/stores`          | 100% — Redux Toolkit runs in RN unchanged   |
| `@aazucena/forms` (schemas) | 100% — all 48 Zod schemas fully portable    |

### Packages needing RN variants

| Web package                          | RN equivalent                                  |
| ------------------------------------ | ---------------------------------------------- |
| `@aazucena/ui` (Radix + Tailwind)    | `@aazucena/ui-native` (View/Text + NativeWind) |
| `@aazucena/hooks/dom`                | `@aazucena/hooks-native`                       |
| `@aazucena/animations` (GSAP/PixiJS) | `react-native-reanimated` v3                   |
| `@mynaui/icons-react`                | `@expo/vector-icons`                           |

### Design token bridge

`@aazucena/design-system` raw token values (colors, spacing, radii) are portable. Both the web Tailwind config and a NativeWind config for mobile consume from the same token source — one design system, two platform outputs.

---

## 🛠️ Tech Stack

| Layer              | Technology                                                        |
| ------------------ | ----------------------------------------------------------------- |
| Framework          | Expo (managed workflow)                                           |
| Language           | TypeScript (strict)                                               |
| Styling            | NativeWind v4 (Tailwind → StyleSheet.create at build time)        |
| Animations         | react-native-reanimated v3                                        |
| Gestures           | react-native-gesture-handler                                      |
| Game engine        | react-native-game-engine                                          |
| Drawing            | react-native-skia (GPU-accelerated, pixel art rendering)          |
| Auth               | expo-local-authentication + Passkeys (WebAuthn)                   |
| Storage            | expo-secure-store (JWT), AsyncStorage (trust tier)                |
| Haptics            | expo-haptics                                                      |
| Sound              | expo-av                                                           |
| Camera / AR        | react-native-vision-camera                                        |
| Navigation         | Expo Router (file-based, same mental model as Next.js App Router) |
| State              | Redux Toolkit (`@aazucena/stores` — shared with web)              |
| Data fetching      | TanStack Query v5 (same as analytics app)                         |
| Push notifications | Expo Notifications                                                |
| Widgets            | react-native-widgetkit (iOS) / react-native-android-widget        |

---

## 🔐 Authentication

Full details in [Rin OS Auth](./rin-os-auth.md).

**Summary:** Passkeys (WebAuthn) replace the existing single-password cookie auth for mobile. The biometric call is wrapped in a gamified retro corridor mini-game hosted by Rin — collecting the ACCESS KEY triggers Face ID. Trust tiers reduce friction for daily use.

The web analytics dashboard retains its existing `ADMIN_PASSWORD` + `httpOnly` cookie auth unchanged. Mobile gets its own Passkey endpoints returning JWT instead of cookies.

---

## 🏁 Build Sequence

### Feature 1 — Gamified Auth Screen (START HERE)

The first and most important screen to build. See [Rin OS Auth](./rin-os-auth.md) for full spec.

**Why first:**

- Forces the hardest architectural problems early (game loop + biometric + Reanimated + Rin's character layer)
- Establishes Rin's motion language, dialogue system, and haptic vocabulary for reuse across all other screens
- Immediately demoable — hand someone the phone, 10-second pitch for the entire concept
- Entirely self-contained, zero backend dependency during development

### Feature 2 — Home (Rin + LYTICS core)

After auth is stable, wire up the first live data connection: visitor count and AI spend from the existing `/api/stats/` routes.

### Feature 3 — Intelligence screen

Full LYTICS dashboard with geographic map.

### Feature 4 — Dev Feed

WakaTime + GitHub activity.

### Feature 5 — Music

Now playing + setlist mode.

### Feature 6 — Egg Codex

Cross-platform easter egg tracker.

### Feature 7 — Stage Mode + AR

Conference-specific features, last because they have the narrowest use case.

---

## 🔗 Connection to Existing Features

### Web Phaser error page games

The retro corridor game in the auth screen shares the same **visual language** as the planned Breakout/Sokoban games on web error pages — same pixel art aesthetic, same atmospheric color palette, same 8-bit sound design. Anyone who plays Breakout on the 404 page recognizes the mobile auth screen immediately. Two different features, one coherent design language.

### AZUCENA_LYTICS pipeline

The app adds a new ClickHouse data consumer but no new ingestion paths. All existing tables (`telemetry_events`, `ai_intelligence`, `system_integrity`, etc.) feed the Intelligence screen via the existing `/api/stats/` routes.

### Rin (web assistant)

The web Rin and the mobile Rin share the same LangGraph brain endpoint and emotion pipeline. Different surfaces, same character.

---

## 📋 Open Questions

- **Rin's visual representation on mobile:** Rive animation (same as web) or a pixel art sprite consistent with the retro game aesthetic?
- **Strudel live coding on mobile:** Viable via WebView embed or needs a custom RN implementation?
- **AR business card:** ViroReact vs @react-three/fiber AR session — needs spike
- **Widget refresh rate:** How frequently should home screen widgets poll the LYTICS data?

---

**Last Updated:** 2026-05-23  
**Status:** Ideation — no code written  
**Next Step:** Begin [Rin OS Auth](./rin-os-auth.md) screen after Phase 5 completion

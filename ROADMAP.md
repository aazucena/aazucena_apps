# Portfolio Development Roadmap

## ⚡ Current Priority: Phase 5 — Testing & Quality

See **[CHANGELOG.md](./CHANGELOG.md)** for a full history of completed milestones.

---

## 🎯 Quick Navigation

- **[Documentation Hub](./docs/README.md)** — Full project documentation
- **[Phase 5: Testing & Quality](./docs/phase-5-testing.md)** 🔥
- **[Architecture Deep-Dive](./docs/architecture.md)**
- **[CHANGELOG](./CHANGELOG.md)** — What shipped and when

---

## 📋 Development Phases

### Phase 1 — Animations Refactoring ✅ (2025-01-13)

**[Full doc →](./docs/phase-1-animations-refactoring.md)**

- Reduced `Section.tsx` 324 → 174 lines (46%)
- Extracted: `AtmosphericOverlays`, `DynamicBackground`, `AnimationCanvas`, `SectionContent`, `UIOverlays`
- Centralized state: `PortfolioContext`, `AnimationContext`

---

### Phase 1.5 — Code Quality & Security ✅ (2025-12-03)

**[Full doc →](./docs/phase-1.5-code-quality-security.md)**

- Eliminated 2 critical happy-dom CVEs
- Fixed scroll handler memory leak, hook deps, GSAP cleanup
- Quality score: 7.5/10 → 8.5-9.0/10

---

### Phase 0 — Infrastructure & Architecture ✅ (2026-01-17)

**[Full doc →](./docs/phase-0-infrastructure.md)**

- Strapi v5 + PostgreSQL 16 + pgVector + Docker Compose
- 15 pages, 24 API clients, Footer, RSS, Sitemap, 500 error page
- Vercel (frontend) + Railway (CMS) deployment pipeline

---

### Phase 2 — Component Architecture ✅ (2026-02-02)

**[Full doc →](./docs/phase-2-component-architecture.md)**

- Template system (Editorial, Legal, Landing)
- 15 specialized utility modules, 6 common components
- Scene directory flattened (depth 3 → 2), all 8 sections < 120 lines
- CMS-driven navigation + footer via `strapi-plugin-navigation`

---

### Phase 3 — Performance Optimization ✅ (2026-02-04)

**[Full doc →](./docs/phase-3-performance.md)**

- **74.3% bundle reduction** — 410KB → 105KB gzipped (target was 63%)
- Lazy loading: `AnimationCanvas` (-302KB), modals, atmospheric layers
- Three.js `frameloop='demand'`; Time to Interactive: 5-6s → 1.5-2s

---

### Phase 4 — Developer Experience ✅ (2026-05-11)

**[Full doc →](./docs/phase-4-developer-experience.md)**

- ✅ 16 specialized packages (`@aazucena/*`) — scaffolded and integrated into `apps/portfolio/`
- ✅ 373+ Storybook stories (260 component, 94 form, MDX docs) — publicly hosted
- ✅ Design system: 7 tokens, 18 themes, 35 platform integrations
- ✅ 94 form templates + 48 Zod schemas (`@aazucena/forms`)
- ✅ TypeScript strict mode (all apps) + Git hooks (Husky + lint-staged)
- ✅ CI: `type_check_packages`, `type_check_apps`, `build_storybook`, `test_storybook` all green
- ✅ Portfolio & CMS version upgrades complete
- ✅ Public Storybook hosting live
- ⏳ Chromatic — deferred (requires paid plan)
- ⏳ Figma Design System — deferred

---

### Phase 5 — Testing & Quality 🔥 (current)

**[Full doc →](./docs/phase-5-testing.md)**

- Vitest unit tests (hooks, utilities) — 70-80% coverage target
- Playwright E2E (critical user flows — 100% coverage target)
- Chromatic visual regression (first baseline + CircleCI job)

---

## 🎵 Feature Implementations

| Feature                   | Timeline      | Docs                                                          |
| ------------------------- | ------------- | ------------------------------------------------------------- |
| AZUCENA_LYTICS v1         | ✅ 2026-02-04 | [docs →](./docs/features/azucena-lytics-plan.md)              |
| AI-Powered Forms          | Post-Phase 5  | [docs →](./docs/features/ai-forms.md)                         |
| Vercel AI SDK Integration | Post-Phase 5  | [docs →](./docs/features/ai-forms.md)                         |
| Music Player              | Post-Phase 5  | [docs →](./docs/features/music-player.md)                     |
| Strudel.cc Live Coding    | Post-Phase 5  | [docs →](./docs/features/strudel-integration.md)              |
| Machine Learning Features | Post-Phase 5  | [docs →](./docs/features/machine-learning.md)                 |
| Strapi Plugin Icons v2.0  | Post-Phase 5  | [docs →](./docs/features/strapi-plugin-icons-field/README.md) |
| Logging & Monitoring      | Post-Phase 5  | [docs →](./docs/features/logging-monitoring.md)               |
| Payments (Stripe + Ko-fi) | Post-Phase 5  | [docs →](./docs/features/payments.md)                         |

---

## 🏛️ Ecosystem Expansion: The Utilitarian Nodes

**[Full overview →](./docs/ecosystem/README.md)** — contingent on 100% core stack polish.

| Node             | Domain                 | Purpose                                      |
| ---------------- | ---------------------- | -------------------------------------------- |
| AAZUCENA_SONA    | `cv.aazucena.com`      | Recruitment re-ranking + dossier generation  |
| AAZUCENA_LEDGE   | `wiki.aazucena.com`    | Public engineering wiki                      |
| AAZUCENA_DAR     | `radar.aazucena.com`   | GitHub-integrated roadmap + issue voting     |
| AAZUCENA_DIO     | `studio.aazucena.com`  | Live-coding studio + data-modulated radio    |
| AAZUCENA_SIM     | `play.aazucena.com`    | Playable technical mission with agentic NPCs |
| AAZUCENA_CLE     | `cli.aazucena.com`     | CLI-first RAG terminal for digital twin      |
| AAZUCENA_SCHOLAR | `scholar.aazucena.com` | HCI + Recommender Systems research hub       |

---

## ⏱️ Execution Timeline

```
Phase 1  (Animations)       →  9-11 days  ✅
Phase 1.5 (Code Quality)    →  0.5-1 day  ✅
Phase 0  (Infrastructure)   → 16-20 days  ✅
Phase 2  (Components)       →  6-8 days   ✅
Phase 3  (Performance)      →  4-6 days   ✅
Phase 4  (Developer XP)     → 19-21 days  🚧 ~95%
Phase 5  (Testing)          →  5-8 days   ⏳
Features (as needed)        →  3-40 days each
```

**Total core phases:** ~61-75 days

---

## 📊 Success Metrics

| Area                     | Target                              |
| ------------------------ | ----------------------------------- |
| Bundle size              | < 150KB gzipped ✅ (105KB achieved) |
| Time to Interactive      | < 3.5s ✅ (1.5-2s achieved)         |
| Lighthouse               | 90+                                 |
| Unit test coverage       | 70-80%                              |
| Critical user flows      | 100% E2E                            |
| AI intent classification | > 95% accuracy                      |
| AI response latency      | < 2s                                |

---

## 🎯 Why This Order?

- **Phase 1 first** — clean animation foundation before infrastructure complexity
- **Phase 1.5 before Phase 0** — eliminate CVEs and memory leaks before Docker/CMS adds surface area
- **Performance after architecture** — measure accurately once structure is stable
- **Testing last** — test after all components are refactored and packages are integrated

---

**Last Updated:** 2026-04-18 | **Next Milestone:** Begin Phase 5 (Testing)

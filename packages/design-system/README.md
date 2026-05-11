# @aazucena/design-system : Intelligence_Core_Tokens

## SUMMARY

Centralized source of truth for the aazucena ecosystem’s visual and behavioral identity. Engineered for high-precision telemetry dashboards and intelligence-gated interfaces.

---

## 🛠️ TOOLKIT_MANIFEST

| System            | Protocol       | Description                                                                                  |
| :---------------- | :------------- | :------------------------------------------------------------------------------------------- |
| **Color_System**  | OKLCH          | Perceptually uniform color scales optimized for neural state visualization.                  |
| **Type_Scale**    | Fira_Sans/Code | Mathematical typography system optimized for technical legibility and data density.          |
| **Phase_Tokens**  | MG / EG        | Semantic transition tokens representing Agentic Reasoning (Midgame) and Synthesis (Endgame). |
| **Grid_Protocol** | 4px_Baseline   | Strict mathematical spacing grid for terminal-grade alignment.                               |

---

## 🏗️ SYSTEM_FACTORIES

### [Tokens] : The_Bedrock

- **Location:** `src/tokens/`
- **Logic:** Raw design primitives (colors, spacing, shadows).
- **Generator:** `exports/figma.json` (Design-to-Code handshake).

### [Tailwind] : The_Preset

- **Location:** `src/exports/tailwind.ts`
- **Logic:** Auto-generated configuration for workspace applications.
- **Plugins:** Includes `typography` and `animate-css` for complex state transitions.

### [CSS_Variables] : The_Runtime

- **Location:** `src/styles/tokens.css`
- **Logic:** Low-level runtime access for Three.js shaders and D3.js visualizations.

### [Integration_Layer] : The_Adapters

- **Location:** `src/integrations/`
- **Logic:** 35 specialized adapters for translating tokens into platform-specific formats (HEX, Integer, JSON).
- **Coverage:** Stripe, Monaco, Strapi, LangSmith, Mapbox, GitHub, and more.

---

## ⚡ CLI_INTERFACE : `azds`

### [Binary] : Design_System_Controller

- **Command:** `azds` (**Az**ucena **D**esign **S**ystem)
- **Location:** `dist/cli.js` (compiled from `scripts/cli.ts`)
- **Protocol:** Interactive + Non-interactive execution modes

### Quick_Start

```bash
# Build binary
pnpm build

# Interactive mode (recommended)
azds

# Quick commands
azds --help                              # Show command reference
azds css                                 # Generate CSS variables
azds figma                               # Generate Figma design tokens
azds all default FAVICON_MAIN ./dist    # Full sync
```

### Why\_"azds"?

- **Ergonomics:** 4-character command - optimized for terminal velocity
- **Semantics:** **Az**ucena **D**esign **S**ystem - zero ambiguity
- **Convention:** Follows industry patterns (jest, vite, pnpm, tsup)

### Command_Matrix

| Action       | Output                 | Use_Case                                 |
| ------------ | ---------------------- | ---------------------------------------- |
| `azds css`   | `dist/css-vars.css`    | Theme updates, CSS variable regeneration |
| `azds figma` | `figma.json`           | Design handoff, DTCG token export        |
| `azds all`   | CSS + Figma + Favicons | Full system sync before deployment       |

### Documentation

- **Full Reference:** `docs/cli-usage.md`
- **Available Vibes:** 18 themes (default, cyberpunk, glass, seasonal variants)
- **Asset Keys:** `FAVICON_MAIN`, `FAVICON_ALT`

---

## 🚦 PHASE_PROTOCOLS (MG/EG)

The design system enforces specific visual behaviors based on the Agentic Lifecycle:

1. **PHASE_MIDGAME (MG):**
   - **UI_State:** High-density reasoning logs, pulsing primary-500 indicators.
   - **Timing:** Snug transitions (300ms) to maintain "Thinking" momentum.
2. **PHASE_ENDGAME (EG):**
   - **UI_State:** Clean Markdown rendering, success-500 accents.
   - **Timing:** Relaxed entrances (700ms) for final synthesis delivery.

---

## ✅ VERIFICATION_SUITE

- **Accessibility:** WCAG AA/AAA compliance via OKLCH lightness mapping.
- **Performance:** Zero runtime overhead; all tokens are statically generated.
- **Sync:** Bi-directional consistency between Figma, Storybook, and Production.

---

**VERSION:** 1.0.0
**PROVIDER:** aazucena_intelligence_engine

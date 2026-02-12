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

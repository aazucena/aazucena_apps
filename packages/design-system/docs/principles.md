# [Principles] : Intelligence_UI_Philosophy

## SUMMARY

Core design tenets for the aazucena ecosystem. Every component and interface must prioritize data integrity, agentic state awareness, and high-performance developer experience.

---

## 1. DATA_DENSITY_OVER_BLOAT

Interfaces are engineered for the **Operator**, not the passive observer.

- **Guideline:** Maximize information density in `AZUCENA_LYTICS` dashboards using the 4px baseline grid.
- **Protocol:** Prefer `Fira Code` for telemetry data and `Fira Sans` for UI labels.

## 2. AGENTIC_STATE_AWARENESS (MG/EG)

The UI must never be a "black box." Users must always know if an agent is **Reasoning** (Midgame) or **Synthesizing** (Endgame).

- **MG Protocol:** Use pulsing primary-500 accents and "thought trace" typography.
- **EG Protocol:** Use static, bold emerald-500 or cyan-500 accents for verified outputs.

## 3. NEURAL_HANDSHAKE (THE_FIREWALL)

Interaction is a privilege, not a default.

- **Tenet:** High-value resources (like the Scheduler) are "Locked" states.
- **Component Design:** Components must support three states: `REDACTED`, `INFERENCE`, and `UNLOCKED`.

## 4. PERCEPTUAL_ACCURACY (OKLCH)

Color is information.

- **Tenet:** We use the OKLCH color space to ensure that a 50% "Warning" amber has the same perceived brightness as a 50% "Operational" cyan.
- **Outcome:** Bi-modal (Light/Dark) consistency is mathematically guaranteed.

## 5. REUSABLE_FACTORIES

We build **Toolkit Systems**, not just layouts.

- **Tenet:** Every complex component must follow the "Factory Pattern"—it should be easily re-instantiated with different data providers while maintaining behavioral consistency.

---

**STATUS:** 🛡️ ENFORCED
**AUTHOR:** aazucena_core_terminal

# 🎹 AAZUCENA_DIO // `studio.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-4--ambitious--long-horizon-nodes)

**The Frequency Node // Generative Audio Lab & Sonification Station**

- **Tier:** 4 — Ambitious & Long-Horizon Node
- **Language:** Haskell (Servant backend)
- **Frontend:** Vite + React SPA (no meta-framework)
- **Build prerequisite:** LYTICS live + Portfolio music section live + ⚠️ Haskell proficiency spike required

---

## Overview

- **Polyglot Challenge:** **Haskell** for the functional sound synthesis and pattern logic.
- **Core Utility:** Solves "Passive Listening." Turns your music background into an interactive technical showcase of sound engineering.

> ⚠️ **Risk note:** Haskell has the steepest learning curve of any language in the ecosystem. Servant is non-trivial. Complete a dedicated Haskell spike before starting this node — do not attempt DIO as a first Haskell project.

---

## Detailed Functionality

- **Interactive Strudel Sandbox:** A live-coding studio pre-loaded with your **TidalCycles** code patterns. Visitors can edit the music patterns in the browser to hear real-time sound changes.
- **LYTICS-Modulated Focus Radio:** A persistent ambient focus stream. The music's BPM, timbre, and glitch-density are modulated in real-time by the live signal pulses from `analytics.aazucena.com`.
- **Oscilloscope Audit:** High-fidelity technical visualizations (via `wavesurfer.js`) providing frequency distribution and dynamic range data for every composition.

---

## Technical Implementation

- **Stack:** Vite + React SPA + Strudel.cc + Web Audio API + wavesurfer.js + Haskell (Servant backend).
- **Why Vite + React SPA (no meta-framework):** DIO is a studio — a single persistent session, not a content site. There's no need for SSR, file-based routing, or static generation. A plain Vite SPA gives fast HMR, full access to `@aazucena/ui`, `@aazucena/hooks`, and `@aazucena/animations` without any framework overhead or bridge complexity.
- **Why not Svelte:** Strudel.cc and the Web Audio API run on a separate audio thread — React's reconciler runs on the main thread and doesn't compete with the audio engine. The performance argument for Svelte doesn't hold in DIO's actual architecture. Keeping React preserves full `@aazucena/ui` component access and eliminates the only framework exception in an otherwise React-consistent frontend layer.
- **Logic:** Data-to-MIDI/Oscillator mapping using ClickHouse telemetry.
- **Data Flow:** `LYTICS stream` → `Haskell audio mapping engine` → `Strudel.cc pattern update` → `Web Audio API` → `wavesurfer.js visualization`.

---

## Visual Persona

"Cyber-Acoustic Studio." Glowing neon waveforms (Cyan/Coral), oscilloscopes, and integrated code editors.

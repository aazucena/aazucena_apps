# 💼 AAZUCENA_SONA // `cv.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-1--foundation-nodes)

**The Projection Node // Recruitment Velocity Tool**

- **Tier:** 1 — Foundation Node
- **Language:** Java (Spring Boot)
- **Frontend:** Remix (loader/action model)
- **Build prerequisite:** Strapi live + Portfolio live

---

## Overview

- **Polyglot Challenge:** **Java (Spring Boot)** for the enterprise-grade dossier engine.
- **Core Utility:** Solves "Scanning Friction" for technical recruiters and CTOs.

---

## Detailed Functionality

- **Quantum Toggling:** Visitors select a professional lens (e.g., _Lead Architect_, _Creative Developer_, _System Engineer_). The site instantly re-ranks and filters the Strapi `api::experience` and `api::project` data to project the most relevant sub-identity.
- **Dynamic Dossier Engine:** A headless PDF generation service (e.g., using Puppeteer/Playwright) that converts the active persona view into a branded, high-fidelity resume on the fly.
- **Persona Persistence:** Syncs the chosen persona across the entire ecosystem using the `az_active_persona` key in `localStorage`.

---

## Technical Implementation

- **Stack:** Remix (loader/action model) + Framer Motion.
- **Why Remix:** Each persona lens is a Remix route loader — persona switch triggers a server-side data fetch that re-ranks and filters Strapi data for that specific role. Progressive enhancement means the toggle works before JS hydrates. The loader/action pattern is a natural fit for dossier generation: the PDF action fires server-side, credentials never touch the browser.
- **Why Spring Boot over Quarkus:** Persistent service — cold-start irrelevant. JasperReports for high-fidelity PDF generation is mature on Spring, not Quarkus.
- **Logic:** Dynamic sorting algorithm based on Strapi relations.
- **Data Flow:** `Strapi` → `Remix loader (role-based transformer)` → `UI`.

---

## Visual Persona

Zero-latency, minimalist "High-Density" UI. White-label professional aesthetic with SHADES gradient accents.

# 🎓 AAZUCENA_SCHOLAR // `scholar.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-4--ambitious--long-horizon-nodes)

**The Wisdom Node // Academic Laboratory & Research Repository**

- **Tier:** 4 — Ambitious & Long-Horizon Node (last in tier — needs full ecosystem for benchmarking)
- **Language:** Python (FastAPI + Research Stack)
- **Frontend:** Astro (static pages) + Remix (`/lab/` dynamic layer)
- **Build prerequisite:** LYTICS live + Intel Engine live + ⚠️ all other nodes live for full benchmarking layer

> ⚠️ **Phased launch:** The static research pages (Astro — publications, SoP, education) can ship as a standalone site before `/lab/` is ready. Split the release: Astro first, Remix + FastAPI after.

---

## Overview

- **Polyglot Challenge:** **Python (Research Stack)** for the data science analysis and experimental layers.
- **Core Utility:** Solves "Theory-Practice Gap." Bridges the distance between academic research (HCI/RecSys) and production-grade software engineering.

---

## Detailed Functionality

- **Experimental Layer (HCI):** A toggleable "Research Mode" on the main portfolio. Visitors can opt-in to user studies where high-fidelity telemetry (scroll velocity, focus-heatmaps, interaction pathing) is anonymized and streamed to **ClickHouse** to test hypotheses about 3D navigation and information density.
- **Explainable RecSys Sandbox:** An interactive playground for **Recommender Systems**. Users can visualize how different algorithms (e.g., _Collaborative Filtering_ vs. _Content-Based RAG_) would re-rank the portfolio's projects. It includes a "Rationale" overlay explaining _why_ a specific project was recommended.
- **Architectural Scaffolding (SE Education):** A pedagogical breakdown of the monorepo's 16 packages. It tracks a learner's "discovery path" through the code, identifying which design patterns (CVA, Zod, GSAP) they've interacted with and providing just-in-time "Contextual Lessons."
- **Interactive Research Statement:** A dynamic version of the Statement of Purpose (SoP). Key research claims are hyperlinked directly to live code modules, telemetry datasets, or interactive visualizations in the portfolio, proving "Technical Feasibility" to admissions committees.

---

## Technical Implementation

- **Stack:** Astro (static pages) + Remix (`/lab/` dynamic layer) + FastAPI + ClickHouse + D3.js.
- **Why Astro for static pages:** The academic core — research interests, publications, SoP, education — is pure static content. Astro's zero-JS default keeps the "Austerity of the Professor" aesthetic honest.
- **Why Remix for `/lab/`:** The RecSys sandbox and HCI experiment pages are dynamic: each experiment is a Remix route with a server loader streaming fresh ClickHouse telemetry. Form actions handle hypothesis submissions. Progressive enhancement keeps the lab accessible even if JS fails.
- **Why FastAPI:** Python's data science ecosystem (NumPy, Pandas, scikit-learn) runs in FastAPI. The `/lab/` endpoints proxy to FastAPI for actual analysis — Remix handles routing and UI, Python handles the math.
- **Logic:** Hypothesis-driven A/B testing framework. Vercel Middleware gates research mode opt-in.
- **Data Flow:** `User Interaction` → `Edge Telemetry` → `ClickHouse` → `FastAPI analysis` → `Remix loader` → `D3 visualization`.

---

## Core Content Modules (Student Researcher Edition)

- **Research Interests:** Concise bullet points on HCI, RecSys, and SE Education.
- **Education:** Degree progress, GPA, and specific "Relevant Coursework" highlights.
- **Publications & Reports:** A repository of papers, preprints, and exhaustive technical reports.
- **Selected Projects (Deep Dives):** The "Scientific Appendix" for your portfolio code — explaining methodology and data structures.
- **Experience:** RA roles, internships, and industry experience with an academic lens.
- **Honors & Awards:** Recognition of academic and technical excellence.
- **Contact:** Formal academic identification (ORCID, LinkedIn, Institution Email).

---

## Dual Audience Split

| Section             | Audience                                  | Stack           | Aesthetic                                                             |
| ------------------- | ----------------------------------------- | --------------- | --------------------------------------------------------------------- |
| Static pages (root) | Admissions committees, recruiters         | Astro           | "Austerity of the Professor" — LaTeX-inspired serif, zero distraction |
| `/lab/`             | Researchers, Aldrin, SCHOLAR benchmarking | Remix + FastAPI | Data-dense, interactive, experiment-driven                            |

The two surfaces must not bleed into each other visually. A committee reviewer landing on `/lab/` mid-benchmark breaks the "intentional plain" promise.

---

## Future Evolution (PhD+ Horizon)

- **Teaching & Pedagogy:** Evolution from "Instructional Design" to formal course materials and monorepo-as-a-curriculum.
- **Student Mentorship:** Transition from "Collaborators" to managing a dedicated research lab and tracking student publications.
- **Academic Service:** Peer review contributions, conference organization, and committee leadership.
- **Openings:** Formal calls for Graduate Assistantships (GAs) and Post-Doc research opportunities.

---

## Visual Persona

"The Intentional Plain." Adopts the "Austerity of the Professor" aesthetic — high-density typography (LaTeX-inspired Serif), single-column layouts, and zero-distraction navigation. Signals "Information Over Decoration" to admissions committees.

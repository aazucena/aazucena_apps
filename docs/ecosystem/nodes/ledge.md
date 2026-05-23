# 🗃️ AAZUCENA_LEDGE // `wiki.aazucena.com`

📍 **Ecosystem:** [README](../README.md) | [Ideation Plan](../IDEATION_PLAN.md) | [Build Sequence](../IDEATION_PLAN.md#tier-2--knowledge--intelligence-nodes)

**The Memory Node // Public Engineering Wiki & Blueprint Repository**

- **Tier:** 2 — Knowledge & Intelligence Node
- **Language:** C/C++ (WASM via Emscripten)
- **Frontend:** Gatsby (Static) + MDX
- **Build prerequisite:** Intel Engine live + documentation corpus seeded from `docs/`

---

## Overview

- **Polyglot Challenge:** **C/C++** for the low-level knowledge graph indexer.
- **Core Utility:** Solves "Knowledge Decay." Codifies complex technical wins into permanent, reusable solutions.

---

## Detailed Functionality

- **Blueprint Foundry:** Every technical hurdle solved (e.g., _ClickHouse RBAC implementation_) is documented as an "Engineering Blueprint." These are highly structured specifications with copy-pasteable XMLs, Zod schemas, and verified code blocks.
- **pgVector Semantic Search:** A natural-language search bar powered by the **Internal RAG**. Users type a problem, and the WIKI retrieves the exact solution chunk from the monorepo's documentation.
- **Interconnectivity Graph:** A D3 force-directed graph showing how technologies are interconnected within the aazucena stack (e.g., _Astro_ → _ClickHouse_ → _D3_).

---

## Technical Implementation

- **Stack:** Gatsby (Static) + MDX + C/C++ WASM (Emscripten) + pgVector.
- **Why Gatsby:** The GraphQL data layer at build time pulls all MDX blueprints into a static graph — every blueprint is queryable at build, no runtime API needed. Gatsby's incremental builds mean adding a new blueprint only rebuilds affected nodes, not the whole site.
- **Why C/C++ WASM:** The trie-based client-side search index is compiled from C/C++ to WASM via Emscripten. Result: instant prefix-search in the browser with zero network round-trip — the polyglot story lands directly in the search bar. SCHOLAR benchmarks this against pgVector's semantic search to compare exact-match vs. embedding-based retrieval.
- **Logic:** Automated indexing via the `Intel Engine` indexer.
- **Data Flow:** `Markdown` → `Gatsby GraphQL (build)` → `C/C++ trie (WASM, client)` + `pgVector (semantic, server)`.

---

## Visual Persona

"Library of the Future." Dark-mode monospace markdown, hierarchical navigation, and technical diagrams.

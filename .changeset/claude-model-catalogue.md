---
'@aazucena/constants': minor
'@aazucena/utils': patch
'@aazucena/api': patch
---

One Claude model catalogue (`CLAUDE_MODELS`, `MODEL_PRICES`) replaces `AI_MODELS` and `AI_PRICING`. AI costs come from a single `calculateAiCost`, priced from the gateway's list; the savings baseline is Claude Opus 5.5.

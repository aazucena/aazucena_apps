---
'@aazucena/constants': minor
'@aazucena/utils': patch
'@aazucena/api': patch
---

One Claude model catalogue (`CLAUDE_MODELS`, `MODEL_PRICES`) replaces `AI_MODELS` and `AI_PRICING`. AI costs come from a single `calculateAiCost`, priced from the gateway's list; the savings baseline is Claude Opus 5.5.

Stored history doesn't change: the analytics ingest writes `cost_usd` and `savings_usd` into ClickHouse (`analytics.ai_intelligence`) when an event arrives. Rows written before this release use the old baseline (Opus 4.7, priced at $15/$75) and the old Opus 4.7 and Haiku 4.5 prices; rows after it use Opus 5.5 and the gateway prices. Savings totals that span the release drop at that point for the same token volume; that is the baseline change, not a change in usage.

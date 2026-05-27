-- 🥉 AZUCENA_LYTICS // Bronze Layer — Raw Ingest Archive
-- Stores validated payloads exactly as received, before any server-side enrichment.
--
-- PURPOSE: Replay buffer. If enrichment logic changes (new geo provider, updated AI
-- cost model, improved UA parsing), raw events can be re-processed without
-- re-ingesting from the original source.
--
-- NOTE: This table stores data AFTER Zod schema validation but BEFORE:
--   - IP normalization (UAParser)
--   - Geo resolution (Vercel edge headers → enrichedData)
--   - AI cost calculation (calculateAiCost / calculateHypotheticalCost)
--
-- TTL: 30 days — Bronze is a replay buffer, not long-term storage.
--      Summaries (Gold) are kept for 2 years; raw Bronze only needs to
--      cover recent enrichment mistakes.

CREATE TABLE IF NOT EXISTS analytics.raw_ingest
(
    `received_at`    DateTime('UTC') DEFAULT now() CODEC(Delta, LZ4),
    `event_type`     LowCardinality(String),    -- discriminator: 'telemetry_event', 'ai_event', etc.
    `raw_payload`    String CODEC(ZSTD(3)),      -- JSON body as received, pre-enrichment
                                                 -- ZSTD(3): JSON is highly compressible repetitive text;
                                                 -- level 3 gives ~60-70% better ratio than level 1
    `source_ip`      String CODEC(ZSTD(1)),      -- raw x-forwarded-for header (pre-normalization)
    `raw_user_agent` String CODEC(ZSTD(1)),      -- raw User-Agent string (pre-UAParser)
    `geo_country`    LowCardinality(String),     -- x-vercel-ip-country (Vercel edge header)
    `geo_city`       String CODEC(ZSTD(1)),      -- x-vercel-ip-city (Vercel edge header)
    `geo_lat`        String DEFAULT '',          -- x-vercel-ip-latitude (empty string = absent)
    `geo_lon`        String DEFAULT '',          -- x-vercel-ip-longitude (empty string = absent)
    `ingest_version` UInt8 DEFAULT 1            -- bump this in code when enrichment logic changes;
                                                 -- enables targeted replay: WHERE ingest_version = N
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(received_at)
ORDER BY (event_type, received_at)
TTL received_at + INTERVAL 30 DAY
SETTINGS index_granularity = 8192;


-- REPLAY REFERENCE
-- To find all events that used a specific enrichment version:
--
--   SELECT event_type, raw_payload, source_ip, raw_user_agent, geo_country
--   FROM analytics.raw_ingest
--   WHERE ingest_version = 1
--     AND received_at >= subtractDays(now(), 30)
--   ORDER BY received_at ASC;
--
-- To count Bronze coverage by event type:
--
--   SELECT event_type, count() AS total
--   FROM analytics.raw_ingest
--   WHERE received_at >= subtractDays(now(), 7)
--   GROUP BY event_type
--   ORDER BY total DESC;

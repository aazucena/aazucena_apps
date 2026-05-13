-- 📬 AZUCENA_LYTICS // Comms Events Schema
-- Adds analytics tables for portfolio contact form submissions and easter egg completions.
-- Run after 01_init_analytics_schema.sql

-- ─── 1. FORM SUBMISSIONS ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics.form_submissions
(
    -- Shared enrichment columns (from ingest enrichedData)
    `timestamp`    DateTime('UTC') DEFAULT now() CODEC(Delta, LZ4),
    `sessionId`    String,
    `url`          String CODEC(ZSTD(1)),
    `ip_address`   IPv4,
    `userAgent`    String CODEC(ZSTD(1)),
    `device_type`  LowCardinality(String),
    `os`           LowCardinality(String),
    `browser`      LowCardinality(String),
    `country`      LowCardinality(String),
    `city`         String CODEC(ZSTD(1)),
    `latitude`     Float32,
    `longitude`    Float32,

    -- Form-specific columns
    `form_type`    LowCardinality(String),                -- e.g. contact_direct, contact_chatbot
    `source`       LowCardinality(String),                -- e.g. direct_form, ai_assistant
    `intent`       LowCardinality(String) DEFAULT '',     -- AI-detected intent (nullable → empty)
    `sentiment`    LowCardinality(String) DEFAULT '',     -- AI-detected sentiment (nullable → empty)
    `summary`      String DEFAULT '' CODEC(ZSTD(1)),      -- AI-generated summary
    `tags`         Array(LowCardinality(String))          -- AI-generated tags
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (form_type, source, toDate(timestamp), timestamp)
TTL timestamp + INTERVAL 365 DAY
SETTINGS index_granularity = 8192;


-- ─── 2. EASTER EGG COMPLETIONS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics.easter_egg_completions
(
    -- Shared enrichment columns
    `timestamp`          DateTime('UTC') DEFAULT now() CODEC(Delta, LZ4),
    `sessionId`          String,
    `url`                String CODEC(ZSTD(1)),
    `ip_address`         IPv4,
    `userAgent`          String CODEC(ZSTD(1)),
    `device_type`        LowCardinality(String),
    `os`                 LowCardinality(String),
    `browser`            LowCardinality(String),
    `country`            LowCardinality(String),
    `city`               String CODEC(ZSTD(1)),
    `latitude`           Float32,
    `longitude`          Float32,

    -- Egg-specific columns
    `egg_id`             String,
    `egg_name`           LowCardinality(String),
    `trigger_type`       LowCardinality(String),          -- konami | click_sequence | terminal_command | idle | cursor_pattern | rive
    `completion_time_ms` UInt32 DEFAULT 0,
    `attempt_count`      UInt16 DEFAULT 1,
    `metadata`           String DEFAULT '' CODEC(ZSTD(1)) -- Serialised JSON
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (egg_id, trigger_type, timestamp)
TTL timestamp + INTERVAL 180 DAY
SETTINGS index_granularity = 8192;


-- ─── 3. DAILY FORM SUMMARY (Materialized View) ───────────────────────────────

CREATE TABLE IF NOT EXISTS analytics.daily_form_summary
(
    `event_date`   Date,
    `form_type`    LowCardinality(String),
    `source`       LowCardinality(String),
    `total`        UInt64,
    `with_intent`  UInt64,
    `with_summary` UInt64
)
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, form_type, source)
TTL event_date + INTERVAL 730 DAY;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_daily_form_summary
TO analytics.daily_form_summary
AS SELECT
    toDate(timestamp)                 AS event_date,
    form_type,
    source,
    count()                           AS total,
    countIf(intent   != '')           AS with_intent,
    countIf(summary  != '')           AS with_summary
FROM analytics.form_submissions
GROUP BY event_date, form_type, source;


-- ─── 4. DAILY EGG SUMMARY (Materialized View) ────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics.daily_egg_summary
(
    `event_date`    Date,
    `egg_id`        String,
    `egg_name`      LowCardinality(String),
    `trigger_type`  LowCardinality(String),
    `completions`   UInt64,
    `avg_ms`        AggregateFunction(avg, UInt32),
    `avg_attempts`  AggregateFunction(avg, UInt16)
)
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, egg_id, trigger_type)
TTL event_date + INTERVAL 730 DAY;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_daily_egg_summary
TO analytics.daily_egg_summary
AS SELECT
    toDate(timestamp)             AS event_date,
    egg_id,
    egg_name,
    trigger_type,
    count()                       AS completions,
    avgState(completion_time_ms)  AS avg_ms,
    avgState(attempt_count)       AS avg_attempts
FROM analytics.easter_egg_completions
GROUP BY event_date, egg_id, egg_name, trigger_type;


-- ─── VERIFICATION ─────────────────────────────────────────────────────────────
-- SELECT name FROM system.tables WHERE database = 'analytics' ORDER BY name;

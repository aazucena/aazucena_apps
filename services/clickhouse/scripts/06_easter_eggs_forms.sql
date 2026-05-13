-- 🥚 AZUCENA_LYTICS // Easter Eggs & Form Submissions Schema
-- Phase 5.x: New event tables for easter_egg_completions and form_submissions.
-- NOTE: RBAC grants for these tables already exist in 03_rbac_security.sql.
--       Run this script AFTER 01_init_analytics_schema.sql.

-- ===========================================================================
-- 1. RAW EVENT TABLES
-- ===========================================================================

CREATE TABLE IF NOT EXISTS analytics.easter_egg_completions
(
    `timestamp`           DateTime('UTC') CODEC(Delta, LZ4),
    `ip_address`          String CODEC(ZSTD(1)),
    `userAgent`           String CODEC(ZSTD(1)),
    `device_type`         LowCardinality(String),
    `os`                  LowCardinality(String),
    `browser`             LowCardinality(String),
    `country`             LowCardinality(String),
    `city`                String CODEC(ZSTD(1)),
    `latitude`            Nullable(String),
    `longitude`           Nullable(String),
    `sessionId`           String CODEC(ZSTD(1)),
    `url`                 String CODEC(ZSTD(1)),
    `egg_id`              String,
    `egg_name`            String,
    `trigger_type`        LowCardinality(String),
    `completion_time_ms`  UInt32,
    `attempt_count`       UInt16,
    `metadata`            String CODEC(ZSTD(1))
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, egg_id, trigger_type, country)
TTL timestamp + INTERVAL 180 DAY
SETTINGS index_granularity = 8192;

CREATE TABLE IF NOT EXISTS analytics.form_submissions
(
    `timestamp`   DateTime('UTC') CODEC(Delta, LZ4),
    `ip_address`  String CODEC(ZSTD(1)),
    `userAgent`   String CODEC(ZSTD(1)),
    `device_type` LowCardinality(String),
    `os`          LowCardinality(String),
    `browser`     LowCardinality(String),
    `country`     LowCardinality(String),
    `city`        String CODEC(ZSTD(1)),
    `latitude`    Nullable(String),
    `longitude`   Nullable(String),
    `sessionId`   String CODEC(ZSTD(1)),
    `url`         String CODEC(ZSTD(1)),
    `form_type`   LowCardinality(String),
    `source`      LowCardinality(String),
    `intent`      Nullable(String) CODEC(ZSTD(1)),
    `sentiment`   LowCardinality(String),
    `summary`     Nullable(String) CODEC(ZSTD(1)),
    `tags`        Nullable(String) CODEC(ZSTD(1))
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, form_type, source, country)
TTL timestamp + INTERVAL 365 DAY
SETTINGS index_granularity = 8192;

-- ===========================================================================
-- 2. DAILY SUMMARY TABLES (Long-term aggregations, 2-year TTL)
-- ===========================================================================

CREATE TABLE IF NOT EXISTS analytics.daily_egg_summary
(
    `event_date`          Date,
    `egg_id`              String,
    `egg_name`            String,
    `trigger_type`        LowCardinality(String),
    `total_completions`   UInt64,
    `unique_players`      AggregateFunction(uniqCombined, String),
    `avg_completion_ms`   AggregateFunction(avg, UInt32),
    `avg_attempts`        AggregateFunction(avg, UInt16)
)
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, egg_id, trigger_type)
TTL event_date + INTERVAL 730 DAY
SETTINGS index_granularity = 8192;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_daily_egg_summary
TO analytics.daily_egg_summary
AS SELECT
    toDate(timestamp)             AS event_date,
    egg_id,
    egg_name,
    trigger_type,
    count()                       AS total_completions,
    uniqCombinedState(sessionId)  AS unique_players,
    avgState(completion_time_ms)  AS avg_completion_ms,
    avgState(attempt_count)       AS avg_attempts
FROM analytics.easter_egg_completions
GROUP BY event_date, egg_id, egg_name, trigger_type;

CREATE TABLE IF NOT EXISTS analytics.daily_form_summary
(
    `event_date`         Date,
    `form_type`          LowCardinality(String),
    `source`             LowCardinality(String),
    `country`            LowCardinality(String),
    `total_submissions`  UInt64,
    `unique_submitters`  AggregateFunction(uniqCombined, String)
)
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, form_type, source, country)
TTL event_date + INTERVAL 730 DAY
SETTINGS index_granularity = 8192;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_daily_form_summary
TO analytics.daily_form_summary
AS SELECT
    toDate(timestamp)            AS event_date,
    form_type,
    source,
    country,
    count()                      AS total_submissions,
    uniqCombinedState(sessionId) AS unique_submitters
FROM analytics.form_submissions
GROUP BY event_date, form_type, source, country;

-- ===========================================================================
-- 3. VERIFICATION
-- ===========================================================================
-- SELECT name, engine FROM system.tables WHERE database = 'analytics' AND name IN (
--     'easter_egg_completions', 'form_submissions',
--     'daily_egg_summary', 'daily_form_summary',
--     'mv_daily_egg_summary', 'mv_daily_form_summary'
-- ) ORDER BY name;

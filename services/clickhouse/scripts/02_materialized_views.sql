-- 🚀 AZUCENA_LYTICS // ClickHouse Performance Layer
-- Phase 4.4: Materialized Views for Accelerated Dashboards

-- NOTE: If you are getting "UNKNOWN_IDENTIFIER" errors, it means the tables exist with an old schema.
-- Uncomment these lines to reset them:
-- DROP TABLE IF EXISTS analytics.mv_daily_event_summary;
-- DROP TABLE IF EXISTS analytics.daily_event_summary;
-- DROP TABLE IF EXISTS analytics.mv_daily_ai_summary;
-- DROP TABLE IF EXISTS analytics.daily_ai_summary;
-- DROP TABLE IF EXISTS analytics.mv_daily_performance_vitals;
-- DROP TABLE IF EXISTS analytics.daily_performance_vitals;
-- DROP TABLE IF EXISTS analytics.mv_hourly_performance_vitals;
-- DROP TABLE IF EXISTS analytics.hourly_performance_vitals;
-- DROP TABLE IF EXISTS analytics.mv_daily_music_summary;
-- DROP TABLE IF EXISTS analytics.daily_music_summary;

-- 1. DAILY EVENT SUMMARY
CREATE TABLE IF NOT EXISTS analytics.daily_event_summary
(
    `event_date` Date,
    `total_events` UInt64,
    `page_views` UInt64,
    `music_plays` UInt64,
    `interactions` UInt64,
    `errors` UInt64,
    `unique_visitors` AggregateFunction(uniqCombined, String)
)
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date)
TTL event_date + INTERVAL 730 DAY;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_daily_event_summary
TO analytics.daily_event_summary
AS SELECT
    toDate(timestamp) AS event_date,
    count() AS total_events,
    countIf(event = 'PageView' OR event = 'Page View') AS page_views,
    countIf(event = 'MusicPlay' OR event = 'Music Play') AS music_plays,
    countIf(event = 'Interaction') AS interactions,
    countIf(event = 'Error' OR event = 'ClientError' OR event = 'Client_Error') AS errors,
    uniqCombinedState(sessionId) AS unique_visitors
FROM analytics.telemetry_events
GROUP BY event_date;

-- 2. DAILY AI INTELLIGENCE SUMMARY
CREATE TABLE IF NOT EXISTS analytics.daily_ai_summary
(
    `event_date` Date,
    `agent_name` LowCardinality(String),
    `model` LowCardinality(String),
    `total_calls` UInt64,
    `input_tokens` UInt64,
    `output_tokens` UInt64,
    `total_cost_usd` Float64,
    `total_savings_usd` Float64,
    `avg_latency_ms` AggregateFunction(avg, UInt32)
)
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, agent_name, model)
TTL event_date + INTERVAL 730 DAY;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_daily_ai_summary
TO analytics.daily_ai_summary
AS SELECT
    toDate(timestamp) AS event_date,
    agent_name,
    model,
    count() AS total_calls,
    sum(input_tokens) AS input_tokens,
    sum(output_tokens) AS output_tokens,
    sum(cost_usd) AS total_cost_usd,
    sum(savings_usd) AS total_savings_usd,
    avgState(latency_ms) AS avg_latency_ms
FROM analytics.ai_intelligence
GROUP BY event_date, agent_name, model;

-- 3. DAILY PERFORMANCE VITALS
CREATE TABLE IF NOT EXISTS analytics.daily_performance_vitals
(
    `event_date` Date,
    `metric_name` LowCardinality(String),
    `vitals_state` AggregateFunction(quantiles(0.75, 0.90, 0.99), Float64),
    `avg_latency` AggregateFunction(avg, Float64),
    `total_samples` UInt64,
    `good_samples` UInt64
)
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, metric_name)
TTL event_date + INTERVAL 730 DAY;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_daily_performance_vitals
TO analytics.daily_performance_vitals
AS SELECT
    toDate(timestamp) AS event_date,
    data['metric_name'] AS metric_name,
    quantilesState(0.75, 0.90, 0.99)(toFloat64(data['value'])) AS vitals_state,
    avgState(toFloat64(data['value'])) AS avg_latency,
    count() AS total_samples,
    countIf(data['rating'] = 'good') AS good_samples
FROM analytics.telemetry_events
WHERE event = 'PerformanceMetric'
GROUP BY event_date, metric_name;

-- 4. HOURLY PERFORMANCE VITALS
CREATE TABLE IF NOT EXISTS analytics.hourly_performance_vitals
(
    `event_hour` DateTime,
    `metric_name` LowCardinality(String),
    `avg_latency` Float64,
    `total_samples` UInt64
)
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(event_hour)
ORDER BY (event_hour, metric_name)
TTL event_hour + INTERVAL 90 DAY;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_hourly_performance_vitals
TO analytics.hourly_performance_vitals
AS SELECT
    toStartOfHour(timestamp) AS event_hour,
    data['metric_name'] AS metric_name,
    avg(toFloat64(data['value'])) AS avg_latency,
    count() AS total_samples
FROM analytics.telemetry_events
WHERE event = 'PerformanceMetric'
GROUP BY event_hour, metric_name;

-- 5. DAILY MUSIC SUMMARY
CREATE TABLE IF NOT EXISTS analytics.daily_music_summary
(
    `event_date` Date,
    `track_title` LowCardinality(String),
    `genre` LowCardinality(String),
    `total_plays` UInt64,
    `total_downloads` UInt64,
    `unique_listeners` AggregateFunction(uniqCombined, String),
    `avg_completion_pct` AggregateFunction(avg, UInt8)
)
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, track_title, genre)
TTL event_date + INTERVAL 730 DAY;

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_daily_music_summary
TO analytics.daily_music_summary
AS SELECT
    toDate(timestamp) AS event_date,
    track_title,
    genre,
    count() AS total_plays,
    sum(is_download) AS total_downloads,
    uniqCombinedState(sessionId) AS unique_listeners,
    avgState(completion_pct) AS avg_completion_pct
FROM analytics.music_playback
GROUP BY event_date, track_title, genre;

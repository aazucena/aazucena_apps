CREATE DATABASE IF NOT EXISTS analytics;

CREATE TABLE IF NOT EXISTS analytics.telemetry_events
(
    `id`           UUID DEFAULT generateUUIDv4(),
    `timestamp`    DateTime('UTC') DEFAULT now() CODEC(Delta, LZ4),
    `event`        LowCardinality(String),
    `url`          String CODEC(ZSTD(1)),
    `sessionId`    String,
    `userAgent`    String CODEC(ZSTD(1)),
    `ip_address`   IPv4,
    `country`      LowCardinality(String),
    `device_type`  LowCardinality(String),
    `os`           LowCardinality(String),
    `browser`      LowCardinality(String),
    `data`         Map(String, String)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (event, toDate(timestamp), sessionId, timestamp)
TTL timestamp + INTERVAL 90 DAY
SETTINGS index_granularity = 8192;

CREATE TABLE IF NOT EXISTS analytics.telemetry_events_buffer AS analytics.telemetry_events
ENGINE = Buffer(analytics, telemetry_events, 16, 10, 100, 10000, 1000000, 10000000, 100000000);

CREATE TABLE IF NOT EXISTS analytics.ai_intelligence (
    `timestamp`     DateTime('UTC') DEFAULT now() CODEC(Delta, LZ4),
    `trace_id`      String,
    `agent_name`    LowCardinality(String),
    `model`         LowCardinality(String),
    `input_tokens`  UInt32,
    `output_tokens` UInt32,
    `cost_usd`      Float64,
    `savings_usd`   Float64,
    `latency_ms`    UInt32,
    `form_type`     LowCardinality(String),
    `sessionId`     String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (agent_name, model, timestamp)
TTL timestamp + INTERVAL 180 DAY
SETTINGS index_granularity = 8192;

CREATE TABLE IF NOT EXISTS analytics.music_playback
(
    `timestamp`       DateTime('UTC') DEFAULT now() CODEC(Delta, LZ4),
    `track_id`        String,
    `track_title`     LowCardinality(String),
    `artist_name`     LowCardinality(String),
    `genre`           LowCardinality(String),
    `completion_pct`  UInt8,
    `is_download`     UInt8,
    `sessionId`       String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (track_title, timestamp)
TTL timestamp + INTERVAL 180 DAY
SETTINGS index_granularity = 8192;

CREATE TABLE IF NOT EXISTS analytics.system_integrity
(
    `timestamp`    DateTime('UTC') DEFAULT now() CODEC(DoubleDelta, LZ4),
    `service`      LowCardinality(String),
    `status`       LowCardinality(String),
    `latency_ms`   UInt32,
    `error_count`  UInt32 DEFAULT 0,
    `payload_size` UInt32 DEFAULT 0,
    `message`      String DEFAULT '' CODEC(ZSTD(1))
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (service, timestamp)
TTL timestamp + INTERVAL 14 DAY
SETTINGS index_granularity = 8192;

CREATE TABLE IF NOT EXISTS analytics.error_traces
(
    `timestamp`   DateTime('UTC') DEFAULT now() CODEC(Delta, LZ4),
    `issue_id`    String,
    `level`       LowCardinality(String),
    `message`     String CODEC(ZSTD(1)),
    `culprit`     String CODEC(ZSTD(1)),
    `release`     String,
    `environment` LowCardinality(String),
    `url`         String CODEC(ZSTD(1)),
    `user_id`     String,
    `tags`        Array(LowCardinality(String)),
    `sentry_url`  String CODEC(ZSTD(1))
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (level, timestamp)
TTL timestamp + INTERVAL 30 DAY
SETTINGS index_granularity = 8192;

CREATE TABLE IF NOT EXISTS analytics.financial_ledger
(
    `timestamp`      DateTime('UTC') CODEC(Delta, LZ4),
    `transaction_id` String,
    `provider`       LowCardinality(String),
    `amount`         Float64,
    `currency`       LowCardinality(String),
    `type`           LowCardinality(String),
    `status`         LowCardinality(String),
    `sessionId`      String,
    `customer_email` String CODEC(ZSTD(1)),
    `metadata`       Map(String, String)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (provider, status, timestamp)
TTL timestamp + INTERVAL 365 DAY
SETTINGS index_granularity = 8192;

CREATE TABLE IF NOT EXISTS analytics.vercel_traffic_daily
(
    `date` Date,
    `project_id` String,
    `pageviews` UInt64,
    `visitors` UInt32,
    `bounces` UInt32,
    `total_visits` UInt32,
    `avg_duration_sec` UInt16,
    `country` LowCardinality(String),
    `referrer_domain` LowCardinality(String),
    `device_type` LowCardinality(String)
)
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, project_id, country, referrer_domain, device_type)
SETTINGS index_granularity = 8192;

CREATE TABLE IF NOT EXISTS analytics.vercel_analytics_events
(
    `timestamp` DateTime('UTC') CODEC(Delta, LZ4),
    `id` String,
    `source` LowCardinality(String),
    `host` String CODEC(ZSTD(1)),
    `path` String CODEC(ZSTD(1)),
    `ua` String CODEC(ZSTD(1)),
    `country` LowCardinality(String),
    `city` String CODEC(ZSTD(1)),
    `browser` LowCardinality(String),
    `os` LowCardinality(String),
    `device` LowCardinality(String),
    `referer` String CODEC(ZSTD(1)),
    `project_id` String,
    `environment` LowCardinality(String)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, project_id)
SETTINGS index_granularity = 8192;

CREATE TABLE IF NOT EXISTS analytics.ai_trajectories
(
    `timestamp`     DateTime('UTC') DEFAULT now() CODEC(Delta, LZ4),
    `trajectory_id` String,
    `step_index`    UInt32,
    `state`         String CODEC(ZSTD(1)), -- Serialized JSON state
    `action`        LowCardinality(String),
    `reward`        Float32,
    `metadata`      String CODEC(ZSTD(1)), -- Serialized JSON metadata
    `sessionId`     String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (trajectory_id, step_index, timestamp)
TTL timestamp + INTERVAL 90 DAY
SETTINGS index_granularity = 8192;
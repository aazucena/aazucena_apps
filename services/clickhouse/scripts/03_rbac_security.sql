-- 🔒 AZUCENA_LYTICS // ClickHouse RBAC Security Layer
-- Phase 4.7: Security Hardening & Restricted Access

-- 1. TELEMETRY INGESTION USER
-- Restricted to INSERT-only on buffer and intelligence tables.
CREATE USER IF NOT EXISTS telemetry_ingest 
IDENTIFIED WITH sha256_password BY 'ingest_secret_pulse_2026';

GRANT INSERT ON analytics.telemetry_events_buffer TO telemetry_ingest;
GRANT INSERT ON analytics.ai_intelligence TO telemetry_ingest;
GRANT INSERT ON analytics.music_playback TO telemetry_ingest;
GRANT INSERT ON analytics.system_integrity TO telemetry_ingest;
GRANT INSERT ON analytics.error_traces TO telemetry_ingest;
GRANT INSERT ON analytics.financial_ledger TO telemetry_ingest;
GRANT INSERT ON analytics.vercel_analytics_events TO telemetry_ingest;
GRANT INSERT ON analytics.ai_trajectories TO telemetry_ingest;


-- 2. DASHBOARD VIEWER USER
-- Restricted to SELECT-only on analytics database and all materialized views.
CREATE USER IF NOT EXISTS dashboard_viewer 
IDENTIFIED WITH sha256_password BY 'viewer_secure_horizon_2026';

GRANT SELECT ON analytics.* TO dashboard_viewer;


-- 3. VERIFICATION
-- Check users and grants
-- SELECT name, networks, grantee_name, access_type FROM system.grants WHERE grantee_name IN ('telemetry_ingest', 'dashboard_viewer');

-- 🧹 AZUCENA_LYTICS // Data Retention (TTL) Strategy
-- Phase 5.1: Tiered Storage Optimization

-- 1. SHORT-TERM OPERATIONAL DATA (30 Days or less)
-- High frequency pulse data that loses utility quickly.
ALTER TABLE analytics.system_integrity MODIFY TTL timestamp + INTERVAL 14 DAY;
ALTER TABLE analytics.error_traces MODIFY TTL timestamp + INTERVAL 30 DAY;

-- 2. BEHAVIORAL & TRAJECTORY DATA (90 Days)
-- Provides a 3-month window for user journey auditing.
ALTER TABLE analytics.telemetry_events MODIFY TTL timestamp + INTERVAL 90 DAY;
ALTER TABLE analytics.ai_trajectories MODIFY TTL timestamp + INTERVAL 90 DAY;
ALTER TABLE analytics.hourly_performance_vitals MODIFY TTL event_hour + INTERVAL 90 DAY;

-- 3. AUDITING & ENGAGEMENT DATA (180 - 365 Days)
-- Financial and cost data kept longer for auditing.
ALTER TABLE analytics.ai_intelligence MODIFY TTL timestamp + INTERVAL 180 DAY;
ALTER TABLE analytics.music_playback MODIFY TTL timestamp + INTERVAL 180 DAY;
ALTER TABLE analytics.financial_ledger MODIFY TTL timestamp + INTERVAL 365 DAY;
-- TTL for easter_egg_completions and form_submissions is defined inline in 06_easter_eggs_forms.sql

-- 3b. EXTERNAL TRAFFIC DATA (1 Year)
-- Vercel log drain data — no personal data, but still bounded.
ALTER TABLE analytics.vercel_traffic_daily MODIFY TTL date + INTERVAL 365 DAY;
ALTER TABLE analytics.vercel_analytics_events MODIFY TTL timestamp + INTERVAL 365 DAY;

-- 4. LONG-TERM SUMMARIES (2 Years)
-- Pre-aggregated data for year-over-year growth analysis.
ALTER TABLE analytics.daily_event_summary MODIFY TTL event_date + INTERVAL 730 DAY;
ALTER TABLE analytics.daily_ai_summary MODIFY TTL event_date + INTERVAL 730 DAY;
ALTER TABLE analytics.daily_performance_vitals MODIFY TTL event_date + INTERVAL 730 DAY;
ALTER TABLE analytics.daily_music_summary MODIFY TTL event_date + INTERVAL 730 DAY;
-- TTL for daily_form_summary and daily_egg_summary is defined inline in 06_easter_eggs_forms.sql

-- 5. VERIFICATION
-- SELECT name, extract(create_table_query, 'TTL [^\n]+') AS ttl_expr FROM system.tables WHERE database = 'analytics' ORDER BY name;

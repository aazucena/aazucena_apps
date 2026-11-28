# ClickHouse practices and intel-bridge (design)

Date: 2026-11-27. Branch: `phase-5/next-release`. Status: brainstormed with the owner; not yet planned or built.

## Intent

The owner wants the analytics ClickHouse to be **cheaper and more reliable**. Cost matters because the Plausible ClickHouse once ran away to 4.21 GB of memory and pushed the Railway bill from about $5 to $50+ a month. Reliability matters because the live status page flips to MAINTENANCE about half the time, and schema, version and backups are not under control today.

The owner chose to **stay on Railway**. AWS may come later "if there's capacity", so nothing here should tie the database to Railway.

## Goals

1. **Bounded cost**: a hard memory ceiling inside ClickHouse and on the Railway service; one ClickHouse only (Plausible's goes with the Plausible removal).
2. **One known version**: the same exact ClickHouse version locally and on Railway, current, kept up to date by Renovate.
3. **Schema under control**: versioned migrations with a record of what ran, applied on deploy to existing volumes, replacing "init scripts run on a fresh volume only".
4. **Backups that survive the volume**: scheduled, kept off the ClickHouse volume, restorable, and pointable at AWS S3 later by configuration.
5. **Correct health signal**: intel-bridge reports often enough that the status page shows OPERATIONAL when everything is up.
6. **Cheap wins while the schema is open**: async inserts instead of the `Buffer` table, a session lookup that doesn't scan, and the content dimension for the Journey page.

## Non-goals

- Moving to ClickHouse Cloud ($66.52/month at 6 h/day activity, toward $186 always-on, because ingestion never idles) or to AWS this release.
- Moving analytics into Postgres.
- Rewriting the dashboards' queries beyond what the schema changes require.
- Plausible's own ClickHouse (removed with Plausible in its own change).

## Anti-goals

- Any change that loses existing analytics data.
- A memory cap so low that ClickHouse kills queries the dashboards run every day.
- A backup that has never been restored.

## Current state (2026-11-27)

- **Service**: `services/clickhouse`. Railway builds `Dockerfile` (`clickhouse/clickhouse-server:24.12-alpine`, with `logs.xml`, `low-resources.xml`, the low-resource profile, and `scripts/` copied into `/docker-entrypoint-initdb.d`). Local `compose.yml` runs `clickhouse/clickhouse-server:latest` with a 2 GB compose limit, and mounts both named volumes and `./data` / `./logs` onto the same paths.
- **Memory**: `low-resources.xml` sets `mark_cache_size` to 500 MB; no `max_server_memory_usage` anywhere; no Railway memory limit recorded in the repo.
- **Schema**: `scripts/01`–`07` (719 lines): `telemetry_events` (MergeTree, `PARTITION BY toYYYYMM(timestamp)`, `ORDER BY (event, toDate(timestamp), sessionId, timestamp)`, `data Map(String, String)`), `telemetry_events_buffer` (Buffer engine; written by `apps/analytics/src/app/api/ingest/route.ts`), AI, music, system integrity, error traces, comms, easter eggs and forms, Vercel traffic, daily rollups through materialized views (Summing/AggregatingMergeTree), TTLs from 14 days (system integrity) to 730 days (rollups), RBAC (`03`), and a bronze replay table `raw_ingest` (30-day TTL).
- **Backups**: `backup.sh` runs `BACKUP DATABASE analytics TO File(...)` through `docker exec` into a folder on the same volume. Nothing schedules it on Railway.
- **intel-bridge** (`services/intel-bridge`, Python 3.11, FastAPI, Railway): receives `/pulse/ai` and `/pulse/health` and forwards them to the analytics ingest endpoint; a heartbeat loop checks external services (Redis, ClickHouse ping) every `HEARTBEAT_INTERVAL`, default **1800 s**. The public health route (`apps/analytics/src/app/api/health/public/route.ts`) reports MAINTENANCE when no `system_integrity` row falls inside its 15-minute window, so with a 30-minute heartbeat the page shows MAINTENANCE about half the time. Dependencies: `clickhouse-connect==0.8.9`, `redis==5.0.8`, FastAPI 0.115.
- **Railway price basis**: RAM $10/GB-month, CPU $20/vCPU-month, volume $0.15/GB-month, billed on use.

## Approaches considered

|             | **Stay on Railway, fix how it runs (chosen)** | ClickHouse Cloud Basic                                               | Analytics in Postgres                                               |
| ----------- | --------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Cost        | about $5–15/month with a 1.5 GB cap           | $66.52 (6 h/day) toward $186 (always on)                             | lowest                                                              |
| Reliability | ours to run (this design)                     | managed                                                              | managed with the CMS DB                                             |
| Why not     | —                                             | 5–15× the cost; ingestion never idles, so scale-to-zero doesn't help | loses rollups, TTLs and fast scans, and the AZUCENA_LYTICS showcase |

## Design

### Memory and cost

- Add a server config (`config.d/memory.xml`) with `max_server_memory_usage` of 1.5 GB (1610612736 bytes), and per-query `max_memory_usage` in the default profile low enough that one query cannot take the whole server (the builder picks it from the dashboards' heaviest query; start around 1 GB). Keep `mark_cache_size` at 500 MB.
- Set a Railway memory limit on the service slightly above the server cap (about 2 GB) as the outer stop. The owner applies it in the dashboard; the repo documents the value.
- Keep the TTLs as they are; record them in one place (see migrations) so a later cost review reads one file.

### One version

- Pin one exact image tag (a current ClickHouse LTS, chosen on the day) in both `Dockerfile` and `compose.yml`; remove `latest`.
- Renovate (set up by the Strapi design) gets a rule for the ClickHouse image: patch updates within the LTS line auto-merge after CI; LTS-to-LTS moves need the owner.
- Fix the duplicate mounts in `compose.yml` (one data mount, one logs mount).

### Versioned migrations

- Turn `scripts/01`–`07` into the baseline of a migrations folder, plus a `schema_migrations` table recording each applied file and its checksum.
- A small runner (a script in the service image, or a lightweight tool such as `clickhouse-migrations`; builder's choice) runs on deploy before the server takes traffic, applies only files not yet recorded, and stops the deploy on a checksum mismatch.
- **Existing production volume**: the first run must not re-create what already exists. The runner inspects which baseline objects exist (`system.tables`) and records those files as applied, then applies anything missing. The builder writes this "adopt existing schema" step and tests it against a copy of a volume made with only `01`–`04`.
- Every later schema change in this design (async inserts, skip index, content dimension) is a numbered migration.

### Inserts

- Replace the `Buffer` table with **async inserts**: the ingest route writes to `telemetry_events` with `async_insert=1, wait_for_async_insert=1` (or `0` where losing the last few seconds on a crash is acceptable; builder decides per route and documents it). Drop `telemetry_events_buffer` in a migration after the route is switched and the buffer has flushed.
- Settle the `data` column: it is `Map(String, String)` and the journeys route still `JSON.parse`s it when it is a string. Pick one shape for writes and remove the dead branch; whether to move to ClickHouse's `JSON` type is the builder's call once the version is pinned (it must be GA in the chosen LTS).

### Session lookups

- Add a data-skipping index on `telemetry_events.sessionId` (`bloom_filter`, granularity chosen by the builder) and materialize it for existing parts; or a projection ordered by `(sessionId, timestamp)` if the index doesn't bring the Journey detail query under a target the builder measures. Verify with `EXPLAIN indexes = 1` and query timings on a realistic local dataset.

### Content dimension for the Journey page

- A small `content` table (or a ClickHouse dictionary backed by it): `url`, `title`, `content_type`, `tags`, `updated_at`, `ReplacingMergeTree(updated_at)` keyed by `url`.
- Fed by the **shared Strapi extractor** the retrieval design builds (public entries only, with title, type and URL); synced on Strapi publish and by a periodic full sync.
- The journeys API joins (or `dictGet`s) it so each step shows "Project · RPS Royale · React, Svelte" instead of a bare path. Unknown URLs fall back to the path.

### Backups

- **Now (owner decision, 2026-11-27): Railway storage buckets.** A scheduled job runs `BACKUP DATABASE analytics TO S3(...)` against a Railway bucket (S3-compatible endpoint, credentials from the environment), daily, with a retention the owner picks; old backups are pruned by the job. Remove `backup.sh`'s `docker exec` path, which cannot run on Railway.
- **Ready for AWS**: the same job points at AWS S3 by changing the endpoint and credentials, nothing else.
- **Restore drill**: once, restore the latest backup into a local container and run the dashboards' key queries against it; record the steps in the service README.

### intel-bridge becomes the one health owner (owner decision, 2026-11-27: option 1)

Today two services watch health and disagree (see the websocket design for the comparison): the websocket service HTTP-checks Strapi, ClickHouse, intel-bridge and the apps; intel-bridge pings Redis and ClickHouse and self-pulses; both default to every 30 minutes against a 15-minute status window, and they report the same service under different names (`strapi` vs `strapi-cms`, `clickhouse` vs `clickhouse-olap`). From this change, **intel-bridge owns all health; the websocket service does realtime only.**

- **One list of monitored services**: a `MONITORS` configuration (JSON from an environment variable, with a committed example; no hardcoded Docker hostnames or LAN IPs), each entry with a canonical id, a check type (HTTP status, JSON `status` field, Redis ping, ClickHouse ping) and a timeout. It replaces the websocket service's `monitors.json` and `BOOTSTRAP_CONFIG`.
- **One name per service**: canonical ids (for example `cms`, `clickhouse`, `redis`, `intel-bridge`, `intel-engine`, `portfolio`, `analytics`) used by every reporter: the bridge's checks, the CMS cron pulse, intel-engine's pulse. The status page maps old names to the canonical ones for history; a test fails if a reporter uses an id not in the list.
- **One cadence**: every check every **5 minutes** (default `HEARTBEAT_INTERVAL` 300 s), well inside the 15-minute window, in code and `.env.example`; the owner sets the same on Railway.
- **Every pulse authenticated**: `BRIDGE_INBOUND_SECRET` becomes required in production (the bridge refuses to start without it outside development), compared in constant time. Every caller sends `X-Bridge-Secret`: the CMS cron (`apps/cms/config/cron.ts`, today it sends none) and intel-engine's AI telemetry (`app/core/telemetry.py`, today it sends none); intel-engine's health pulse already does. A failed forward is logged with a counter, not swallowed.
- Report failures as DOWN rather than skipping the pulse, so a missing row always means "bridge down", not "bridge quiet".
- Pin and update dependencies (`clickhouse-connect`, `redis`, FastAPI, uvicorn, pydantic, requests), move to the same Python version as intel-engine, and keep `test_*` coverage for the pulse endpoints and the heartbeat with mocks.

## Verification

- Local: the pinned image starts with the memory config (check `system.server_settings`), the migration runner applies the baseline to an empty volume and adopts an existing one without changes, and applies the new migrations once.
- A load test against the local container (synthetic events through the ingest route) shows memory staying under the cap, and the dashboards' queries succeeding.
- The Journey detail query reads far fewer granules after the skip index (`EXPLAIN indexes = 1`), and returns the same rows.
- Async inserts: events land in `telemetry_events`, the buffer table is gone, and no ingest test regresses.
- intel-bridge unit tests with mocks; locally, with a 600 s interval, the public health route returns OPERATIONAL across a 30-minute run.
- Restore drill done once and written down.
- Production changes (Railway memory limit, heartbeat variable, migrations on the live volume, backups) only on the owner's go, with a backup taken first.

## Calls made after the builder check (author's, for the owner to check)

- **05 and 06 conflict.** `05_comms_events.sql` and `06_easter_eggs_forms.sql` both create `easter_egg_completions`, `form_submissions`, `daily_egg_summary`, `daily_form_summary` and their views with different shapes (`ip_address` IPv4 vs String, latitude Float32 vs Nullable(String), `tags` Array vs Nullable(String), different sort keys). With `IF NOT EXISTS` the first one wins silently. The baseline keeps the shape the ingest route writes (05: `tags` as an array); 06's duplicate definitions are removed. Adoption compares **column names and types** from `system.columns`, not only table existence, and stops with a report when production's shape differs.
- **Migrations are a gated step, not part of boot.** The server starts as today; the migration runner is a command the owner triggers after a backup (locally, in CI, then on Railway). A pending or mismatched migration raises a warning in the health output instead of blocking startup, so a bad file never takes ClickHouse down. A CircleCI job boots the pinned image, applies all migrations to an empty volume and to a fixture shaped like `01`–`04`, and runs smoke queries.
- **No auto-merge for the ClickHouse image.** A version bump restarts the only instance with its volume, so every ClickHouse bump waits for the owner, patch included (this overrides the Renovate rule in "One version").
- **Content table feed.** intel-engine's Strapi extractor writes `content` rows directly through a dedicated ClickHouse user with INSERT on `analytics.content` only (credentials from the environment), and owns the periodic full sync. This project ships the table, the user and the journeys API's path fallback; the feed is wired when the retrieval project lands. URLs are normalised to the path (no origin, no trailing slash, no query) on both sides of the join.
- **Grants**: `telemetry_ingest` has INSERT only on the buffer table; a migration grants INSERT on `telemetry_events` before the buffer is dropped. The ingest client already sends `async_insert=1, wait_for_async_insert=0`.
- **Committed passwords.** `03_rbac_security.sql` contains the two users' passwords in plain text in a public repo. The users move to environment-provided passwords (created by the runner from Railway variables), the committed values are removed, and the owner rotates both passwords on Railway. This is the most urgent item in the design and can land on its own first.

## Left to the builder

The exact LTS tag; the migration tool; per-query memory limits; skip-index granularity or projection; async-insert wait mode per route; the `data` column shape; the backup job's scheduler.

## Open for the owner

- Backup retention to keep in the Railway bucket (backups go to Railway storage buckets, owner decision 2026-11-27).
- **A dump of the production schema** before any migration work: `SHOW CREATE TABLE` for every table in `analytics`, `system.users`, `system.grants`, and rows and bytes per table (`system.parts`). The repo can't tell whether production has `05`–`07`, or which of the conflicting shapes; ingest already writes to `raw_ingest` and the form tables, and bronze insert errors are swallowed.
- **How the ClickHouse service deploys on Railway** (auto-deploy from a branch, or manual), so migrations and image bumps never reach production without the owner.
- The Railway memory limit and `HEARTBEAT_INTERVAL` are set in the Railway dashboard by the owner.

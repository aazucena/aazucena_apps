# Websocket realtime service (design)

Date: 2026-11-27. Branch: `phase-5/next-release`. Status: brainstormed with the owner; not yet planned or built.

## Intent

The owner wants the live feed for three things: watching visitors arrive in real time, keeping an eye on system health, and two-way features planned for later. So real websockets stay (one-way Server-Sent Events would mean a second system later). The service should follow websocket best practices: only logged-in users can listen, clients receive only what they subscribe to, and the service is reproducible and safe to run.

## Owner decisions (2026-11-27)

- **Approach A**: keep and harden the existing Socket.IO service on Railway (not a managed realtime vendor, not SSE).
- **Option 1**: split by job. The websocket service does **realtime delivery only**; its health checks move to intel-bridge, which owns all health (see [clickhouse-and-intel-bridge.md](./clickhouse-and-intel-bridge.md)).

## Goals

1. Only authenticated dashboard users can connect and receive events.
2. Channels: clients join rooms (`visitors`, `health`, and later two-way features) and receive only those.
3. A locked-down `/emit` (internal broadcast endpoint).
4. A dashboard client that stays connected and shows its connection state.
5. A reproducible, minimal, non-root container with graceful shutdown and a JSON health endpoint.
6. Remove the watchdog (`heartbeat.ts`, `monitors.json`, `node-cron`) from this service.

## Non-goals

- Building the two-way features themselves; this leaves rooms and an auth model they can use.
- Horizontal scaling (a Redis adapter for several instances). One instance is enough; the design keeps the door open.
- Changing what events the ingest route sends.

## Anti-goals

- Visitor events (URL, country, device, session) reachable by anyone who knows the URL.
- A silent dead live feed: the terminal looking live while disconnected.

## Current state (2026-11-27)

- `services/websocket` (Node 22, Socket.IO 4.8, TypeScript, Railway): `src/index.ts` starts `bridge.ts` (HTTP server + Socket.IO) and `heartbeat.ts` (node-cron health checks every 30 min by default via `PULSE_CRON`; the README says 60 s).
- **`POST /emit`**: the analytics ingest route (`apps/analytics/src/app/api/ingest/route.ts`, `WS_URL`, `WS_INTERNAL_SECRET`) posts each event; the service `io.emit('telemetry_signal', payload)` to every client. Open to anyone if `WS_INTERNAL_SECRET` is unset (only a warning); compared with `!==`; no body size limit.
- **Connections**: no authentication; CORS from `WS_CORS_ORIGINS`. Anyone can connect with a non-browser client and receive every event.
- **`GET /status`**: HTML page loading Tailwind from a CDN; `/` redirects to it.
- **Client**: `apps/analytics/src/providers/SocketProvider.tsx` connects to `NEXT_PUBLIC_WS_SERVER` with `reconnectionAttempts: 5`, then stops forever; no visible state. The dashboard itself sits behind a login (LoginOverlay).
- **Build**: `Dockerfile` runs `npm install` without a lockfile, keeps dev dependencies, runs as root; `@types/node` is 20 while the runtime is Node 22.

## Approaches considered

|               | **A · Harden Socket.IO (chosen)** | B · Managed realtime (Ably, Pusher…)                                           | C · SSE now, sockets later                 |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------ |
| Two-way later | built in                          | built in                                                                       | a second system                            |
| Cost          | one small always-on container     | free tier, then per message/connection; the always-on telemetry stream adds up | low now, more later                        |
| Why not       | —                                 | another vendor and a metered bill for a stream that never stops                | doesn't cover the planned two-way features |

## Design

### Authentication on connect

- The analytics app gets a server route (for example `GET /api/realtime/token`) that, for a logged-in session only, returns a short-lived signed token (HMAC or JWT, about 5 minutes, carrying the user id and allowed rooms), signed with a secret shared with the websocket service (`WS_TOKEN_SECRET`).
- The client passes it in Socket.IO's `auth` handshake; a server middleware verifies signature and expiry and rejects otherwise. On reconnect the client fetches a fresh token.
- How the analytics login session is checked in that route follows the app's existing auth (builder reads LoginOverlay and its backing route).

### Rooms

- The server never broadcasts to everyone. `/emit` payloads carry a channel (`visitors` for telemetry events, `health` for system integrity, more later), mapped from the event type; the server emits to that room only.
- Clients join rooms after connecting (`subscribe` event), limited to the rooms their token allows.

### `/emit`

- `WS_INTERNAL_SECRET` is required: the service refuses to start without it (outside development).
- Compared with `crypto.timingSafeEqual`.
- Body capped (for example 64 KB) and JSON validated against the known event shapes; unknown channels rejected.

### Client

- Reconnect indefinitely with exponential backoff and jitter (cap around 30 s), fetching a new token each time.
- A visible connection state in the terminal: live, reconnecting, offline, using the existing status components (Avra tokens; status grammar: ● info, OK, ◆ warning, ▲ alert).

### Running it

- `package-lock.json` committed; Dockerfile uses `npm ci`, a multi-stage build (compile, then copy `dist` and production dependencies only), runs as the `node` user.
- `@types/node` matches Node 22; dev tooling moves to `tsx` or stays `ts-node` (builder's call).
- `GET /health` returns JSON (status, uptime, client count) for Railway's healthcheck and for intel-bridge's monitor list. The HTML `/status` page either goes or renders without the CDN script (builder's call; the JSON endpoint is required).
- Graceful shutdown on `SIGTERM`: stop accepting connections, tell clients to reconnect, close within a timeout.
- Remove `heartbeat.ts`, `monitors.json`, `node-cron` and the `INTERNAL_INGEST_URL` / `INGESTION_SECRET_KEY` variables from this service; README updated to "realtime only".

## Verification

- Unit tests: token verification (valid, expired, wrong signature, room not allowed), `/emit` (missing secret, wrong secret, oversize body, unknown channel, valid event goes to one room only).
- An integration test with a real Socket.IO client against the server: unauthenticated connect rejected; a `health` subscriber does not receive `visitors` events; reconnect after a server restart.
- Dashboard in the browser with the service local: the state indicator shows live, then reconnecting when the service stops, then live again.
- Container: builds from the lockfile, runs as non-root, `/health` answers, shuts down cleanly on `SIGTERM`.
- Production changes (new secrets on Railway and Vercel) only on the owner's go.

## Decisions after the builder check (owner, 2026-11-27)

1. **Order**: the websocket heartbeat is reporting in production today. intel-bridge's monitor list (with every service the heartbeat covers) ships and is confirmed on the status page **before** `heartbeat.ts` is removed.
2. **Logout** (author's suggestion, owner to object if not): three layers. (a) `SocketProvider` moves out of the root layout into the logged-in dashboard, so no socket opens on `/status` or behind the login overlay. (b) Logout closes the socket immediately. (c) Server backstop: tokens last about 5 minutes; the client refreshes before expiry through the token route, which needs a valid session; the server disconnects any socket whose token has expired.
3. **Two-way features are for the owner only.** The token carries a fixed subject (`admin`) and all rooms; CORS admits only the analytics origin. No anonymous rooms.
4. **pnpm**, not npm: `services/*` is already in the pnpm workspace and `services/websocket` is in the root lockfile. Build in Docker from the workspace (`pnpm deploy` or a filtered install). CONTEXT.md's line that services are outside the workspace gets corrected.
5. **One health source for the websocket service** (author's proposal, owner reviewing): canonical id `websocket`; intel-bridge checks its `/health` every 5 minutes. The ingest route's failed-broadcast handler logs a warning (and Sentry) instead of writing a `websocket-bridge` DOWN row to ClickHouse, which today only ever records DOWN and contradicts the new UP checks. The "don't change what the ingest route sends" non-goal is narrowed accordingly.

## Left to the builder

Token format (HMAC or JWT) and lifetime; event-to-channel mapping details; backoff numbers; whether `/status` stays; tooling for dev.

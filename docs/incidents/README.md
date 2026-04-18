# Incident Documentation Standard

All incidents of significant impact (build failures, data loss, deployment outages, security
events) are documented here as directories, not flat files.

---

## Directory Naming

```
YYYY-MM-DD-short-kebab-description/
```

Use the date the incident was **first observed**, not when it was resolved.

---

## Required Structure

Every incident directory must contain these three files:

```
YYYY-MM-DD-short-description/
├── README.md        # Incident summary — always the entry point
├── debug-log.md     # Step-by-step investigation log
└── post-incident.md # Follow-up notes, remaining debt, lessons applied
```

### `README.md` — Incident Summary

Required frontmatter block at the top:

```markdown
**Date:** YYYY-MM-DD
**Branch:** `branch-name`
**Root Cause Commit:** `sha` (if applicable)
**Severity:** Brief description (e.g. "All Vercel deployments failing")
**Resolution:** One-line summary of how it was fixed
```

Required sections:

| Section                 | Contents                                                                          |
| ----------------------- | --------------------------------------------------------------------------------- |
| **Files**               | Table linking to `debug-log.md` and `post-incident.md` with one-line descriptions |
| **What Happened**       | Narrative summary — what broke, how, and what it affected                         |
| **Root Cause**          | Technical explanation of the actual cause, with code snippets if helpful          |
| **Resolution**          | Exact steps taken to fix — commits, commands, config changes                      |
| **Rules Going Forward** | Numbered actionable rules to prevent recurrence; include verification commands    |
| **Affected Files**      | Table: file path, what changed, whether it's safe to reintroduce                  |

### `debug-log.md` — Investigation Log

Chronological step-by-step record of the debug session. Each step follows this format:

```markdown
### Step N — What was tested

**Change:** What was modified and where
**Result:** Build PASSES ✅ / Build FAILS ❌ / [specific error]
**Conclusion:** What this proves or rules out; what the next suspect is
```

- Record every test — including dead ends. Dead ends prove what the cause is NOT.
- Note chunk sizes when relevant (line number deltas confirm whether a change had effect).
- Mark the resolving step clearly: `## ✅ RESOLVED — Root Cause & Fix`

### `post-incident.md` — Follow-Up Notes

Two required sections:

```markdown
## Follow-Up Sessions
```

Any investigation or remediation work done after the initial incident — tool sessions,
additional debugging, recovery steps, commits that restored lost work.

```markdown
## Known Remaining Technical Debt
```

Issues uncovered during the incident that were NOT fixed (e.g. phantom lint rules,
noisy warnings, deferred cleanups). Each entry needs:

- What it is
- Why it hasn't been fixed yet
- Planned resolution with verification commands

---

## Severity Threshold

Document an incident here when **any** of the following are true:

- A Vercel deployment enters ERROR state more than twice from the same root cause
- A `git reset --hard` or `git reflog` recovery is required
- Work is lost and must be recovered from stash, reflog, or re-implemented
- A security vulnerability is introduced or discovered
- Data loss occurs (database, files, secrets)
- A single commit breaks CI for more than one app in the monorepo

Minor bugs, lint errors, and single-build failures fixed in one commit do NOT need an
incident file — a descriptive commit message is sufficient.

---

## Example

```
docs/incidents/
├── README.md                                              ← this file
└── 2026-04-07-eslint-flat-config-build-failure/
    ├── README.md        ← incident summary
    ├── debug-log.md     ← 17-step debug session
    └── post-incident.md ← Gemini CLI follow-up + remaining debt
```

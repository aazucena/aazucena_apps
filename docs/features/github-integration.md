# Feature: GitHub Ecosystem Integration

📍 **Related Documentation:** [Phase 4: DX Plan](../phase-4-developer-experience.md) | [Agentic Telemetry](./agentic-telemetry.md)

## 🎯 Objective
Integrate real-time GitHub data to bridge the gap between **Engineering Intelligence** (telemetry) and **Engineering Output** (code). This provides proof-of-work for the portfolio and development velocity insights for the analytics dashboard.

---

## 🛠️ Integration Strategy

### 1. `apps/analytics` (The Intelligence Dashboard)
GitHub is treated as a **Telemetry Source**.
- **Velocity Tracking:** Real-time monitoring of PR cycle times, commit frequency, and issue resolution latency.
- **AI-to-Code Correlation:** Correlate AI token usage (MG/EG phases) with code output. *Metric: "Inference Cost per Pull Request."*
- **Health Monitoring:** Display active security vulnerabilities (GitHub Dependabot) and CI/CD status (GitHub Actions) alongside system integrity metrics.

### 2. `apps/portfolio` (The Showcase)
GitHub is treated as a **Verification Layer**.
- **Live Project Stats:** Dynamic cards showing stars, forks, and the "Latest Release" notes directly from repositories.
- **Automated Tech Stack:** A "Most Used Tech" visualization powered by repository language distributions, styled with `@aazucena/design-system` colors.
- **Agent-Assisted Contributions:** A custom visualization identifying "Human-only" vs. "Agent-Assisted" commits to showcase the AI-integrated workflow.

---

## 📦 Phase 4 Architecture Readiness

| Package | Responsibility |
|---------|----------------|
| `@aazucena/api` | **GithubClient**: Centralized service for Octokit/GraphQL integration with rate-limit handling. |
| `@aazucena/types` | **Git Types**: Standardized interfaces for `Repository`, `PullRequest`, and `Contribution`. |
| `@aazucena/ui` | **ContributionGraph**: A terminal-themed, high-fidelity alternative to the standard GitHub grid. |
| `@aazucena/constants` | **Repo Config**: List of featured repository IDs and API endpoints. |

---

## 🚀 Roadmap
- **Phase 4:** Infrastructure readiness (API client & types).
- **Phase 6:** Full implementation and dashboard integration.

---

**Last Updated:** 2026-02-05
**Status:** 📝 CONCEPT DEFINED (Post-Phase 4 Target)

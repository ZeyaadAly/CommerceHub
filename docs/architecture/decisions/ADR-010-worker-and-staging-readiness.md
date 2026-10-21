# ADR-010 — Redis/BullMQ readiness, recovery and staging

Status: PROPOSED — decision preparation only. 2026-10-21. CH-01/D (legacy CH-P0-008).
Owner: Operations/DevOps + Security; Legal/Product for retention/release; named individual/signature NOT RECORDED.
Gate: OPS-01 / SEC-01 / LEG-01; OPEN. No policy approval or implementation follows from this record.

## Context and approved constraints

CH-01 E_QUEUE, CH-09 JOBS/EXPLORER and CH-15 STAGE_A/STAGE_B. Sources: architecture §§11/14–17, database §16, API §§14/18; BA-19.

Redis/BullMQ architecture remains planned for durable jobs; PostgreSQL is truth, outbox recovery is ADR-014. Managed Redis spending DEFERRED. Docker/WSL is not required. Runtime API/worker are separate from frontend deployment concerns.

## Options and trade-offs

A: separately approved isolated managed Redis: fewer host maintenance duties, but costs, quotas and provider outage/custody need review. B: approved existing isolated service with native tooling: possible zero new provision, but isolation, limits and restore ownership must be demonstrated. In-memory queues cannot satisfy durable job acceptance. Neither option is authorized now.

## Recommendation and owner decision

Defer provider/spending selection until E_QUEUE has a concrete bounded job workload and owner authorization. Prepare budgets, ownership and recovery contracts first. Do not make Redis a dependency for API or UI foundations. Keep staging preparation STAGE_A before E2E/restore evidence and final go/no-go STAGE_B after hardening.

## Security and operational effects

Approve connection/worker caps, backoff/attempt/deadline/DLQ handling, failover/alerts, least privilege, rotation, backup/restore and exact RPO/RTO by workload. Secrets stay backend-only. Hosted verification, restore drills and deployment all require separate authority. Legally sensitive data gets minimal sanitized observability.

## API and database effects

Queue payloads carry safe identifiers/rule versions, not credentials/PII/provider bodies. Define idempotent consumption and durable recovery scans without changing authoritative stock/expiry semantics. Host/provider-specific deployment ADR-011 remains deferred; no host selection, public staging or migration script results here.

## Evidence, approval and reversal

OPS supplies an environment/workload/isolation/cost plan and later outage/retry/DLQ/restore proof; SEC reviews custody and LEG reviews retention. STAGE_A needs approved service targets and separate deployment permission; STAGE_B needs product/security/legal exit and restore evidence. No numeric recovery/budget/retention examples approved. Reopen on topology or workload changes.

Approval date/signature: NOT RECORDED. Decision verification: NOT RUN; later implementation proof requires separate authorization. Reversal must preserve historical financial/stock/audit evidence, keep mandatory security constraints and receive the affected owners' review.

See the [single decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md), [architecture baseline](../../04-architecture.md), [database baseline](../../05-database-design.md) and [API baseline](../../06-api-design.md).

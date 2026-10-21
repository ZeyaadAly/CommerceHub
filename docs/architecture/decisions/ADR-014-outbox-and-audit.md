# ADR-014 — Transactional outbox and early audit ownership

Status: PROPOSED — decision preparation only. 2026-10-21. CH-01/D (legacy CH-P0-008).
Owner: Backend + Security/Operations; Legal for retention; named individual/signature NOT RECORDED.
Gate: DB-0 / DB-01 / SEC-01 / OPS-01 / LEG-01; OPEN. No policy approval or implementation follows from this record.

## Context and approved constraints

CH-09 A/JOBS/EXPLORER and CH-07 PERSIST before privileged/order consumers. Sources: architecture §§4.3/11/15, database §§5/14–16, API §14; BA-06/07/19.

Critical business state, required audit and outbox intent commit together. External provider/queue I/O stays outside database transactions. Append-only histories and idempotent consumers are mandatory; later explorer UI is not a substitute for an early writer.

## Options and trade-offs

A: bounded database polling dispatcher: portable and fits the baseline, but adds polling/load/lease/recovery work. B: approved CDC dispatcher: lower polling overhead, but expands permissions/infra and recovery complexity. In-process events may complement noncritical work but cannot replace the durable bridge.

## Recommendation and owner decision

Prepare bounded polling as the initial review candidate, subject to OPS load/recovery evidence; do not choose lease/retry numbers. Review A audit writer/minimal outbox persistence early and required PERSIST schema before privileged flows; defer full JOBS dispatch and EXPLORER UI until their actual dependencies. This preserves approved ordering without implementing later milestones.

## Security and operational effects

Define atomic failure behavior for required audit, dispatcher duplicate delivery and lost acknowledgments. Approved append-only/compensating controls cannot be weakened to arbitrary edits or deletions. LEG/OPS must approve per-data retention, privileged access, anonymization/holds and safe archival; no universal retention duration.

## API and database effects

Assign audit/outbox schema and migration contributions to A/PERSIST and domain transactions explicitly. Minimal sanitized fields, safe request correlation and payload versions must match API contracts; no raw addresses, session keys or provider payloads. Domain aggregates own business effects; worker consumers call those services rather than bypassing invariants.

## Evidence, approval and reversal

Backend/Data review atomic write and migration/FK ordering; Security decides critical audit scope; OPS/Legal decide recovery/retention. Later tests cover rollback, commit-before-enqueue crash, duplicate dispatch, worker/Redis outage and recovery without lost/double effects. Reopen on new critical effects, payload versions or retention policy.

Approval date/signature: NOT RECORDED. Decision verification: NOT RUN; later implementation proof requires separate authorization. Reversal must preserve historical financial/stock/audit evidence, keep mandatory security constraints and receive the affected owners' review.

See the [single decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md), [architecture baseline](../../04-architecture.md), [database baseline](../../05-database-design.md) and [API baseline](../../06-api-design.md).

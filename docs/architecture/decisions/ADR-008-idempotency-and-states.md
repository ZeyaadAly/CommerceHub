# ADR-008 — Payment idempotency, replay and cross-state mapping

Status: PROPOSED — decision preparation only. 2026-10-21. CH-01/D (legacy CH-P0-008).
Owner: Backend/Payments + Finance; Product/Data for state mapping; named individual/signature NOT RECORDED.
Gate: PAY-01 / INV-01 / DB-0 / DB-01 / SEC-01; OPEN. No policy approval or implementation follows from this record.

## Context and approved constraints

CH-07 PERSIST/ORDER and CH-08 MOCK/SETTLE. Sources: architecture §10, database §§8–10/15, API §§6/10–12; BA-03/06/12/25.

Actor/operation/key scope, canonical payload binding, durable event dedupe, trusted amount/currency and at-most-once committed business effects are mandatory. Browser redirects cannot prove payment; unknown outcomes stay reconcilable. Outbox/audit persistence ownership is ADR-014, not a competing event implementation.

## Options and trade-offs

A: stored stable result replay: deterministic client recovery, but privacy masking and retention need policy. B: durable operation identity/status response: reduces stored response exposure, but requires a complete status/reconciliation contract. In-flight identical requests may bounded-wait or return explicit in-progress; owner must choose timing/leases and replay semantics.

## Recommendation and owner decision

Use durable actor-scoped operation identity and uniqueness with payload mismatch rejection; choose A/B response strategy only after PAY/SEC review. Re-read durable outcomes before retrying unknown effects. Produce one order/payment/reservation transition and projection table; no enum unions or invented paid transitions. Keep C client no-retry behavior unchanged.

## Security and operational effects

Authenticate before idempotency lookup, bound abuse, prevent cross-actor replay and verify provider raw bytes/context before trusted effects. Specify signed event freshness/key rotation and dedupe identity. Provider network calls occur outside DB transactions. Candidate key lengths, TTLs, leases and retry windows are not frozen.

## API and database effects

PERSIST must include required order/payment/idempotency/event/audit/outbox foundations before orchestration. Map DB order PLACED/VOIDED/CLOSED versus payment/fulfillment and API projections; map intent/attempt CREATED/STARTED/SUBMITTED and EXCEPTION/UNKNOWN explicitly. Resolve unpaid void and late-success actions under PAY/INV, never mark paid from UI.

## Evidence, approval and reversal

Owners deliver cross-state table, canonical payload rules, replay masks/retention, signed fixtures and unknown-outcome actions. Later tests prove same/different payload keys, concurrent duplicates, lost responses and duplicate/out-of-order/forged/late events. Reopen when adding provider/effect/state types.

Approval date/signature: NOT RECORDED. Decision verification: NOT RUN; later implementation proof requires separate authorization. Reversal must preserve historical financial/stock/audit evidence, keep mandatory security constraints and receive the affected owners' review.

See the [single decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md), [architecture baseline](../../04-architecture.md), [database baseline](../../05-database-design.md) and [API baseline](../../06-api-design.md).

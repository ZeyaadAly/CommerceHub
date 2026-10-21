# ADR-006 — Inventory reservation expiry and concurrent checkout

Status: PROPOSED — decision preparation only. 2026-10-21. CH-01/D (legacy CH-P0-008).
Owner: Product + Backend/Data; named individual/signature NOT RECORDED.
Gate: INV-01 / PAY-01 / DB-0 / DB-01; OPEN. No policy approval or implementation follows from this record.

## Context and approved constraints

CH-05 INV and CH-07 RESERVE/ORDER/SETTLE. Sources: architecture §9, database §§8/15, API §10.2; BA-03/06/11/12.

Cart does not reserve. Stock is authoritative in PostgreSQL; terminal consume/release/expire effects are exclusive and at most once. Late callbacks cannot recreate stock or consume an effectively expired hold. Numeric TTL and race precedence remain undecided.

## Options and trade-offs

A: deterministic row locks plus conditional transitions at normal isolation: explicit contention control, but lock-order/deadlock discipline is essential. B: serializable transactions for selected flows: stronger anomaly rejection, but requires measured contention and approved bounded retries with stable idempotency. A global lock reduces concurrency and is not the baseline strategy. Either option must implement DB-clock effective expiry and guards.

## Recommendation and owner decision

Prepare a shared lock-order/transaction map and benchmark A versus targeted B on approved disposable PostgreSQL later. Prefer bounded row-level coordination over global serialization, pending real race evidence. Do not select the candidate 15-minute hold or retry numbers. Product must decide TTL/quota/late-success handling before implementation.

## Security and operational effects

Include worker-down expiry, payment-vs-expiry, customer retry, duplicate release, admin stock adjustment and lost-commit responses in one race matrix. Sweepers provide cleanup, not stock truth. Manual unpaid void/exception actions require approved permissions and immutable compensating evidence.

## API and database effects

PERSIST order/item/payment/idempotency/outbox foundations must precede RESERVE. Review canonical order/payment/fulfillment projection and reservation states rather than freezing conflicting API/DB spellings. Resolve threshold settings/filter contracts under INV-01, and lock inventory keys in deterministic order across services.

## Evidence, approval and reversal

Owners supply signed state/race/TTL/late-success policy and fixtures. Later real multi-connection tests prove last-unit safety, conservation, no double release/consume and recovery under failures. Reopen for new stock paths or lock orders. [PostgreSQL locking documentation](https://www.postgresql.org/docs/current/explicit-locking.html) explains conflicting row locks and deadlocks; it is not proof CommerceHub is deadlock-free.

Approval date/signature: NOT RECORDED. Decision verification: NOT RUN; later implementation proof requires separate authorization. Reversal must preserve historical financial/stock/audit evidence, keep mandatory security constraints and receive the affected owners' review.

See the [single decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md), [architecture baseline](../../04-architecture.md), [database baseline](../../05-database-design.md) and [API baseline](../../06-api-design.md).

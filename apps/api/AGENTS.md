# API and trusted worker instructions

Extend [root instructions](../../AGENTS.md). This directory initially contains no runtime. Business implementation and migration execution need their own authorized story and applicable gates.

Sources: [architecture §§4–12/15–17](../../docs/04-architecture.md), [database §§4–18/20](../../docs/05-database-design.md), [API design](../../docs/06-api-design.md), [gates](../../docs/implementation/gate-register.md), [audit](../../docs/implementation/baseline-audit.md).

## Module and contract boundaries

- NestJS modules own distinct domains. Controllers map HTTP/DTO/errors; application services authorize and orchestrate; domain policies express invariants; repositories/adapters persist or call providers. Avoid circular dependencies and unrelated nested transactions. A use case has one transaction coordinator.
- Use versioned /api/v1 REST, strict allowlisted DTO validation, explicit public presenters, bounded query filters/pagination, stable errors and request IDs. Canonical wire schemas/OpenAPI/client compatibility must stay aligned; never return Prisma models or SQL/provider errors directly.
- Validate positive bounded quantities, exact decimal-string money, enum/precondition/ownership fields and upload content independently of frontend validation. Reject mass assignment of price/paid/stock/actor/grant fields. Missing contracts must be reviewed rather than invented.
- BA-03/04 require approved API-to-persistence state/permission mappings; BA-05/06/07 require reviewed persistence/audit ordering before consumers. BA-08/10–15 identify missing profile/address/overview/threshold/void/media/auth/SKU rules. Do not silently implement audit recommendations as accepted schema/route changes.

## Identity and authorization

- Backend default-deny guard AND domain policy enforce action/resource permissions and customer ownership, including list queries. Resolve actor from the authenticated context; never trust payload role/user IDs. Return non-disclosing ownership failures consistent with API design.
- Use Argon2id credentials and hashed single-use verification/reset challenges; approved opaque sessions require audience, expiry, rotation/revocation and staff membership revalidation. SEC-01 must settle cookie/BFF/CSRF/origin/rate/step-up semantics before affected implementation.
- Staff management, role grants, self-escalation and the last active Super Admin need transactional governance and auditable provenance. Do not equate a general admin role with access to all operations or delegate Super Admin rights without policy approval.

## Persistence and commerce

- Access PostgreSQL through backend-owned Prisma repositories or reviewed parameterized SQL within the same transaction when explicit locking is required. Separate runtime/worker privileges from migration credentials. No SQL string interpolation, startup migrations on every replica or production db push.
- Review schema/FKs/unique/CHECK/indexes, snapshot immutability and migration graph under DB-0/DB-01 before execution. FIN-01 controls price scales, inclusive/exclusive tax, shipping and rounding/allocation; never choose proposed defaults in a migration. Test real PostgreSQL behavior.
- Server quote and immutable order snapshots own payable EGP amounts. Use Decimal/NUMERIC and canonical decimal strings end to end; never Number conversion or floating-point monetary authority. Verify trusted payment amount/currency against the persisted order.
- Atomically check and reserve ATS, lock stock rows in a consistent reviewed order and enforce on_hand >= reserved >= 0. An order/line hold can consume or release/expire exactly once; consumption decrements on-hand and reserved, release only reserved. Record every stock effect in the ledger. Do not rely on an unlocked read.
- INV-01 must approve TTL, effective DB-clock expiry, race precedence and late-success resolution. Cleanup jobs do not establish stock truth. Never fulfill expired/unavailable stock or revert paid stock through an expiry race.
- Idempotency uses server-derived actor/operation scope, key and canonical payload digest with durable result identity. Same key/different payload conflicts; concurrent/replayed requests produce at most one committed business effect. PAY-01 controls leases, replay retention, retries and unknown outcomes.
- In short DB-only transactions, persist related order/payment/reservation/movement/history/audit/outbox effects atomically. Provider calls happen after durable intent commit and outside locks. Critical audit persistence failure aborts the associated mutation. Audit writers must exist before privileged consumers, regardless of later explorer story ordering.
- Do not call a business transaction successful before authoritative commit. On timeout/unknown commit state, consult durable intent/idempotency/provider evidence before another effect; do not report automatic failure or initiate an independent charge.
- Payment adapters isolate provider logic. Verify webhook signature over required raw bytes, environment/account/amount/currency and freshness before trusted processing; enforce size limits, durable inbox identity and event/effect dedupe. Acknowledge trusted receipt only after commit. Redirects never mark paid.
- P0 is deterministic mock/sandbox without card collection or live provider calls. Keep test-only simulation ingress inaccessible in production; resolve its distinction from public sandbox purchase in BA-25/PAY-01/OPS-01. Real providers require PAY-LIVE and separate activation approval.
- P1 refunds require approved eligibility/approvals, idempotency and locked eligible capture ceilings including in-flight holds. Never duplicate refunds or automatically restock from a refund; receipt/inspection is separate. Financial corrections append new records rather than rewriting history.

## Jobs, diagnostics and verification

BullMQ workers are restricted backend processes using the same domain invariants, not frontend handlers or arbitrary DB writers. Use transactional outbox/inbox, stable job identities, bounded retries/backoff, failed-job visibility and idempotent consumers. DB state must remain safe through Redis/worker outage and repeated delivery; recovery scans must be bounded. OPS-01 defines operational deadlines, hosting and restore targets.

Log structured sanitized route/result/latency/request IDs; redact credentials, cookies, challenges, PII and raw provider content. Expose safe health/readiness separately; observe pending-payment age, invariant breaches, lock failures and outbox/queue lag without leaking secrets. Apply LEG-01/OPS-01 retention rules only after review.

Verify policy/money/state units; Supertest contracts and full denial matrix; actual PostgreSQL constraints/migrations, rollback/crash and last-unit/last-admin races; same/different-key replays; duplicate/forged/reordered/late callbacks; expiry/settlement and queue-recovery races; snapshot/archive invariance; fail-closed audit and sanitized errors. Use approved exact financial fixtures. Mocks alone cannot prove concurrency, and documentation test IDs are not passing suites. Record commands and observed committed state, including unavailable checks.

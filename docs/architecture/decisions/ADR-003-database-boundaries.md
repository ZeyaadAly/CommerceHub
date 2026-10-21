# ADR-003 — PostgreSQL identities, custody and migration safety

Status: PROPOSED — decision preparation only. 2026-10-21. CH-01/D (legacy CH-P0-008).
Owner: Backend/Data + Operations/Security; named individual/signature NOT RECORDED.
Gate: DB-0 / DB-01 / OPS-01 / SEC-01; OPEN. No policy approval or implementation follows from this record.

## Context and approved constraints

CH-02 M/DB and CH-01 E_DB. Sources: architecture §§5/7/14, database §§15–17, API §§1–3; BA-05/06/15/19.

PostgreSQL/Prisma is backend-owned. Migration DDL identity must be separate from restricted API/worker runtime identities; Next.js/browser access to business tables is forbidden. Approved development target configuration is partial 006 evidence, not custody, role separation, disposable isolation or live authentication proof.

## Options and trade-offs

A: dedicated disposable PostgreSQL target with native Windows tools: realistic destructive/concurrency tests and no Docker requirement; requires explicitly approved provisioning/cost/custody. B: separately isolated namespace on an approved shared development project: fewer resources, but role boundaries/reset mistakes can affect unrelated data and require explicit threat review. Persistent approved development alone is not a disposable target. Runtime direct IPv6 vs exact approved Session Pooler IPv4 are connectivity options; neither implies migration eligibility.

## Recommendation and owner decision

Prefer a separately approved disposable target with strict runtime/migration separation. Retain approved exact session-mode configuration as the Windows runtime candidate; do not guess hosts/routing names, select transaction pooling, pay for IPv4 or reuse a superuser role as runtime acceptance. Direct IPv6 reachability is UNVERIFIED. Migration route/driver compatibility needs its own reviewed proof; no automatic runtime endpoint fallback.

## Security and operational effects

Trusted CA chain plus hostname verification, finite attempts/deadlines and protected credential custody remain mandatory. CA rotation, role rotation, pool budget and permission-denial proof need named custodians. No connection string or secret enters this packet. Service-role separation must be proven before writes; no certificate bypass to fix Windows routing.

## API and database effects

M must review identity/catalog schema and early order/payment/idempotency/audit/outbox FK ownership before DB/PERSIST. One explicit application transaction owner coordinates writes; provider calls stay outside transactions. Prefer additive reviewed migrations, with forward repair versus backout assessed per change and restore rehearsal on disposable data. Do not silently adopt proposed NUMERIC scales/enums or execute illustrative SQL.

## Evidence, approval and reversal

Owners supply target purpose/isolation, grants/DDL denial, custody/rotation process, endpoint/mode, compatible pinned driver, TLS negative cases, migration order and restore/backout acceptance. Decision approval and later real-service proof are separate; no E_DB/DB operation is authorized here. Reopen on driver/topology/CA/grant changes.

Approval date/signature: NOT RECORDED. Decision verification: NOT RUN; later implementation proof requires separate authorization. Reversal must preserve historical financial/stock/audit evidence, keep mandatory security constraints and receive the affected owners' review.

[Supabase connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres) distinguishes persistent IPv6 direct access, IPv4 session pooling and direct migration sessions; it requires taking actual pooler identities from Dashboard, not regional patterns. [PostgreSQL TLS guidance](https://www.postgresql.org/docs/current/libpq-ssl.html) distinguishes CA-chain and hostname validation; future driver options must prove equivalent protection, not copy libpq flags blindly. Public guidance is not project reachability evidence.

See the [single decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md), [architecture baseline](../../04-architecture.md), [database baseline](../../05-database-design.md) and [API baseline](../../06-api-design.md).

# Adopted backlog definition — backlog.md

**ADOPTED by explicit owner approval on 2026-10-21 after PR #21 merge
`8543df03c23423ff58d383dde0de2a5192725dbb`.**

The 21-story mapping, five ownership moves, missing-feature assignments and exact
48-milestone definitions/dependencies are approved. Current execution/readiness
comes from [adoption.json](adoption.json) and
[the operative tracker](../../implementation/story-tracker.md). CH-01 is partial
IN PROGRESS; CH-02–CH-21 NOT STARTED. No feature or specialist policy is authorized.

[verify.mjs](verify.mjs) validates immutable legacy evidence from its recorded Git
baseline, then [verify-adoption.mjs](verify-adoption.mjs) checks live synchronization.
[Adoption review evidence](adoption-verification.md) records actual checks.

The approved proposal text below is preserved verbatim. Its PROPOSED/pending
adoption/status fields and instruction to await adoption are historical metadata,
now superseded by this explicit adoption. Its substantive scope, acceptance,
phase, gate and milestone definitions remain binding without change. There are
48 milestone tasks; the old phrase "not 46 new stories" is historical editorial
wording and does not change that count. No original IDs/history are deleted.
<!-- LEGACY BASELINE: 8543df03c23423ff58d383dde0de2a5192725dbb -->

# Proposed consolidated backlog

**PROPOSED — owner approval required. No implementation authority or status replacement.**

The twelve fields below are supplemented by exact inherited source specifications and AC in [inventory.json](inventory.json). All source clauses remain binding; the focused criteria add observable cases and never replace them. Dependencies name reviewed milestones from [schedule.md](schedule.md), not full-parent completion. Every source item keeps its original release.

## CH-01 — Foundation, environments, tooling, CI and decision work

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Make independently usable engineering foundations available without treating service blockers as a universal dependency.

**Included functionality:**

- Retain 001–005 DONE evidence verbatim; 006 partial merged work remains BLOCKED, 007/008 unstarted.
- Tooling, shared wire/client scaffolds, secret boundaries, Docker-free local workflow, isolated DB/cache readiness, ADR option work and gate evidence are tasks within this parent.
- Redis/BullMQ stays architectural; managed Redis/spending deferred. No provider access follows from planning.

**Original stories:** CH-P0-001, CH-P0-002, CH-P0-003, CH-P0-004, CH-P0-005, CH-P0-006, CH-P0-007, CH-P0-008. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** NFR-SEC-05, NFR-SEC-06, NFR-REL-02, NFR-TEST-01, NFR-API-01, NFR-OPS-01.

**Dependencies:** F is already accepted 001–005 evidence; C uses 007; D uses 008; E uses 006. Depend on the smallest relevant milestone, never whole CH-01.

**Architecture/UX/API/database references:** 01 §§11–12; 04 §§3/5/7/11/14/18; 07 §§4–10; 08 E0; current 006 evidence. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** OPS-01 for shared infrastructure; SEC-01 for dependent transport; every specialist decision stays OPEN. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-01-AC-1. A clean supported Windows workflow works without Docker/WSL, with independent scripts and redacted configuration denial.
CH-01-AC-2. Full 006 retains seven PASS/eight BLOCKED criteria until actual target/custody/isolation/bootstrap/Redis evidence is accepted.
CH-01-AC-3. Wire/client packages compile independently and ADR records distinguish options from owner decisions; no blanket READY from grouping.

**Required tests:** Frozen install/build/type/lint/hook/CI denial and bounded secret scans; AC-006-01–15 with real services only when separately authorized.

**Deliverables:** Foundation milestone ledger, shared schemas/client, environment/runbook evidence, reviewed ADR/gate records.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-02 — Reviewed PostgreSQL schema and migration foundations

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Provide compatible, constrained persistence before its API consumers.

**Included functionality:**

- Identity/RBAC and catalog schema design, reviewed SQL on disposable PostgreSQL, FK/delete/index/rollback evidence.
- Review order/payment/idempotency/audit/outbox schema interfaces early with CH-07/08/09 owners; those owners keep domain acceptance.
- No startup migrations, real/shared dev reset or frontend database access.

**Original stories:** CH-P0-009, CH-P0-010. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-AUTH-001, CH-AUTH-002, CH-AUTH-003, CH-AUTH-004, CH-AUTH-005, CH-CAT-001, CH-CAT-002, CH-CAT-003, CH-CAT-004, CH-CAT-005, CH-ADM-CAT-001, CH-ADM-CAT-002, CH-ADM-CAT-003, CH-ADM-CAT-004, CH-SEC-001, CH-SEC-002, CH-SEC-003, CH-SEC-004, CH-SEC-005, NFR-DATA-01, NFR-DATA-02.

**Dependencies:** M after C and D; DB execution after M and separately approved E disposable target. Domain tables follow owning milestone acceptance, not entire later stories.

**Architecture/UX/API/database references:** 04 §7; 05 §§4–10/12–18; 06 §§1–3; 07 009/010. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** DB-0/DB-01; SEC-01 identity semantics; FIN-01 price scales; INV-01/PAY-01 where applicable. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-02-AC-1. Identity plus catalog design exists before applying 010; no unreviewed price or deletion defaults.
CH-02-AC-2. Empty and upgraded disposable databases enforce reviewed constraints and preserve historical references.
CH-02-AC-3. Money remains NUMERIC/currency/decimal strings; runtime and migration authority are separate and verified before use.

**Required tests:** DB-001–004/015/017/018/020 as applicable; actual PostgreSQL migrations and constraint failures, drift and rollback/forward rehearsal.

**Deliverables:** Reviewed Prisma/SQL, schema ownership graph, migration/test and rollout evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-03 — Identity, secure sessions and staff governance

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Let customers and staff authenticate while backend permissions prevent escalation.

**Included functionality:**

- NestJS transport/DTO/error/OpenAPI foundations, Argon2id credentials, verification/recovery, revocable opaque cookie sessions and CSRF.
- Separate staff audience, invitation acceptance, bootstrap, default-deny RBAC, last-active-Super-Admin protection and staff UI (moved 044).
- CH-11 owns profile/address delivery across its API/UI; CH-18 owns P1 session management and advanced permission bundles.

**Original stories:** CH-P0-011, CH-P0-012, CH-P0-013, CH-P0-014, CH-P0-044. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-AUTH-001, CH-AUTH-002, CH-AUTH-003, CH-SEC-001, CH-SEC-002, CH-SEC-003, CH-SEC-004, CH-SEC-005, NFR-SEC-01, NFR-SEC-02, NFR-SEC-03, NFR-SEC-04, NFR-REL-01, NFR-API-01, NFR-UX-01.

**Dependencies:** API after C; AUTH after DB/API and SEC-01; STAFF_API after AUTH/A; staff controls after SHELL/T. Only the remaining 044 audit explorer portion waits EXPLORER; APIs do not wait for CH-09 workers.

**Architecture/UX/API/database references:** 02 CH-AUTH/CH-SEC; 03 §§4–6; 04 §6; 05 §§4–5; 06 §§4/8.3/9/17. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** SEC-01; DB-0/DB-01; API-01; early fail-closed audit contract. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-03-AC-1. Register/login/recovery challenges are enumeration-safe and single-use; logout/expiry/revocation deny subsequent requests.
CH-03-AC-2. Origin/CSRF/audience and permission matrix decisions are signed before affected code; no token browser storage or role claims from payloads.
CH-03-AC-3. Concurrent staff changes cannot remove final active Super Admin or escalate grants; authorized UI invokes audited API actions and unauthorized mutations commit nothing.

**Required tests:** API-004–009/025/027; DB-001–004/017/018; UX-05/12/18; Supertest denial matrix and browser cookie/focus tests.

**Deliverables:** Identity/session/RBAC APIs and staff UI, contracts, grants policy and security evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-04 — Catalog administration, variants, media and public APIs

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Publish trustworthy multi-category goods through a usable staff workflow.

**Included functionality:**

- Products/categories/brands, variant combinations and default SKU, attributes, publication/archive, media upload/link/reorder/remove lifecycle.
- Catalog admin UI (moved 041), bounded public browse/search/filter/sort/detail and safe shipping-zone projection.
- Product duplication and publish-minimum rules remain conditional proposals, not newly approved behavior.

**Original stories:** CH-P0-015, CH-P0-016, CH-P0-017, CH-P0-041. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-CAT-001, CH-CAT-002, CH-CAT-003, CH-CAT-004, CH-ADM-CAT-001, CH-ADM-CAT-002, CH-ADM-CAT-003, CH-ADM-CAT-004, NFR-SEC-04, NFR-PERF-01, NFR-RESP-01, NFR-UX-01.

**Dependencies:** CAT_API after DB/API/STAFF_API/A; CAT media/editor completion after SHELL/T and OPS approval. Consumers can use accepted CAT_API before full parent media/UI completion, but release needs all catalog evidence.

**Architecture/UX/API/database references:** 02 CH-CAT-001–005/CH-ADM-CAT; 03 admin catalog; 04 §§7/12/13; 05 §6; 06 §§5/8.1. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** FIN-01 SKU price policy; SEC-01; OPS-01 storage; DB-0/DB-01; API-01/UX readiness. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-04-AC-1. Authorized staff edit and publish valid catalog; draft/archive never leak through lists, details, SEO or stale caches.
CH-04-AC-2. Unique SKU/default variant/combination rules and safe hierarchy operations reject invalid or racing edits without history loss.
CH-04-AC-3. Uploads and attachment lifecycle reject wrong type/size/ownership; accessible admin forms and public DTOs expose only permitted data.

**Required tests:** API-002/005/023/026/027; DB-015/020/024; UX-03/09; upload abuse, version conflicts, pagination and viewport tests.

**Deliverables:** Catalog/media APIs, admin editors, DTO/schema changes and publication/security evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-05 — Inventory balances, movements and staff stock tools

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Keep every stock adjustment explainable and prevent invalid availability.

**Included functionality:**

- Immutable stock ledger, inventory balances, reason-coded authorized adjustments and inventory UI (moved 042).
- Explicit low-stock threshold persistence/filter/update ownership added for existing CH-INV-004; values/permissions need review.
- P0 single stock bucket; extended alerting/history remains P1 CH-18.

**Original stories:** CH-P0-018, CH-P0-019, CH-P0-042. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-INV-001, CH-INV-002, CH-INV-004, CH-SEC-004, NFR-DATA-02, NFR-RESP-01, NFR-UX-01.

**Dependencies:** INV after DB/CAT_API/STAFF_API/A/SHELL/T; reservation consumption remains CH-07/08.

**Architecture/UX/API/database references:** 02 CH-INV-001/002/004; 03 inventory; 04 §9; 05 §9; 06 §8.2. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** INV-01; SEC-01; DB-0/DB-01; BA-07/11. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-05-AC-1. A permitted adjustment writes balance, reason, movement and audit atomically; missing permission or audit failure leaves no mutation.
CH-05-AC-2. On-hand never falls below held quantity; arithmetic and concurrent writes preserve on_hand >= reserved >= 0.
CH-05-AC-3. Threshold configuration and stock filters follow a reviewed contract; compact tables expose read-only state by permission and bounded history.

**Required tests:** API-021/027; DB-006/014/018; UX-10; PostgreSQL concurrent adjustment and accessibility/overflow tests.

**Deliverables:** Stock schema/API and UI, threshold contract, ledger and concurrency evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-06 — Authenticated cart, exact pricing and quotes

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Give shoppers a persistent editable basket and a server-authoritative final quote.

**Included functionality:**

- Cart ownership/quantity/reconciliation and explicit full cart-page acceptance, exact decimal EGP quote computation and expiry.
- Shipping-zone/fee/tax rule ownership and P0 read-only settings projection with CH-13; no new fee/tax/default values.
- Guest cart/merge conflict remains blocked BA-02 until Product resolves; coupon logic remains P1.

**Original stories:** CH-P0-020, CH-P0-021, CH-P0-022. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-CART-001, CH-CART-002, CH-CHECK-001, CH-CHECK-003, CH-SEC-005.

**Dependencies:** CART after AUTH, public catalog and T; QUOTE after CART and ACCOUNT address API plus FIN-01. Quote schema contract can precede quote implementation.

**Architecture/UX/API/database references:** 02 CH-CART/CH-CHECK-001/003; 03 cart/checkout; 04 §8; 05 §7; 06 §§5–6. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** FIN-01/LEG-01 as applicable; SEC-01 ownership; BA-02/08/09; API-01. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-06-AC-1. Cart persists own unique SKUs and positive bounded quantities; stale/unavailable lines can be edited or removed; cart never reserves stock.
CH-06-AC-2. API ignores browser price claims and produces explicit EGP shipping/tax/discount breakdown using signed fixtures and inclusive-tax semantics.
CH-06-AC-3. Expired/stale/version-conflicting quotes require review/reconfirmation; unsupported destinations and other-user IDs fail without side effects.

**Required tests:** API-003/004/010/011/014; DB-005/016/017; UX-04/06; golden Decimal and stale cart/quote tests.

**Deliverables:** Cart API/page, pricing policy implementation, immutable quote contract and tests.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-07 — Reservation-backed atomic order initiation

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Commit one immutable order and one safe stock hold despite retries and races.

**Included functionality:**

- Order/item/address/rule snapshots, deterministic locking, reservation terminal states and atomic quote acceptance.
- Coordinate early order foundations with CH-08 payment/idempotency and CH-09 audit/outbox persistence before commands.
- Effective DB-clock expiry and late-success behavior remain gated, never inferred from cleanup timing.

**Original stories:** CH-P0-023, CH-P0-024, CH-P0-025. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-CHECK-001, CH-CHECK-002, CH-CHECK-003, CH-ORD-004, CH-INV-001, CH-INV-003, NFR-DATA-01, NFR-DATA-02.

**Dependencies:** PERSIST before RESERVE/ORDER; RESERVE after INV and QUOTE; ORDER after AUTH, QUOTE, RESERVE and A. No wait for full CH-08 settlement or CH-09 workers.

**Architecture/UX/API/database references:** 02 CH-CHECK-002/003/CH-INV-003; 04 §§8–10; 05 §§7–10/15/17; 06 §6. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** FIN-01; INV-01; PAY-01; DB-0/DB-01; API-01; BA-03/06. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-07-AC-1. Same actor/operation/key/body replays one order; changed body conflicts; two keys on one quote still cannot create two orders.
CH-07-AC-2. Last-unit and multi-SKU failure races preserve conservation and roll back order/hold/payment-intent/idempotency/audit/outbox together.
CH-07-AC-3. Consume/release/expire is exclusive and monotonic; later catalog/address edits cannot change snapshots or recreate stock after late payment.

**Required tests:** API-012–017/023; DB-006–012/015/016/018; crash/unknown-commit reread, 100-call source scenario retained without treating it as a universal approved performance target.

**Deliverables:** Transactional order/hold use case, reviewed migration graph and replay/race evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-08 — Sandbox payments, event authentication and settlement

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Demonstrate payment outcomes that only trusted backend evidence can establish.

**Included functionality:**

- Payment intent/attempt/effect/idempotency schema, deterministic mock adapter, signed synthetic ingress, durable event dedupe and settlement coordinator.
- Split schema contract/persistence before order acceptance from later provider processing; retain payment/reservation/order mapping.
- P0 mock/sandbox only, no card capture or live processor; production-safe mock surface differs from test injection.

**Original stories:** CH-P0-026, CH-P0-027, CH-P0-028, CH-P0-029. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-CHECK-003, CH-CHECK-004, CH-ORD-002, CH-ORD-004, CH-PAY-001, CH-PAY-002, CH-PAY-003, CH-INV-003, NFR-DATA-01, NFR-DATA-02.

**Dependencies:** PERSIST schema before ORDER; MOCK after PERSIST; SETTLE after ORDER, MOCK and RESERVE with PAY/INV decisions.

**Architecture/UX/API/database references:** 02 CH-PAY P0; 04 §10; 05 §10; 06 §§6/10/11. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** PAY-01; INV-01; FIN-01; SEC-01; DB-0/DB-01; BA-03/06/25. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-08-AC-1. Raw signed bytes/provider context are authenticated before durable processing; forged, duplicate or reordered events cannot duplicate or regress effects.
CH-08-AC-2. Browser return URLs and forged paid flags cannot establish capture; unknown/timeout remains explicitly reconcilable.
CH-08-AC-3. Network side effects stay outside DB transactions; authoritative commit and exclusive hold transition precede business success, with no live config fallback.

**Required tests:** API-015–020/028; DB-008–013; proof/replay/signature/late success/out-of-order/crash and production test-ingress denial tests.

**Deliverables:** Mock adapter, intent/effect/inbox schema, settlement policy, redacted reconciliation evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-09 — Durable jobs, audit persistence and observability

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Make critical actions auditable now and recoverable when workers fail.

**Included functionality:**

- Early audit/outbox persistence A before privileged consumers; later explorer/diagnostics after staff/jobs readiness.
- Transactional outbox to BullMQ, idempotent consumers, bounded retries/DLQ, queue outage recovery and operational metrics.
- 031 customer order API moved to CH-12; 032 fulfillment moved to CH-13. P1 notifications live in CH-18, using this foundation.

**Original stories:** CH-P0-030, CH-P0-033. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-ORD-004, CH-PAY-002, CH-PAY-003, CH-INV-003, CH-SEC-004, NFR-SEC-05, NFR-DATA-02, NFR-REL-01, NFR-REL-02.

**Dependencies:** A after reviewed DB/API contracts, not after staff mutations/settlement/workers; JOBS after PERSIST/SETTLE/E_QUEUE; EXPLORER after A/STAFF_API/JOBS.

**Architecture/UX/API/database references:** 02 CH-SEC-004/NFR-REL; 04 §§11/15; 05 §§5/10.6/15; 06 §§8.3/12. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** OPS-01; SEC-01; LEG-01 retention; DB-0/DB-01; BA-07/19. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-09-AC-1. A critical mutation fails closed when audit cannot persist; append-only history excludes secrets and minimized PII.
CH-09-AC-2. Lost responses, queue outage and duplicate delivery retain DB truth and cannot duplicate stock/payment effects.
CH-09-AC-3. Retries/backoff/DLQ/recovery and health/readiness diagnostics follow approved operational targets, never invented numeric defaults.

**Required tests:** API-020/025/027; DB-018/019/025; log canaries, fail-closed audit, worker restart/outbox backlog/fault tests.

**Deliverables:** Early persistence helpers, worker/outbox adapters, minimal audit view and redacted operator evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-10 — Shared accessible design system

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Give both applications consistent, usable controls and states.

**Included functionality:**

- Tokens, forms/buttons/dialogs/tables and accessible interaction primitives; no domain or database logic.
- Compact admin density with accessible hit areas; explicit pending/loading/empty/error/success states.

**Original stories:** CH-P0-034. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** NFR-A11Y-01, NFR-RESP-01, NFR-UX-01.

**Dependencies:** T after C and UX readiness for the relevant components; independent of full E/CH-01 and backend side effects.

**Architecture/UX/API/database references:** 03 §§6–10/14/16; 04 §13; shared UI instructions. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** UX/quality readiness; BA-23; no implicit contrast or metric approval. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-10-AC-1. Keyboard, focus trapping/restoration, labels and status announcements work for each shared primitive.
CH-10-AC-2. 360/768/1440 reference screens show no unintended page overflow; scoped table scrolling remains usable.
CH-10-AC-3. Tokens are shared consistently and client transient state stays distinct from server state.

**Required tests:** UX-01–18 applicable primitive contracts; component tests, axe/manual keyboard, viewport/contrast review.

**Deliverables:** Shared tokens/primitives and component/a11y evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-11 — Storefront discovery and customer account delivery

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Let visitors find a sellable SKU and customers maintain eligible checkout details.

**Included functionality:**

- Home/list/category/search/PDP/variant/SEO and add-to-cart feedback; account/login/recovery/profile/address pages.
- Public shipping/returns/privacy/terms/help content follows actual capability and legal review, with truthful sandbox messaging and no claims of enabled P1 automation.
- Explicit backend profile/address ownership including verified email-change and atomic default address, closing assignment gap BA-08 without choosing missing contracts.
- Full cart editing is CH-06; secure identity service remains CH-03.

**Original stories:** CH-P0-035, CH-P0-036, CH-P0-037. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-AUTH-001, CH-AUTH-002, CH-AUTH-003, CH-AUTH-004, CH-AUTH-005, CH-CAT-001, CH-CAT-002, CH-CAT-003, CH-CAT-004, CH-CAT-005, CH-CART-001, NFR-SEC-01, NFR-PERF-01, NFR-RESP-01, NFR-UX-01.

**Dependencies:** STORE after CAT_API/CART/T; ACCOUNT after AUTH/DB/T, before QUOTE/checkout integration. Contract fixtures can run in parallel without persisted-success claims; full release needs CAT media evidence.

**Architecture/UX/API/database references:** 02 CH-CAT P0/CH-AUTH-001–005; 03 §§4–5/11; 04 §13; 05 §4.5; 06 §§4–5. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** SEC-01; UX readiness; API-01; BA-02/08/09/14/18/23. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-11-AC-1. Public published routes have reproducible filter URLs, SKU-specific price/availability and canonical metadata; private/admin routes are not indexed.
CH-11-AC-2. Account/profile/address APIs and UI reject other owners and privileged fields, preserve order snapshots and enforce reviewed email-change/default-address behavior.
CH-11-AC-3. Forms and route states work by keyboard and at reference widths; guest-merge is held pending Product reconciliation and no fake persisted success is shown.

**Required tests:** API-002/004/007–010/023; DB-001/002/015/017; UX-03–05/15/16/18; Playwright variants/ownership and semantic SEO checks.

**Deliverables:** Storefront pages, account/address API+UI, SEO and ownership/contract evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-12 — Shopper checkout, payment outcome and order history

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Show a trustworthy purchase outcome and a private durable order timeline.

**Included functionality:**

- Checkout/payment UX and customer order APIs (moved 031) plus history/detail pages.
- P0 shipment/status projection and ownership-safe tracking; richer notification/tracking remains P1 CH-18.
- Authoritative quotes and payment state, polling/retry guidance, refresh-safe outcome and explicit unknown/pending.

**Original stories:** CH-P0-031, CH-P0-038, CH-P0-039. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-CART-001, CH-CART-002, CH-CHECK-001, CH-CHECK-004, CH-ORD-001, CH-ORD-002, CH-PAY-001, CH-SEC-005, NFR-SEC-03, NFR-UX-01.

**Dependencies:** CUSTOMER orders after ORDER/SETTLE/AUTH/T; CHECKOUT after ACCOUNT, STORE, QUOTE/ORDER/SETTLE. Do not omit cart/account prerequisites.

**Architecture/UX/API/database references:** 02 CH-CHECK P0/CH-ORD-001/002; 03 checkout/orders; 04 §§10/13; 05 §8; 06 §§6–7. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** FIN-01; INV-01; PAY-01; SEC-01; API-01/UX readiness; BA-18. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-12-AC-1. Shopper reviews API price/address and confirms one command; duplicate clicks/refresh cannot duplicate order or capture.
CH-12-AC-2. Failure/timeout/unknown never shows paid; actionable recheck/reconfirmation uses durable backend status.
CH-12-AC-3. Only owner sees paged historical items, exact totals, addresses and separate payment/fulfillment timelines; tracking reflects audited staff transitions.

**Required tests:** API-004/010/014/017/023/034; DB-015/017; UX-06–08; purchase/failure/timeout/replay/isolation Playwright plus persisted-state assertions.

**Deliverables:** Checkout and order API/pages, accessible outcome states, full purchase evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-13 — Admin overview, fulfillment and operational controls

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Give staff the right operational view and only permitted order actions.

**Included functionality:**

- Admin shell/overview and fulfillment/payment oversight APIs (moved 032) with order UI.
- Explicit overview aggregation ownership/date/sandbox/permission definitions; P0 unpaid void and manual sandbox exception contracts stay gated.
- P0 read-only settings summary or only specifically approved constrained fields; P1 shipping/tax/payment controls remain CH-18.

**Original stories:** CH-P0-032, CH-P0-040, CH-P0-043. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-ORD-002, CH-ORD-003, CH-ORD-004, CH-PAY-003, CH-INV-004, CH-SEC-001, CH-SEC-004, CH-DASH-001, NFR-SEC-01, NFR-PERF-02, NFR-UX-01.

**Dependencies:** ADMIN after STAFF_API/SHELL/A/SETTLE/INV/T; overview definitions before aggregation; fulfillment before shopper tracking proof.

**Architecture/UX/API/database references:** 02 CH-DASH-001/CH-ORD-002–004; 03 admin overview/orders/settings; 04 §§9/13; 05 §8; 06 §8. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** SEC-01; INV-01/PAY-01 void/exception policy; FIN-01 metrics/settings; BA-10/12/18. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-13-AC-1. Initial overview fetches only scoped aggregates with explicit date/sandbox definitions and correct permission-filtered empty states.
CH-13-AC-2. Unpaid orders cannot ship; allowed processing/shipped/delivered changes record actor/reason/time/tracking and update shopper view.
CH-13-AC-3. Void/exception/settings actions exist only after reviewed contracts; forced paid, unsafe restock and unauthorized mutation are rejected with no history loss.

**Required tests:** API-005/016/017/021–024/027; DB-009/010/018; UX-10/11/13/14; route-request isolation and state/permission/conflict E2E.

**Deliverables:** Admin shell/KPI API, order operations API+UI, settings/void reviewed contracts and evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-14 — Performance, accessibility and adversarial MVP proof

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Prove the complete sandbox product under failure, load and accessibility conditions.

**Included functionality:**

- Query/index/cache and all active-route fetching, end-to-end, a11y/responsive/security/load/fault proof.
- All shopper/staff/catalog/inventory/audit routes included; restore and DB concurrency use real isolated services.
- Coverage/Lighthouse/latency/load/browser targets remain proposed until separately approved.

**Original stories:** CH-P0-045, CH-P0-046, CH-P0-047. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-DASH-001, NFR-SEC-01, NFR-SEC-02, NFR-SEC-03, NFR-SEC-04, NFR-SEC-05, NFR-SEC-06, NFR-DATA-01, NFR-DATA-02, NFR-PERF-01, NFR-PERF-02, NFR-A11Y-01, NFR-RESP-01, NFR-REL-01, NFR-REL-02, NFR-TEST-01, NFR-API-01, NFR-UX-01.

**Dependencies:** PERF after all route deliveries; E2E after PERF and test environment STAGE-A; HARDEN after E2E/JOBS/restore prerequisites.

**Architecture/UX/API/database references:** 02 NFR/KPI/J/EC; 03 §13–16; 04 §§15–17; 05 §18; 06 §18; 07 §9. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** All scoped SEC/FIN/INV/PAY/OPS/LEG and UX/quality gates; BA-18/19/23/25. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-14-AC-1. Inactive modules do not fetch; private caches are principal-scoped/cleared on logout; measured budgets use agreed fixtures.
CH-14-AC-2. Happy, denial, stale, pending, expiry, late callback, replay, crash and queue recovery cases assert authoritative stored state.
CH-14-AC-3. Keyboard/focus and 360/768/1440 journeys plus security/restore evidence meet accepted targets; findings remain visible, no invented passes.

**Required tests:** All applicable UX/API/DB specified cases; real disposable PostgreSQL races, Playwright, fault/restore, audit/leak checks.

**Deliverables:** Reproducible test fixtures, measured reports, defects/limits and reviewable release evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-15 — Staging and MVP release acceptance

**Phase/status:** P0 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Release the sandbox product only with observed operational and product sign-off.

**Included functionality:**

- Separately authorized STAGE-A test-environment preparation before final hardening; STAGE-B final deployment/runbooks/go-no-go.
- Independently hosted UIs/API/worker as needed, credentials isolation, backups/restore, synthetic fixtures and production-safe sandbox behavior.
- No automatic production activation or live payments.

**Original stories:** CH-P0-048. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** NFR-DATA-02, NFR-REL-02, NFR-OPS-01.

**Dependencies:** STAGE-A after E/API and OPS environment approval; STAGE-B after HARDEN and all scoped launch approvals. Full CH-15 must not precede its own test environment.

**Architecture/UX/API/database references:** 02 §§13/20; 04 §§14–17; 05 §§16–17; 06 §§11/22; 07 §§10/14. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** OPS-01; LEG-01; SEC-01; relevant quality and product exit; BA-19/25. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-15-AC-1. Observed smoke URLs/runbooks/rollback and environment isolation exist with redacted release evidence.
CH-15-AC-2. Restore and migration deployment are separately authorized and rehearsed on eligible resources; no production secret inheritance.
CH-15-AC-3. Human go/no-go records remaining risks; no live processor or test simulation ingress is exposed by accident.

**Required tests:** CI/CD logs, sandbox smoke/E2E, deployment separation, restore/rollback/security review; never run merely because planned.

**Deliverables:** Staging/test environment evidence, operator runbooks and explicit MVP acceptance decision.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-16 — V1 cancellation, returns and guarded refunds

**Phase/status:** P1 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Resolve customer service requests without losing stock or financial control.

**Included functionality:**

- Review-only V1 scope/gates/options within 049 before dependent decisions; no circular prerequisite that approval must exist to research it.
- Explicit customer cancellation cutoff/race and return eligibility/review/receive workflows, partial/full refund allocation and in-flight ceilings.
- Refund execution and physical return/restock remain distinct. Real adapter later CH-19.

**Original stories:** CH-P1-049, CH-P1-050, CH-P1-051. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-ORD-005, CH-ORD-006, CH-PAY-006.

**Dependencies:** V1-REVIEW after STAGE-B; RETURNS/MOCK-REFUND after scoped FIN-02/LEG/state approval; provider approval/certification is staged under CH-19 before real funds.

**Architecture/UX/API/database references:** 02 CH-ORD-005/006 and CH-PAY P1; 03 P1 returns; 04 §10.4; 05 §11; 06 §13. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** FIN-02; PAY-LIVE as declared for real effects; LEG-01; SEC-01; BA-20/21. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-16-AC-1. Only eligible owner/staff can request/cancel/review; shipping/capture races follow an approved cutoff with timestamped outcomes.
CH-16-AC-2. Concurrent pending+settled refunds cannot exceed eligible captured amount; exact signed allocation fixtures reconcile partial tax/shipping.
CH-16-AC-3. Retries cannot duplicate provider effects or restock; physical receive/inspection determines restock within actually returned quantities.

**Required tests:** API-029/030; DB-021/022; UX-19; cancellation-vs-shipment, partial/duplicate/concurrent/refund-unknown tests using mocks before real adapter.

**Deliverables:** Cancellation/return/refund APIs and UX, financial fixtures and staged gate evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-17 — V1 merchandising, promotions, reviews and wishlists

**Phase/status:** P1 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Increase useful discovery and repeat shopping without corrupting price or stock.

**Included functionality:**

- Coupons/campaign lifecycle and redemption ledger, wishlist ownership, verified-purchase reviews/moderation.
- Explicit enhanced category-attribute discovery ownership for CH-CAT-006; retain P1, distinct from advanced P2 ranking/personalization.

**Original stories:** CH-P1-052, CH-P1-053. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-CAT-006, CH-CAT-007, CH-CAT-008, CH-CHECK-005, CH-MKT-001.

**Dependencies:** V1-REVIEW and accepted catalog/order baselines; revise finance decisions before promotion effects.

**Architecture/UX/API/database references:** 02 CH-CAT-006–008/CH-CHECK-005/CH-MKT-001; 03 §4.2/4.4; 05 §11.3; 06 §14. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** FIN-01 revision; SEC-01; LEG-01 as applicable; BA-20. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-17-AC-1. Campaign eligibility/window/stacking/caps hold under concurrent redemptions and snapshots preserve exact discounts.
CH-17-AC-2. Wishlist deduplicates own items and never reserves stock; archived goods degrade gracefully.
CH-17-AC-3. Review eligibility/moderation/dedupe prevents fabricated purchases and rating manipulation; filters stay scoped to active SKUs.

**Required tests:** API-031/032; DB-023; PRD J-10; coupon expiry/race, review denial/moderation and wishlist isolation E2E.

**Deliverables:** Merchandising/promotion/review/wishlist APIs/UI, ledger and quality evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-18 — V1 customer operations, reporting and notifications

**Phase/status:** P1 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Support customers and explain operations using privacy-safe data and reliable updates.

**Included functionality:**

- Customer support/search/actions, analytics/export, exact captured/refunded/net and Cairo/DST semantics.
- Assign missing P1 active-session controls, notifications/preferences, low-stock alerts/extended history, richer shipment tracking and advanced audit/permission bundles here.
- P1 shipping/tax/payment settings controls require explicit confirmation and policy; no live provider activation through settings. Existing domain modules retain business ownership.

**Original stories:** CH-P1-054. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-AUTH-006, CH-PAY-005, CH-INV-005, CH-SEC-006, CH-CUST-001, CH-AN-001, CH-NOTIF-001, NFR-OPS-02.

**Dependencies:** V1-REVIEW; accepted identity/orders/stock/audit/JOBS; refund metrics integrate after CH-16 data contracts; export/retention policy before sensitive access.

**Architecture/UX/API/database references:** 02 CH-AUTH-006/CH-INV-005/CH-SEC-006/CH-CUST-001/CH-AN-001/CH-NOTIF-001/NFR-OPS-02; 03 §4 P1 tracking/settings; 05 §11.3; 06 §15. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** SEC-01; OPS-01; LEG-01; FIN-01/02 for reporting/settings semantics; BA-20/26. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-18-AC-1. Support/export/audit/session controls enforce action/owner scope and minimize PII; revocation takes effect per approved policy.
CH-18-AC-2. Analytics distinguish failed sandbox, captured, refunded and net data with agreed timezone/DST/currency fixtures and bounded lazy queries.
CH-18-AC-3. Notifications/alerts verify recipients, dedupe/retry through durable jobs and respect mandatory notice policy; failures cannot alter money/stock truth; tracking/settings remain state-safe.

**Required tests:** Privacy/permission/export masking, session revocation, reporting/DST fixtures, notification duplicate/outage/recipient tests, tracking and settings audit E2E.

**Deliverables:** Support/analytics/export, notification/session/tracking/settings sub-deliveries and security/ops evidence.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-19 — Egyptian live payment adapter and reconciliation

**Phase/status:** P1 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Enable real funds only after provider eligibility and end-to-end controls are accepted.

**Included functionality:**

- Provider shortlist/contract and capability review, adapter sandbox certification, raw-signature webhook verification, reconciliation/unknown outcomes and separately approved live activation.
- No provider is selected by this proposal; no implicit subscription/cost approval.

**Original stories:** CH-P1-055. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-PAY-004, CH-PAY-005, CH-PAY-006.

**Dependencies:** V1-REVIEW/CH-16 eligible refund contract; provider decision before certification, then PAY-LIVE decision/proof before LIVE. Do not require successful live activation to approve research.

**Architecture/UX/API/database references:** 02 CH-PAY P1; 04 §10.5; 05 §§10–11; 06 §13; 07 055. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** PAY-LIVE; OPS-01; LEG-01; FIN-02/SEC-01 as applicable; BA-21. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-19-AC-1. Egypt commercial/API eligibility, signed event specification, secret custody, fees/settlement and refund capability are owner-reviewed from official provider evidence.
CH-19-AC-2. Certification verifies replay/forgery/reordering/refund/unknown reconciliation without raw card storage or browser success claims.
CH-19-AC-3. Live config/activation is a separate protected approval after all scoped evidence, never automatic from sandbox or MVP completion.

**Required tests:** Signed provider sandbox certification, duplicate/timeout/refund/ledger reconciliation and environment isolation tests; live run only separately authorized.

**Deliverables:** Provider decision evidence, isolated adapter/certification, reconciliation runbook and activation checkpoint.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-20 — V1 UX, regression and release

**Phase/status:** P1 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Accept the complete V1 without hiding unfinished features behind a parent status.

**Included functionality:**

- Integrate CH-16–19 workflows, P1 UX/accessibility, regression/fault/operations evidence and controlled release.
- Include all newly assigned gaps in release acceptance; shipping/settings/notification work cannot disappear behind generic UX sign-off.

**Original stories:** CH-P1-056. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-CAT-007, CH-CAT-008, CH-CHECK-005, CH-ORD-006, CH-PAY-004, CH-PAY-005, CH-PAY-006, CH-CUST-001, CH-MKT-001, CH-AN-001.

**Dependencies:** CH-16/17/18/19 accepted scoped milestones and all applicable V1 gates; no partial parent implies final release DONE.

**Architecture/UX/API/database references:** 02 P1 acceptance; 03 §§12–16; 04 §§14–17; 05 §18; 06 §22. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** All scoped V1 gates including FIN-02/PAY-LIVE/OPS/LEG/SEC; UX quality. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-20-AC-1. Cancellation, return/refund, merchandising, support/reporting, notifications/tracking and provider flows have persisted normal/error/security evidence.
CH-20-AC-2. No overrefund/duplicate stock/provider effects, PII leakage or unreviewed numerical target passes remain hidden.
CH-20-AC-3. Human release review accepts remaining risks, runbooks/rollback and actual environment evidence; no automatic deployment/merge.

**Required tests:** End-to-end V1 regression, accessibility/focus/viewports, provider/refund concurrency and recovery/restore review.

**Deliverables:** V1 integrated evidence pack and explicit release acceptance.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

## CH-21 — Future feasibility and separately scoped research

**Phase/status:** P2 / PROPOSED / NOT AUTHORIZED.

**Business objective:** Evaluate future capabilities without making them prerequisites or shipping speculative systems.

**Included functionality:**

- Recommendations/advanced search, loyalty/referrals/gift cards; warehouse/logistics/forecasting; marketplace/settlements/multi-currency/international tax/i18n.
- Explicit native mobile and fraud feasibility ownership for CH-FUT-006; research only and no committed implementation acceptance.

**Original stories:** CH-P2-057, CH-P2-058, CH-P2-059. See [mapping](mapping.md) for exact historical statuses/evidence and full inherited AC.

**Applicable requirement IDs:** CH-FUT-001, CH-FUT-002, CH-FUT-003, CH-FUT-004, CH-FUT-005, CH-FUT-006.

**Dependencies:** Accepted STAGE-B as original 048 predecessor plus a separately approved research brief; not whole V1.

**Architecture/UX/API/database references:** 02 CH-FUT-001–006; 03 §4.5/12; 04 P2 seams; 05 §11 exclusions; 06 §16; 07 057–059. Section inventory and [coverage](coverage.md) retain full clauses and test IDs.

**Security/specialist gates:** New P2 PRD/INV/financial/legal architecture approvals; privacy/security review; BA-26. Declared original gate strings and inherited blockers also remain in inventory; none is closed.

**Acceptance criteria (in addition to every inherited AC):**

CH-21-AC-1. Each of the six P2 requirement IDs has a scoped feasibility result including benefit, risk, privacy/cost and decision owner.
CH-21-AC-2. Warehouse/marketplace/loyalty models assess conservation, auditable balances, isolation, tax and settlement without production changes.
CH-21-AC-3. New PRD/ADR and acceptance approval precede any implementation; no research completion is reported as delivered product.

**Required tests:** Research/ADR, threat/concurrency/financial/legal review and reproducible bounded experiments only when separately authorized.

**Deliverables:** Six-requirement feasibility coverage and explicit go/no-go options.

**Definition of Done:** Every inherited original AC, scope, verification and applicable requirement AC remains mandatory. Reviewed slice evidence, applicable owner decisions, contracts, persisted effects and negative tests, human approval and merge are required; operational proof is required where applicable. Proposal approval, mocks, CI alone or a completed child never complete the parent. P2 completion means approved research evidence, not product implementation.

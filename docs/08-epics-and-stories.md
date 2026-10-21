# CommerceHub — operative 21-story backlog

2026-10-21 (Africa/Cairo). **CH-01–CH-21 ADOPTED as operative planning baseline.**
Owner explicitly approved adoption, five ownership moves, feature coverage and the
48-milestone schedule after [PR #21](https://github.com/ZeyaadAly/CommerceHub/pull/21)
merged at `8543df03c23423ff58d383dde0de2a5192725dbb`. The adoption decision alone authorized governance synchronization;
separate scoped implementation authority is recorded below. No specialist gate closes.

Default to the [adopted backlog](planning/backlog-consolidation/README.md), [definitions](planning/backlog-consolidation/stories.json),
[full acceptance](planning/backlog-consolidation/backlog.md), [milestone graph](planning/backlog-consolidation/milestones.json) and
[current adoption/status record](planning/backlog-consolidation/adoption.json). Legacy CH-P0-001–CH-P2-059 IDs remain
immutable traceability/history, not a competing top-level work queue.
Every inherited requirement/AC/test and gate remains binding; the original
100 edges are historical while the approved scoped milestone repairs now govern
readiness. [Mapping](planning/backlog-consolidation/mapping.md) and [coverage](planning/backlog-consolidation/coverage.md) retain all assignments.

The material below the LEGACY BASELINE marker is preserved verbatim history and
is not the operative status/dependency model. Stale proposed/pending and 59-story
execution instructions there are superseded by this adopted header.

## Operative story index

| Operative story | Phase | Status      | Delivery                                                |
| --------------- | ----- | ----------- | ------------------------------------------------------- |
| CH-01           | P0    | IN PROGRESS | Foundation, environments, tooling, CI and decision work |
| CH-02           | P0    | NOT STARTED | Reviewed PostgreSQL schema and migration foundations    |
| CH-03           | P0    | NOT STARTED | Identity, secure sessions and staff governance          |
| CH-04           | P0    | NOT STARTED | Catalog administration, variants, media and public APIs |
| CH-05           | P0    | NOT STARTED | Inventory balances, movements and staff stock tools     |
| CH-06           | P0    | NOT STARTED | Authenticated cart, exact pricing and quotes            |
| CH-07           | P0    | NOT STARTED | Reservation-backed atomic order initiation              |
| CH-08           | P0    | NOT STARTED | Sandbox payments, event authentication and settlement   |
| CH-09           | P0    | NOT STARTED | Durable jobs, audit persistence and observability       |
| CH-10           | P0    | NOT STARTED | Shared accessible design system                         |
| CH-11           | P0    | NOT STARTED | Storefront discovery and customer account delivery      |
| CH-12           | P0    | NOT STARTED | Shopper checkout, payment outcome and order history     |
| CH-13           | P0    | NOT STARTED | Admin overview, fulfillment and operational controls    |
| CH-14           | P0    | NOT STARTED | Performance, accessibility and adversarial MVP proof    |
| CH-15           | P0    | NOT STARTED | Staging and MVP release acceptance                      |
| CH-16           | P1    | NOT STARTED | V1 cancellation, returns and guarded refunds            |
| CH-17           | P1    | NOT STARTED | V1 merchandising, promotions, reviews and wishlists     |
| CH-18           | P1    | NOT STARTED | V1 customer operations, reporting and notifications     |
| CH-19           | P1    | NOT STARTED | Egyptian live payment adapter and reconciliation        |
| CH-20           | P1    | NOT STARTED | V1 UX, regression and release                           |
| CH-21           | P2    | NOT STARTED | Future feasibility and separately scoped research       |

Each story's objective, scope, original membership, requirement IDs, dependencies,
references, gates, acceptance, tests, deliverables and DoD are incorporated from
[the approved full backlog](planning/backlog-consolidation/backlog.md) and
[stories.json](planning/backlog-consolidation/stories.json), without redefinition.
The historical proposal metadata is superseded only by adoption/current status;
all definitions and inherited acceptance remain unchanged.

## Legacy story history

The following original 59 specifications, their 295 AC clauses, tests, gates and
dependencies are preserved, searchable and recoverable at the recorded Git commit.
They remain acceptance/traceability evidence, not new top-level assignments.

## CH-01/C implementation checkpoint — 2026-10-21

The owner separately authorized Milestone C only after PR #22 merged at
`09fc6aa04d8df8a20cc5eb6e3752ae25d5e42bd7`. Bounded shared transport/schema/client
implementation is **REVIEW**, not DONE; human acceptance and merge are pending.
[Milestone C evidence](verification/CH-01-C.md) maps all five inherited CH-P0-007 clauses, public exports,
negative tests and unresolved API policies. Canonical schemas own inferred types;
no domain policy or specialist gate closes. CH-01 stays partial, 006 BLOCKED,
D/008 and every later milestone unstarted; Redis/spending DEFERRED.
<!-- LEGACY BASELINE: 8543df03c23423ff58d383dde0de2a5192725dbb -->

# CommerceHub — Complete BMAD Epic & Story Backlog

**Document ID:** CH-BMAD-08  
**Status:** Proposed story breakdown, awaiting review. Seven planning baselines approved; open gates are **not** approved.  
**Date:** 2026-10-18  
**Sources:** `01-project-brief.md` through `07-implementation-plan.md`, especially the task registry in section 12 of `07-implementation-plan.md`.  
**Execution status:** No story is implemented, tested, merged or deployed based on this backlog.

## How to use this backlog

This document turns the **59 existing implementation-plan task IDs into 59 initial, testable BMAD stories**, grouped into seven epics. Keeping the exact IDs avoids drifting from the approved work breakdown structure. It is an initial 1:1 story/task mapping, **not a claim that every slice is small enough to implement in one pull request**. During story readiness, split larger stories into subtasks with IDs such as `CH-P0-025-A` while keeping the parent acceptance criteria intact.

Every story must be reviewed for its PRD requirement IDs, UX screen references, API endpoints, database tables, and security permissions during `CH-P0-001`. **Do not invent reference IDs or claim an unmapped story is ready.** This backlog is complete at the level of the approved 59-item plan, but detailed evidence-based traceability is pending the audit.

### Gate policy

Unresolved gates: `FIN-01` (MVP money/tax/shipping), `FIN-02` (refund accounting), `INV-01` (inventory/expiry), `SEC-01` (sessions/RBAC), `PAY-01` (sandbox payment reliability), `OPS-01` (recovery/hosting), `LEG-01` (compliance), and `PAY-LIVE` (live Egyptian payment provider). `DB-0` requires a reviewed migration before database writes. **No story that relies on a gate may cross that decision point before documented human approval.** The gate label `FIN-01 revision` is a new approval for promotion financial effects, not automatic approval from MVP finance sign-off.

### Universal definition of done

A story is `DONE` only when its approved requirements are mapped, its dependencies are satisfied, all applicable gates are signed off, implementation matches the approved architecture, tests and negative tests pass, security/privacy and accessibility checks are completed as applicable, API/DB/docs are updated, and the change is reviewed and merged. A Codex completion message alone is insufficient. All stories below start as `NOT STARTED`.

## Epic summary

| Epic | Release | Scope | Stories |
|---|---|---|---:|
| E0 — Foundation and governance (P0) | P0 / MVP | See stories below | 8 |
| E1 — Core API, identity and catalog (P0) | P0 / MVP | See stories below | 9 |
| E2 — Inventory, cart and checkout (P0) | P0 / MVP | See stories below | 8 |
| E3 — Sandbox payments and operations (P0) | P0 / MVP | See stories below | 8 |
| E4 — Storefront, admin and MVP release (P0) | P0 / MVP | See stories below | 15 |
| E5 — V1 business capabilities (P1) | P1 / V1 | See stories below | 8 |
| E6 — P2 research and feasibility (P2) | P2 / Future | See stories below | 3 |

## Story index

| Story ID | Name | Dependencies | Gate(s) | Status |
|---|---|---|---|---|
| `CH-P0-001` | Freeze requirement matrix and gate owners | none | none | NOT STARTED |
| `CH-P0-002` | Create repository and AGENTS guidance | 001 | none | NOT STARTED |
| `CH-P0-003` | Initialize pnpm workspace and strict TS | 002 | none | NOT STARTED |
| `CH-P0-004` | Establish formatting, lint and hooks | 003 | none | NOT STARTED |
| `CH-P0-005` | Setup CI pipeline and protected PR flow | 003 | none | NOT STARTED |
| `CH-P0-006` | Document env/secret boundary and local Docker | 003 | OPS-01 for shared infra only | NOT STARTED |
| `CH-P0-007` | Create shared validation and API client scaffolds | 003 | none | NOT STARTED |
| `CH-P0-008` | Record initial ADR decisions and gate tracker | 001 | none | NOT STARTED |
| `CH-P0-009` | Design Prisma identity/RBAC schema | 006,008 | SEC-01 on session semantics | NOT STARTED |
| `CH-P0-010` | Apply identity/catalog baseline to disposable DB | 009 | DB-0 | NOT STARTED |
| `CH-P0-011` | NestJS app skeleton and API policy middleware | 003,007 | none | NOT STARTED |
| `CH-P0-012` | Password credentials + verification flows | 010,011 | SEC-01 | NOT STARTED |
| `CH-P0-013` | Opaque cookie sessions and CSRF defenses | 012 | SEC-01 | NOT STARTED |
| `CH-P0-014` | Staff bootstrap and granular RBAC guards | 013 | SEC-01 | NOT STARTED |
| `CH-P0-015` | Catalog CRUD, variants, publication | 010,011,014 | none | NOT STARTED |
| `CH-P0-016` | Media upload policy and image linking | 015 | OPS-01 | NOT STARTED |
| `CH-P0-017` | Public catalog browse/search/filter API | 015 | none | NOT STARTED |
| `CH-P0-018` | Inventory ledger and balance migration | 010,008 | INV-01 | NOT STARTED |
| `CH-P0-019` | Inventory adjustment admin API | 018,014 | INV-01 | NOT STARTED |
| `CH-P0-020` | Authenticated cart endpoints | 013,017 | none | NOT STARTED |
| `CH-P0-021` | Financial quote rules and fixtures | 020,008 | FIN-01 | NOT STARTED |
| `CH-P0-022` | Quote read/create/expiry contracts | 021 | FIN-01 | NOT STARTED |
| `CH-P0-023` | Reservation state machine and DB locks | 018,022 | INV-01 | NOT STARTED |
| `CH-P0-024` | Order and snapshot migration | 010,022 | FIN-01 | NOT STARTED |
| `CH-P0-025` | Atomic quote acceptance -> order/hold | 023,024,013 | FIN-01,INV-01 | NOT STARTED |
| `CH-P0-026` | Payment intent and attempt schema | 025 | PAY-01 | NOT STARTED |
| `CH-P0-027` | Sandbox provider adapter | 026 | PAY-01 | NOT STARTED |
| `CH-P0-028` | Sandbox signed webhook receiver | 027 | PAY-01 | NOT STARTED |
| `CH-P0-029` | Settlement and order transition coordinator | 028,023 | PAY-01,INV-01 | NOT STARTED |
| `CH-P0-030` | Outbox and BullMQ retry processing | 029 | OPS-01 | NOT STARTED |
| `CH-P0-031` | Customer order history/detail | 025,029 | none | NOT STARTED |
| `CH-P0-032` | Admin fulfillment and payment oversight | 014,029 | none | NOT STARTED |
| `CH-P0-033` | Audit logs and anomaly observability | 014,030 | OPS-01 | NOT STARTED |
| `CH-P0-034` | Shared tokens and UI primitives | 007 | none | NOT STARTED |
| `CH-P0-035` | Storefront layout and catalog UI | 017,034 | none | NOT STARTED |
| `CH-P0-036` | Product detail and add-to-cart UI | 035,020 | none | NOT STARTED |
| `CH-P0-037` | Customer account and address UI | 013,034 | SEC-01 | NOT STARTED |
| `CH-P0-038` | Checkout and sandbox payment UX | 025,029,036 | FIN-01,INV-01,PAY-01 | NOT STARTED |
| `CH-P0-039` | Customer order pages | 031,038 | none | NOT STARTED |
| `CH-P0-040` | Admin shell and overview | 014,034 | none | NOT STARTED |
| `CH-P0-041` | Admin product/catalog UI | 015,040 | none | NOT STARTED |
| `CH-P0-042` | Admin inventory UI | 019,040 | none | NOT STARTED |
| `CH-P0-043` | Admin order/fulfillment UI | 032,040 | none | NOT STARTED |
| `CH-P0-044` | Admin staff/RBAC and audit UI | 014,033,040 | SEC-01 | NOT STARTED |
| `CH-P0-045` | Optimize queries/cache and active-route fetching | 035,040,044 | none | NOT STARTED |
| `CH-P0-046` | MVP end-to-end and accessibility suite | 038,039,043,044,045 | none | NOT STARTED |
| `CH-P0-047` | Security/load/fault-injection readiness | 046,033 | FIN-01,INV-01,SEC-01,PAY-01,OPS-01 | NOT STARTED |
| `CH-P0-048` | Staging deployment, documentation and go/no-go | 047,005 | OPS-01,LEG-01 | NOT STARTED |
| `CH-P1-049` | V1 requirements/gates review | 048 | FIN-02,PAY-LIVE for gated subset | NOT STARTED |
| `CH-P1-050` | Return request and review workflow | 049 | LEG-01 | NOT STARTED |
| `CH-P1-051` | Refund calculation and guarded DB effects | 050 | FIN-02,PAY-LIVE | NOT STARTED |
| `CH-P1-052` | Promo/coupon rules and redemption ledger | 049 | FIN-01 revision | NOT STARTED |
| `CH-P1-053` | Reviews and wishlists | 049 | none | NOT STARTED |
| `CH-P1-054` | Analytics and customers operations | 049 | SEC-01 | NOT STARTED |
| `CH-P1-055` | Live Egypt payment adapter and reconciliation | 049,051 | PAY-LIVE,OPS-01,LEG-01 | NOT STARTED |
| `CH-P1-056` | V1 UX, regression and release | 051,052,053,054,055 | all scoped V1 gates | NOT STARTED |
| `CH-P2-057` | Recommendation/loyalty feasibility | 048 | new P2 PRD | NOT STARTED |
| `CH-P2-058` | Multi-warehouse feasibility | 048 | new INV architecture | NOT STARTED |
| `CH-P2-059` | Marketplace/multi-currency feasibility | 048 | new financial/legal ADR | NOT STARTED |

## Story specifications

### E0 — Foundation and governance (P0)

#### CH-P0-001 — Freeze requirement matrix and gate owners

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `none` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to freeze requirement matrix and gate owners, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Map PRD ID to release and owner; record unresolved questions.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Document cross-reference review.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-002 — Create repository and AGENTS guidance

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `001` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to create repository and AGENTS guidance, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Monorepo tree, root/nested AGENTS and PR templates reviewed.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** File/layout and instructions audit.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-003 — Initialize pnpm workspace and strict TS

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `002` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to initialize pnpm workspace and strict TS, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Reproducible workspace, strict compiler, no implementation modules.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Install/build/typecheck smoke.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-004 — Establish formatting, lint and hooks

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `003` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to establish formatting, lint and hooks, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** One shared lint/format policy, scripts work for each workspace.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Lint-format negative fixture.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-005 — Setup CI pipeline and protected PR flow

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `003` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to setup CI pipeline and protected PR flow, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** CI for lint/typecheck/test/build; branch rules documented.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Dry-run failed test blocks merge.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-006 — Document env/secret boundary and local Docker

> **2026-10-19 superseding amendment:** [Docker-free CH-P0-006 decision and refined AC-006-01–15](implementation/CH-P0-006-container-free-decision.md) remove mandatory local Docker Desktop/WSL 2/Compose from this story and its index title. Historical title, user story and original criteria remain below for audit; current limited readiness is in the live tracker. Security, isolated PostgreSQL/Redis, real integration tests and reproducible bootstrap remain. Dependency 003 and OPS-01 shared-infrastructure gate are unchanged. Refined criteria await review; implementation and provisioning are not authorized.

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `003` · **Decision gates:** `OPS-01 for shared infra only`.  
**User story:** As a platform maintainer, I need the platform to document env/secret boundary and local Docker, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** No secrets in git; dev DB and Redis isolated.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Secret scan and clean bootstrap.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-007 — Create shared validation and API client scaffolds

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `003` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to create shared validation and API client scaffolds, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Zod schemas/types and API client package compile independently.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Type and version compatibility tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-008 — Record initial ADR decisions and gate tracker

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `001` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to record initial ADR decisions and gate tracker, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Each unresolved gate has owner, evidence, blocking ID.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Gate audit.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

### E1 — Core API, identity and catalog (P0)

#### CH-P0-009 — Design Prisma identity/RBAC schema

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `006,008` · **Decision gates:** `SEC-01 on session semantics`.  
**User story:** As a platform maintainer, I need the platform to design Prisma identity/RBAC schema, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Constraints match DB doc; safe relation deletion.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Migration review and schema test.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-010 — Apply identity/catalog baseline to disposable DB

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `009` · **Decision gates:** `DB-0`.  
**User story:** As a platform maintainer, I need the platform to apply identity/catalog baseline to disposable DB, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Reviewed SQL, rollback/forward notes, CI apply clean.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Fresh/migrated DB integration.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-011 — NestJS app skeleton and API policy middleware

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `003,007` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to nestJS app skeleton and API policy middleware, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Module boundaries, validation, errors, OpenAPI, health.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Supertest contracts.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-012 — Password credentials + verification flows

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `010,011` · **Decision gates:** `SEC-01`.  
**User story:** As a platform maintainer, I need the platform to password credentials + verification flows, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Argon2id hashes, one-time tokens, enumeration safe.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Unit + negative integration.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-013 — Opaque cookie sessions and CSRF defenses

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `012` · **Decision gates:** `SEC-01`.  
**User story:** As a platform maintainer, I need the platform to opaque cookie sessions and CSRF defenses, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Rotate/revoke/expire correctly; secure origin policy.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Session and CSRF integration.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-014 — Staff bootstrap and granular RBAC guards

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `013` · **Decision gates:** `SEC-01`.  
**User story:** As a authorized administrator, I need the platform to staff bootstrap and granular RBAC guards, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Least privilege and last Super Admin protections.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Full deny/allow matrix.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-015 — Catalog CRUD, variants, publication

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `010,011,014` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to catalog CRUD, variants, publication, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Slugs/SKUs unique; only published visible publicly.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** CRUD + visibility tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-016 — Media upload policy and image linking

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `015` · **Decision gates:** `OPS-01`.  
**User story:** As a platform maintainer, I need the platform to media upload policy and image linking, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Validated type/size and authorized object storage.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Invalid upload/security tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-017 — Public catalog browse/search/filter API

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `015` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to public catalog browse/search/filter API, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Cursor stable, whitelist filtering, no draft leak.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Contract + pagination tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

### E2 — Inventory, cart and checkout (P0)

#### CH-P0-018 — Inventory ledger and balance migration

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `010,008` · **Decision gates:** `INV-01`.  
**User story:** As a platform maintainer, I need the platform to inventory ledger and balance migration, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** CHECK protections and immutable stock movements.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Constraint and transaction tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-019 — Inventory adjustment admin API

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `018,014` · **Decision gates:** `INV-01`.  
**User story:** As a authorized administrator, I need the platform to inventory adjustment admin API, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Permissioned reason-coded movements, no stock below holds.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Concurrency, RBAC and audit.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-020 — Authenticated cart endpoints

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `013,017` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to authenticated cart endpoints, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Cart validates variant and quantities; no price trust.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** CRUD and ownership tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-021 — Financial quote rules and fixtures

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `020,008` · **Decision gates:** `FIN-01`.  
**User story:** As a platform maintainer, I need the platform to financial quote rules and fixtures, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Exact EGP totals and approved tax/shipping model.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Golden rounding tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-022 — Quote read/create/expiry contracts

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `021` · **Decision gates:** `FIN-01`.  
**User story:** As a platform maintainer, I need the platform to quote read/create/expiry contracts, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Server recomputes prices, rejects stale tampered inputs.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Quote replay tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-023 — Reservation state machine and DB locks

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `018,022` · **Decision gates:** `INV-01`.  
**User story:** As a commerce operations system, I need the platform to reservation state machine and DB locks, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Atomic ACTIVE to terminal, expiry safety via DB clock.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Parallel buyer stress test.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-024 — Order and snapshot migration

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `010,022` · **Decision gates:** `FIN-01`.  
**User story:** As a platform maintainer, I need the platform to order and snapshot migration, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Immutability and historical snapshots, FK restrictions.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Snapshot mutation regression.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-025 — Atomic quote acceptance -> order/hold

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `023,024,013` · **Decision gates:** `FIN-01,INV-01`.  
**User story:** As a platform maintainer, I need the platform to atomic quote acceptance -> order/hold, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** One order per idempotent command, no oversell.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Crash rollback + 100 concurrent calls.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

### E3 — Sandbox payments and operations (P0)

#### CH-P0-026 — Payment intent and attempt schema

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `025` · **Decision gates:** `PAY-01`.  
**User story:** As a commerce operations system, I need the platform to payment intent and attempt schema, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Unique effects, provider refs and idempotency keys.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Migration constraints and replay.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-027 — Sandbox provider adapter

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `026` · **Decision gates:** `PAY-01`.  
**User story:** As a platform maintainer, I need the platform to sandbox provider adapter, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Deterministic mock outcomes, no live network or card data.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Adapter unit suite.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-028 — Sandbox signed webhook receiver

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `027` · **Decision gates:** `PAY-01`.  
**User story:** As a commerce operations system, I need the platform to sandbox signed webhook receiver, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Raw-body signature validation; unique event dedupe.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Bad signature, replay tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-029 — Settlement and order transition coordinator

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `028,023` · **Decision gates:** `PAY-01,INV-01`.  
**User story:** As a commerce operations system, I need the platform to settlement and order transition coordinator, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Out-of-order handling, no success on redirect.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Race and late-success tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-030 — Outbox and BullMQ retry processing

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `029` · **Decision gates:** `OPS-01`.  
**User story:** As a commerce operations system, I need the platform to outbox and BullMQ retry processing, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** At-least-once jobs idempotent; backoff and DLQ.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Queue outage and recovery.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-031 — Customer order history/detail

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `025,029` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to customer order history/detail, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Only owner sees snapshots and statuses.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Cross-user 404 regression.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-032 — Admin fulfillment and payment oversight

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `014,029` · **Decision gates:** `none`.  
**User story:** As a commerce operations system, I need the platform to admin fulfillment and payment oversight, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Permissioned valid transitions with audit.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** State transition/role tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-033 — Audit logs and anomaly observability

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `014,030` · **Decision gates:** `OPS-01`.  
**User story:** As a platform maintainer, I need the platform to audit logs and anomaly observability, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Redaction, trace IDs and admin audit visibility.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Log leak/fail-closed tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

### E4 — Storefront, admin and MVP release (P0)

#### CH-P0-034 — Shared tokens and UI primitives

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `007` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to shared tokens and UI primitives, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Responsive accessible forms/buttons/tables, no overflow.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Story/unit/a11y review.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-035 — Storefront layout and catalog UI

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `017,034` · **Decision gates:** `none`.  
**User story:** As a customer, I need the platform to storefront layout and catalog UI, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** SEO metadata and working list/filter URLs.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Playwright 360/768/1440.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-036 — Product detail and add-to-cart UI

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `035,020` · **Decision gates:** `none`.  
**User story:** As a customer, I need the platform to product detail and add-to-cart UI, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Correct variant availability, pending/error states.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** RTL + E2E variant flow.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-037 — Customer account and address UI

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `013,034` · **Decision gates:** `SEC-01`.  
**User story:** As a customer, I need the platform to customer account and address UI, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Secure form flows, normalized errors.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Login/password e2e.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-038 — Checkout and sandbox payment UX

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `025,029,036` · **Decision gates:** `FIN-01,INV-01,PAY-01`.  
**User story:** As a commerce operations system, I need the platform to checkout and sandbox payment UX, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Displays server quote; uncertain outcomes never shown paid.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Purchase and timeout E2E.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-039 — Customer order pages

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `031,038` · **Decision gates:** `none`.  
**User story:** As a customer, I need the platform to customer order pages, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Accurate history and tracking, loading/empty/error.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Owner isolation e2e.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-040 — Admin shell and overview

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `014,034` · **Decision gates:** `none`.  
**User story:** As a authorized administrator, I need the platform to admin shell and overview, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Role-aware shell and lightweight KPIs only.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Network request assertion.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-041 — Admin product/catalog UI

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `015,040` · **Decision gates:** `none`.  
**User story:** As a authorized administrator, I need the platform to admin product/catalog UI, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Compact forms, variants, images and accessible CRUD.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Form validation/overflow e2e.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-042 — Admin inventory UI

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `019,040` · **Decision gates:** `none`.  
**User story:** As a authorized administrator, I need the platform to admin inventory UI, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Paginated stock/movement, read-only by permission.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Role and table e2e.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-043 — Admin order/fulfillment UI

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `032,040` · **Decision gates:** `none`.  
**User story:** As a authorized administrator, I need the platform to admin order/fulfillment UI, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Allowed actions, filters, error and conflict handling.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Status transitions e2e.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-044 — Admin staff/RBAC and audit UI

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `014,033,040` · **Decision gates:** `SEC-01`.  
**User story:** As a authorized administrator, I need the platform to admin staff/RBAC and audit UI, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Cannot expose unauthorized grant actions; API blocks.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Privilege escalation e2e.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-045 — Optimize queries/cache and active-route fetching

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `035,040,044` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to optimize queries/cache and active-route fetching, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Inactive modules never fetch; no duplicate requests.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** HAR/network budget regression.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-046 — MVP end-to-end and accessibility suite

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `038,039,043,044,045` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to mVP end-to-end and accessibility suite, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Happy and failure purchase, desktop/mobile, WCAG review.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Full Playwright + manual keyboard.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-047 — Security/load/fault-injection readiness

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `046,033` · **Decision gates:** `FIN-01,INV-01,SEC-01,PAY-01,OPS-01`.  
**User story:** As a platform maintainer, I need the platform to security/load/fault-injection readiness, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** No critical failures or unresolved high-severity findings.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Concurrency, pentest checklist, restore.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P0-048 — Staging deployment, documentation and go/no-go

**Release:** P0 · **Status:** NOT STARTED · **Dependencies:** `047,005` · **Decision gates:** `OPS-01,LEG-01`.  
**User story:** As a platform maintainer, I need the platform to staging deployment, documentation and go/no-go, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Smoke verified URLs and observed runbooks; no live payments.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** CI/CD logs and product sign-off.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

### E5 — V1 business capabilities (P1)

#### CH-P1-049 — V1 requirements/gates review

**Release:** P1 · **Status:** NOT STARTED · **Dependencies:** `048` · **Decision gates:** `FIN-02,PAY-LIVE for gated subset`.  
**User story:** As a platform maintainer, I need the platform to v1 requirements/gates review, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** P1 scope/ADR and provider shortlist approved.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Contract review.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P1-050 — Return request and review workflow

**Release:** P1 · **Status:** NOT STARTED · **Dependencies:** `049` · **Decision gates:** `LEG-01`.  
**User story:** As a platform maintainer, I need the platform to return request and review workflow, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Eligibility and return states documented and tested.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Return state tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P1-051 — Refund calculation and guarded DB effects

**Release:** P1 · **Status:** NOT STARTED · **Dependencies:** `050` · **Decision gates:** `FIN-02,PAY-LIVE`.  
**User story:** As a platform maintainer, I need the platform to refund calculation and guarded DB effects, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Total pending+done <= captured with exact allocations.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Partial/duplicate/concurrent refund tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P1-052 — Promo/coupon rules and redemption ledger

**Release:** P1 · **Status:** NOT STARTED · **Dependencies:** `049` · **Decision gates:** `FIN-01 revision`.  
**User story:** As a platform maintainer, I need the platform to promo/coupon rules and redemption ledger, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Exclusive conditions, ceilings and replay safety.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Coupon stack/expiry tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P1-053 — Reviews and wishlists

**Release:** P1 · **Status:** NOT STARTED · **Dependencies:** `049` · **Decision gates:** `none`.  
**User story:** As a platform maintainer, I need the platform to reviews and wishlists, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Authorized reviews; owner-only wishlists.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Moderation and ownership tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P1-054 — Analytics and customers operations

**Release:** P1 · **Status:** NOT STARTED · **Dependencies:** `049` · **Decision gates:** `SEC-01`.  
**User story:** As a platform maintainer, I need the platform to analytics and customers operations, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Permission-scoped bounded KPIs and PII-safe exports.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Query/perms/performance tests.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P1-055 — Live Egypt payment adapter and reconciliation

**Release:** P1 · **Status:** NOT STARTED · **Dependencies:** `049,051` · **Decision gates:** `PAY-LIVE,OPS-01,LEG-01`.  
**User story:** As a commerce operations system, I need the platform to live Egypt payment adapter and reconciliation, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Provider Egypt support and certification verified.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Signed sandbox certification run.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P1-056 — V1 UX, regression and release

**Release:** P1 · **Status:** NOT STARTED · **Dependencies:** `051,052,053,054,055` · **Decision gates:** `all scoped V1 gates`.  
**User story:** As a platform maintainer, I need the platform to v1 UX, regression and release, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Refund/returns UX tested; controlled launch.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** End-to-end regression.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

### E6 — P2 research and feasibility (P2)

#### CH-P2-057 — Recommendation/loyalty feasibility

**Release:** P2 · **Status:** NOT STARTED · **Dependencies:** `048` · **Decision gates:** `new P2 PRD`.  
**User story:** As a platform maintainer, I need the platform to recommendation/loyalty feasibility, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Privacy-aware feasibility and acceptance scope.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** ADR/research review.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P2-058 — Multi-warehouse feasibility

**Release:** P2 · **Status:** NOT STARTED · **Dependencies:** `048` · **Decision gates:** `new INV architecture`.  
**User story:** As a platform maintainer, I need the platform to multi-warehouse feasibility, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Stock allocation and race model proposal.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Concurrency threat review.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

#### CH-P2-059 — Marketplace/multi-currency feasibility

**Release:** P2 · **Status:** NOT STARTED · **Dependencies:** `048` · **Decision gates:** `new financial/legal ADR`.  
**User story:** As a platform maintainer, I need the platform to marketplace/multi-currency feasibility, so that the related commerce capability is delivered reliably, securely, and consistently with the approved product scope.  
**Scope / expected outcome:** Tenant isolation, settlement and tax model study.  
**Acceptance criteria:**
1. Implement or document the outcome above without expanding its approved release scope.
2. Enforce relevant ownership, authorization, financial, concurrency, and audit invariants in the trusted backend where applicable.
3. Handle errors and invalid inputs predictably; avoid accidental state changes on retries.
4. Satisfy the named dependencies and decision gates; record exact PRD/UX/API/DB references before execution.
5. Capture evidence for the story-specific verification below, including meaningful negative cases.

**Verification:** Threat and legal review.  
**Definition of ready:** dependencies met; gate decisions signed where required; exact requirement and contract references attached; acceptance scenarios refined and reviewed.  
**Definition of done:** universal definition of done plus verified story-specific acceptance and tests.

## Execution and sequencing

1. Start with **CH-P0-001**, the documentation baseline and gate audit. It may produce traceability and identify blockers without building code.
2. Review **CH-P0-002** to establish repository Codex rules, followed by foundation tasks and gate decisions according to their actual dependencies.
3. Implement P0 stories in dependency order, allowing independent tasks to proceed in parallel only when ownership and contracts are settled.
4. Demonstrate the full sandbox order lifecycle and admin operations, then complete MVP security/performance/accessibility/operations gates before staging release.
5. Begin V1 only after the approved P0 exit and relevant V1 gate approvals; treat P2 as feasibility research until separately scoped.

## Before sending an individual story to Codex

Use a per-story implementation prompt with: exact story ID and source paths; PRD/UX/API/DB references; dependencies and gate evidence; allowed file scope; implementation and non-goals; security/privacy expectations; test matrix (including failures and concurrency where relevant); exact commands to run; rollback/migration checks; and required evidence in the final Codex report. Never tell Codex to infer missing business policy or auto-approve a gate.

## Change management

Maintain this backlog alongside `07-implementation-plan.md`. A proposed new or split story should preserve its parent ID, cite rationale and impact, and obtain approval before modifying scope or delivery dependencies. Review status changes against Git commits, PRs, CI results and human approvals rather than using agent claims alone.

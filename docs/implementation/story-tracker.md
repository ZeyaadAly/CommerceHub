# CommerceHub operative story tracker

2026-10-21 (Africa/Cairo). **CH-01–CH-21 ADOPTED as operative planning baseline.**
Owner explicitly approved adoption, five ownership moves, feature coverage and the
48-milestone schedule after [PR #21](https://github.com/ZeyaadAly/CommerceHub/pull/21)
merged at `8543df03c23423ff58d383dde0de2a5192725dbb`. The adoption decision alone authorized governance synchronization;
separate scoped implementation authority is recorded below. No specialist gate closes.

Default to the [adopted backlog](../planning/backlog-consolidation/README.md), [definitions](../planning/backlog-consolidation/stories.json),
[full acceptance](../planning/backlog-consolidation/backlog.md), [milestone graph](../planning/backlog-consolidation/milestones.json) and
[current adoption/status record](../planning/backlog-consolidation/adoption.json). Legacy CH-P0-001–CH-P2-059 IDs remain
immutable traceability/history, not a competing top-level work queue.
Every inherited requirement/AC/test and gate remains binding; the original
100 edges are historical while the approved scoped milestone repairs now govern
readiness. [Mapping](../planning/backlog-consolidation/mapping.md) and [coverage](../planning/backlog-consolidation/coverage.md) retain all assignments.

The material below the LEGACY BASELINE marker is preserved verbatim history and
is not the operative status/dependency model. Stale proposed/pending and 59-story
execution instructions there are superseded by this adopted header.

## Current C acceptance and D preparation — 2026-10-21

C/007 is **DONE for bounded scope**, after all five acceptance clauses, package/consumer/security tests, exact-head CI and owner PR #23 merge at `5c31a735251eeb179ae3a8b174b49f8ac13004d6` were checked. CH-01 remains partial, full 006 BLOCKED. D/008 is **REVIEW** for decision preparation only.

The [single decision matrix](../architecture/decisions/decision-matrix.md) provides nine PROPOSED ADR packets, all owner/evidence/blocking requests, acceptance/protection visibility limits and deferred decisions. No specialist gate closes. The owner separately authorized CH-03/API transport only; its bounded implementation is now DONE after the separately authorized PR #25 evidence reconciliation, with the API-01 handoff recorded and API-01 still OPEN. CH-03 is IN PROGRESS, never DONE. AUTH/STAFF/DB are unstarted; T has C satisfied and scoped owner D1–D4 approval; bounded implementation is REVIEW, human acceptance remains outstanding. No successor starts. Redis spending remains DEFERRED; Docker/WSL not required.

## Current parent execution status

| Operative story | Phase | Status      | Delivery                                                |
| --------------- | ----- | ----------- | ------------------------------------------------------- |
| CH-01           | P0    | IN PROGRESS | Foundation, environments, tooling, CI and decision work |
| CH-02           | P0    | NOT STARTED | Reviewed PostgreSQL schema and migration foundations    |
| CH-03           | P0    | IN PROGRESS | Identity, secure sessions and staff governance          |
| CH-04           | P0    | NOT STARTED | Catalog administration, variants, media and public APIs |
| CH-05           | P0    | NOT STARTED | Inventory balances, movements and staff stock tools     |
| CH-06           | P0    | NOT STARTED | Authenticated cart, exact pricing and quotes            |
| CH-07           | P0    | NOT STARTED | Reservation-backed atomic order initiation              |
| CH-08           | P0    | NOT STARTED | Sandbox payments, event authentication and settlement   |
| CH-09           | P0    | NOT STARTED | Durable jobs, audit persistence and observability       |
| CH-10           | P0    | IN PROGRESS | Shared accessible design system                         |
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

CH-01 is IN PROGRESS / PARTIALLY IMPLEMENTED, not DONE. Its F milestone reuses
historical 001–005 DONE evidence. Legacy 006 remains BLOCKED overall with merged
partial work. C/007 is bounded DONE; D/008 preparation is REVIEW. Scoped readiness is separate.
CH-02–CH-21 are NOT STARTED: there is no verified feature implementation evidence.
Open unrelated specialist gates do not change every parent's execution status to BLOCKED.

The [48 milestone states](../planning/backlog-consolidation/adoption.json) separately
record execution, readiness, unmet prerequisites and authorization. All unstarted
implementation remains NOT AUTHORIZED. [Task readiness](task-readiness.md) explains
C/D readiness boundaries; changing status requires actual evidence.

## Historical evidence

All original rows below, including 001–005 DONE and 006–059 historical BLOCKED
values, remain unchanged. Historical BLOCKED rows do not override current scoped
readiness; they are not erased or retrospectively relabeled READY. Legacy 007 is bounded DONE; 008 decision preparation is REVIEW. No child completion automatically completes a parent.

## Historical C implementation checkpoint — 2026-10-21

This REVIEW checkpoint is superseded by the current acceptance above; its preparation evidence is retained.

The owner separately authorized Milestone C only after PR #22 merged at
`09fc6aa04d8df8a20cc5eb6e3752ae25d5e42bd7`. Bounded shared transport/schema/client
implementation is **REVIEW**, not DONE; human acceptance and merge are pending.
[Milestone C evidence](../verification/CH-01-C.md) maps all five inherited CH-P0-007 clauses, public exports,
negative tests and unresolved API policies. Canonical schemas own inferred types;
no domain policy or specialist gate closes. CH-01 stays partial, 006 BLOCKED,
D/008 and every later milestone unstarted; Redis/spending DEFERRED.

## Historical CH-03/API pre-acceptance transport checkpoint — 2026-10-21

[Technical handoff, inherited acceptance and actual verification](../verification/CH-03-API.md) record transport-only REVIEW. PR #24 merge `ffa113804b4c38237576e6fafaf637cb50779f01` was verified before work; its ADR recommendations remain unsigned PROPOSED. Existing F/C acceptance is unchanged. No authentication, staff governance, persistence or business implementation is accepted. API-01 and all specialist gates remain OPEN; full 006 BLOCKED, Redis spending DEFERRED, Docker/WSL not required. Independent CH-10/T design preparation is a possible next separately authorized task; T implementation awaits UX/quality evidence, and no next milestone starts here.

## Historical CH-10/T readiness and API reconciliation — 2026-10-21

[Single concise handoff](../design/CH-10-T-handoff.md): D1–D4 PROPOSED, readiness REVIEW; T implementation BLOCKED on named UX/Product + QA approval and separate implementation authority. C is sufficient predecessor; no full CH-01/API/DB dependency added. API bounded transport is DONE after PR #25's implementation, all inherited AC, exact-head CI and owner merge were assessed; CH-03 stays IN PROGRESS, AUTH/STAFF/DB unaccepted, API-01 OPEN. This task implements no components. All gates/ADRs, historical 001–005 DONE, full 006 BLOCKED, Redis DEFERRED and security-exception dates remain unchanged.

## Current CH-10/T implementation — 2026-10-21

Owner explicitly approved D1–D4 for shared tokens/primitives, representative test compositions and accessibility/testing only. [Implementation evidence](../verification/CH-10-T.md) records T REVIEW, CH-10 IN PROGRESS, no feature-page UX or specialist gate closure. The original readiness report is preserved below its own history boundary. C/F/API acceptance, approved 21-story/48-milestone definitions, 59 legacy stories, CH-01 partial, CH-03 incomplete, full 006 BLOCKED, unsigned ADRs, OPEN specialist gates, Redis DEFERRED and security-exception dates remain unchanged. Human assistive-tech/native zoom/device and final acceptance evidence remain outstanding; no next milestone starts.
<!-- LEGACY BASELINE: 8543df03c23423ff58d383dde0de2a5192725dbb -->

# CommerceHub story tracker

CH-P0-006 exact owner-observed pooler tuple APPROVED (2026-10-21);
[code activation REVIEW](../verification/CH-P0-006-approved-pooler-target.md),
subject to review/merge. Live verification/custody/role separation remain blocked
or unverified. All story rows/dependencies and prior acceptance unchanged:
001–005 DONE, full 006 BLOCKED, 007 NOT STARTED/readiness BLOCKED,
specialist gates OPEN and managed Redis/spending DEFERRED.

CH-P0-006 target-evidence checkpoint (2026-10-21): [record REVIEW](../verification/CH-P0-006-pooler-target-verification.md),
exact pooler identity BLOCKED and owner endpoint approval PENDING. PR #18 merged;
production allowlist unchanged. Existing seven PASS/eight BLOCKED criteria,
001–005 DONE, full 006 BLOCKED, 007 NOT STARTED/readiness BLOCKED, all story
dependencies, specialist gates OPEN and managed Redis/spending DEFERRED retained.

CH-P0-006 offline Windows compatibility follow-up (2026-10-21): implementation
REVIEW; [evidence](../verification/CH-P0-006-session-pooler-compatibility.md).
Exact Session Pooler approval and live verification remain BLOCKED. No original
acceptance/status change: 001–005 DONE; full 006 BLOCKED; 007 NOT STARTED/readiness
BLOCKED; specialist gates OPEN; managed Redis/spending DEFERRED.

## CH-P0-006 persistent dev choice - 2026-10-20

**Limited 006: MERGED. Full 006: BLOCKED/not DONE.** The owner [designates existing Supabase `commercehub` as persistent non-production dev](CH-P0-006-supabase-dev-designation.md); new/empty is an owner attestation, not independently checked. PR #14 proposal is verified merged at `0ea8195d8d4daf9a4c4d198929cd4af640ebb2da`. This designation is no resource-operation or connectivity authorization. Redis/spending remain DEFERRED and all specialist gates OPEN. All 59 IDs/dependencies, five DONE predecessors and CH-P0-007 not-started status are preserved. Earlier option/proposal states are dated history.

## CH-P0-006 infrastructure approval checkpoint - 2026-10-20

**Limited phase: MERGED through PR #13; full story: BLOCKED, not DONE.** Verified merge `d45cc09b87bf1d1b1b2c4d68266562776af15afd`, reviewed head `5ab16ff0fbbd97bb9a5f9febf7f4e8d4ed3a825f`. The [infrastructure proposal](CH-P0-006-infrastructure-proposal.md) is PROPOSED/REVIEW; no provider/resource/spending approval or runtime evidence follows. [Checkpoint verification](../verification/CH-P0-006-infrastructure-checkpoint.md). All 59 IDs/dependencies, five DONE stories, OPEN gates and CH-P0-007 not-started status are retained; earlier limited REVIEW statements are historical.

## CH-P0-006 limited preparation - 2026-10-20

**Limited phase: REVIEW; full story: BLOCKED, not DONE.** Governance PR #12 is merged at `bce93821870ad7d966a2e33d7945d226e4f3261f`. The separately authorized limited implementation has [scoped verification evidence](../verification/CH-P0-006-limited.md); database/Redis resource and integration acceptance remains blocked. Older readiness/authority snapshots below are historical. No other story, dependency or gate changes.

## CH-P0-006 Docker-free governance reassessment — 2026-10-19

**CH-P0-006: READY only for limited documentation/configuration preparation; not started and implementation NOT authorized.** The [owner-approved narrow workstation amendment](CH-P0-006-container-free-decision.md) removes mandatory local Docker/WSL/Compose. Full runtime bootstrap/integration verification awaits separately approved isolated PostgreSQL/Redis resources and compatible Redis selection. Pending evidence cannot count as DONE. Dependency CH-P0-003, OPEN OPS-01 shared-infrastructure gate and all downstream statuses remain unchanged. This authored governance revision awaits review/integration; earlier Docker-blocked snapshots are superseded only for current readiness.

## CH-P0-005 final integration and CH-P0-006 readiness - 2026-10-19

**CH-P0-005 is DONE** after explicit owner acceptance and verified [PR #8 merge](https://github.com/ZeyaadAly/CommerceHub/pull/8) at 30545f77f139cb8fcf629b27b87da9f628b627bd. **CH-P0-006 remains BLOCKED** only on a usable Docker/Compose execution environment for reproducible local bootstrap; its predecessor evidence is satisfied and its limited acceptance is refined in [readiness](task-readiness.md). No next-story implementation is authorized. See [integration evidence](../verification/CH-P0-005-integration.md). The November 2 UTC exception expiry and all OPEN specialist gates remain unchanged. Earlier execution sections are historical.

## CH-P0-005 temporary exception execution - 2026-10-19

Status **REVIEW**. Owner approved the exact time-limited GHSA-vfj7-8cjw-p6xm exception, not story acceptance or merge. Fail-closed implementation and green Linux CI are verified; main protection is active with admin enforcement and an app-bound required check. Lint/type/security negative PRs report BLOCKED; exact-source recovery is SUCCESS/CLEAN, and disposable PR #10 is closed unmerged with its owned branches deleted. Evidence and final observed outcomes are recorded in [005 evidence](../verification/CH-P0-005.md). Expiry 2026-11-02T00:00:00Z; reassessment 2026-10-26. All specialist gates remain OPEN. No subsequent story is readied or started. Earlier blocker/proposal snapshots below are historical.


As of 2026-10-19. Source: [07 §12](../07-implementation-plan.md) and [08 index/specifications](../08-epics-and-stories.md). Actual 59 parent IDs retained; no new story IDs. Declared dependencies and gates are preserved verbatim in meaning, normalized to full IDs. Audit additions are recommendations/blockers, not approved graph edits.

Status vocabulary: NOT_STARTED = no execution evidence and no current blocking prerequisite; READY = reviewed scope, predecessors and gates satisfied; BLOCKED = unmet predecessor, gate or readiness issue; IN_PROGRESS = executing authorized work; REVIEW = deliverable awaiting acceptance; DONE includes verified human-reviewed/merged evidence. Human approval for CH-P0-001/002: APPROVED 2026-10-18, CommerceHub project owner; GitHub integration: MERGED in PR #1 at b5dd1a3932d49b7fcbd7759cfa7e7365104a8e6c, fetched origin/main content verified. Current full-story counts after limited preparation: DONE=5, BLOCKED=54; other statuses zero. Limited-phase MERGED is recorded separately above. 003 is human APPROVED and its accepted C: implementation is verified MERGED in PR #4; 004 is human APPROVED and verified MERGED in PR #6; 005 is human APPROVED and verified MERGED in PR #8; its protection and scoped exception evidence are accepted for this story only. Other stories are not automatically unblocked. See [approval register](approval-register.md), [formal review](formal-review-001-002.md) and [integration evidence](governance-finalization.md).

Numbered dependencies refer to real IDs in the table. Every descendant inherits the unresolved predecessor gates; “none” in the direct gate column is not clearance. BA-22 still requires story-specific AC refinement for later work; 003 acceptance is refined in its verification evidence. CH-P0-003 scaffold verification passed locally; see [003 evidence](../verification/CH-P0-003.md). Domain implementation tests remain NOT RUN. See [gate register](gate-register.md), [audit](baseline-audit.md), [readiness](task-readiness.md) and [traceability](requirements-traceability.md).

| Story ID | Story / epic | Release | Priority | Declared dependencies | Direct gates | Additional audit/readiness blockers | Status | Evidence |
|---|---|---|---|---|---|---|---|---|
| CH-P0-001 | Freeze requirement matrix and gate owners / E0 | MVP | P0 | none | none | none for accepted scope | DONE | Human APPROVED 2026-10-18, CommerceHub project owner; [formal review PASS](formal-review-001-002.md); [PR #1 MERGED](https://github.com/ZeyaadAly/CommerceHub/pull/1), b5dd1a3932d49b7fcbd7759cfa7e7365104a8e6c |
| CH-P0-002 | Create repository and AGENTS guidance / E0 | MVP | P0 | CH-P0-001 | none | none for accepted scope | DONE | Human APPROVED 2026-10-18, CommerceHub project owner; eight instructions/metadata [review PASS](formal-review-001-002.md); [PR #1 MERGED](https://github.com/ZeyaadAly/CommerceHub/pull/1), b5dd1a3932d49b7fcbd7759cfa7e7365104a8e6c |
| CH-P0-003 | Initialize pnpm workspace and strict TS / E0 | MVP | P0 | CH-P0-002 | none | none for accepted scope; Windows limitation acknowledged | DONE | Human APPROVED 2026-10-19; [PR #4 MERGED](https://github.com/ZeyaadAly/CommerceHub/pull/4), 111a2ce752e9f8aa18ef970bfc972f3b39e8b50f; exact fetched main tree verified; [final evidence](../verification/CH-P0-003-integration.md) |
| CH-P0-004 | Establish formatting, lint and hooks / E0 | MVP | P0 | CH-P0-003 | none | Human APPROVED 2026-10-19; verified merge, accepted tooling limitations | DONE | [PR #6 MERGED](https://github.com/ZeyaadAly/CommerceHub/pull/6), 5cbb86aea0f70f489a47245204c1850e80ee0264; exact fetched main tree verified; all final checks passed; [owner approval](approval-register.md), [integration evidence](../verification/CH-P0-004-integration.md) |
| CH-P0-005 | Setup CI pipeline and protected PR flow / E0 | MVP | P0 | CH-P0-003 | none | Human APPROVED; required checks and protected merge verified; exact temporary exception remains active | DONE | [PR #8 MERGED](https://github.com/ZeyaadAly/CommerceHub/pull/8), 30545f77f139cb8fcf629b27b87da9f628b627bd, 2026-10-19T12:32:40Z; [integration evidence](../verification/CH-P0-005-integration.md); all specialist gates OPEN |
| CH-P0-006 | Document env/secret boundary and local Docker (historical title; Docker-free amendment) / E0 | MVP | P0 | CH-P0-003 | OPS-01 for shared infra only | Limited phase MERGED; owner dev choice recorded, connectivity/security evidence unverified; Redis/spending deferred | BLOCKED | [Controlled verifier](../verification/CH-P0-006-controlled-connectivity.md) (REVIEW; live BLOCKED); [Connectivity plan](../verification/CH-P0-006-postgres-connectivity-readiness.md) (REVIEW, no connection); [Designation](CH-P0-006-supabase-dev-designation.md); [limited evidence](../verification/CH-P0-006-limited.md); no full acceptance, connection or migration |
| CH-P0-007 | Create shared validation and API client scaffolds / E0 | MVP | P0 | CH-P0-003 | none | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-008 | Record initial ADR decisions and gate tracker / E0 | MVP | P0 | CH-P0-001 | none | Predecessor satisfied; story-specific ADR option-pack readiness/AC review pending (BA-22); not automatically readied | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-009 | Design Prisma identity/RBAC schema / E1 | MVP | P0 | CH-P0-006, CH-P0-008 | SEC-01 on session semantics | BA-05/15: catalog/price schema boundary; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-010 | Apply identity/catalog baseline to disposable DB / E1 | MVP | P0 | CH-P0-009 | DB-0 | BA-05/06: missing schema foundations; DB-01; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-011 | NestJS app skeleton and API policy middleware / E1 | MVP | P0 | CH-P0-003, CH-P0-007 | none | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-012 | Password credentials + verification flows / E1 | MVP | P0 | CH-P0-010, CH-P0-011 | SEC-01 | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-013 | Opaque cookie sessions and CSRF defenses / E1 | MVP | P0 | CH-P0-012 | SEC-01 | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-014 | Staff bootstrap and granular RBAC guards / E1 | MVP | P0 | CH-P0-013 | SEC-01 | BA-04/07/14: permissions, early audit, staff audience; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-015 | Catalog CRUD, variants, publication / E1 | MVP | P0 | CH-P0-010, CH-P0-011, CH-P0-014 | none | BA-04/05/13/15: catalog contract and price/default SKU; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-016 | Media upload policy and image linking / E1 | MVP | P0 | CH-P0-015 | OPS-01 | BA-13: media lifecycle contract; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-017 | Public catalog browse/search/filter API / E1 | MVP | P0 | CH-P0-015 | none | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-018 | Inventory ledger and balance migration / E2 | MVP | P0 | CH-P0-010, CH-P0-008 | INV-01 | BA-06: reservation FK ordering; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-019 | Inventory adjustment admin API / E2 | MVP | P0 | CH-P0-018, CH-P0-014 | INV-01 | BA-07/11: early audit and threshold policy; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-020 | Authenticated cart endpoints / E2 | MVP | P0 | CH-P0-013, CH-P0-017 | none | BA-02/09: guest merge/cart ownership; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-021 | Financial quote rules and fixtures / E2 | MVP | P0 | CH-P0-020, CH-P0-008 | FIN-01 | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-022 | Quote read/create/expiry contracts / E2 | MVP | P0 | CH-P0-021 | FIN-01 | BA-08/06: address/quote persistence; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-023 | Reservation state machine and DB locks / E2 | MVP | P0 | CH-P0-018, CH-P0-022 | INV-01 | BA-06: order FK foundation; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-024 | Order and snapshot migration / E2 | MVP | P0 | CH-P0-010, CH-P0-022 | FIN-01 | BA-03/06: states and persistence ordering; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-025 | Atomic quote acceptance -> order/hold / E2 | MVP | P0 | CH-P0-023, CH-P0-024, CH-P0-013 | FIN-01,INV-01 | BA-06/07: payment/idempotency/outbox/audit foundation; PAY-01; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-026 | Payment intent and attempt schema / E3 | MVP | P0 | CH-P0-025 | PAY-01 | BA-03/06: schema before consumer; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-027 | Sandbox provider adapter / E3 | MVP | P0 | CH-P0-026 | PAY-01 | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-028 | Sandbox signed webhook receiver / E3 | MVP | P0 | CH-P0-027 | PAY-01 | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-029 | Settlement and order transition coordinator / E3 | MVP | P0 | CH-P0-028, CH-P0-023 | PAY-01,INV-01 | BA-03/12/25: states and exception actions; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-030 | Outbox and BullMQ retry processing / E3 | MVP | P0 | CH-P0-029 | OPS-01 | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-031 | Customer order history/detail / E3 | MVP | P0 | CH-P0-025, CH-P0-029 | none | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-032 | Admin fulfillment and payment oversight / E3 | MVP | P0 | CH-P0-014, CH-P0-029 | none | BA-07/12: early audit and unpaid void; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-033 | Audit logs and anomaly observability / E3 | MVP | P0 | CH-P0-014, CH-P0-030 | OPS-01 | BA-07: split writer from explorer; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-034 | Shared tokens and UI primitives / E4 | MVP | P0 | CH-P0-007 | none | BA-23: tokens/contrast approval; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-035 | Storefront layout and catalog UI / E4 | MVP | P0 | CH-P0-017, CH-P0-034 | none | BA-23: wireframes/copy; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-036 | Product detail and add-to-cart UI / E4 | MVP | P0 | CH-P0-035, CH-P0-020 | none | BA-02/09/23: merge/cart page and UX; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-037 | Customer account and address UI / E4 | MVP | P0 | CH-P0-013, CH-P0-034 | SEC-01 | BA-08/14/23: profile/address API and UX; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-038 | Checkout and sandbox payment UX / E4 | MVP | P0 | CH-P0-025, CH-P0-029, CH-P0-036 | FIN-01,INV-01,PAY-01 | BA-02/18/23: cart/account prerequisites and UX; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-039 | Customer order pages / E4 | MVP | P0 | CH-P0-031, CH-P0-038 | none | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-040 | Admin shell and overview / E4 | MVP | P0 | CH-P0-014, CH-P0-034 | none | BA-10/23: overview API and metric/UX approval; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-041 | Admin product/catalog UI / E4 | MVP | P0 | CH-P0-015, CH-P0-040 | none | BA-13/18/23: media prerequisite and UX; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-042 | Admin inventory UI / E4 | MVP | P0 | CH-P0-019, CH-P0-040 | none | BA-11/23: low-stock source and UX; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-043 | Admin order/fulfillment UI / E4 | MVP | P0 | CH-P0-032, CH-P0-040 | none | BA-12/23: transitions/void and UX; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-044 | Admin staff/RBAC and audit UI / E4 | MVP | P0 | CH-P0-014, CH-P0-033, CH-P0-040 | SEC-01 | BA-04/23: grants/audit and UX; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-045 | Optimize queries/cache and active-route fetching / E4 | MVP | P0 | CH-P0-035, CH-P0-040, CH-P0-044 | none | BA-18/23: all-route and budget fixtures; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-046 | MVP end-to-end and accessibility suite / E4 | MVP | P0 | CH-P0-038, CH-P0-039, CH-P0-043, CH-P0-044, CH-P0-045 | none | BA-18/19/23: catalog/inventory paths and test environment; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-047 | Security/load/fault-injection readiness / E4 | MVP | P0 | CH-P0-046, CH-P0-033 | FIN-01,INV-01,SEC-01,PAY-01,OPS-01 | BA-19/23: environment/recovery/load proof; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P0-048 | Staging deployment, documentation and go/no-go / E4 | MVP | P0 | CH-P0-047, CH-P0-005 | OPS-01,LEG-01 | BA-19/25: environment staging and sandbox exposure; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P1-049 | V1 requirements/gates review / E5 | V1 | P1 | CH-P0-048 | FIN-02,PAY-LIVE for gated subset | BA-20/21: V1 coverage and review gate boundary; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P1-050 | Return request and review workflow / E5 | V1 | P1 | CH-P1-049 | LEG-01 | BA-20: cancellation/tracking coverage and FIN-02 eligibility; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P1-051 | Refund calculation and guarded DB effects / E5 | V1 | P1 | CH-P1-050 | FIN-02,PAY-LIVE | BA-21: refund/provider approval sequencing; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P1-052 | Promo/coupon rules and redemption ledger / E5 | V1 | P1 | CH-P1-049 | FIN-01 revision | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P1-053 | Reviews and wishlists / E5 | V1 | P1 | CH-P1-049 | none | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P1-054 | Analytics and customers operations / E5 | V1 | P1 | CH-P1-049 | SEC-01 | BA-20: missing P1 outcomes; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P1-055 | Live Egypt payment adapter and reconciliation / E5 | V1 | P1 | CH-P1-049, CH-P1-051 | PAY-LIVE,OPS-01,LEG-01 | BA-21: provider certification sequencing; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P1-056 | V1 UX, regression and release / E5 | V1 | P1 | CH-P1-051, CH-P1-052, CH-P1-053, CH-P1-054, CH-P1-055 | all scoped V1 gates | BA-20/21: unowned V1 features; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P2-057 | Recommendation/loyalty feasibility / E6 | Future research | P2 | CH-P0-048 | new P2 PRD | BA-26: research-only acceptance; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P2-058 | Multi-warehouse feasibility / E6 | Future research | P2 | CH-P0-048 | new INV architecture | Unmet predecessors; AC refinement (BA-22) | BLOCKED | No implementation, tests, review or merge evidence |
| CH-P2-059 | Marketplace/multi-currency feasibility / E6 | Future research | P2 | CH-P0-048 | new financial/legal ADR | BA-26: native/fraud research coverage; unmet predecessors | BLOCKED | No implementation, tests, review or merge evidence |

Epic counts: E0=8, E1=9, E2=8, E3=8, E4=15, E5=8, E6=3. Release counts: MVP/P0=48, V1/P1=8, Future/P2=3. Declared graph has no unknown dependency, cycle, or P0 dependency on P1/P2. Semantic cycles/missing foundations are BA-05–08; other sequencing issues BA-17–19/21. No source baseline or backlog was rewritten.

# CommerceHub adopted 21-story planning baseline

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

# CommerceHub backlog consolidation — proposed governance rebaseline

2026-10-21 (Africa/Cairo). **PROPOSED / REVIEW. Owner adoption approval PENDING.**
Planning only: no features, resource access or next-story implementation.
The existing 59-story backlog remains the operative source of truth. Approval or
merge of this proposal's documentation is not automatically adoption, gate closure
or acceptance of any delivery story.

## Baseline and authority

Source baseline main: `107da8c70adc71cbbd861a430d7758a13f00e1df`, verified
[PR #20 merged](https://github.com/ZeyaadAly/CommerceHub/pull/20).
Fetched origin/main and safely fast-forwarded main before branching:
`docs/BMAD-backlog-consolidation`. Initial working tree clean. Root AGENTS apply;
no nested documentation instructions found. User explicitly authorizes a planning
proposal and protected PR, not changing source story IDs/statuses or implementing.

The owner supplied the CH-01–CH-21 starting map during this task, explicitly as a
proposal. Five explained owner-assignment moves improve vertical delivery in
[mapping.md](mapping.md); all other groupings are retained. There are exactly
21 proposed parents: 15 MVP/P0, 5 V1/P1, 1 Future/P2 research parent. Their original
membership remains 48 P0 / 8 P1 / 3 P2; no feature or original story changes phase.

All eight approved BMAD sources are retained, including requirement text,
acceptance, architecture constraints, API/data/UX details and proposed/unresolved
policy labels. Stale draft labels do not reverse approved planning authority;
planning approval does not accept the audit recommendations or specialist policies.
Canonical ADR directory remains docs/architecture/decisions/; candidates are not
silently turned into accepted decisions.

Baseline references: [brief](../../01-project-brief.md), [PRD](../../02-prd.md),
[UX](../../03-ux-specification.md), [architecture](../../04-architecture.md),
[database](../../05-database-design.md), [API](../../06-api-design.md),
[implementation plan](../../07-implementation-plan.md) and
[original backlog](../../08-epics-and-stories.md). The inventory records section
line ranges and normalized hashes against these unchanged files.

## Review package

| Proposed story | Delivery                                                            | Original numbers (phase retained) |
| -------------- | ------------------------------------------------------------------- | --------------------------------- |
| CH-01          | Foundation, environment, tooling, CI, decisions                     | P0 001–008                        |
| CH-02          | PostgreSQL schema and reviewed migrations                           | P0 009–010                        |
| CH-03          | Identity, sessions, staff governance and RBAC UI                    | P0 011–014, 044                   |
| CH-04          | Catalog, media, public APIs and catalog admin UI                    | P0 015–017, 041                   |
| CH-05          | Inventory, movements and stock admin UI                             | P0 018–019, 042                   |
| CH-06          | Editable cart, exact pricing and quotes                             | P0 020–022                        |
| CH-07          | Reservations and atomic order initiation                            | P0 023–025                        |
| CH-08          | Sandbox payments, authenticated events and settlement               | P0 026–029                        |
| CH-09          | Durable jobs, early audit and observability                         | P0 030, 033                       |
| CH-10          | Shared accessible design system                                     | P0 034                            |
| CH-11          | Storefront discovery, accounts and address APIs/UI                  | P0 035–037                        |
| CH-12          | Shopper checkout, payment outcome and order APIs/UI                 | P0 031, 038–039                   |
| CH-13          | Admin overview, fulfillment APIs/UI and settings boundary           | P0 032, 040, 043                  |
| CH-14          | Performance, accessibility, E2E, security/load/fault proof          | P0 045–047                        |
| CH-15          | Staging environment and MVP release acceptance                      | P0 048                            |
| CH-16          | V1 review, cancellation, returns and refunds                        | P1 049–051                        |
| CH-17          | Promotions, discovery, reviews and wishlists                        | P1 052–053                        |
| CH-18          | Customer operations, analytics and missing P1 operational workflows | P1 054                            |
| CH-19          | Egyptian live provider and reconciliation                           | P1 055                            |
| CH-20          | V1 UX, regression and release                                       | P1 056                            |
| CH-21          | Future feasibility including all six FUT requirements               | P2 057–059                        |

| Artifact                           | Purpose                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [backlog.md](backlog.md)           | All 21 stories with objective, scope, originals, requirement IDs, dependencies, references, gates, acceptance, tests, deliverables and DoD |
| [mapping.md](mapping.md)           | Every original ID has exactly one parent; release/status/dependencies/gates and evidence retained                                          |
| [coverage.md](coverage.md)         | 59 functional + 19 NFR rows, contract/invariant inventory, explicit missing-scope assignments and all 26 BA findings                       |
| [schedule.md](schedule.md)         | Proposed milestone graph, named dependency repairs, critical chain and safe parallel lanes                                                 |
| [stories.json](stories.json)       | Machine-readable 21-story specifications                                                                                                   |
| [inventory.json](inventory.json)   | Exact original specifications/AC, tracker evidence rows, PRD requirement text, 100 original edges, gates/BA records and source-unit hashes |
| [milestones.json](milestones.json) | Full executable-checkable proposed DAG; tasks inside parents, not extra stories                                                            |
| [verify.mjs](verify.mjs)           | Offline planning retention/link/phase/DAG/governance checks; no app/service or network access                                              |
| [verification.md](verification.md) | Actual task checks and delivery limits                                                                                                     |

## Status and implementation evidence

- CH-P0-001–005 remain DONE with their exact human/merge/CI evidence in tracker
  rows copied to inventory, with unchanged linked evidence files.
- Full CH-P0-006 remains BLOCKED. The owner-approved exact Session Pooler target
  validation was merged in PR #20. That is configuration/code integration only:
  actual TLS/authentication, secure custody, real grants/isolation, clean repeat
  bootstrap and Redis capability remain unverified/deferred. Seven PASS/eight
  BLOCKED AC-006 statuses are retained; no new service PASS.
- CH-P0-007 remains NOT STARTED/readiness BLOCKED; CH-P0-008 not started. CH-01
  contains completed and blocked/unstarted work and **must not be DONE**.
- Every new parent has PROPOSED status; this neither resets historical DONE
  children nor implies a partially implemented parent is fully accepted.
- FIN-01, INV-01, SEC-01, PAY-01, OPS-01, LEG-01, FIN-02, PAY-LIVE, FIN-01
  revision, DB-0/DB-01, API-01 and scoped UX/quality approvals remain OPEN/pending
  as registered. No specialist owner signature or policy is fabricated.
- Redis/BullMQ remains in the design; managed Redis/spending DEFERRED. Local
  Docker/WSL is not required. Existing security exception identity, expiry and
  restrictions are unchanged; no new exception is created.

## Faster Codex delivery workflow — proposed

1. Select the next **authorized ready milestone** within a parent using accepted
   predecessor evidence, applicable gates and bounded ownership. Do not wait for
   unrelated unfinished parent work or infer that a new request accepted a predecessor.
2. Validate the exact PRD/UX/API/DB clauses, source AC and scoped specialist decisions.
   Record blocked slices and continue only independently authorized work.
3. Put a short implementation plan, file boundaries, observable normal/error/security
   acceptance and verification commands directly in the story/PR; no routine
   documentation/configuration/verification micro-story is required.
4. Implement a coherent vertical slice across the owned API/schema/UI boundaries.
   Keep business rules in NestJS/domain services and only safe public contracts in
   shared/frontend code. Coordinate transaction/migration ownership explicitly.
5. Run meaningful checks continuously during change; preserve real PostgreSQL
   concurrency, Supertest/contract/permission, Playwright/a11y/focus/viewport and
   recovery evidence where relevant. Existing CI/security controls remain mandatory.
6. Open one or more focused PRs; use the protected workflow, least privilege,
   Husky, secret/audit checks and exact-head commercehub-quality. No giant-PR rule.
7. Human review plus scoped specialist review precede merge; new commits invalidate
   assumptions about reviewed head/checks. Gate decisions and defects remain visible.
8. Merge only with session authorization and actual repository requirements;
   migrations, provider calls, credential custody, resource changes, spending,
   deployment and live funds retain their separate high-risk approval checkpoints.
9. Update milestone evidence and remaining parent acceptance; mark parent DONE only
   when all its applicable obligations, review and merge evidence are satisfied.
10. Reassess/recommend the next ready work item. Current root instructions require
    stopping before the next story; this planning proposal grants no automatic
    implementation continuation. A future explicit standing authorization/adopted
    instruction change would be needed to execute a batch without another task request.

## Decisions required before adoption

Owner must approve the final 21-parent mapping (including five owner moves), missing
feature ownership, scoped milestone dependency changes and operational workflow.
That approval does not decide tax/rounding/shipping/TTL, auth transport/delegation,
state mappings/replay retention, provider, recovery/retention targets or budgets.
BA-02 guest merge, BA-03/04 status/permissions, BA-05–15/18/19/21 contract/order gaps,
BA-20/26 later-release detail and BA-23 numeric/UX proof remain scoped blockers.
BA-16 convention is already resolved; DEC aliases need named-gate reconciliation.

After explicit adoption approval, separately authorize a synchronized governance
follow-up to update operative 07/08/tracker/readiness/traceability and any affected
instructions, retaining immutable old IDs/evidence and recording the adoption
version/date. Do not delete/renumber originals. No implementation starts merely
because the proposal exists or its PR merges. Stop at REVIEW; leave PR OPEN.

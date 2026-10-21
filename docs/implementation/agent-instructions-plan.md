# CommerceHub agent instruction responsibility synchronization

2026-10-21 (Africa/Cairo). **CH-01–CH-21 ADOPTED as operative planning baseline.**
Owner explicitly approved adoption, five ownership moves, feature coverage and the
48-milestone schedule after [PR #21](https://github.com/ZeyaadAly/CommerceHub/pull/21)
merged at `8543df03c23423ff58d383dde0de2a5192725dbb`. This task synchronizes governance only;
no implementation or specialist gate closure is authorized.

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

## Operative instruction ownership

Root AGENTS now selects adopted CH-01–CH-21 plus one authorized milestone; nested
app/package instructions inherit it and continue enforcing their domain boundaries.
All seven nested files were reviewed: they link root and applicable contracts and
contain no competing top-level backlog. No nested policy edit is required. Their
historical references/BA blockers remain traceability; unresolved contract policy
is still gated, even where ownership and scheduling are now approved.

The former one-story stop rule now means one authorized milestone at a time, with
continuation only where explicitly authorized. No automatic implementation,
standing resource/financial permission or unrelated gate prerequisite is added.
<!-- LEGACY BASELINE: 8543df03c23423ff58d383dde0de2a5192725dbb -->

# CommerceHub AGENTS.md responsibility plan

Current governance status (2026-10-18): all eight instruction files and metadata were human-approved as CH-P0-002. Canonical ADR location is `docs/architecture/decisions/`, approved separately and aligned in 04/07/root guidance. The plan/review snapshots below describe earlier states and old path alternatives; they are preserved history, not current blockers. See [approval register](approval-register.md) and [governance finalization](governance-finalization.md).

Date: 2026-10-18. Planning only; no AGENTS.md created. Sources: [04 §§3/6–13](../04-architecture.md), [07 §7 and Prompt B](../07-implementation-plan.md).

Formal-review update (2026-10-18): the opening statement describes the CH-P0-001 planning snapshot. All eight requested instruction files and the PR/decision/verification metadata now exist. Review disposition is **REVIEW PASSED — AWAITING HUMAN APPROVAL**; no story is DONE. All seven nested instruction files link the root and add scoped responsibilities. The actual eight-file scope was expressly authorized in CH-P0-002, including instructions-only directories. The ADR path recommendation remains unadopted pending human approval; it does not block toolchain setup. See [formal review](formal-review-001-002.md) for current evidence and readiness. The responsibility plan below remains a record of the original intended scope.

| Proposed location | Responsibilities and boundaries |
|---|---|
| Root AGENTS.md | Project scope and source authority; link docs 01–08 and implementation audit/gates; P0/P1/P2 rules; inspect current repo before work; preserve user changes; use actual scripts once present; authorized file/task scope; no invented approvals/results; no secrets; review/commit/deploy boundaries; precise evidence report. |
| apps/storefront/AGENTS.md | Public SEO/catalog and private no-store rendering; only typed API access, no DB/Prisma/server secrets; exact API money display; verified/account checkout gates; principal-scoped cache clearing; route-owned requests; variant/stock/reprice/pending flows; accessible responsive UI and error/empty states. |
| apps/admin/AGENTS.md | Staff audience and permission-aware UX without deciding authorization; compact controls/tables, viewport-safe menus; active-route-only queries; sandbox KPI semantics; grant/last-Super-Admin/error/confirmation flows; minimized PII and no forbidden module fetches. |
| apps/api/AGENTS.md | NestJS module/service ownership; default-deny permission and ownership checks; strict DTOs/OpenAPI; hashed secrets/opaque sessions/CSRF after SEC-01; Decimal/NUMERIC; explicit state machines; locked stock transactions; stable idempotency; immutable snapshots/audit/ledgers; provider calls outside DB transactions; durable inbox/outbox and restricted workers; reviewed migrations and real PostgreSQL race tests. |
| packages/validation/AGENTS.md (optional) | Safe shared wire schemas and backwards compatibility; one source for DTO/OpenAPI/client contracts; no Prisma internals, secrets or authoritative business calculations. |
| Other packages (only if needed) | UI owns tokens/primitives, types owns safe published DTOs, API client owns credential/CSRF forwarding, cancellation and safe retry classification. Avoid redundant instructions until a scope needs them. |

Root guidance applies repository-wide; nested files add scope-specific details and cannot weaken project invariants or user instructions. Resolve conflicts by reporting the exact source and pausing only the affected work; do not rewrite approved policy. Keep instructions short and link baselines rather than copying them. Document commands as planned until scripts exist, then update and verify paths. Do not include production credentials or copied tokens.

For 002, root instructions and PR/review metadata are the immediate deliverables. Proposed app paths do not yet exist. Prompt B allows nested instructions only where directories exist or docs-only placeholders are explicitly approved; choose that scope during 002 review, without scaffolding applications. Decide `docs/adr` versus `docs/decisions` explicitly (BA-16). 003 owns executable workspace; 011 owns API middleware; 008 owns proposed ADR option packs, not automatic gate acceptance.

Review acceptance for 002: instructions reference real baseline paths, preserve all open gates, distinguish planned scripts from runnable ones, have no contradictory nested rules, identify root/app responsibility, provide evidence/PR reporting, and create no business code/packages/migrations. Do not start 002 in this task.

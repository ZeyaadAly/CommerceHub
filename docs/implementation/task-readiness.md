# CommerceHub task readiness

Date: 2026-10-18 (Africa/Cairo). Current authority: [approval register](approval-register.md) and [governance integration evidence](governance-finalization.md). Human-approved task deliverables and GitHub integration are distinct.

## Current readiness after human approval

The project owner explicitly APPROVED CH-P0-001 and CH-P0-002 on 2026-10-18 after their formal review PASS. Both are DONE for the accepted documentation scope as expressly directed by the owner; GitHub integration remains PENDING until actual PR merge verification. No specialist gate was approved.

**CH-P0-003 is BLOCKED pending required merged predecessor evidence.** Human acceptance is satisfied, but 07 §12 and Prompt C still require approved/merged CH-P0-002, including its predecessor. Governance integration is authorized and being prepared on the dedicated branch; do not claim merge before verification. The remaining 57 stories are BLOCKED; no application work began. The [ready-to-use prompt](prompts/CH-P0-003.md) is preparation only and must not be executed before READY and separate story authorization.

The scope is sufficiently defined for later planning: pnpm/strict TypeScript workspace, independently buildable minimal app/package bootstraps, placeholder route/API health only, safe examples and local setup documentation, version/compatibility verification at task start, and install/typecheck/build/startup evidence. Do not implement auth, pricing, inventory, payments, business entities, migration access or external infrastructure. Full policy middleware/OpenAPI is 011; CI 005 and formatter/lint setup 004 remain separate slices.

FIN-01, INV-01, SEC-01, PAY-01, OPS-01, LEG-01, FIN-02, PAY-LIVE and later DB/API/UX readiness reviews do not block this restricted toolchain scope. API health/placeholder routes must not adopt disputed payment enums, session transport, permissions or financial rules. BA-22 is satisfied for setup planning by 07 Prompt C's explicit outcomes, to be refined in its implementation plan. Verify supported tool versions/tool availability when 003 is authorized; no package installation/version selection is required in this review.

The owner approved `docs/architecture/decisions/`; 04/07/root and the canonical README are aligned, resolving BA-16's path convention without changing any proposed ADR decision. There were no existing ADRs to move. After the actual governance merge and origin/main content are verified, reassess 003 for READY; do not automatically unblock other stories or start setup. See [integration evidence](governance-finalization.md) for the pending/merged distinction.

## Historical preparation snapshots

The remainder records the earlier 001/002 preparation states and is superseded for current status by the formal review above. Its references to 002 being BLOCKED describe that earlier state.

CH-P0-001 preparation snapshot: seven requested implementation documents delivered for REVIEW; user acceptance and authorized commit/merge outstanding. No story DONE; no application implementation evidence.

## CH-P0-002 preparation update — 2026-10-18

The user explicitly authorized preparing eight AGENTS.md files and instruction-only directories even without formal CH-P0-001 approval. Those instructions, the plan-required PR template and decision/verification READMEs are prepared; see [002 review and audit dispositions](ch-p0-002-review.md). CH-P0-001 remains REVIEW and CH-P0-002 remains BLOCKED by that predecessor, with draft evidence recorded rather than false completion. The decisions README does not choose the disputed canonical ADR convention (BA-16). No specialist gate is closed. CH-P0-003 is not ready or started; first accept predecessor work, review 002, then record the required evidence. Resolve the ADR convention before its decision pack. The original 001 readiness snapshot below remains historical context.

## Next story recommendation

**CH-P0-002 — Create repository and AGENTS guidance (E0, P0/MVP)** is next after CH-P0-001 is reviewed/accepted and its predecessor evidence is recorded according to [07 §12/14 and Prompt B](../07-implementation-plan.md). It has no specialist financial/security gate for instruction/template-only work. The Git repository already exists; reuse it. It remains BLOCKED now by 001 in REVIEW, rather than being falsely marked READY. No story is currently READY under the baseline predecessor/merge rule.

Recommended 002 scope for the next explicit authorization: root AGENTS guidance, applicable nested-instruction scope decision, PR template, ADR/verification directory guidance. Use [agent-instructions-plan.md](agent-instructions-plan.md) and [github-workflow.md](github-workflow.md). Keep application scaffolding/packages/database work out of 002. Do not recreate Git or assume write authorization to GitHub.

Concrete readiness checklist for 002:

1. Reviewer accepts the seven CH-P0-001 artifacts and acknowledges unresolved findings and gates; record actual review/commit/PR evidence if authorized. No specialist gate closes with that acceptance.
2. Resolve BA-16 scope: existing repository, docs remain in docs root, choose canonical ADR directory, decide whether nested instruction placeholders may be created where app directories are absent.
3. Confirm reviewable acceptance: root rules match approved scope; nested rules extend root; links valid; planned scripts clearly labeled; no secrets, app code or migrations; PR metadata captures story/requirements/gates/tests.
4. Run file/link/instruction consistency and documentation-only diff checks. Report NOT RUN where a tool/check does not exist. Stop for review before 003.

**CH-P0-008** can be considered after the same predecessor review for a proposed ADR/gate option pack. Its gate-register overlap with 001 does not make its ADR analysis done. It is a second candidate, not automatically started or completed.

## Domain readiness and release boundaries

Follow declared dependencies in [story-tracker.md](story-tracker.md), but first review semantic graph corrections BA-05–08/17–19/21 in [baseline-audit.md](baseline-audit.md). In particular, design catalog/price persistence before applying it; move order/payment/idempotency/outbox and atomic audit foundations ahead of their consumers; add profile/address/cart/overview outcomes; provision a test environment before final release verification. These are recommendations, not amended dependencies.

Refine every story's repeated generic acceptance into exact PRD IDs, actor/permission, route/entity/screen, fixtures, positive/error/ownership/retry assertions and actual verification commands before READY. No gate marked “none” exempts inherited dependencies or scope-specific blockers. No frontend code is ready merely because a UI contract exists: 03 §§14/16 require relevant wireframes, tokens/contrast, copy and backend contracts.

FIN-01/INV-01/SEC-01/PAY-01 must close for dependent money/stock/auth/payment work; DB reviews and OPS/LEG apply at their respective implementation/environment/launch points. P1 remains after P0 exit and its gates; P2 remains separately approved feasibility. Named owners are roles awaiting nominated people, not evidence that anyone signed off.

## Verification record

Read all eight source files completely using UTF-8 reads in bounded chunks. Compared 07 registry with 08 index and specifications: 59 unique matching IDs and dependency/gate values, 48 P0 / 8 P1 / 3 P2, no unknown references or declared cycles. Traceability lists each functional requirement and each NFR, identifies partial/missing coverage, and references proposed tests without claiming they ran.

Read-only Git checks succeeded using a command-scoped safe.directory after default checks rejected ownership. Initial tree was clean, main with origin configured, eight source documents tracked. Source documents are unchanged. Final checks passed for seven generated Markdown files, local links, requirement inventory, tracker inventory/statuses, dependency graph and documentation-only scope. No app tests/builds were run because there is no application/toolchain; no package install, SQL, Prisma schema, Supabase connection, AGENTS file, deployment or Git mutation was performed. CH-P0-001 ends here pending review; do not automatically execute another story.

Observed verification results: 59 functional requirements (37 P0, 16 P1, 6 P2), 19 NFRs (18 P0/foundation, 1 P1), each present in traceability. All 20 BR IDs and J-01–J-10 are associated with stories/tests in the invariant table. All 59 initial story IDs are unique and match the plan, index and detailed specs, including declared dependencies and direct gates. Tracker: REVIEW 1, BLOCKED 58, all other status counts 0. Local Markdown links resolve; table/whitespace smoke checks pass. `git diff --exit-code -- docs/01-project-brief.md ... docs/08-epics-and-stories.md` returned success with no source changes. `git diff --check` returned success for tracked content; new files were checked separately for trailing whitespace. `git status --short --untracked-files=all` shows exactly the seven requested untracked Markdown files and no other changes. These are documentation checks, not application tests or remote GitHub protection verification.

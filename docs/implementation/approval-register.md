# CommerceHub approval register

## CH-P0-005 exact temporary advisory exception - 2026-10-19

Owner ZeyaadAly explicitly APPROVED temporary risk acceptance for GHSA-vfj7-8cjw-p6xm, braces@3.0.3, only root dev @next/eslint-plugin-next@16.4.2 > fast-glob@3.3.1 > micromatch@4.0.8 > braces@3.0.3. Conservative approval interval: 2026-10-19T00:00:00Z <= execution < 2026-11-02T00:00:00Z. Reassess 2026-10-26 and before expiry; no automatic renewal. [Decision](../verification/CH-P0-005-advisory-review.md).

Authorized: exact fail-closed policy/tests, normal commit/push/update PR #8, actual green CI, safe main protection after green, disposable unmerged positive/negative PRs. No version upgrades, PR merges, next story, specialist gate closure, database/cloud/deployment changes. This approval does not accept CH-P0-005; status remains REVIEW awaiting human acceptance.

## CH-P0-004 verified integration - 2026-10-19

**Human acceptance: APPROVED. Integration: MERGED. Story: DONE.** Owner approval is the dated report-based acceptance below; the final staged-diff/line-ending/check/policy conditions were verified before integration. [PR #6](https://github.com/ZeyaadAly/CommerceHub/pull/6) was squash-merged at 5cbb86aea0f70f489a47245204c1850e80ee0264 on 2026-10-19T08:34:17Z, from reviewed head ce5e8e36d4f83a88a22cc49723ff4c8d62404608. GitHub MERGED metadata and fetched main's exact reviewed tree were independently verified; local main was fast-forwarded safely.

The real commit ran Husky without bypass and matched the reviewed staged patch. All required local checks passed; both automatic PR preview deployment statuses succeeded; GitHub Actions runs and submitted reviews were absent, and authenticated policy reads found no required checks/reviews or applicable protections/rulesets. No setting was changed. Known limitations remain accepted and visible. See [final integration evidence](../verification/CH-P0-004-integration.md). This tracking update is delivered through a separate documentation PR; its own merge is not pre-claimed. CH-P0-005 readiness review is authorized, implementation is not. All specialist gates remain OPEN. Earlier entries below record the REVIEW/approval chronology.

## CH-P0-004 owner approval - 2026-10-19

**Story:** CH-P0-004. **Decision:** APPROVED. **Date:** 2026-10-19.
**Authority:** CommerceHub project owner, explicit Final Approval, GitHub Integration & CH-P0-005 Readiness instruction.
**Acceptance basis:** Reported implementation verification, quality checks, negative fixtures and actual isolated Git hook tests. This records the owner's report-based acceptance; it does not claim line-by-line owner inspection.
**Conditions:** Reviewed final staged diff, exclusion of unintended line-ending-only changes, successful final candidate checks and actual GitHub policy compliance before merge.
**Known limitations:** Existing Windows native-binding constraints, ESLint 9 compatibility/deprecation warning, native Linux hook execution unverified.
**Integration:** PENDING; story remains REVIEW until actual PR merge is verified. Commit/push/PR and policy-compliant merge are authorized for this story. No subsequent implementation, specialist gate closure or infrastructure change is authorized.
See [integration review](../verification/CH-P0-004-integration.md). Earlier records below are chronological snapshots.


## CH-P0-003 C: approval - 2026-10-19

**APPROVED by the CommerceHub project owner**, based on the verified C: implementation report and explicit Finalization, GitHub Integration & Vercel Preparation instruction. Accepted scope: pnpm/strict TypeScript; two Next.js scaffolds; static Nest health; four shared boundaries; safe examples, reproducible checks and responsive placeholders. Accepted limitation: Windows native pnpm 12/SWC unavailable; verified pnpm 11.28.6 and Webpack/WebAssembly fallback.

Implementation is complete and reviewed; human acceptance is APPROVED. **GitHub integration is MERGED; CH-P0-003 is DONE.** [PR #4](https://github.com/ZeyaadAly/CommerceHub/pull/4), merge 111a2ce752e9f8aa18ef970bfc972f3b39e8b50f, was re-read as MERGED and fetched origin/main was verified to contain the exact reviewed C: integration tree on 2026-10-19. Earlier PR #3 merged a different D: scaffold; its history and evidence are preserved. See [finalization evidence](../verification/CH-P0-003-integration.md). No specialist gate or deployment approval is granted. The 2026-10-18 rows and 003 limitations below are historical and superseded for the current C: workspace by this dated decision.

Human approval date: **2026-10-18** (Africa/Cairo). Authority: **CommerceHub project owner**, explicitly recorded in the user-supplied “Governance Finalization and CH-P0-003 Readiness” instruction. This is the approval source; no GitHub review submission, signature or CI success is invented.

| Item | Human decision / accepted scope | Verification evidence | GitHub integration |
|---|---|---|---|
| CH-P0-001 | APPROVED; DONE for the documentation audit: seven deliverables, requirement/story inventory, 26 findings, open gate register and readiness/Git workflow | [Formal review](formal-review-001-002.md), [traceability](requirements-traceability.md), [audit](baseline-audit.md) | MERGED: [PR #1](https://github.com/ZeyaadAly/CommerceHub/pull/1), b5dd1a3932d49b7fcbd7759cfa7e7365104a8e6c; origin/main content verified |
| CH-P0-002 | APPROVED; DONE for eight AGENTS files, PR template, decision/verification guidance and review evidence; no applications | [Formal review](formal-review-001-002.md), [002 preparation](ch-p0-002-review.md), [root instructions](../../AGENTS.md) | MERGED: [PR #1](https://github.com/ZeyaadAly/CommerceHub/pull/1), b5dd1a3932d49b7fcbd7759cfa7e7365104a8e6c; origin/main content verified |
| CH-P0-003 | APPROVED WITH ENVIRONMENT LIMITATION; CommerceHub project owner, 2026-10-18, explicit Environment Recovery, Acceptance and GitHub Integration instruction; scaffold scope only | [Acceptance](../verification/CH-P0-003-acceptance.md), [recovery outcome](../verification/CH-P0-003-recovery.md); D: capacity/external-root Turbopack limitation remains unresolved | PENDING; no task commit/PR/merge; required safe-capacity remediation cannot be completed from disposable project artifacts |
| BA-16 ADR convention | APPROVED; canonical path docs/architecture/decisions/ only; RESOLVED after references/README alignment and checks | [Canonical README](../architecture/decisions/README.md); path-only changes to 04/07/root; original audit finding retained | MERGED with PR #1; canonical README and source paths verified; no actual ADR files moved |

Historical 2026-10-18 003 update: human approval is recorded separately from integration. CH-P0-003 remains REVIEW, not DONE, because integration is pending and environment recovery is blocked. CH-P0-004 remains BLOCKED. No specialist gate is waived. Historical 001/002 integration was independently verified MERGED; the earlier 003 READY/not-executed state was superseded by its separately authorized execution and approval above.

## Decisions excluded from approval

All other 25 BA findings retain their existing dispositions; their proposed resolutions are not accepted by these approvals. FIN-01, FIN-02, INV-01, SEC-01, PAY-01, OPS-01, LEG-01 and PAY-LIVE remain OPEN. FIN-01 revision, DB-0/DB-01, API-01, UX readiness, quality budgets and P2 scope reviews remain applicable and OPEN as recorded in the [gate register](gate-register.md).

Path alignment preserves proposed ADR identifiers/content and does not adopt any architecture ADR or alter finance, API behavior, security, inventory, legal, hosting or release policy. The earlier 001/002 approval did not authorize 003 execution; its later separate authorization/approval is recorded above. No schema, migration, deployment, specialist policy or later development story is authorized by these approvals.

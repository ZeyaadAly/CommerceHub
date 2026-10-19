# CommerceHub approval register

Human approval date: **2026-10-18** (Africa/Cairo). Authority: **CommerceHub project owner**, explicitly recorded in the user-supplied “Governance Finalization and CH-P0-003 Readiness” instruction. This is the approval source; no GitHub review submission, signature or CI success is invented.

| Item | Human decision / accepted scope | Verification evidence | GitHub integration |
|---|---|---|---|
| CH-P0-001 | APPROVED; DONE for the documentation audit: seven deliverables, requirement/story inventory, 26 findings, open gate register and readiness/Git workflow | [Formal review](formal-review-001-002.md), [traceability](requirements-traceability.md), [audit](baseline-audit.md) | MERGED: [PR #1](https://github.com/ZeyaadAly/CommerceHub/pull/1), b5dd1a3932d49b7fcbd7759cfa7e7365104a8e6c; origin/main content verified |
| CH-P0-002 | APPROVED; DONE for eight AGENTS files, PR template, decision/verification guidance and review evidence; no applications | [Formal review](formal-review-001-002.md), [002 preparation](ch-p0-002-review.md), [root instructions](../../AGENTS.md) | MERGED: [PR #1](https://github.com/ZeyaadAly/CommerceHub/pull/1), b5dd1a3932d49b7fcbd7759cfa7e7365104a8e6c; origin/main content verified |
| CH-P0-003 | APPROVED WITH ENVIRONMENT LIMITATION; CommerceHub project owner, 2026-10-18, explicit Environment Recovery, Acceptance and GitHub Integration instruction; scaffold scope only | [Acceptance](../verification/CH-P0-003-acceptance.md), [recovery outcome](../verification/CH-P0-003-recovery.md); D: capacity/external-root Turbopack limitation remains unresolved | PENDING; no task commit/PR/merge; required safe-capacity remediation cannot be completed from disposable project artifacts |
| BA-16 ADR convention | APPROVED; canonical path docs/architecture/decisions/ only; RESOLVED after references/README alignment and checks | [Canonical README](../architecture/decisions/README.md); path-only changes to 04/07/root; original audit finding retained | MERGED with PR #1; canonical README and source paths verified; no actual ADR files moved |

Current 003 update: human approval is recorded separately from integration. CH-P0-003 remains REVIEW, not DONE, because integration is pending and environment recovery is blocked. CH-P0-004 remains BLOCKED. No specialist gate is waived. Historical 001/002 integration was independently verified MERGED; the earlier 003 READY/not-executed state was superseded by its separately authorized execution and approval above.

## Decisions excluded from approval

All other 25 BA findings retain their existing dispositions; their proposed resolutions are not accepted by these approvals. FIN-01, FIN-02, INV-01, SEC-01, PAY-01, OPS-01, LEG-01 and PAY-LIVE remain OPEN. FIN-01 revision, DB-0/DB-01, API-01, UX readiness, quality budgets and P2 scope reviews remain applicable and OPEN as recorded in the [gate register](gate-register.md).

Path alignment preserves proposed ADR identifiers/content and does not adopt any architecture ADR or alter finance, API behavior, security, inventory, legal, hosting or release policy. The earlier 001/002 approval did not authorize 003 execution; its later separate authorization/approval is recorded above. No schema, migration, deployment, specialist policy or later development story is authorized by these approvals.

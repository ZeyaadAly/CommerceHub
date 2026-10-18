# CommerceHub architecture decision records

**Canonical directory: docs/architecture/decisions/**, approved by the CommerceHub project owner on 2026-10-18 as the narrow BA-16 convention decision. Sources: [architecture §18](../../04-architecture.md), [implementation plan §6 and Prompt B](../../07-implementation-plan.md), [approval register](../../implementation/approval-register.md).

No ADR decision is approved by creating this directory. The proposed ADR-001–ADR-015 identifiers and design content in the architecture baseline remain intact; specialist policies remain gated. No actual ADR files existed in the old locations, so none were moved. The [legacy pointer](../../decisions/README.md) preserves earlier review links and is not a second decision history.

Create individual ADR-XXX-short-title.md records during a separately authorized decision task, preserving existing identifiers. Include story/requirements, context, alternatives, recommendation, consequences, affected API/data/UX/tests, owners, status, dated human approval evidence, verification stage and reversal conditions. Proposed records must remain PROPOSED until their designated decision owners approve them; task approval and repository merge cannot substitute for specialist sign-off.

CH-P0-008 prepares reviewable options for remaining gates. Use the [gate register](../../implementation/gate-register.md) and [audit](../../implementation/baseline-audit.md); do not infer that resolving the directory convention resolves BA-03–15, financial/security policies or production readiness. No secrets, personal data, credentials or provider payloads belong in ADRs.

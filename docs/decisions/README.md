# Legacy decision-directory pointer

The CommerceHub project owner approved [docs/architecture/decisions](../architecture/decisions/README.md) as the canonical ADR location on 2026-10-18. Create future decision records there. This existing README is retained to preserve prior review links; it contains no ADRs and is not a second decision history. See the [approval register](../implementation/approval-register.md).

The following text is the historical CH-P0-002 staging evidence, superseded by that explicit path approval. It does not impose a current approval blocker.

Prepared for review in CH-P0-002 because [07 Prompt B](../07-implementation-plan.md) names this directory. [04 §18](../04-architecture.md) instead names docs/adr. **This README does not choose the canonical ADR directory or resolve BA-16.** Keep existing planning files in docs root; do not move files or create a competing accepted decision history.

Formal-review recommendation: `docs/architecture/decisions/`. It conflicts with the explicit paths above, so adoption requires human approval of a coordinated documentation delta; no new directory was created and no ADR moved. This is a blocker for establishing the decision-record convention in CH-P0-008, not for CH-P0-003 toolchain setup. See [formal review](../implementation/formal-review-001-002.md).

Before creating the first ADR pack, record the Product/Lead decision on the canonical location and update affected references through a reviewed documentation change. Until then, use the [gate register](../implementation/gate-register.md) and [baseline audit](../implementation/baseline-audit.md) as the existing review inventory. CH-P0-008 is a separate task for proposed decision options, not automatic approval.

Each future decision record should state ID/title, story/requirements, proposed or accepted status with actual owner/date, problem, alternatives, recommendation, consequences, affected UX/API/data/tests, gate evidence and reversal conditions. Accepted requires designated human approval; examples, mock results and planning acceptance are insufficient. Keep secrets, credentials and personal data out of records.

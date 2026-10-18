# CH-P0-002 — instruction preparation and review

Subsequent human decision (2026-10-18): CH-P0-002 documentation and its CH-P0-001 predecessor are explicitly APPROVED by the CommerceHub project owner. The owner also approved the canonical ADR directory `docs/architecture/decisions/`. See [approval register](approval-register.md) and [governance finalization](governance-finalization.md) for current GitHub integration and 003 readiness. Preparation and formal-review statements below remain historical evidence, not current human-approval blockers. All specialist gates remain OPEN.

Date: 2026-10-18 (Africa/Cairo). **Prepared for review; story remains BLOCKED by unapproved CH-P0-001.** No DONE, predecessor acceptance, specialist sign-off, commit or merge is recorded.

Formal-review update (2026-10-18): **REVIEW PASSED — AWAITING HUMAN APPROVAL**, status REVIEW. The explicit preparation exception permits reviewing these artifacts without claiming predecessor acceptance. CH-P0-001/002 human approval and merge evidence remain outstanding; 003 is BLOCKED. The current review instruction treats all eight BMAD documents as approved planning sources. [Formal review](formal-review-001-002.md) supersedes earlier preparation-time status/approval wording below; those paragraphs remain historical evidence, not current completion or gate claims.

## Scope and dependency evidence

[07 §12](../07-implementation-plan.md) and [08 CH-P0-002](../08-epics-and-stories.md) define repository/root/nested guidance and PR templates, dependency 001, no direct specialist gate. 07 Prompt B requires 001 reviewed/approved and permits instruction-only directories when explicitly authorized. The current user explicitly authorizes those directories and review-only preparation even if 001 is unapproved. [Tracker](story-tracker.md) still records 001 REVIEW; this exception does not satisfy its dependency or authorize 003.

Read all eight BMAD documents in this conversation; source diff was empty when starting 002. Read all seven implementation audit documents, inspect 07 §7/§12/Prompt B and 08 index/spec, and inspect existing instruction locations/Git state. No AGENTS.md files existed. The current user requires all eight sources to guide instructions; 08 itself remains a proposed backlog and the 26 audit recommendations remain unapproved. The instructions preserve that distinction rather than treating every draft field as approved policy.

Delivered eight instruction files at root, apps/storefront, apps/admin, apps/api, packages/ui, packages/types, packages/validation and packages/api-client. Each app/package directory contains only AGENTS.md. Also prepared the plan-required [PR template](../../.github/PULL_REQUEST_TEMPLATE.md), [decision staging guidance](../decisions/README.md), [verification guidance](../verification/README.md), this review record, and limited evidence/readiness updates. Existing CH-P0-001 untracked files were preserved; eight planning baselines and gate register are unchanged.

The existing repository is reused. No canonical ADR directory was chosen: 04 uses docs/adr, while 07 Prompt B specifies docs/decisions. The decisions README is explicitly review staging at the plan-requested path, with no ADRs or accepted decision history; its existence does not resolve BA-16. Product/Lead must settle that convention before the first ADR pack. The verification README describes evidence without inventing executable commands. All eight requested instructions and Prompt B metadata drafts are present for review.

## Instruction responsibilities

Root defines source authority, one-story workflow, gates, stack, architecture, security/commerce invariants, evidence, Git and delivery. Nested instructions link root and add only scoped rules:

- Storefront: Server/Client Component boundaries, SEO/public vs private rendering, variant/cart/quote/outcome UX and active-route data.
- Admin: staff access UX, compact accessible tables/dialogs/navigation, scoped aggregates and selective queries.
- API/workers: validated REST contracts, guards/domain ownership, Prisma transactions/locks, durable payment/stock/audit/outbox, adapters and integration tests.
- UI/types/validation/client: presentation, safe public wire types, canonical schemas and authentication-safe transport respectively; no app imports, DB access, authoritative business rules or circular dependencies.

Mandatory safeguards include backend permission/ownership checks, protected Super Admin actions, Argon2id, secure revocable cookie sessions with gated transport/CSRF details, no secrets/card storage, exact Decimal/NUMERIC money, immutable snapshots, no oversell/double capture/duplicate refund, verified webhook events, idempotent committed effects and provider calls outside DB transactions. Proposed versions/policies/thresholds remain subject to later verification and approval.

## Disposition of all 26 audit findings

Categories may overlap: **R** = safe to reference as a restriction, not a resolution; **B** = human decision/gate blocks the affected future implementation; **D** = separate reviewed documentation/contract/dependency correction needed; **L** = nonblocking for this instruction task, owned by a later story/release. Every item remains unresolved unless the current request explicitly settles its narrow preparation scope.

| Finding | Category | Instruction treatment and next owner/action |
|---|---|---|
| BA-01 stale approvals | D, L | Root preserves user baseline authority and open gates. Product/Lead reconciles old status text separately; no source edits. |
| BA-02 guest cart/merge | R, B, D | Storefront prohibits inventing P0 merge; Product must decide scope/API/UX consistency before affected cart slice. |
| BA-03 states | R, B, D | API/types stop conflicting enum definitions; Backend/Data/Product approve PAY/INV state and mapping tables. |
| BA-04 permissions/delegation | R, B, D | API/admin enforce deny-by-default without choosing conflicting keys/delegation. SEC-01 owner freezes exact matrix. |
| BA-05 catalog schema predecessor | R, B, D | Root/API require reviewed schema/price foundation; Backend/Data approves migration/task correction. |
| BA-06 persistence order | R, B, D | API prohibits missing idempotency/order/payment/outbox foundations; Backend/Data reviews graph, not silent dependency rewrite. |
| BA-07 early audit | R, B, D | Root/API require atomic critical audit before privileged writers. Backend/Security resolves early writer vs later explorer split. |
| BA-08 profile/address owner | R, B, D | Storefront/API do not invent API ownership/fields; Backend/Product reviews explicit contracts/subtasks. |
| BA-09 cart page owner | R, D, L | Storefront references missing full-page slice; Lead refines 036/038 acceptance before implementation. |
| BA-10 overview API/metrics | R, B, D | Admin requires backend aggregate and clear sandbox/Cairo semantics; Product/Backend approves definitions/owner. |
| BA-11 low-stock threshold | R, B, D | Admin/API must not invent configuration persistence/filter contracts; INV owner approves rule and scope. |
| BA-12 void/exception actions | R, B, D | API/admin prohibit forced paid or implicit restock; PAY/INV owners approve operator actions/contracts. |
| BA-13 catalog/media lifecycle | R, B, D | UI/API do not fabricate unpublish/archive/reorder/remove actions; catalog/storage owners review contracts and OPS controls. |
| BA-14 staff auth/invite/profile | R, B, D | Client/API/admin stop missing audience/invite/email-change details; SEC/Product approve contracts. |
| BA-15 SKU/price constraints | R, B, D | API/types/validation do not fix zero/default-SKU/combination policy from examples; FIN/Data owners decide. |
| BA-16 paths/scaffold overlap | R, D | User authorizes instruction-only directories and repository reuse. Root keeps actual docs paths; ADR directory conflict stays open. No applications scaffolded. |
| BA-17 CI predecessor | R, D, L | Root requires actual scripts/evidence; Lead reviews 004/005 dependency before CI story. No graph changed. |
| BA-18 UI/test prerequisites | R, D, L | App instructions require real integration contracts and relevant route/viewport evidence; Lead approves corrected task edges later. |
| BA-19 test environment/release order | R, B, D | API/root require appropriate disposable/staging evidence; OPS approves environment and recovery sequencing. |
| BA-20 missing P1 outcomes | R, D, L | Root/app instructions keep P1 deferred; Product refines explicit V1 scope/contracts, never promotes to P0. |
| BA-21 refund/provider process | R, B, D, L | API protects refund/live gates; Finance/Payments must separate policy, mock proof and provider certification approval. |
| BA-22 generic acceptance/overlap | R, D, L | Root requires observable story-specific normal/error/security acceptance and evidence. No proposal to split is implemented by these files. |
| BA-23 UX/budgets | R, B, L | UI/apps require relevant visual/contrast readiness; candidate metrics are not passes. UX/QA/Product approve before relevant UI/release work. |
| BA-24 DEC alias drift | D, L | Root uses stable named gate register and reports conflicting source references. Lead/Product reconcile aliases separately. |
| BA-25 simulation vs portfolio | R, B, D | API requires gated environment distinction and no production test injection; PAY/OPS settle safe sandbox surface. |
| BA-26 P2 breadth | R, D, L | Root keeps P2 research separate; Product scopes native/fraud/i18n and future acceptance explicitly. |

No finding blocks writing the requested instruction documents under the explicit review-only exception. Findings marked B block their affected implementation; they are not blanket approval requests for unrelated documentation.

## Gate and repository status

FIN-01, FIN-02, INV-01, SEC-01, PAY-01, OPS-01, LEG-01 and PAY-LIVE remain OPEN, as do applicable financial revisions, DB/API/UX/quality readiness reviews. Gate-register content is unchanged. No current supported package versions, provider capabilities, legal conclusions or live Codex product behavior are asserted from external sources; verification belongs to later relevant implementation.

Initial branch: main; origin fetch/push `https://github.com/ZeyaadAly/E-commerce.git`. Local config: normal non-bare repository, main tracks origin/main; symlinks disabled and case-insensitive paths. Seven pre-existing untracked CH-P0-001 documents were present. No existing CI/runtime/scripts or instruction files were found. Read-only Git commands use `-c safe.directory=D:/E-commerce` for the ownership mismatch already observed in 001; no persistent configuration was changed or credentials printed.

No task branch, commit, push, merge or history change was made. Branch-per-task guidance applies to authorized contribution work; this preparation stayed on existing main with uncommitted documentation, as no Git write was needed. Branch protection, remote PRs and remote CI remain unverified. Before committing, isolate the desired story files and predecessor documents deliberately rather than staging unrelated existing work.

## Verification

Executed PowerShell Test-Path/Get-Content and inventory/regex checks: eight nonempty AGENTS files, seven nested root links, all 26 unique BA disposition rows, unchanged 001 REVIEW/002 BLOCKED status, all eight named specialist gates visible. Local links and whitespace were checked separately for new/untracked files; all app/package directories contain only AGENTS.md. Manual content review found complementary root/app/package responsibilities with no gate closure or approved-baseline rewrite.

Executed `git -c safe.directory=D:/E-commerce diff --exit-code -- docs/01-project-brief.md ... docs/08-epics-and-stories.md`: success, no source changes. Executed `git -c safe.directory=D:/E-commerce diff --check` and `diff --stat`: success/empty tracked diff. These commands omit untracked file contents, so new Markdown content was separately read and checked. Executed `git -c safe.directory=D:/E-commerce status --short --untracked-files=all`: only expected untracked Markdown paths; no tracked file changes. Full final link/scope inventory is checked after adding this record and metadata.

Final inventory result: PASS, eight AGENTS files and 71 local links across the 14 created/updated task files checked; no trailing whitespace. PASS, 26 audit disposition rows and all 59 tracker stories retained (REVIEW 1, BLOCKED 58). PASS, app/package directories contain instructions only and every repository file outside .git remains Markdown. Git status shows 19 untracked Markdown files: seven pre-existing audit documents plus 12 new files for 002. Two pre-existing untracked documents, story-tracker.md and task-readiness.md, received limited preparation-evidence updates; other pre-existing files were preserved.

No application lint, typecheck, build, unit/integration/browser suites were run: there are no manifests, applications or toolchain scripts (NOT RUN). No packages, schemas, migrations, SQL, Supabase connections, runtime code or deployment commands were created/executed.

## Next action

Review/accept CH-P0-001, then review the CH-P0-002 instructions/metadata and record actual predecessor and instruction review/merge evidence. Resolve the ADR convention before the first decision pack. CH-P0-003 remains BLOCKED and is not started. After prerequisites and scope approval, it is the next implementation-plan story; CH-P0-008 remains a separate proposed ADR preparation candidate. This turn stops at CH-P0-002 preparation.

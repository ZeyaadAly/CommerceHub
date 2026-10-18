# CommerceHub engineering instructions

Created in CH-P0-002; documentation approved by the CommerceHub project owner on 2026-10-18. The owner separately approved the ADR directory convention. These instructions do not approve specialist policies, later stories, migrations or deployment. See the [approval register](docs/implementation/approval-register.md).

## Project and authority

CommerceHub is a single-merchant, Egypt-first, EGP physical-goods store with configurable categories and SKU variants. The planned modular monolith has separate Next.js storefront/admin applications and one shared NestJS REST API. P0 is sandbox MVP; P1 is V1 business depth; P2 is separately scoped research/future work. Do not promote deferred features by treating them as prerequisites.

Read these planning sources before development, then revisit the exact sections for the task:

- [01 project brief](docs/01-project-brief.md), [02 PRD](docs/02-prd.md), [03 UX](docs/03-ux-specification.md), [04 architecture](docs/04-architecture.md).
- [05 database design](docs/05-database-design.md), [06 API design](docs/06-api-design.md), [07 implementation plan](docs/07-implementation-plan.md), [08 story backlog](docs/08-epics-and-stories.md).
- [Requirements traceability](docs/implementation/requirements-traceability.md), [baseline audit](docs/implementation/baseline-audit.md), [gate register](docs/implementation/gate-register.md), [story tracker](docs/implementation/story-tracker.md).
- [GitHub workflow](docs/implementation/github-workflow.md), [instruction responsibility plan](docs/implementation/agent-instructions-plan.md), [task readiness](docs/implementation/task-readiness.md), [CH-P0-002 review](docs/implementation/ch-p0-002-review.md).

These documents provide project authority within the applicable system, developer and user instructions. The formal-review user instruction accepts all eight as approved planning documents; stale draft/proposed labels in the sources do not override that instruction. Planning approval does not approve story completion, specialist policies or audit recommendations. Root rules apply throughout the repository; nested AGENTS.md files add rules for their directories and must not weaken project invariants. Surface conflicts with exact file/section and BA/gate IDs; stop only the affected implementation and continue authorized independent work. The 26 audit recommendations are not approved changes. See the [formal review](docs/implementation/formal-review-001-002.md) for scoped blockers and acceptance dispositions.

## One story at a time

1. Identify the authorized story, relevant PRD/UX/API/DB sections, current acceptance criteria and permitted files. Read applicable nested instructions.
2. Check predecessor review/merge evidence, tracker status and applicable gates, including inherited blockers. Do not infer predecessor acceptance from a new task request. A review-only exception permits documentation preparation, not downstream implementation.
3. Inspect existing files, Git status/configuration and available tooling; preserve unrelated user changes. Reuse the existing repository.
4. State a small implementation plan and unresolved assumptions. Refine generic acceptance into observable normal/error/security cases without inventing business policy.
5. Implement only authorized scope and maintain module ownership. Keep changes focused; avoid unrelated refactors.
6. Run relevant existing checks and meaningful tests. Inspect diffs, including untracked files, for behavior, secrets and scope.
7. Update affected contracts, traceability, gate references and story evidence as warranted. Record proposed corrections separately; never silently rewrite approved baselines or dependencies.
8. Report story/status, changed files, exact commands/results, NOT RUN checks and reasons, remaining blockers and next recommendation. Stop before the next story. DONE normally requires actual acceptance, tests where applicable, human review and merge evidence under the project definition. For documentation stories 001/002 only, the owner explicitly authorized DONE on human acceptance with GitHub integration tracked separately; 003 still requires their verified merged evidence.

## Stack and ownership

- Strict TypeScript; React and Next.js App Router; Tailwind CSS, shadcn/ui/Radix; TanStack Query for server state; Zustand for justified transient client state; React Hook Form/Zod for forms.
- NestJS REST/OpenAPI; Prisma/PostgreSQL via Supabase infrastructure; Redis/BullMQ only when the approved phase requires durable jobs. Jest/Vitest, Supertest and Playwright are the planned test stack.
- Verify current supported stable toolchain versions and compatibility from official sources when implementation is authorized. Do not pin guessed versions, install tools during documentation tasks or substitute major technologies without approval.
- NestJS owns business rules, authorization, pricing, inventory, order/payment/refund transitions and audit. Only API and trusted worker domain services have database credentials; neither browser nor Next.js server code may access PostgreSQL/Supabase business tables directly.
- Controllers handle transport; services coordinate use cases; domain policies enforce invariants; repositories persist. One explicit owner coordinates each transaction. Prevent circular imports/modules; do not hide coupling with circular dependency workarounds.
- Shared packages own presentation, safe public types, wire validation and typed API access. Do not import API/Prisma internals into frontend or shared browser bundles. Backend validates every input independently of client validation.

## Gates and conflict handling

Consult the live gate register before each task. At preparation, FIN-01, INV-01, SEC-01, PAY-01, OPS-01, LEG-01, FIN-02 and PAY-LIVE remain OPEN; FIN-01 revision, DB-0/DB-01, API-01 and UX/quality reviews also remain pending where applicable. Only designated owner decisions and evidence can close them.

Do not choose tax/rounding/scale/shipping fees, a 15-minute hold, session origin/BFF transport, permission delegation, payment enums/replay retention, provider, retention or recovery targets from proposed examples. Stop the dependent slice until reviewed. Consult BA-02–15/17–19/21/25 for guest-cart, states, permissions, missing contracts and semantic dependency defects; a syntactically valid graph is insufficient. Use actual `docs/` paths. The owner approved `docs/architecture/decisions/` as the canonical ADR directory on 2026-10-18. Use its [README](docs/architecture/decisions/README.md); old path mentions in dated audit/review evidence are historical, not competing conventions. Approval of this path resolves BA-16's convention only and does not accept the proposed ADR decisions or other audit findings.

## Security and commerce invariants

- Default-deny API permission checks plus resource ownership apply at guard/service boundaries. UI visibility and a broad admin label never authorize actions. Super Admin must satisfy protected backend capability, last-active-Super-Admin and escalation safeguards.
- Use Argon2id password hashing, opaque revocable HttpOnly sessions with Secure cookies in production, separate staff/customer audiences, rotation/expiry and CSRF/origin protections for unsafe cookie-authenticated operations. Final transport, rates and step-up policy remain SEC-01 gated. Never store session secrets in localStorage/sessionStorage.
- Validate allowlisted inputs, bound lists/uploads/query costs, parameterize SQL and minimize response fields. Keep secrets in protected runtime configuration; no real credentials/PII in prompts, fixtures, code, frontend environments or logs. Never store raw payment-card data. Redact cookies, tokens, passwords, addresses and provider payloads from diagnostics.
- Never trust browser prices, totals, stock, actor/role claims or payment success. Centralize exact decimal money calculations in API; persist NUMERIC with currency and serialize money as decimal strings. Never use binary floating-point as financial authority.
- Preserve immutable order/item/address/rule/financial snapshots and append-only stock/payment/audit evidence. Corrections use explicit compensating events; no casual history deletion or cascade loss.
- Prevent oversell with atomic availability checks, deterministic locking, constraints and exclusive reservation terminal transitions. Cart does not reserve stock. Consume/release at most once; workers cannot bypass effective expiry or recreate stock after late payment.
- Scope idempotency by actor/operation/key and canonical payload; duplicate effects must not double-create orders, capture payments, release stock or refund. Do not exceed eligible capture including in-flight refunds. Refund is distinct from physical return/restock.
- Authenticate webhook raw bytes/provider context and deduplicate durable events before trusted processing. Unknown/timeouts remain explicitly reconcilable; browser redirects cannot prove success. P0 remains mock/sandbox; live provider integration and activation require separate approval.
- Use short, explicit database transactions for related stock/order/payment/audit/outbox changes. Provider network calls happen outside them. Report business success only after authoritative commit; re-read durable state after unknown outcomes before retrying side effects.

## Quality and verification

Build accessible keyboard/focus/label/dialog behavior toward WCAG 2.2 AA; verify relevant screens at 360/768/1440px with no unintended page overflow. Use shared tokens, compact consistent admin controls with accessible hit areas and explicit loading/empty/error/success/pending states. Fetch only active-route data; separate server state from UI state, scope private caches to principal and clear them on logout.

No package manifest, runnable lint/typecheck/build/test scripts or CI existed when these instructions were prepared. Discover actual commands from repository manifests/configuration when present; never claim a planned command exists. Add/record scripts in the authorized tooling story, not by guessing them here. Run appropriate format/lint/strict type/build and affected tests once available; mark unavailable checks NOT RUN with reason.

Use unit tests for policies, real disposable PostgreSQL integration/concurrency tests for persisted invariants, Supertest for API denial/validation/retry behavior, OpenAPI/client compatibility checks, and Playwright for shopper/admin workflows and request isolation. Include accessibility/manual focus and responsive evidence for UI changes; restore/fault tests for operations. Never substitute mocked UI success for persisted effects. Proposed coverage/Lighthouse/latency targets require approval and measured evidence, not invented passes.

## Git and delivery

Use one task per short-lived branch and focused changes with task IDs in authorized commits, PRs and reports. Preserve user edits and inspect staged/unstaged/untracked content. Human review precedes merge; no force pushes or history rewriting. Commit, push, merge, migration execution, external provisioning and deployment require authorization in the session and applicable gate evidence; do not repeatedly ask when it already exists. No next story starts automatically.

Use the repository PR template and linked workflow. Record checks honestly and keep unresolved findings visible. If Git rejects repository ownership, report it; a narrowly scoped read exception may be used without altering global Git configuration. Do not claim branch protection or remote CI is enabled without verification.

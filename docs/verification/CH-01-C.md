# CH-01 Milestone C implementation evidence

Status: REVIEW. Human acceptance and merge required before DONE. Starting main `09fc6aa04d8df8a20cc5eb6e3752ae25d5e42bd7` is verified PR #22 merge; F/001–005 accepted foundation remains the actual prerequisite. Branch `feat/CH-01-C-shared-contracts`. Owner separately authorized this bounded implementation on 2026-10-21; no later milestone or service access authority follows.

## Contracts and refined acceptance

Sources: PRD NFR-SEC-05/06, NFR-REL-02, NFR-TEST-01 and NFR-API-01; UX §§7/10 route/error boundaries; architecture §§3/5/13 shared package ownership; database §§1/4 transport/persistence separation; API §§1.1/2/3/12/13; original CH-P0-007 and adopted CH-01/C. Specialist gate register and BA-03/04/08/11–15 remain binding. No entire-parent dependency replaces F.

Canonical Zod wire definitions belong to [validation](../../packages/validation/README.md). [Types](../../packages/types/README.md) re-export inferred contracts with type-only utilities; [client](../../packages/api-client/README.md) consumes a structural parser interface. Public APIs and exact transport limitations are documented there. Both Next apps declare all three packages; API declares safe types/validation. Real package-resolution/strict compiler fixtures use all three app configurations; CommonJS API runtime consumes ESM schemas on the pinned Node runtime. No feature code or UI flow added.

Observable cases: valid envelopes/UUID/UTC, bounded pagination and endpoint sorts succeed; invalid/unknown request fields and malformed responses fail safely; no fetch before invalid config/body/path denial; one fetch maximum on writes; cancellation/deadline covers headers and stalled bodies; configured credentials remain isolated; errors retain no fixture secrets, URLs, raw payloads or causes; type-only imports erase and forbidden backend imports remain denied by existing architecture tests.

| Original CH-P0-007 acceptance | Bounded evidence / disposition |
| --- | --- |
| 1. Outcome without release expansion | Three independent packages with transport/schema implementations, exports and strict compatibility fixtures; no P1/P2 or domain feature |
| 2. Relevant backend invariants | No backend rules moved into shared/browser code; existing ownership/secret import tests retained; DTO schemas are not authorization |
| 3. Predictable errors/invalid input; safe retries | Synthetic success/error/media/schema/size/network/cancel/timeout tests; every method one attempt; no refresh/replay |
| 4. Dependencies/gates and exact references | F and PR #22 verified; references above; no specialist policy selection; scoped C only |
| 5. Meaningful verification/negative cases | Public export, strict negative compiler, runtime ESM/CommonJS, schema bounds, safe errors and transport tests in contracts.test.mjs; full repository checks recorded below |

No clause is marked finally accepted before human review/merge. CH-01 remains partial; legacy 006 BLOCKED with exact historical evidence unchanged; D/008 and later work not started. The live governance checker permits C REVIEW only, rejects premature C DONE/later authorization, and retains historical baseline/graph/gate assertions.

## Decisions deliberately unresolved

API §§4.1/13 give 20/100 pagination values as candidates: no defaults or global bounds frozen. Cursor size/signing, per-endpoint sort/filter/array conventions and text caps must be supplied by reviewed endpoint contracts. API-01/OpenAPI generation is later work. SEC-01 origin/BFF/cookie/CSRF/refresh policy is not selected; explicit client credentials mode is configuration only, no server session forwarding. API §§2/12 example codes do not define a closed business error enum: transport errors expose status and fixed category only. Money scale/rounding/tax FIN-01, state mappings BA-03/PAY-01, permission mapping BA-04/SEC-01 and domain DTO gaps BA-08/11–15 remain out of scope. No invented business schema closes these gaps.

## Security review and checks

No hosted calls in tests, only mocked fetch/streams and local compiler fixtures. TLS is native HTTPS validation with no bypass; redirect rejection prevents forwarding headers across origins. Base URL is trusted explicit application configuration, not user-input origin approval. Response byte and timeout limits are explicit caller technical budgets, not adopted service rate policy. Wire messages remain untrusted; shared errors intentionally discard them. Request-specific adapters and CSRF/backend authorization remain required before protected endpoints. No global mutable user state, secrets, database imports or storage. Existing security exception remains unchanged.

Zod 4.6.7 is promoted from existing locked transitive resolution to exact direct validation dependency; no resolved third-party version change. Local pnpm initially rejected implicit store relocation, then used the existing explicit store without global config changes. An offline install attempt lacked registry policy metadata; ordinary policy verification recovered and the required full frozen install passed. No supply-chain policy bypass.

Validation results will be recorded after final execution. No PostgreSQL/Supabase connection, credentials, SQL, migrations, Prisma schema, auth/product/inventory/payment/checkout implementation, resource provisioning, Redis spending, Docker/WSL installation or deployment occurred. Stop at REVIEW; recommend separately authorized D options preparation next.

## Final local verification

- Frozen install using the existing explicit pnpm store: PASS; lockfile unchanged by the frozen run. Third-party package and snapshot maps exactly equal starting main; only workspace importer links and the existing Zod direct edge changed.
- `pnpm.cmd lint`: PASS, zero warnings.
- `pnpm.cmd typecheck`: PASS across seven workspaces; the command first builds four shared packages. A clean-artifact run moves old validation/types/client output into an ignored backup, regenerates declarations and checks actual app configurations; no pre-existing shared output required. Package compilation remains the existing ESM tsc configuration, with native require(ESM) on pinned Node.
- `pnpm.cmd build`: PASS, all seven workspaces including both Next.js production builds. Later validation-only refinements were rebuilt independently; CI repeats the complete final build.
- `pnpm.cmd test`: PASS, 147 tests, zero failures/skips; 39 new focused contracts/transport/consumer tests and four new nested-workspace audit regressions alongside the existing 104 tests. Initial run exposed nested workspace resolution in audit; fixed and full suite rerun green. Strict compiler fixtures assert rejected type misuse with checked expect-error directives.
- `pnpm.cmd test:quality`: PASS, three tests including real Husky denial/partial-staging preservation.
- `pnpm.cmd test:ci`: PASS, 63 CI/scanner/audit-policy tests, including nested workspace production-exposure/unknown-link/identity denial.
- `pnpm.cmd audit:ci`: PASS with registry access; raw audit exit 1 remains visible for the approved braces high advisory, lower findings 0, additional high/critical 0; 172 local artifact/trace entries inspected. Sandbox registry fetch initially returned an error object and correctly failed closed. The gate was not relaxed for network failure. Exception review 2026-10-26 and expiry 2026-11-02T00:00:00Z unchanged.
- `pnpm.cmd scan:secrets`: PASS, zero findings; repeated after staging final scope.
- `node docs/planning/backlog-consolidation/verify.mjs`: PASS; historical retention unchanged, 21 parents/48-node acyclic graph, live C REVIEW evidence and seven rejected governance mutations. Downstream C prerequisite remains unmet until acceptance/merge.
- `git diff --check`: PASS; generated Next declaration churn restored to starting main.
- Additional `pnpm.cmd format:check`: raw Windows FAIL only on eight unchanged baseline Markdown files with CRLF (seven planning-package reports/pages plus CH-P0-005 verification). Their LF-normalized contents exactly match starting Git blobs. `node .verification/check-c-format.cjs`: PASS using exact Git bytes temporarily and restoring original working copies in finally; no ignore/policy weakening. Final remote CI uses the committed tree and its result is recorded in the PR.

Audit traversal correction: nested link paths resolve relative to the declaring workspace while retaining original root ancestry and production classification. Referenced manifest identity must match the link name. Added tests prove safe nested graphs pass and missing targets, wrong identities and transitive production braces fail. Every existing exception constraint and negative suite remains enforced.

Repository check counts and exact-head CI delivery evidence are included in the PR; CI is not presumed successful by this document. UI/manual responsive checks NOT RUN: no UI change. Hosted service/integration checks NOT RUN: no authority and no domain implementation. C remains REVIEW, not DONE.

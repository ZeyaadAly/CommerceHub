# CH-02/M-CAT-1 offline implementation evidence

2026-10-22 (Africa/Cairo). Status: **REVIEW for the two-model offline subset**;
CH-02/M IN PROGRESS/incomplete, DB blocked. No database enforcement is implemented.

## Authority, scope and baseline

Starting fetched main: `334178d0a9610d3a4792a8e5029c08171ac69929`.
Branch: `feat/CH-02-M-CAT-1-category-schema`, isolated worktree under
`.verification/CH-02-M-CAT-1-worktree`; prior branch and uncommitted documents
preserved. Prior proposed review copied as historical evidence with a superseding
approval pointer. [Exact approved contract](../architecture/decisions/CH-02-M-CAT-1.md),
[approval register](../implementation/approval-register.md) and
[SQL obligations](../architecture/decisions/CH-02-M-CAT-1-sql-manifest.json).

Owner ZeyaadAly explicitly approves the technical contract while acting as
Backend/Data reviewer and separately authorizes offline implementation/delivery.
No independent second specialist is claimed. Accepted C/D prerequisites remain
as recorded in adoption.json; E_DB is not an M predecessor, but DB still requires
M + E_DB and separate execution approval. No other milestone starts.

Implemented models: Category → categories; CategoryClosure → category_closure.
Exactly thirteen stored columns, three explicit RESTRICT/RESTRICT foreign keys,
two primary keys, one global slug UNIQUE, two ordered ordinary indexes. Explicit
PostgreSQL types/defaults match the approved contract; no UUID-generation default,
@updatedAt, enum, client generator or runtime connection. No financial/identity/
inventory/payment model. Pure backend slug helper only; no catalog module/handler.

Traceability: DB §§4/6.1/12–13/17–18; architecture §7; PRD
CH-ADM-CAT-002 and catalog hierarchy constraints; legacy CH-P0-009 five clauses.
Bounded outcome/keys/deletion mapping implemented offline (clause 1); invariants
assigned to trusted DB/service owners rather than frontend (2); slug errors and
future atomic retry/rollback obligations specified, not implemented as handlers
(3); accepted predecessors and scoped signed decision recorded (4); actual
parser/mutation/security tests and future DB negatives recorded (5). Full legacy
009 migration review/schema test and full M acceptance remain incomplete.

## Actual local verification

- Frozen install: PASS after exact backend dev pins prisma@7.10.1 and
  @prisma/internals@7.10.1; initial dependency update exited on pnpm's newly
  encountered build approvals, then reviewed exact-version engine download and
  CLI Node-version scripts were allowed and frozen install passed. No generated
  client, migrations or runtime adapter. Existing pg unchanged.
- Prisma format, validate and format --check: PASS using API config with no
  datasource URL, dotenv, seed or migration configuration. No database-requiring
  command used. Focused test repeats validate/format --check with database-related
  environment removed and network operations denied by test-only instrumentation.
- Focused schema tests: **28 PASS**, zero failures/skips. Actual Prisma DMMF
  checks model/table/column/type/default/nullable/key/index/relation structure;
  invalid FK rejected by parser, valid length drift rejected by contract check;
  slug tests include boundary length, ASCII-only conversion and newline rejection.
  Manifest completeness and browser dependency/import boundaries checked.
- `pnpm lint`: PASS, zero warnings, including shared build prerequisites.
- `pnpm typecheck`: PASS across all seven workspaces.
- `pnpm build`: PASS, shared packages, NestJS API and both Next.js production apps.
  Build-generated tracked next-env.d.ts changes were restored from HEAD; none
  delivered. No source/browser behavior change.
- `pnpm test`: PASS, **201 Node tests + 6 token tests + 17 UI component tests**.
  Includes existing transport/health/API/security/contract tests and new schema
  tests. Existing connectivity suite uses synthetic local TLS/protocol fixtures,
  not a PostgreSQL server or Supabase target, and issues no SQL.
- `pnpm test:quality`: PASS, three checks including real Husky partial-staging
  and invalid-TypeScript rejection; no hook bypass.
- `pnpm audit:ci`: PASS. Only unchanged approved development-only
  GHSA-vfj7-8cjw-p6xm braces@3.0.3 risk; no additional high/critical findings,
  172 artifact entries/traces inspected. Review 2026-10-26 and expiry
  2026-11-02T00:00:00Z unchanged. Not deployed-artifact attestation.
- `pnpm scan:secrets`: PASS, no findings; final scan repeated before delivery.
- Raw Windows `pnpm format:check`: FAIL solely on 15 unchanged CRLF baseline
  files. Exact-Git-byte check PASS with original working bytes restored in
  finally; no ignore rule/historical content weakened. Files: CH-10-T handoff;
  planning adoption-verification/backlog/coverage/mapping/README/schedule/
  verification; CH-P0-005 and its advisory review; four shared-package READMEs;
  packages/ui/test/browser/index.html. Each normalized content was asserted equal
  to its HEAD blob before temporarily substituting recorded bytes. New contract,
  manifest and review evidence explicitly formatted outside historical ignores.
- Governance verifier: PASS; unchanged 21 parents, 48 milestones, 59 historical
  stories, 295 clauses, 100 historical edges, 26 findings; 32 rejected mutations,
  including four new bounded-scope/database-proof/gate/approval regressions.
  Global implementationAuthorized=false still forbids blanket authority; the
  exact category authorization is a separate checked boundedCategoryContract.
- `git diff --check`: PASS; tracked/untracked diff and lockfile reviewed for scope,
  credentials, runtime integration and no migration artifacts.

Tooling: existing repository-local pnpm 11.28.6 reused by adding its .tools bin
directory to process PATH; no global tool install or Git configuration change.
Node 24.19.0 / TypeScript 5.9.3 compatible with stable Prisma 7.10.1. Official
compatibility/release sources and RC-vs-stable rationale are in the contract.

## Limits and remaining acceptance

All twelve SQL-only manifest obligations are **DESIGNED — NOT IMPLEMENTED**.
Checks/triggers/routines/locking/privileges, real persisted closure completeness,
cycle/concurrency/rollback proof and SQL migration/application tests: **NOT RUN**,
explicitly outside authorization. No target/credential access, SQL command,
PrismaClient initialization, db push/pull, migrate, studio or generation occurred.
Offline validation is not production readiness. Superuser bypass remains a
future operational limitation; global table locking trades write parallelism for
a simpler hierarchy integrity proof; matching internal-parser pin is test-only.

Local browser/responsive/assistive-tech checks NOT RUN for this backend-only
change; CH-10/T human accessibility acceptance remains outstanding. Remote CI
must be observed on the exact final commit and linked in PR/final report, never
inferred from local results. No merge/deployment authorized.

M-01 identity mapping pending; M-02 remainder (brands/products/variants/media and
their constraints) pending; M-03 money policy pending; M-04 full ownership outside
this category contribution pending. All specialist gates including SEC-01,
DB-0/DB-01 OPEN; full 006 BLOCKED; Redis spending DEFERRED; Docker/WSL not mandatory;
all unsigned ADR portions PROPOSED. Parent and full milestone are not DONE.

Recommended next schema slice: **M-01 users only**, after separately attributable
Security + Backend/Data approval of identity normalization, status/null/default
mapping and exact scope authorization. This is a recommendation, not a start or
standing authority. It prepares real creator/uploader FK targets for later
catalog slices without fake identity tables or premature media dependencies.

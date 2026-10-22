# CH-02/M-ID-1 offline User implementation evidence

2026-10-22 (Africa/Cairo). **REVIEW**, bounded users-only subset; full CH-02/M
incomplete, DB blocked. [Approved contract](../architecture/decisions/CH-02-M-ID-1.md),
[approval register](../implementation/approval-register.md),
[deferred manifest](../architecture/decisions/CH-02-M-ID-1-sql-manifest.json).

Starting fetched main `c6b96f26d3db947619ac4d1a71b3b01e912c21ff`, verified PR #30
merge, on requested branch `feat/CH-02-M-ID-1-users-schema`. Existing five local
review/policy changes are retained and finalized in their authorized scope.
Owner ZeyaadAly explicitly acts as Product, Backend/Data and Security reviewer
for this bounded decision, October 22; no independent second reviewer claimed.
Accepted C/D prerequisites remain unchanged; E_DB is for later DB, not M.

Exactly one new User → users model; eleven baseline columns, UUID without default,
VARCHAR lengths/native nullability, TIMESTAMPTZ(6), version default 1, status
VARCHAR(20) without default, named primary/global normalized-email UNIQUE keys.
No outgoing FK, role/authority/password/token/session field. Both category model
blocks preserved, and parser regression verifies them against accepted main.

Pure email helper validates the reviewed ASCII grammar, preserves local display
spelling/dots/plus tags and lowercases domain/display and complete identity key.
No provider aliasing, trim/Unicode folding, truncation or ownership claim. It is
not wired to an auth endpoint or module. Required registration displayName API
amendment records the earlier explicit Product decision, with exact full-document
governance comparison; no other API baseline edit. Empty-name/phone/status/update
rules require future enforcement, not invented successful handlers.

Traceability: DB §4.1/12–13/16–18, architecture §§6–7, API §4,
CH-AUTH-001/003/004; legacy CH-P0-009 five clauses: bounded field/key contract,
trusted backend/DB ownership, deterministic normalization/errors and future
transaction/replay negatives, accepted C/D plus exact scoped decision, actual
offline parser/helper tests and deferred PostgreSQL/migration proof. Full 009/M
is not DONE from this subset.

## Verification

Reused exact Prisma/internals 7.10.1, Node 24.19.0, TS 5.9.3 and
pnpm 11.28.6; frozen install passed without lockfile/dependency changes. Official
[v7 requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements)
and [config](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference)
reviewed: existing URL-free .mjs config is retained. No generator/client.

Actual results:

- Frozen installation PASS; no package/lockfile/workspace/dependency version
  changes. Repository-local pnpm reused through process PATH, no global install.
- Prisma format and validate PASS. Existing category test runs genuine CLI
  validate/format --check on the combined three-model schema with database
  environment removed and network operations denied; PASS, no credential/URL.
- `pnpm test:user-schema`: **69 PASS**, zero failures/skips: **41 User/email**
  tests and **28 category regressions**. Exact DMMF field/key/null/default types,
  no extra authority fields/models, parser-negative and valid-schema-drift cases,
  source/parser category equality, boundary ASCII grammar, case identity and
  distinct dots/plus tags; required SQL contract coverage, not SQL enforcement.
- `pnpm lint`: PASS, zero warnings; `pnpm typecheck`: PASS;
  `pnpm build`: PASS across shared packages, API and both Next.js apps.
  Generated tracked next-env.d.ts changes restored from HEAD before delivery.
- `pnpm test`: **242 Node tests + 6 UI token tests + 17 UI component tests PASS**,
  zero failures/skips. Existing API/health/OpenAPI, safe transport/environment,
  boundary/security checks retained. Existing connectivity suite uses synthetic
  local TLS/protocol fixtures, not PostgreSQL/Supabase and no SQL.
- `pnpm test:quality`: PASS, three checks including actual normal pre-commit
  invalid-TypeScript rejection and preservation of partially staged/unrelated edits.
- `pnpm audit:ci`: PASS. Only unchanged approved development-only braces@3.0.3
  GHSA-vfj7-8cjw-p6xm; zero additional high/critical findings, 172 local artifact
  entries/traces inspected. Review 2026-10-26 / expiry 2026-11-02T00:00:00Z remain
  unchanged. Not a deployed-artifact attestation or remediation claim.
- Secret scan PASS, 216 files, four existing binaries, zero findings; diff check
  PASS. Tracked/untracked files reviewed; no runtime connection/client/SQL or
  migration artifact, dependency or unrelated source change.
- Raw Windows `pnpm format:check`: FAIL only on ten unchanged CRLF baseline files:
  planning adoption-verification/backlog/coverage/mapping/schedule/verification;
  CH-P0-005 verification; api-client/types/validation READMEs. Full formatting
  against exact Git bytes PASS with normalized equality asserted first and all
  original working copies restored in finally. No ignore/history changes. New
  contract/manifest/evidence explicitly formatted outside historical ignores.
- Governance PASS: 21 stories, 48 unchanged milestones, 59 legacy stories,
  295 original clauses, 100 historical edges, 26 findings, 719 local links;
  **36 scope/authority mutations + 2 API-amendment regressions rejected**.
  Approval and implementation are exact bounded records; no blanket authority.

Local browser/device/assistive-tech verification NOT RUN for this backend-only
slice; T human acceptance remains outstanding. Unchanged required remote CI
includes browser/app-style checks; exact-head result must be observed and linked
in PR/final delivery, never inferred from these local results. No merge authorized.

## Deferred proof and remaining scope

All twelve User manifest obligations DESIGNED — NOT IMPLEMENTED. Future DB
must enforce canonical grammar/key equality and C collation, global uniqueness,
status/deactivation/phone/name/version CHECKs, immutable UUID/created time,
database updated_at, version increment guards, privileges and actual historical
RESTRICT FKs. AUTH/ACCOUNT with DB/A own expected-version updates, one-time
verified replacement and atomic audit. Session revocation/reauth/notification
policy remains later scoped Security/AUTH work, not silently approved durations.

PostgreSQL/Supabase connections, credential retrieval, SQL/migration generation/
execution, PrismaClient, handlers, sessions/staff/RBAC, provisioning, financial/
inventory work and deployment NOT RUN/not performed, expressly forbidden.
Offline parser/helper and network-denied CLI checks cannot prove persisted
uniqueness, races, rollback, security transitions or privileges.

Remaining M-01 credentials/session/RBAC mappings pending; M-02 outside category
hierarchy pending; M-03 financial policy pending; full M-04 beyond reviewed user/
category contributions pending. Full M incomplete, DB blocked, all specialist
gates including SEC-01/DB-0/DB-01 OPEN. T manual accessibility acceptance
outstanding, full 006 BLOCKED, Redis DEFERRED, Docker/WSL not mandatory.

Next recommendation after review/acceptance: separately review a bounded
UserCredentials mapping and Security hashing/version/lifecycle/ownership contract;
do not add it or start AUTH in this task. No merge or next milestone authorized.

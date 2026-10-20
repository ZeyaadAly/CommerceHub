# CH-P0-006 Supabase development environment designation

Date: 2026-10-20 (Africa/Cairo). **Environment choice: owner APPROVED.
Documentation delivery: REVIEW. Connectivity/security readiness: NOT VERIFIED.
Full CH-P0-006: BLOCKED, not DONE.** Designation is not permission to use, connect
to, mutate or reset the resource, nor a specialist gate closure.

## Authority and integration baseline

The owner request, “CommerceHub — CH-P0-006 Supabase Development Environment
Designation”, explicitly designates the existing project for persistent development
and authorizes this documentation/Husky commit/branch push/open review PR only.
It explicitly excludes database access, SQL, credentials, infrastructure changes,
implementation, migrations, spending, deployment, merge and CH-P0-007.

Prerequisite [PR #14](https://github.com/ZeyaadAly/CommerceHub/pull/14) is verified
MERGED at **0ea8195d8d4daf9a4c4d198929cd4af640ebb2da**, 2026-10-20T12:24:21Z,
from reviewed head `8a3eed57c0227a346384fdc63177fe7af2f5de0f`. Fetched origin/main
and fast-forwarded local main match that merge; its tree equals the reviewed tree.
Fresh main branch metadata reports protected=true and commercehub-quality required
for everyone, bound to GitHub Actions app 15368. No GitHub policy changed.

Branch: `docs/CH-P0-006-supabase-dev-designation`. The clean existing checkout is
`C:\Zeyad\CommerceHub`. Root AGENTS applies; no nested documentation instructions
exist. Sources: [architecture §§2/7.2/14/16](../04-architecture.md),
[database security/migration boundaries](../05-database-design.md),
[API backend authority](../06-api-design.md), [07 §12](../07-implementation-plan.md),
[08 CH-P0-006](../08-epics-and-stories.md),
[Docker-free decision](CH-P0-006-container-free-decision.md),
[infrastructure proposal](CH-P0-006-infrastructure-proposal.md) and
[OPEN gates](gate-register.md). This is a scoped owner decision record, not a new
approved production topology or reassignment of reserved ADR identifiers.

## Resource identity and evidence classification

| Field                       | Recorded designation / evidence                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Provider / existing project | Supabase / `commercehub`; reuse the existing resource, do not create another                                            |
| Owning organization         | `ZeyaadAly's Org`                                                                                                       |
| Region                      | Frankfurt, `eu-central-1`, as recorded by earlier authorized management inventory in the merged infrastructure proposal |
| Plan                        | Free / tier_free, organization classification refreshed through management-only get_organization during this task       |
| Purpose                     | Persistent, non-production PostgreSQL development environment for CommerceHub                                           |
| Classification              | Development; explicitly not staging, production or disposable integration test                                          |
| Lifecycle authority         | Owner attests authorization to make this resource's lifecycle and access decisions                                      |

Project identity/region and PostgreSQL 17.11 metadata were previously observed in
the [integrated checkpoint](../verification/CH-P0-006-infrastructure-checkpoint.md).
Only organization plan metadata was refreshed here; no database, credentials,
connection URL, key, table, log, Auth identity or Storage object was requested.
No current usage, role configuration, security posture or available capacity is
inferred from Free classification. No sensitive resource settings/identifiers are
published in this record.

**Owner attestations:** the project is new, reportedly empty, created specifically
for development, and under the owner's lifecycle/access authority. These are
statements supplied by the owner, **not independently verified database facts**.
Empty state, absence of other consumers, grants and dependency safety have not
been inspected. Any preservation, ownership or dependency uncertainty must be
resolved through separately approved evidence before future access or mutation.
The environment designation resolves the owner-choice question only.

## Preserved architecture and security boundaries

NestJS remains the database access layer and Prisma the approved ORM. Storefront
and admin, including Next.js server code, access business data through the NestJS
REST API; neither receives database credentials or direct Supabase business-table
access. Future trusted workers remain within the approved backend/domain-service
boundary, not an independent authorization or invariant bypass.

Financial calculations, permissions, inventory and order operations stay backend
controlled. No financial, session, payment or stock policy is selected here.
Require separate least-privilege runtime and migration identities, authenticated
TLS with CA/certificate and hostname verification, protected backend-only secret
storage and redacted diagnostics. These remain future controls, not verified
configuration. Development data must be synthetic. Persistent development data
must not be automatically wiped by tests, even when initially reported empty.

Disposable integration-test resources require a separate approved identity,
roles, lifecycle and positive reset/cleanup authority. Development designation
does not approve staging/production use, production-target access, migration,
seeding or reset. Docker, Compose and WSL remain optional, not prerequisites.

## Explicit exclusions

No PostgreSQL connection or SQL, including catalog/read-only queries; no record
inspection, connection-string/credential retrieval, secret generation/rotation,
table/schema/migration creation, reset or seed, Supabase permission/settings change,
new project/organization/branch, Free upgrade/add-on, billing change, production
credentials, Redis provisioning, Docker/WSL install or application deployment is
authorized. No app code, dependency, environment variable, workflow or hosting
configuration changes belong to this task. Existing unrelated projects are untouched.

## Proposed connectivity-readiness follow-up - separate approval required

The following is a plan only; no step is implemented or authorized by designation.

| Boundary                  | Required owner-approved follow-up                                                                                                                                                                                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity / preservation   | Confirm exact resource and authorized operator, purpose, dependency/preservation summary and permitted operations before any access. Do not infer safe mutation from the empty-state attestation.                                                                                                   |
| Credentials / custody     | Explicit permission to retrieve only necessary backend credentials and store them in ignored API-local/protected secret configuration. No credentials in prompts, documents, frontend env, bundles, fixtures or logs.                                                                               |
| Runtime / migration roles | Review least-privilege runtime grants and distinct controlled migration authority. Role inspection/creation or SQL requires its own explicit scope; do not copy broad provider-example privileges.                                                                                                  |
| Direct / Session pooler   | Validate actual IPv4/IPv6 reachability and future supported Prisma/driver session behavior. Direct PostgreSQL normally requires IPv6 without the paid IPv4 option; Session pooling may supply IPv4. No paid add-on is approved.                                                                     |
| TLS / network             | Verify authentication, CA/certificate and hostname for the actual endpoint. Approve appropriate network restrictions where supported. No certificate bypass, plaintext fallback or automatic alternate-environment connection.                                                                      |
| Nondestructive validation | Separately authorize bounded connection/handshake and ownership checks, timeouts and redacted outcomes; explicitly authorize any identity SQL if required. No SQL is implicitly permitted because it is read-only. Reject production/staging/shared/disposable-target mismatches before connection. |
| Test separation           | Approve independent disposable test resource identity/roles and cleanup. Persistent dev is never an automatic reset target. Hosted Linux CI service testing is an option requiring separate workflow/test authorization.                                                                            |
| Future Prisma migrations  | Select supported ORM/driver versions in the owning story, inspect generated SQL and obtain DB-0/DB-01/applicable reviews. Migration execution remains later owning-story work, including CH-P0-010; no startup migrations, db push, schema or shadow DB now.                                        |
| Rotation / incidents      | Name credential custodian and incident owner. A later approved runbook must cover scoped rotation/revocation, consumer restart/revalidation, redacted incident evidence and preservation obligations; no new rate/retention/recovery target or secret change is chosen here.                        |

The existing [Docker-free guide](../development/docker-free-setup.md) remains the
current application-only runbook; it is not a connection runbook for this resource.
[Supabase connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres)
and [Prisma guidance](https://supabase.com/docs/guides/database/prisma) inform future
review, not a pinned implementation contract or compatibility PASS.

## Redis, BMAD and acceptance

**Managed Redis and all associated spending remain DEFERRED.** No subscription or
budget is approved. Redis/BullMQ remains in the architecture; no dependency,
substitute service, credentials, environment variables or queue tests are added.
Future disposable Redis services on GitHub-hosted Linux require separate approval.
This supersedes the infrastructure proposal's paid-provider recommendation as the
current action direction, without rewriting its historical research.

| Criterion | Status after designation | Limit / remaining evidence                                                                             |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| AC-006-01 | PASS                     | Retained merged ownership evidence; future secret controls unverified                                  |
| AC-006-02 | PASS                     | Retained Docker-free Node startup evidence                                                             |
| AC-006-03 | PASS                     | Retained examples/ignore/scan/redaction/canary evidence                                                |
| AC-006-04 | BLOCKED                  | Owner dev choice recorded; role, target guard, isolation and reset boundaries not technically verified |
| AC-006-05 | BLOCKED                  | Redis deferred, no approved runtime capability evidence                                                |
| AC-006-06 | BLOCKED                  | Resource-backed connection/bootstrap NOT RUN                                                           |
| AC-006-07 | BLOCKED                  | Existing config cases retained; service/auth/TLS tests NOT RUN                                         |
| AC-006-08 | BLOCKED                  | Executable forbidden-target denial remains unimplemented                                               |
| AC-006-09 | BLOCKED                  | Real module-owned integration suites/resources not implemented                                         |
| AC-006-10 | PASS                     | Prior protected delivery evidence retained; this documentation PR requires its own successful check    |
| AC-006-11 | PASS                     | No schema/migration/DB integration introduced                                                          |
| AC-006-12 | BLOCKED                  | Approved connectivity/service lifecycle runbook and verification still pending                         |
| AC-006-13 | PASS                     | Actual results and evidence limits recorded                                                            |
| AC-006-14 | BLOCKED                  | Full approved-resource clean setup/repeatability NOT RUN                                               |
| AC-006-15 | PASS                     | Designation grants no resource operation or cost authority; none performed                             |

All 15 original criteria stay unchanged. CH-P0-001-005 remain DONE; limited 006 is
MERGED through PR #13; full 006 remains BLOCKED, not DONE; CH-P0-007 remains NOT
STARTED (tracker BLOCKED). All 59 IDs/dependencies, OPS-01 and every specialist
gate remain unchanged/OPEN. No proposal merge or designation substitutes for
specialist sign-off. Existing advisory review 2026-10-26 and expiry
2026-11-02T00:00:00Z remain unchanged.

## Verification and review boundary

Existing Node 24.19.0/pnpm 11.28.6 is reused without installation. Preflight status,
fetch, refs, GitHub merge/protection summary, fast-forward and merged-tree equality
passed. Organization-plan management read confirmed Free; no database read ran.
Actual documentation checks:

| Command / method                                                                                                    | Result                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm.cmd format:check`                                                                                             | Initial exit 1 solely for historical 005 report CRLF; exit 0 using exact Git bytes after content-equality proof. Historical checkout restored/excluded from delivery.                                        |
| `pnpm.cmd exec prettier --check --ignore-path .gitignore docs/implementation/CH-P0-006-supabase-dev-designation.md` | Exit 0; new record explicitly checked despite governance formatter exclusions                                                                                                                                |
| `pnpm.cmd scan:secrets`                                                                                             | Exit 0; 115 files, zero signature findings; bounded scanner limitations retained                                                                                                                             |
| Inline Node relative-link/story/AC/scope assertions                                                                 | PASS; 87 local links resolve; 59 IDs/dependencies and DONE=5/BLOCKED=54 preserved; original 15 criteria unchanged; protected source/config/workflow/lockfile/scanner/exception/gate-register files unchanged |
| `git diff --check`; staged `git diff --cached --check`; tracked/untracked/staged inspection                         | Exit 0; five scoped Markdown files only, no credentials or out-of-scope changes                                                                                                                              |

Local application/build/runtime/database/Redis tests are NOT RUN for this
documentation-only task. Required new-head CI is observed after push and recorded
in the PR/final delivery report; no future PASS is pre-claimed.

Leave the new PR OPEN at REVIEW. Next approval is a separately scoped,
nondestructive connectivity-readiness phase with credential, role, target and TLS
authority explicitly stated. No connectivity work, migration or next story begins
automatically. No database access, provisioning, SQL, credential retrieval/change,
spending, deployment or CH-P0-007 work occurred.

# CH-P0-006 limited Docker-free preparation evidence

Date: 2026-10-20 (Africa/Cairo). **Limited phase: REVIEW. Full story: BLOCKED,
not DONE.** Human review and protected integration remain pending. This report is
commit-time evidence; the actual PR head, URL and required-check outcome belong
in the PR delivery record/final report after they exist.

## Authority, baseline and scope

Owner request: “CommerceHub — CH-P0-006 Limited Docker-Free Implementation”, supplied
as the session attachment. It authorizes this limited implementation, local checks,
Husky commit, branch push and open review PR, and prohibits merge, full bootstrap,
service provisioning, migrations, deployment and CH-P0-007.

Actual existing checkout: `C:\Zeyad\CommerceHub`; origin:
`https://github.com/ZeyaadAly/CommerceHub.git`. Preflight working tree was clean.
`git fetch origin` succeeded with authorized sandbox escalation. `origin/main`
was `bce93821870ad7d966a2e33d7945d226e4f3261f`, the verified merge of
[PR #12](https://github.com/ZeyaadAly/CommerceHub/pull/12), reviewed head
`703f7b6b097a2673493f1bdc16f81bd495a0653e`. GitHub independently reported merged
at 2026-10-20T11:02:16Z. Branch
`chore/CH-P0-006-docker-free-environment` starts from that fetched baseline.
The existing 001-005 acceptance/merge records are retained; declared predecessor
CH-P0-003 is satisfied. No dependency edge is added.

Sources: PRD §2.1 and NFR-SEC-05/06, NFR-OPS-01, NFR-TEST-01, NFR-REL-02;
[architecture §§2/14/16/17](../04-architecture.md);
[database §§14-18](../05-database-design.md);
[API security/health boundaries](../06-api-design.md);
[07 §12](../07-implementation-plan.md), [08 CH-P0-006](../08-epics-and-stories.md),
[unchanged AC-006-01–15](../implementation/CH-P0-006-container-free-decision.md),
[gates](../implementation/gate-register.md), BA-19/22 and live readiness/tracker.
Root plus API/storefront/admin AGENTS were read; there are no nested docs/scripts
instructions. No shared package is changed.

Implemented: real environment ownership inventory, root template index and three
scoped examples, minimal API-owned strict configuration validation, native optional
env-file loading, 10 focused Node tests, Docker-free runbook and scoped tracking.
No app URL consumer existed, so no public URL variable/validator was invented.
No UI, business API, database, cache, session or worker contract is added.

## Configuration and files

[Runbook and complete inventory](../development/docker-free-setup.md) document
classification and precedence. Only API `PORT` and `NODE_ENV` are new application
consumers. Both are backend-only/nonsecret. Development/test default to port 3002;
production mode requires explicit PORT. Blank, malformed/out-of-range ports and
unknown modes fail before Nest starts, reporting field names only. Loopback stays
fixed. Process environment overrides optional `apps/api/.env`; no root or implicit
production file fallback exists. No file is required for development startup.

Next's existing environment loader remains unchanged, but frontend placeholders
consume no application variables and have no public URL contract. Port/host CLI
arguments stay fixed at 3000/3001 and loopback. No frontend imports backend config.
No DB/cache/provider/session variables are required. Infrastructure and shared
packages remain inert. Tooling inputs SCAN_BASE, NEXT_TELEMETRY_DISABLED, PATH and
ComSpec, plus synthetic test-only markers, are classified in the inventory.

| File                                                                            | Purpose                                                                                   |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `.env.example`                                                                  | Root index, no second configuration contract                                              |
| `apps/api/.env.example`                                                         | Optional local nonsecret port/mode settings                                               |
| `apps/storefront/.env.example`, `apps/admin/.env.example`                       | Comments-only templates and frontend secret boundaries                                    |
| `apps/api/src/config.ts`                                                        | Pure strict API port/mode validation; redacted field-only errors                          |
| `apps/api/src/main.ts`                                                          | Validate before Nest initialization; configurable loopback port and safe failure          |
| `apps/api/package.json`                                                         | Native optional env-file flags for existing dev/start commands                            |
| `scripts/environment.test.mjs`                                                  | Configuration, file precedence, subprocess failure/health/port-conflict tests             |
| `package.json`                                                                  | Include those tests in existing `test`; dependencies unchanged                            |
| `README.md`                                                                     | Link runbook, correct former fixed-API-port wording                                       |
| `docs/development/docker-free-setup.md`                                         | Inventory, precedence, setup, Windows troubleshooting and deferred services               |
| `docs/implementation/CH-P0-006-container-free-decision.md`                      | Dated merge/limited-authority supersession; historical decision and all criteria retained |
| `docs/implementation/approval-register.md`                                      | Exact limited authorization and verified governance merge                                 |
| `docs/implementation/story-tracker.md`, `docs/implementation/task-readiness.md` | Separate limited REVIEW from full-story infrastructure blocker                            |
| `docs/implementation/requirements-traceability.md`                              | Link scoped preparation evidence without claiming business/integration coverage           |
| This report                                                                     | Actual results, limitations and criterion dispositions                                    |

## Local verification

Pinned environment: Node **v24.19.0**, pnpm **11.28.6**. Existing local pnpm resides
in `.tools/node_modules/.bin`; commands prepend that directory to process PATH only.
No global tooling/dependency/version change. Lockfile SHA-256 remains
`70efe7ea3540ac226a5b1fde3c30064d7984f86064de769862933eaada676539`.

| Exact command / method                                                                                                                                                                              | Exit / actual result                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Get-Location`; `git status --short --untracked-files=all`; `git branch --show-current`; `git remote -v`; `git rev-parse HEAD`; `git rev-parse origin/main`; `node --version`; `pnpm.cmd --version` | 0; correct clean existing repository and pins. Starting local head was reviewed 703f7b6; fetched main is the PR #12 merge.                                                                                                                                                                                                                                                |
| `git fetch origin`                                                                                                                                                                                  | 0 with authorized escalation; no main mutation                                                                                                                                                                                                                                                                                                                            |
| `git switch -c chore/CH-P0-006-docker-free-environment origin/main`                                                                                                                                 | 0 with authorized escalation                                                                                                                                                                                                                                                                                                                                              |
| `pnpm.cmd install --frozen-lockfile`                                                                                                                                                                | 0; already up to date, no lockfile/dependency change                                                                                                                                                                                                                                                                                                                      |
| `pnpm.cmd --filter @commercehub/api build`; `node --test scripts/environment.test.mjs`                                                                                                              | 0; 10/10 focused tests passed                                                                                                                                                                                                                                                                                                                                             |
| `pnpm.cmd format:check`                                                                                                                                                                             | Initial 1 for unchanged historical 005 report CRLF; 0 after proving content equality and temporarily using exact HEAD Git bytes. Historical report restored/excluded from delivery.                                                                                                                                                                                       |
| `pnpm.cmd lint`                                                                                                                                                                                     | 0; zero warnings/errors                                                                                                                                                                                                                                                                                                                                                   |
| `pnpm.cmd typecheck`                                                                                                                                                                                | 0; all seven workspaces                                                                                                                                                                                                                                                                                                                                                   |
| `pnpm.cmd build`                                                                                                                                                                                    | 0; all seven workspaces. Repeated after dev smoke because dev regenerates Next output needed by audit.                                                                                                                                                                                                                                                                    |
| `pnpm.cmd test`                                                                                                                                                                                     | 0; 79/79 tests, zero skipped/failed                                                                                                                                                                                                                                                                                                                                       |
| `pnpm.cmd test:quality`                                                                                                                                                                             | 0; 3/3, including real isolated Husky rejection and partial-staging preservation                                                                                                                                                                                                                                                                                          |
| `pnpm.cmd test:ci`                                                                                                                                                                                  | 0; 59/59 workflow/scanner/audit-policy tests                                                                                                                                                                                                                                                                                                                              |
| `pnpm.cmd audit:ci`                                                                                                                                                                                 | Initial sandbox 1: unsupported audit response; bounded raw-command diagnostic timed out. Network-authorized retry reached missing BUILD_ID while rebuild was still finishing. Final retry after completed build: 0; unchanged exact temporary exception, raw full-audit exit 1, zero additional high/critical findings, 172 artifact entries/traces inspected. No bypass. |
| `pnpm.cmd scan:secrets`                                                                                                                                                                             | 0; zero signature findings. Final delivery scan includes all added files. Bounded scanner is not universal secret detection.                                                                                                                                                                                                                                              |
| `git diff --check`; staged `git diff --cached --check`                                                                                                                                              | 0; final tracked/untracked and staged content reviewed before commit                                                                                                                                                                                                                                                                                                      |
| Inline Node documentation assertions                                                                                                                                                                | PASS; local links resolve, 15 AC rows unchanged, 59 story IDs/dependencies/gates preserved; DONE=5/BLOCKED=54, limited REVIEW recorded separately                                                                                                                                                                                                                         |
| `git check-ignore --no-index` for real env paths and examples                                                                                                                                       | Real root/app env paths ignored (0); examples not ignored (1, expected). Existing ignore rules suffice. Examples included in staged review.                                                                                                                                                                                                                               |

Focused tests cover defaults, valid values, missing production PORT, malformed
inputs, redaction, unused future inputs/no endpoint fallback, native missing-file
and shell/file precedence, actual invalid-startup nonzero exits, real API health,
404 behavior and occupied-port failure. Invalid-public-URL tests are **NOT
APPLICABLE**, because no public URL is consumed or required; the test suite checks
the current frontend config/page have no public URL or backend config exposure.
No PostgreSQL/Redis integration or business invariant is proven by these tests.

## Actual local startup and security checks

`pnpm.cmd dev:storefront` and `pnpm.cmd dev:admin` started their own watchers at
127.0.0.1:3000/3001. API `pnpm.cmd dev:api` initially exited 1 inside the sandbox
with tsx `uv_os_get_passwd` ENOMEM; the identical command with authorized execution
outside the sandbox started at 127.0.0.1:3002. Optional `.env` was absent and the
native loader continued; no persistent environment file was created.

`pnpm.cmd test:smoke` exited 0 twice: frontend `/` responses 200 with the expected
placeholder titles, API `GET /health` 200 with exactly `{"status":"ok"}`;
`GET /missing` and `POST /health` 404. All task-owned watchers were stopped. After
rebuild, independent `pnpm.cmd --filter @commercehub/{storefront,admin,api} start`
commands restarted the three listeners; another smoke run exited 0 with the same
five results. Built API startup used the development-mode default, not a deployment
or production connection. Test subprocesses separately verify production-mode
missing-port denial. Task-owned built listeners were then stopped.

Build commands set a **synthetic, nonsecret** CH006_BUNDLE_SENTINEL in process
environment. Inline recursive byte inspection of both `.next/static` trees found
its marker in **zero of 42 built client files**; a dev-output check also inspected
42 files with zero matches. This is scoped canary evidence, not a claim to prove
arbitrary secret noninterference. Source/import checks, template review and bounded
secret scanning supplement it. No backend secrets or real credentials were used.

No UI changed; browser screenshots/accessibility/responsive checks are NOT RUN as
inapplicable to this configuration-only phase. HTTP checks exercise real Node
listeners; no mocked UI success is substituted for persisted integration effects.

## AC-006-01 through AC-006-15

Statuses assess each full criterion at commit time. PASS for documentation or
scope controls does not mean full infrastructure acceptance. No criterion is edited.

| Criterion | Evidence / test command                                                                                | Status  | Remaining work                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------ |
| AC-006-01 | Runbook ownership inventory, templates, source/import review; `pnpm.cmd test`                          | PASS    | Future real secrets belong only to API/trusted workers                               |
| AC-006-02 | Actual independent Node dev listeners and `pnpm.cmd test:smoke`                                        | PASS    | No Docker needed; sandbox watcher limitation recorded                                |
| AC-006-03 | Template/ignore/diff review, `scan:secrets`, 42-file canary check                                      | PASS    | Recheck future integrations; scanner limitations retained                            |
| AC-006-04 | Runbook identifies required target/role/disposal approval; no resource exists                          | BLOCKED | Explicit isolated PostgreSQL identity/roles and forbidden-target checks              |
| AC-006-05 | Compatibility/isolation requirements retained, no distribution chosen                                  | BLOCKED | Approved Redis target and actual BullMQ capability evidence when used                |
| AC-006-06 | Local defaults, dev/built restart and health verified; no migrations                                   | BLOCKED | Approved service bootstrap and bounded connection readiness, repeated                |
| AC-006-07 | `node --test scripts/environment.test.mjs`: missing/malformed config, redaction and occupied port pass | BLOCKED | Unavailable service, bad credentials and TLS failures require approved integrations  |
| AC-006-08 | Unchanged CI/source review shows no production secret/endpoint inputs or connections                   | BLOCKED | Actual forbidden-target validation before future service connections                 |
| AC-006-09 | Runbook distinguishes current tests from future native/hosted/CI isolation mechanisms                  | BLOCKED | Runnable real isolated PostgreSQL/Redis suites with later owning modules/resources   |
| AC-006-10 | `test:ci`, hook tests, audit and unchanged protected workflow/security inputs                          | NOT RUN | New-head required CI evidence is recorded in the PR/final delivery report after push |
| AC-006-11 | Complete diff/execution review; no schema/client/migration/DB integration                              | PASS    | Migration work remains CH-P0-010                                                     |
| AC-006-12 | Application setup/stop/restart/troubleshooting documented                                              | BLOCKED | Chosen approved service runbook: auth/TLS/reset/owned teardown/restart               |
| AC-006-13 | Exact command/outcome/error record in this report                                                      | PASS    | Final PR head/check recorded after actual delivery                                   |
| AC-006-14 | Repeat local app startup from no env files, pinned versions, tests                                     | BLOCKED | Full resource-backed clean bootstrap awaits approved prerequisites                   |
| AC-006-15 | No hosted creation, paid commitment, selection or use; explicit approval boundary                      | PASS    | Separate approval before any later resource operation                                |

All specialist gates remain OPEN, including FIN-01, INV-01, SEC-01, PAY-01,
OPS-01, LEG-01, FIN-02, PAY-LIVE, FIN-01 revision and DB/API/UX/quality reviews.
No policy choice or gate closure is inferred. CH-P0-007 remains BLOCKED/not started.
The 59 story IDs, declared dependency edges and 001-005 DONE evidence are retained.

## Delivery and next action

Deliver only the scoped files above on the implementation branch, with enabled
Husky and a non-force push. Require actual `commercehub-quality` SUCCESS on the PR
head; no workflow/security/exception changes. The advisory expiry remains
2026-11-02T00:00:00Z. Leave the PR open for human review; do not merge.

Deferred PostgreSQL/Redis/provider/disposability decisions need explicit owner
approval and applicable specialist evidence. No Docker/WSL/container operation,
service installation, external provisioning, database/cache connection, schema,
migration, worker, authentication, commerce, Vercel, hosting or deployment change
was performed. Revert the scoped preparation commit through review if needed;
there is no persisted data to roll back. Next action: human review of this limited
phase only, without beginning another story.

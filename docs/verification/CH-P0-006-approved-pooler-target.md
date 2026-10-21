# CH-P0-006 approved Session Pooler target activation

2026-10-21 (Africa/Cairo). **Owner target approval: APPROVED. Code activation:
REVIEW, subject to PR review/merge. Actual TLS/authentication: NOT VERIFIED.
Credential custody: NOT ESTABLISHED. Runtime/migration role separation:
NOT VERIFIED. Full CH-P0-006: BLOCKED.**

## Authority and baseline

[PR #19](https://github.com/ZeyaadAly/CommerceHub/pull/19) verified merged at
`6e96f9554e973edd73cf85a0064047f9a5608ed3`. Fetched origin/main and safely
fast-forwarded local main match. Working tree initially clean. Branch:
`feat/CH-P0-006-approved-pooler-target`. Root/API instructions apply.
Owner authorizes exact allowlist activation, offline tests/docs and Husky
commit/push/open review PR only. No live access or local credential/CA reads.

The owner explicitly confirms this tuple was observed in the designated project's
Dashboard → Connect → Session pooler dialog and explicitly approves it:

| Field                    | Approved value                                                         |
| ------------------------ | ---------------------------------------------------------------------- |
| Organization             | `cjtfuyrqxgkqnyjdpirx`                                                 |
| Project / name           | `uktducdwfzakyoolysvt` / commercehub                                   |
| Environment              | Persistent non-production development, manifest persistent-development |
| Mode / port              | session / 5432                                                         |
| Host                     | `aws-1-eu-central-1.pooler.supabase.com`                               |
| Database / existing role | postgres / postgres                                                    |
| Exact routing username   | `postgres.uktducdwfzakyoolysvt`                                        |

Evidence classification: **owner-observed and owner-approved**, dated 2026-10-21.
Pooler parameters were not independently observed by the agent or management
integration. Approval resolves the tuple's configuration authority without claiming
independent observation or successful connectivity. Earlier
[target-verification record](CH-P0-006-pooler-target-verification.md) remains dated
history; its pending owner confirmation/approval is superseded for this exact tuple.
This is no approval of postgres as a future application runtime privilege model.

Architecture section 7 and DB design sections 1/16 retain backend-only ownership,
TLS and role separation. Existing [designation](../implementation/CH-P0-006-supabase-dev-designation.md),
[readiness](CH-P0-006-postgres-connectivity-readiness.md),
[controlled protocol](CH-P0-006-controlled-connectivity.md), and
[Windows compatibility](CH-P0-006-session-pooler-compatibility.md) remain relevant.
No specialist gate, BA finding or business policy changes.

## Implementation and offline evidence

connectivity.ts replaces null approval with a frozen exact host/user definition.
The existing organization/project digest, commercehub name, environment, session
mode, port 5432, database postgres, exact routing username, manifest-key allowlist
and custody attestation remain required. Different clusters/regions, host suffix
spoofing, arbitrary/wildcard hosts, wrong usernames/project suffixes, unknown
projects/orgs, staging/production/Expense Tracker, transaction pooling, wrong port
or database, SSL overrides and connection URLs are denied by pure validation.
Direct-mode behavior remains unchanged and is asserted offline.

The existing generic synthetic approval/pending-denial tests remain. Production
validation now accepts the approved nonsecret tuple and rejects a forbidden-target
matrix without network access. A new loopback authentication-failure test observes
one connection, no retry and startup-only frames through a bounded post-failure
observation window. Source review confirms a single connect call and no fallback
branch; finite observation is not proof against every hypothetical delayed retry.
All wire fixtures use synthetic credentials on loopback, never provider hosts.

verify-connectivity.ts is unchanged. No SQL messages, Prisma CLI/startup or new
NestJS database startup behavior. TLS chain and exact hostname checks, explicit
trusted CA, TLS 1.2 minimum, traditional SSLRequest, immediate authenticated
termination, finite deadlines, persistent exclusive single-attempt ledger, redacted
errors, ignored backend-only custody and no retries/fallback are preserved.
pg remains pinned 8.23.1; dependencies/lockfile and CI/security controls unchanged.
The live verifier is not executed. No actual target/secret/CA/ledger file is read,
created, deleted or modified. Synthetic fixture certificates are generated locally.

## Verification

Pinned Node 24.19.0/pnpm 11.28.6 used; existing pnpm under
`.tools/node_modules/.bin` added to PATH. No toolchain/dependency change.
No Supabase DNS, TCP, TLS or PostgreSQL authentication probe was performed.

| Command / check                                                        | Actual local result                                                                                                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm.cmd install --frozen-lockfile`                                   | PASS, already up to date                                                                                                                                                 |
| `pnpm.cmd build`                                                       | PASS, all seven workspaces                                                                                                                                               |
| `pnpm.cmd lint`; `pnpm.cmd typecheck`                                  | PASS                                                                                                                                                                     |
| `pnpm.cmd test`                                                        | PASS, 104 tests including 25 verifier tests, zero failures/skips                                                                                                         |
| `pnpm.cmd audit:ci`                                                    | PASS with registry access; existing exact development-only braces exception and expiry retained; no additional high/critical findings                                    |
| `pnpm.cmd format:check`                                                | Raw checkout FAILED unchanged historical CH-P0-005.md CRLF formatting; PASS after normalized equality proof and temporary recorded Git bytes, original checkout restored |
| Explicit new-report Prettier check                                     | PASS                                                                                                                                                                     |
| `pnpm.cmd scan:secrets`                                                | PASS, 124 files, zero bounded signature findings                                                                                                                         |
| `node .verification/ch006-activation-check.cjs`                        | PASS, 101 local links, 59 story rows/dependencies/statuses identical; protocol/CLI, original criteria, gates, CI and lockfile unchanged                                  |
| `git diff --check`                                                     | PASS; scoped tracked/untracked review                                                                                                                                    |
| Real TLS/auth, local target/secret/CA custody, actual grants/isolation | NOT RUN, prohibited                                                                                                                                                      |
| Separate app smoke / UI                                                | NOT RUN, no UI/app behavior changes; existing health/config tests ran with no DB access                                                                                  |

Build/typegen frontend declaration changes restored/excluded before commit.
Husky and required commercehub-quality on the final PR head are recorded in PR
delivery evidence; local checks do not substitute for CI. No CI SUCCESS preclaimed.

## Remaining blockers and next step

Target configuration approval does not establish secure local custody,
endpoint-appropriate CA provenance/validity, actual TLS/authentication, grants,
least privilege, migration/runtime role separation or persistent data isolation.
The pooler terminates shared-host TLS; project routing is a separate binding.
Direct IPv6 reachability and pooler-to-database protections remain unverified.
Any later single live attempt needs separate explicit authorization, reviewed
operator/preservation scope and custody. Never delete/bypass a prior attempt ledger.
No zero-physical-effects claim: a future handshake may cause provider bookkeeping.

Retain PASS AC-006-01/02/03/10/11/13/15 and BLOCKED
AC-006-04/05/06/07/08/09/12/14; new tests are offline partial evidence only.
All 59 story IDs/dependencies and prior acceptance evidence preserved.
CH-P0-001–005 DONE; full 006 BLOCKED; 007 NOT STARTED/readiness BLOCKED.
All [specialist gates](../implementation/gate-register.md) OPEN; Redis/spending
DEFERRED; existing security exception and expiry unchanged; Docker/WSL not required.
Real connection/bootstrap, role/isolation, disposable module-owned integration,
repeat bootstrap, Redis capability/decision and specialist reviews remain blockers.

Next is human review/merge of this code activation PR; no next story starts.
No live connection, database credentials/CA access, SQL, migrations/schema changes,
resource modification, Docker/WSL, Redis/spending, deployment or CH-P0-007 work.
Stop at REVIEW; leave PR OPEN. Rollback is a reviewed source/test/docs revert.

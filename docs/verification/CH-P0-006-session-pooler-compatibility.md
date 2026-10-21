# CH-P0-006 Windows Session Pooler compatibility

2026-10-21 (Africa/Cairo). Implementation: REVIEW. Live connectivity and full
CH-P0-006: BLOCKED. This is offline evidence, not service verification.

## Authority and baseline

Owner authorizes offline implementation/tests and commit/push/open review PR only.
No PostgreSQL DNS/TCP/TLS/authentication probes are authorized in this task.
[PR #17](https://github.com/ZeyaadAly/CommerceHub/pull/17) is verified merged at
`4ec0835fc540976013a7f668ff4050030ccc4bf3`; fetched origin/main and safely
fast-forwarded local main match. Work branch:
`feat/CH-P0-006-session-pooler-support`. Initial working tree was clean.
Root and API instructions apply. This extends the
[controlled verifier](CH-P0-006-controlled-connectivity.md),
[readiness review](CH-P0-006-postgres-connectivity-readiness.md) and
[development designation](../implementation/CH-P0-006-supabase-dev-designation.md).
Architecture database ownership/TLS, DB secret isolation and API backend ownership
remain unchanged; no application API, schema or business-policy contract changes.

## Endpoint assessment and identity evidence

Official [connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres)
reviewed on this date distinguishes direct IPv6 on 5432 from shared Session Pooler
IPv4 on 5432 and transaction pooling on 6543. The cluster index cannot be inferred
from region. Shared routing uses an existing role plus the project reference;
that public format alone does not approve either a hostname or role.
The [changelog](https://supabase.com/changelog) was reviewed for relevant breaking
changes; no applicable authentication/TLS protocol change identified. Markdown
index fetch failed (web content type/local restricted network); HTML review used.

Read-only Supabase `list_projects` reconfirmed `commercehub`, project reference
`uktducdwfzakyoolysvt`, organization `cjtfuyrqxgkqnyjdpirx`, Frankfurt,
and direct host `db.uktducdwfzakyoolysvt.supabase.co`. These nonsecret identity
fields match the existing SHA-256 organization/project binding. The separate
Expense Tracker project is not an eligible target. No credentials were requested.
Available management metadata supplies no Session Pooler hostname or existing
role routing approval. No credential-bearing connection-string endpoint was used.

**Exact owner-approved Session Pooler identity is NOT independently verified.**
Accordingly `approvedSessionPooler` remains null in production authority.
The pure offline seam accepts a separately supplied exact approval for synthetic
tests; the CLI cannot supply or override that approval through manifest or env.
Live Session Pooler targets are rejected before secret-file reads, ledger creation
or network access. Future activation needs separately reviewed nonsecret exact
host/role routing evidence and owner approval through a reviewed code change.
Direct IPv6 reachability remains unverified. No automatic fallback is added.

## Validation and security

Both modeled modes require 5432, postgres database, exact organization/project
digest, CommerceHub name, persistent-development classification, exact manifest
keys and custody attestation. Session mode additionally requires exact approved
host and username plus the matching project suffix and valid existing-role shape.
Unknown projects, Expense Tracker, staging/production, transaction mode, wrong
ports, wildcard/arbitrary hosts, incorrect routing identities and extra SSL/URL
fields fail closed. Ambiguous driver/TLS environment rejection is retained.
No approval is inferred from a hostname pattern or region.

pg remains pinned at 8.23.1; lockfile/dependencies unchanged. Authentication-only
transport and CLI custody code are unchanged: no SQL/ORM/Prisma, immediate
termination at AuthenticationOk, exclusive persistent one-attempt ledger,
finite deadline, no retries, no fallback and redacted results.

TLS retains certificate-chain validation, explicit hostname verification,
TLS 1.2 minimum and no downgrade/bypass. No connection-string SSL override is
accepted. [Supabase TLS guidance](https://supabase.com/docs/guides/platform/ssl-enforcement)
describes verify-full and dashboard CA provenance;
[pg SSL guidance](https://node-postgres.com/features/ssl) warns URL SSL parameters
can replace explicit options. A custodian must independently establish the trust
material for the selected endpoint; a direct endpoint CA must not simply be
assumed valid for the pooler. No actual CA file was retrieved or trusted here.
Pooler TLS identifies the shared endpoint, not the tenant; project routing binding
is separate. Pooler-to-database TLS, actual grants, remote enforcement and data
isolation remain unverified. A future handshake may cause provider bookkeeping;
no zero-physical-effects claim is made.

## Offline verification

Synthetic TLS servers bind loopback only. All client frames are inspected.
Seven new tests cover exact Session Pooler approval and forbidden targets,
production pending denial for the designated project, SCRAM/password success,
authentication rejection/bad proof, and hostname/unrelated valid CA rejection
before Startup. Existing invalid-CA, timeout, no-TLS, premature AuthOK, no SQL,
environment and ledger tests remain intact. Certificates are generated locally;
an unrelated trusted-root PEM additionally tests a parseable but untrusted chain.

No live CLI was invoked. Existing local pnpm 11.28.6 was found under
`.tools/node_modules/.bin` and added to PATH for commands; Node is 24.19.0.
No toolchain/dependency pins changed. Main protection was read back as enabled,
requiring commercehub-quality for everyone (Actions app 15368); no setting changed.

| Command                                                                                | Actual local result                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm.cmd install --frozen-lockfile`                                                   | PASS; already up to date                                                                                                                                                                                   |
| `pnpm.cmd build`                                                                       | PASS; all seven workspaces                                                                                                                                                                                 |
| `pnpm.cmd --filter @commercehub/api build`                                             | PASS after final environment-guard extension                                                                                                                                                               |
| `pnpm.cmd lint`; `pnpm.cmd typecheck`                                                  | PASS                                                                                                                                                                                                       |
| `node --test scripts/connectivity.test.mjs`                                            | PASS; 24 tests, zero failures/skips                                                                                                                                                                        |
| `pnpm.cmd test`                                                                        | PASS; 103 tests, zero failures/skips                                                                                                                                                                       |
| `pnpm.cmd audit:ci`                                                                    | PASS with registry access; existing exact temporary development-only braces exception retained, no additional high/critical findings. Restricted-network run failed unsupported response schema; no bypass |
| `pnpm.cmd format:check`                                                                | PASS with unchanged historical CH-P0-005.md temporarily checked using recorded Git bytes after normalized equality proof, then restored. Raw Windows checkout initially failed that historical file only   |
| Explicit new-report Prettier check                                                     | PASS                                                                                                                                                                                                       |
| `pnpm.cmd scan:secrets`; `git diff --check`                                            | PASS; no signature findings or whitespace errors                                                                                                                                                           |
| `pnpm.cmd test:smoke`                                                                  | FAILED: ECONNREFUSED on loopback 3000 because app servers were not running; no service connectivity conclusion                                                                                             |
| Actual Supabase DNS/TCP/TLS/authentication, Windows custody/CA files, grants/isolation | NOT RUN: offline-only scope; no live files or credentials retrieved                                                                                                                                        |

Build/typegen changes to frontend next-env declarations were restored/excluded.
CI evidence belongs to the PR's final head and is recorded in its delivery report;
local results do not substitute for the required check. UI verification is not
applicable to this backend verifier change.

## BMAD and remaining blockers

Retain PASS AC-006-01/02/03/10/11/13/15 and BLOCKED
AC-006-04/05/06/07/08/09/12/14. New tests add partial offline evidence only.
Original criteria and prior acceptance evidence are unchanged. CH-P0-001–005
remain DONE; full 006 BLOCKED; 007 NOT STARTED/readiness BLOCKED.
All [specialist gates](../implementation/gate-register.md) remain OPEN.
Managed Redis/spending DEFERRED; Redis/BullMQ architecture retained.
No Docker/WSL requirement. Outstanding: exact Session Pooler approval, secure local
custody/CA, separately authorized service authentication, actual role separation,
disposable test resources/isolation, real module-owned integration and repeat
bootstrap evidence, Redis decision/capability and applicable specialist reviews.

No live database access, credentials retrieval, SQL, migrations, schema/role/settings
changes, resource creation, Redis spending, deployment or CH-P0-007 implementation.
Stop at REVIEW; leave PR OPEN, require commercehub-quality SUCCESS and human review.
Rollback is a reviewed source/test/documentation revert; no database effects to undo.

## Delivery blocker

Implementation committed with Husky successfully enabled at
`df595ba369c96b3a4dc978c647aeb4f59a8f1bd0` and pushed to the requested branch.
The GitHub connector rejected PR creation with HTTP 403, Resource not accessible
by integration. No PR was created. Automatic approval review rejected a proposed
fallback using an existing stored GitHub credential for REST access because that
credential extraction/reuse was outside its authorization assessment. The fallback
was not executed and was not bypassed. This is unrelated to database credentials.
Required commercehub-quality for this branch is NOT RUN / pending PR creation;
no CI SUCCESS or complete delivery is claimed. The prepared PR body is retained
locally in ignored `.verification/pr-body.md`. Delivery remains BLOCKED at REVIEW
until PR creation is available through an authorized connection or explicitly
approved fallback; then observe required CI and leave the PR OPEN for review.

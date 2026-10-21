# CH-P0-006 Session Pooler target verification

2026-10-21 follow-up: the owner explicitly confirmed Session dialog/role and
approved the exact tuple. [Activation record](CH-P0-006-approved-pooler-target.md)
supersedes this report's pending owner approval only. Code activation remains
REVIEW; no independent observation, actual TLS/auth or credential custody claimed.
The remainder preserves the earlier target-review evidence as history.

2026-10-21 (Africa/Cairo). **Record: REVIEW. Independent pooler verification: BLOCKED.
Owner endpoint approval: PENDING. Live connectivity/full CH-P0-006: BLOCKED.**

## Baseline and scope

[PR #18](https://github.com/ZeyaadAly/CommerceHub/pull/18) is verified merged at
`89e54c0af51f0a76834686da40ac59752b44f226`. Fetched origin/main and safely
fast-forwarded local main match. Initial working tree was clean. Branch:
`feat/CH-P0-006-pooler-target-verification`. Main protection requires
commercehub-quality for everyone (Actions app 15368); no settings changed.

Owner authorizes noncredential management metadata, official documentation,
offline review/checks and Husky commit/push/open review PR. This task does not
authorize database credentials, database probes or resource modifications.
Root/API AGENTS apply. Relevant authority: architecture section 7 database ownership
and connections, DB design sections 1/16 backend credentials/TLS/role separation,
CH-P0-006 criteria and [OPEN gates](../implementation/gate-register.md), especially
OPS-01. No specialist policy is chosen or gate closed.

Sources: [approved designation](../implementation/CH-P0-006-supabase-dev-designation.md),
[readiness](CH-P0-006-postgres-connectivity-readiness.md),
[controlled verifier](CH-P0-006-controlled-connectivity.md) and
[Windows compatibility](CH-P0-006-session-pooler-compatibility.md).
The previous report's PR-creation blocker is historical: PR #18 has now merged;
that does not verify or approve its pending endpoint.

## Evidence and sanitized approval record

Only project-specific `get_project` and `get_organization` were called for the
designated references. No project inventory or unrelated project was accessed.
Management metadata is not PostgreSQL connectivity or database-content evidence.

| Fact                                          | Value                                     | Evidence classification                                                                         |
| --------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Project / reference                           | commercehub / `uktducdwfzakyoolysvt`      | Provider management verified this task                                                          |
| Organization / reference                      | ZeyaadAly's Org / `cjtfuyrqxgkqnyjdpirx`  | Provider management verified this task                                                          |
| Region / plan                                 | Frankfurt, eu-central-1 / free, tier_free | Provider management verified this task                                                          |
| Environment purpose                           | Persistent non-production development     | Existing owner-approved designation; not inferred from provider status                          |
| Direct host                                   | `db.uktducdwfzakyoolysvt.supabase.co`     | Provider management verified; no DNS/TCP/TLS probe                                              |
| Session Pooler host                           | `aws-1-eu-central-1.pooler.supabase.com`  | Owner reported in response to Dashboard inspection request; not independently observed by agent |
| Session Pooler port / mode                    | Reported: 5432 / required: session        | Port owner reported; explicit Session dialog/mode confirmation pending                          |
| Database                                      | postgres                                  | Owner reported                                                                                  |
| Selected existing role                        | Username role component: postgres         | Parsed from reported username; explicit selected-role confirmation/grants not verified          |
| Exact pooler routing username                 | `postgres.uktducdwfzakyoolysvt`           | Owner reported verbatim; suffix matches designated project; not independently observed          |
| Endpoint owner approval / approver / date     | PENDING / unrecorded / unrecorded         | No approval inferred from designation, metadata or merge                                        |
| Pooler-specific trusted CA source/fingerprint | PENDING                                   | No actual material retrieved or endpoint chain observed                                         |
| Local secret/CA custody                       | Not established by this review            | No live input files opened or secret values retrieved                                           |

The owner supplied these four nonsecret fields during this task, on 2026-10-21;
no URI/password was supplied. This is owner-observed evidence, not explicit
approval or independent agent/provider-management confirmation. The username's
role component is a consistency check, not a recommendation of postgres privileges.
No least-privilege runtime role or grant suitability is accepted by this record.

Project/organization fields match the verifier's existing SHA-256 identity binding.
The production Session Pooler approval remains null. The available integration
exposes project identity/direct host but no tool for sanitized pooler parameters.
Credential-bearing connection-string or API-key endpoints were not called.

## Minimum owner action and follow-up approval

1. The owner has supplied host/port/database/user. Confirm those exact values were
   displayed under Session pooler for this project and selected role postgres.
   Original procedure: open the project in the authenticated Dashboard. Confirm
   project reference and organization above, then choose **Connect → Session pooler**.
2. Inspect the separate parameters locally. Record only exact hostname, numeric
   port, displayed session mode, database, selected existing role and exact routing
   username, plus observation date/source. Do not reveal/reset a password, fill in
   a password placeholder, copy a complete URI, or share keys or credential images.
3. Confirm port 5432 and database postgres, and compare the displayed routing
   suffix with the designated project reference. Official docs describe a custom
   role routing form, but that format does not establish the selected existing role.
   Do not create a role or inspect grants for this task.
4. Review the supplied nonsecret fields above. A direct owner observation is
   recorded as owner-observed provider display, not agent-independent verification.
   Record any independently reviewable sanitized provider evidence separately.
5. After exact values and provenance are reviewed, obtain explicit owner approval
   of that specific host/mode/port/database/role/routing identity/project/org tuple.
   Approval of the tuple does not authorize authentication or credential use.

Proposed approval tuple: organization `cjtfuyrqxgkqnyjdpirx`, project
`uktducdwfzakyoolysvt`, persistent development, session,
`aws-1-eu-central-1.pooler.supabase.com:5432`, database postgres,
role postgres, routing username `postgres.uktducdwfzakyoolysvt`.
Approval remains PENDING. Independent evidence remains BLOCKED; the allowlist
is not changed solely because the owner supplied these values.

[Supabase connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres)
identifies the Connect dialog as the source and explicitly warns that a region
can have multiple pooler cluster indexes. It documents Session Pooler on IPv4,
5432, and project-suffixed routing; transaction mode on 6543 is ineligible here.
Direct IPv6 reachability remains unverified. No automatic endpoint fallback.

## TLS and local trust procedure

[Supabase SSL guidance](https://supabase.com/docs/guides/platform/ssl-enforcement)
documents verify-full, CA plus hostname verification, and the dashboard's
Database Settings → SSL Configuration as the public CA download source.
It includes a pooler example but does not prove which CA signs this unobserved
endpoint today. Direct and shared pooler terminate TLS at different endpoints;
do not assume direct endpoint trust material is suitable for the pooler.

Before later live authorization, a designated custodian must obtain the public
CA from authenticated provider guidance for the exact endpoint. If the dashboard
does not establish its applicability to the selected pooler, obtain provider
confirmation of that endpoint's trust chain. Do not collect an unverified peer
certificate through a forbidden probe or trust a certificate merely because it
was presented. Record public source, SHA-256 fingerprint, issuer and validity;
keep trust selection pending when provenance/applicability is unresolved.

After independently establishing provenance, a future custodian can save only
the required public PEM certificate to ignored API-local
`apps/api/.env.connectivity-ca.pem`, first verifying Git ignore and restrictive
Windows ACL custody (operator, SYSTEM, local Administrators). No private keys or
client certificates are required by this verifier. Do not modify machine/global
trust stores or Supabase TLS enforcement. Download/storage steps were NOT RUN here.
Target and secret files remain separately controlled; no credentials belong in
chat, shell arguments, tracked examples or frontend/Next.js environments.

[pg SSL documentation](https://node-postgres.com/features/ssl) supports explicit
Node TLS options and warns that URI SSL parameters can replace the SSL object.
Existing pg 8.23.1/Node 24.19.0 verifier options are retained: traditional PostgreSQL
SSLRequest negotiation, explicit ca, rejectUnauthorized true, minimum TLS 1.2,
SNI for the exact hostname, checkServerIdentity, and channel binding enabled when
offered. No connection string or environment SSL override is accepted.
Offline tests validate driver compatibility, not this provider endpoint.
Shared-host TLS identity does not identify a tenant; exact project routing is
also required. Pooler-to-DB protection, actual grants and remote TLS enforcement
remain unverified. No TLS setting was read or changed through management APIs.

Official changelog HTML was reviewed for relevant breaking changes; none requiring
a change to this verifier was identified. The markdown index fetch was attempted
but rejected by the web reader's content-type support. API-domain TLS guidance is
not substituted for PostgreSQL/pooler guidance.

## Existing verifier and offline checks

Reviewed connectivity.ts, verify-connectivity.ts and every protocol test. No code
or test extension is necessary for this evidence-only task. Production approval
is still null; target checks precede secret/CA reads, ledger claim and sockets.
Explicit startup/authentication/Terminate wire frames, immediate disconnect,
finite deadline, exclusive ledger, backend-only custody, redacted errors and no
retry/fallback are retained. No SQL/Prisma initialization or dependency changes.
Synthetic loopback tests cover correct approval, wrong project/org/host/user,
missing approval, transaction/wrong-port/production/staging/Expense Tracker denial,
untrusted CA/hostname failures, no query frames and authentication/error redaction.
Code review confirms one connect call and no alternate endpoint/retry path;
synthetic tests do not establish remote behavior or actual resource isolation.

All protocol fixtures use synthetic credentials and loopback; no live CLI
invocation or Supabase probe. Pinned Node 24.19.0 and existing pnpm 11.28.6 used
through `.tools/node_modules/.bin` on PATH; no tools installed.

| Command / check                                                    | Actual result                                                                                                                                                                           |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm.cmd install --frozen-lockfile`                               | PASS, already up to date                                                                                                                                                                |
| `pnpm.cmd build`                                                   | PASS, seven workspace builds                                                                                                                                                            |
| `pnpm.cmd lint`                                                    | PASS                                                                                                                                                                                    |
| `pnpm.cmd typecheck`                                               | PASS, seven workspaces                                                                                                                                                                  |
| `pnpm.cmd test`                                                    | PASS, 103 tests including 24 verifier tests, zero failures/skips                                                                                                                        |
| `pnpm.cmd audit:ci`                                                | PASS with registry access; existing exact development-only braces exception retained, no additional high/critical findings                                                              |
| `pnpm.cmd format:check`                                            | Raw Windows checkout FAILED unchanged historical CH-P0-005.md CRLF formatting; PASS using its recorded Git bytes after normalized equality proof, then original checkout bytes restored |
| Explicit report `prettier --check --ignore-path .gitignore`        | PASS after scoped formatting                                                                                                                                                            |
| `pnpm.cmd scan:secrets`                                            | PASS, 123 files, zero bounded signature findings                                                                                                                                        |
| `node .verification/ch006-target-check.cjs`                        | PASS, 91 local links; all 59 story rows/dependencies/statuses identical; original criteria, code/tests, lockfile, CI and gate register unchanged                                        |
| `git diff --check`                                                 | PASS; tracked/untracked scoped review                                                                                                                                                   |
| Live PostgreSQL / actual endpoint TLS / local secret or CA custody | NOT RUN, prohibited by this task                                                                                                                                                        |
| App smoke / UI                                                     | NOT RUN, documentation-only target review; no app or UI changes                                                                                                                         |

Generated frontend next-env declarations are restored/excluded before commit.
Existing exception identity and expiry are unchanged. Husky and PR-head CI results
are recorded during delivery; no CI SUCCESS is inferred from local checks.

## Governance and later live attempt

Retain PASS AC-006-01/02/03/10/11/13/15 and BLOCKED
AC-006-04/05/06/07/08/09/12/14. CH-P0-001–005 DONE, full 006 BLOCKED,
007 NOT STARTED/readiness BLOCKED, all 59 story IDs/dependencies unchanged,
all specialist gates OPEN, managed Redis/spending DEFERRED. Existing security
exception and expiry unchanged. Docker/WSL not required or used.

Before a later single live authentication attempt: exact target evidence plus
explicit endpoint approval and reviewed allowlist update; named operator and
preservation authority; separately authorized existing credential use; secure
target/secret/endpoint-appropriate CA custody; current gate/scope review; and
explicit single-attempt authorization. Preserve any existing ledger, never delete
or bypass it to retry. Keep query-free transport and immediate disconnect; no
SQL, migrations, grants or resource modifications. A handshake may cause provider
bookkeeping and proves neither least privilege nor unchanged database contents.

Remaining full-story blockers include real connection/bootstrap/role isolation,
disposable resources and real module-owned integration, repeat bootstrap, Redis
capability/decision and specialist reviews. This report resolves none by inference.
No database credentials, live PostgreSQL, SQL, migrations/schema changes,
Supabase resource modifications, Docker/WSL, Redis provisioning/spending,
deployment or CH-P0-007 implementation occurred. Stop at REVIEW.

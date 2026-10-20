# CH-P0-006 controlled PostgreSQL connectivity verifier

2026-10-20 (Africa/Cairo). **Implementation delivery: REVIEW. Live verification:
BLOCKED before DNS/socket creation. Full CH-P0-006: BLOCKED, not DONE.**

## Authority and baseline

The owner request, "Controlled PostgreSQL Connectivity Verification", authorizes a
narrow verifier, offline negative tests and at most one bounded authentication-only
connection to the designated persistent development database. It does not authorize
SQL, inspection, roles/grants, migrations, seed/reset, settings/resources, Redis,
spending, deployment, merge or CH-P0-007. All specialist gates remain OPEN.

[PR #16](https://github.com/ZeyaadAly/CommerceHub/pull/16) is verified merged at
`0b88e1596e5dd2f0547a804b0eff0cbb43ac6581`; fetched origin/main and safely
fast-forwarded local main match. Branch:
`feat/CH-P0-006-postgres-connectivity-verifier`. Initial checkout was clean.
Root and [API AGENTS](../../apps/api/AGENTS.md) apply. Planning sources:
[architecture](../04-architecture.md), [database design](../05-database-design.md),
[API](../06-api-design.md), [plan](../07-implementation-plan.md),
[backlog](../08-epics-and-stories.md), [criteria](../implementation/CH-P0-006-container-free-decision.md),
[designation](../implementation/CH-P0-006-supabase-dev-designation.md),
[infrastructure proposal](../implementation/CH-P0-006-infrastructure-proposal.md),
[readiness report](CH-P0-006-postgres-connectivity-readiness.md) and
[OPEN gate register](../implementation/gate-register.md).
This authorization supersedes earlier planning-only restrictions for this slice only.

Read-only get_project for the previously designated reference and get_organization
confirm commercehub belongs to ZeyaadAly's Org, the same exact project/organization,
and its direct hostname. No other project was contacted. Empty state remains an
owner attestation; roles, contents, consumers and preservation safety were not queried.
No credentials or connection string were returned/requested. A nonsecret SHA-256
identity digest binds the CLI to that exact project and organization without
publishing routing usernames or live endpoint values in this report.

## Design and dependency review

No existing approved dependency provided PostgreSQL authentication. Rather than
implement cryptography, add exact API dependency **pg 8.23.1** and development types
**@types/pg 8.23.1**, verified against the registry's stable dist-tag and Node >=16
engine range. Pinned Node 24.19.0/pnpm 11.28.6 are retained. Lockfile adds those
packages and 13 runtime/transitive entries without upgrading existing dependencies.
No Prisma, Supabase SDK, ORM, native driver, framework or service is added.
The mandatory audit passes with no additional high/critical findings; the exact
existing development-only braces exception remains unchanged, not remediated.

Reviewed installed pg client.js (_connect, getStartupConf, authentication handlers,
end), connection.js (TLS upgrade, startup, password/SASL send, Terminate) and
connection-parameters.js (environment fallback). Relevant upstream sources:
[pg release source](https://github.com/brianc/node-postgres/tree/pg%408.23.1/packages/pg),
[PostgreSQL protocol flow](https://www.postgresql.org/docs/17/protocol-flow.html),
[message formats](https://www.postgresql.org/docs/17/protocol-message-formats.html),
[driver TLS guidance](https://node-postgres.com/features/ssl) and
[Supabase connections](https://supabase.com/docs/guides/database/connecting-to-postgres).
Supabase changelog HTML was checked after the markdown endpoint was unsupported.

The verifier overrides startup parameters to user/database only; the serializer
adds client_encoding. It never calls query, and disables the client query entry.
The internal send boundary permits password/SASL responses only; startup and
Terminate use separately reviewed driver paths. At AuthenticationOk it immediately
sends Terminate and waits for closure, without waiting for ReadyForQuery or sending
SQL. An actual TLS-authorized socket and prior authentication challenge are required.
No pools, retries, fallback, ORM initialization, replication or application hooks.
Pinned internal APIs require renewed source/wire review on any future upgrade.

Loopback fixtures inspect every decrypted client frame, including SCRAM proof,
and deliberately omit ReadyForQuery. Successful transcripts are SSLRequest,
Startup, authentication response(s), Terminate only. Real local TLS fixtures test
CA and hostname denial. The existing OpenSSL executable generates temporary
synthetic one-day test certificates/keys; these never enter Git or connect to a
database. CI's existing Ubuntu runner supplies OpenSSL; no CI policy is weakened.

## Target, TLS and secret boundaries

The executable CLI accepts only --live-once and fixed ignored API-local paths.
An exact-key manifest must match the pinned organization/project digest,
commercehub, persistent-development, direct mode, exact project-derived hostname,
5432, postgres database and an explicit existing role. Unknown fields, URL
overrides, pooler routing, wildcard/other hosts and foreign environments fail closed.
No DNS/socket is created until this validation and local custody checks finish.
Synthetic positive/negative manifest tests use a separate pure validation seam;
the executable always uses the pinned identity validator.

**Scope limitation:** only the direct endpoint could be confirmed by management
metadata. Session Pooler remains the recommended future Windows IPv4 path, but
needs independently approved exact endpoint and routing identity before support
is added. No guessed pooler hostname and no paid IPv4 add-on/fallback. Direct IPv6
reachability is unverified; Windows network compatibility is not claimed.

TLS requires explicit CA material, valid CA dates, rejectUnauthorized=true,
Node's hostname check and TLS >=1.2; no URL flags can replace SSL options.
Inherited PG*, database URLs, TLS overrides, preload options and debug variables
are rejected. One 10-second overall/connect/authentication/cleanup bound is a
local probe limit, not an OPS-01 service target. Failure destroys the socket;
the CLI prints only an allowlisted status/code, no driver message/cause/stack,
URL, username, password or server error payload.

Only an owner-designated custodian may populate these ignored files:

- `apps/api/.env.connectivity-target.json`: exact reviewed manifest.
- `apps/api/.env.connectivity-secret.json`: matching existing user and password only.
- `apps/api/.env.connectivity-ca.pem`: independently trusted provider CA material.

[Fake configuration shapes](../../apps/api/connectivity.example.json) are never
populated with real values. The CLI verifies git check-ignore for every input,
regular-file/no-symlink/size limits, restrictive POSIX modes or Windows ACL allowlist
(current operator, SYSTEM, local Administrators). custodyReviewed is an operator
attestation, not a cryptographic signature. No permission/ACL is changed. Ancestor
directories and the local operator must also be trusted; this does not defend
against a malicious user who can rewrite the verifier or its local files.
No app startup loads these files. No browser/Next.js access or migration credential
inheritance; no settings, role creation/rotation or grants.

An exclusive ignored `.env.connectivity-attempted` ledger is created before network
access and never automatically removed, even after failure. Concurrent/repeated
claims are denied. Do not delete it or retry without renewed explicit authorization.
This is an accidental-retry safeguard, not protection against a malicious operator.

## Observed live outcome and remaining procedure

Ran `node apps/api/dist/verify-connectivity.js --live-once` once after offline
review. **Exit 1: BLOCKED / LOCAL_CUSTODY_OR_TARGET.** The three input files were
absent, so the CLI stopped at local preflight: no database credential retrieved,
no database DNS/TCP/TLS/authentication attempt, no attempt ledger created.
The authorized live-attempt allowance was not consumed. No invalid credentials
were tried against Supabase. A management API request is not PostgreSQL access.

Before any eventual live attempt, the custodian must establish private local
custody, trusted CA source, exact existing identity and preservation authority.
Provide no password through chat, prompts, shell arguments or tracked examples.
If direct IPv6 cannot be used, stop; separately review the exact Session Pooler
allowlist/identity and tests. No endpoint fallback. Reassess task authorization and
the current reviewed verifier before running; never turn this into automated CI
or NestJS bootstrap. A result can prove only authentication and verified TLS to
the approved endpoint, not role least privilege, schema readiness or data isolation.
No SQL is permitted. Provider logs/session bookkeeping can occur during a future
handshake; "no intentional mutation/no application SQL" does not mean zero
physical changes or independently verified unchanged contents.

## Acceptance and delivery

Retain prior statuses: PASS AC-006-01/02/03/10/11/13/15; BLOCKED
AC-006-04/05/06/07/08/09/12/14. Offline tests supply partial evidence for 07/08;
they do not prove live authentication, actual roles, CI target isolation, repeat
bootstrap, real module-owned integration or full acceptance. Original 15 criteria
are unchanged. CH-P0-001-005 DONE; full 006 BLOCKED; CH-P0-007 NOT STARTED
(tracker readiness BLOCKED). All specialist gates OPEN; Redis/BullMQ architecture
retained, managed Redis/spending DEFERRED. No Docker/WSL requirement or operation.

| Local validation                                                                                        | Actual result                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frozen install, strict typecheck, all seven workspace builds, lint                                      | PASS on pinned Node 24.19.0/pnpm 11.28.6                                                                                                                                                 |
| Existing/full test run                                                                                  | PASS: final 95 tests, including all 16 offline verifier cases; zero failures/skips                                                                                                       |
| pnpm.cmd audit:ci                                                                                       | PASS with registry access; restricted-network attempt failed unsupported response schema, without bypass; unchanged approved braces exception only                                       |
| pnpm.cmd format:check                                                                                   | PASS after proving unchanged CH-P0-005.md normalized equality and temporarily checking its recorded Git bytes; initial CRLF checkout failure retained, historical file restored/excluded |
| Explicit report Prettier check                                                                          | PASS                                                                                                                                                                                     |
| pnpm.cmd scan:secrets                                                                                   | PASS: 121 files, zero findings within scanner coverage                                                                                                                                   |
| Link/governance assertions and git diff --check                                                         | PASS: 92 local links, 59 stories, five DONE/54 BLOCKED, dependencies/original criteria/gates/CI/exception unchanged                                                                      |
| Live auth/TLS, direct network reachability, real grants/isolation, database content/mutation inspection | NOT RUN: local custody inputs absent; database operations prohibited beyond the conditional single authentication attempt                                                                |
| Actual Windows input-file ACL/CA validation                                                             | NOT RUN: files absent; no live custody claim                                                                                                                                             |

Required PR CI results are recorded in delivery evidence. No merge
or full-story acceptance is implied. Rollback removes this standalone verifier and
its dependencies through a reviewed revert; there are no database effects to undo.

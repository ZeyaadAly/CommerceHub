# CH-P0-006 PostgreSQL connectivity readiness

2026-10-20 (Africa/Cairo). **REVIEW: planning only. Full CH-P0-006 BLOCKED.**
No database credential retrieval, connection, DNS/TCP probe, SQL or resource
operation is authorized or performed by this task.

## Verified baseline and authority

[PR #15](https://github.com/ZeyaadAly/CommerceHub/pull/15) merged at
`3d23052205af7dfe5927cc7fc431c42a8085dbe3` on 2026-10-20T12:34:52Z.
Fetched origin/main and safely fast-forwarded local main match that SHA.
GitHub reports main protected, with commercehub-quality required for everyone,
bound to Actions app 15368. No protection or CI setting changed.
Branch: `docs/CH-P0-006-postgres-connectivity-readiness`.

Root AGENTS applies; there are no nested documentation instructions.
Sources: [architecture](../04-architecture.md), [database design](../05-database-design.md),
[implementation plan](../07-implementation-plan.md), [backlog](../08-epics-and-stories.md),
[15 measurable criteria](../implementation/CH-P0-006-container-free-decision.md),
[approved development designation](../implementation/CH-P0-006-supabase-dev-designation.md),
[gate register](../implementation/gate-register.md) and
[limited implementation evidence](CH-P0-006-limited.md).
PR #15 integrates the designation, not technical security verification.
Earlier dated delivery snapshots remain history.

## Recommended connection strategy - unverified

For the long-running Windows NestJS process, recommend **Supabase Session Pooler
on port 5432 when IPv4 is needed**. Direct PostgreSQL on port 5432 is suitable
when working IPv6 is separately verified; direct IPv4 normally needs a paid
add-on, which is not authorized. Windows alone does not establish IPv6 availability.
No endpoint, route, project setting or capacity was inspected here.
Do not automatically switch endpoints, environments or TLS modes after failure.

[Supabase connection documentation](https://supabase.com/docs/guides/database/connecting-to-postgres)
distinguishes these paths and transaction pooling on 6543. Transaction mode is not
recommended for this persistent development process; prepared-statement/session
constraints require separate compatibility review.
[Supabase's Prisma guide](https://supabase.com/docs/guides/database/prisma)
supports Session mode for server-based runtime and migration connections, with
direct as an IPv6 alternative. This does not approve migrations here.

Prisma remains the approved ORM; no Prisma/driver dependency is installed or
selected by this report. A later authorized implementation must pin supported
Node/Prisma/adapter/driver versions, verify their session/prepared-statement and TLS
behavior and configure CLI and runtime independently. A session-capable endpoint
may be shared, but credentials and authority must not be: runtime gets reviewed
least privilege without schema/role creation, ownership or migration authority;
migration credentials are separately controlled and absent from ordinary startup.
Do not copy the provider tutorial's broad role grants. Shadow databases,
introspection, db push, seed, migrate and reset require separate authorization,
reviewed SQL and applicable DB-0/DB-01 evidence in their owning stories.

## TLS, timeouts and secret custody

Require encrypted PostgreSQL transport, trusted CA chain and exact endpoint
hostname validation, equivalent to verify-full. Encryption-only require is
insufficient evidence of server identity. Use the provider-documented trust
material for the selected endpoint; record its source and validity outside
credential-bearing evidence. Never disable certificate validation, override
hostname checks, set NODE_TLS_REJECT_UNAUTHORIZED=0 or fall back to plaintext.
The selected driver's options must be tested, not inferred from a URL flag.
[node-postgres TLS guidance](https://node-postgres.com/features/ssl) warns that
connection-string SSL options can replace the explicit SSL object; review the
effective configuration and reject conflicting settings. Pooler TLS authenticates
the pooler endpoint, not a unique project tenant. Provider-side TLS enforcement
and pooler-to-database protections remain unverified and need separate review.

Future connect, pool-acquisition and overall probe deadlines must be finite and
explicit; future query deadlines are a separate runtime concern. Numeric bounds
and pool sizes remain review inputs, not approved OPS-01 targets. Use one bounded
attempt per approved case, clean up sockets/pools on success and failure, and
fail closed on DNS, timeout, TLS, target or authentication failure. No background
retry, automatic production fallback or liveness-success claim for DB readiness.

Only the owner-designated backend secret custodian may later populate ignored
`apps/api/.env` or approved protected backend runtime configuration, with restrictive
local file access. Verify Git ignore before writing; never stage actual values.
No secret is requested now, including URLs, passwords, API/service-role keys or
production credentials. No credentials in documentation, prompts, fixtures,
shell arguments/history, frontend environments or Next.js public variables.
Next.js server code also receives no database credentials; all business access
goes through NestJS/trusted backend domain services.

Keep migration secrets outside routine API configuration; CI integration tests
must use separately approved disposable identities, never persistent development
credentials. Examples remain fake. Scanner checks remain mandatory.
Log only allowlisted error categories/codes and a safe case identifier; suppress
credential-bearing URLs, usernames, raw exceptions, nested causes and stacks that
could expose configuration. Review rotation/revocation ownership separately;
no secrets or environment contracts are added by this report.

## Target isolation - required future safeguards

Before creating any network client, require a separately approved target manifest:
exact organization/project reference mapped to commercehub in ZeyaadAly's Org,
persistent-development classification, selected endpoint/mode/port, database and
role identity, trusted CA and permitted operation (connectivity only).
The custodian compares these to authoritative owner-approved provider metadata,
without copying credentials to review evidence. No live identifiers are fetched
or published here. Display names and region alone are insufficient.

Fail closed for absent/mismatched metadata, inherited ambiguous environment
values, production, staging, Expense Tracker and disposable integration-test
targets. A shared pooler hostname is insufficient: validate the project-specific
routing identity as well. Never accept an arbitrary URL override or reuse a
production/staging/test secret. Negative target fixtures must be rejected locally
before DNS or socket creation. These are design requirements, not implemented guards.

Persistent development must never be the default reset/cleanup/shadow target.
Integration tests need independent positive disposability and cleanup approval.
No startup migration, automatic reset, schema bootstrap or database fallback.
Remaining ownership/dependency/preservation uncertainty must be resolved before
future access; reported emptiness is still an owner attestation.

## Future procedure - separate authorization required; ALL NOT RUN

1. Obtain an explicit, bounded authorization naming target, custodian, client
   version, permitted authentication-only operations, case/attempt limits and
   deadlines. Resolve preservation concerns and review existing role permissions;
   role inspection/creation and any SQL require their own scope.
2. Have the custodian verify exact identity and locally supply only necessary
   credentials through ignored backend configuration. Confirm no frontend or
   migration credential inheritance. Run local target guards against all forbidden
   fixtures without opening sockets; inspect secret-safe output.
3. Review the proposed verifier before execution: protocol/TLS/authentication and
   disconnect only, no SQL messages, startup hooks or ORM initialization that
   implicitly queries. Do not use Prisma CLI, application bootstrap or health
   probes as a query-free verifier without proving their behavior.
4. On the approved target only, perform one bounded authenticated handshake with
   CA and hostname validation, capture sanitized TLS validation outcome and close.
   Verify wrong-host/untrusted-CA denial with controlled local fixtures, never by
   weakening validation or connecting to another real project.
5. With separate negative-case permission, make one deliberately invalid-password
   attempt to the same approved target; do not rotate the real password, retry
   repeatedly or print either value. Require authentication failure without
   fallback. Stop on unexpected success.
6. Exercise DNS/connect/handshake deadlines using controlled local fault fixtures.
   Confirm bounded termination, cleanup and redaction, including nested errors.
   Never probe forbidden real targets to test denial.
7. Retain reviewed verifier/command evidence showing no query or mutation path,
   sanitized outcomes and operator attestation. Do not infer absence of writes
   from a successful handshake alone. Provider session/log/statistics bookkeeping
   may occur; zero physical changes cannot be promised. Any independent
   schema/data comparison, catalog SQL or audit-log retrieval needs separate
   authorization; absent that evidence, report the no-mutation assurance limit.

No step above has been executed. Authenticated connectivity, project routing,
effective grants, TLS enforcement, error behavior and isolation remain unverified.

## Acceptance and governance

Statuses retain merged limited-phase evidence; planning creates no new PASS.

| Criterion | Status  | Remaining boundary                                                              |
| --------- | ------- | ------------------------------------------------------------------------------- |
| AC-006-01 | PASS    | Existing backend ownership evidence retained; future credentials unverified     |
| AC-006-02 | PASS    | Existing Docker-free Node startup evidence retained                             |
| AC-006-03 | PASS    | Existing safe examples/ignore/scan/redaction evidence retained                  |
| AC-006-04 | BLOCKED | Actual roles, identity guards and resource isolation unverified                 |
| AC-006-05 | BLOCKED | Managed Redis deferred; no runtime verification                                 |
| AC-006-06 | BLOCKED | Resource-backed bootstrap/connectivity NOT RUN                                  |
| AC-006-07 | BLOCKED | Auth/TLS/service failure verification NOT RUN                                   |
| AC-006-08 | BLOCKED | Executable forbidden-target guard not implemented/verified                      |
| AC-006-09 | BLOCKED | Real isolated integration resources/suites absent                               |
| AC-006-10 | PASS    | Existing protected CI evidence retained; this PR needs its own successful check |
| AC-006-11 | PASS    | Existing ownership/contracts retained; no business policy selected              |
| AC-006-12 | BLOCKED | Network/bootstrap evidence and executable runbook absent                        |
| AC-006-13 | PASS    | Existing scope/gate preservation evidence retained                              |
| AC-006-14 | BLOCKED | Full acceptance, infrastructure proof, human review and integration outstanding |
| AC-006-15 | PASS    | Existing history/traceability retained; this report is REVIEW                   |

CH-P0-001-005 remain DONE; full CH-P0-006 BLOCKED, not DONE.
CH-P0-007 remains NOT STARTED (tracker readiness BLOCKED); no implementation.
All specialist gates remain OPEN, including SEC-01 and OPS-01; no gate closure.
Redis/BullMQ remains in the architecture; managed Redis and spending DEFERRED.
Docker/WSL remains optional. No dependencies, lockfile, application code,
environment files, CI, advisory exceptions or specialist register changes.

## Local validation and delivery

Local pinned Node 24.19.0 / pnpm 11.28.6 tooling was reused; no install or upgrade.

| Check                                                  | Actual result                                                                                                                                                                                   |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pnpm.cmd format:check                                  | PASS using exact recorded bytes for unchanged CH-P0-005.md after proving normalized equality; initial checkout CRLF failure retained here. Historical file restored and excluded from delivery. |
| Explicit Prettier check of this report                 | PASS; report formatted explicitly because repository ignore rules exclude new verification reports                                                                                              |
| pnpm.cmd scan:secrets                                  | PASS: 116 files, zero findings within existing scanner coverage                                                                                                                                 |
| Documentation links and governance assertions          | PASS: 85 local links; 59 stories, five DONE and 54 BLOCKED; all dependencies, original 15 criteria and gate register unchanged                                                                  |
| git diff --check                                       | PASS                                                                                                                                                                                            |
| Local lint/typecheck/build/application tests           | NOT RUN: documentation-only changes; unchanged full required CI must run on the PR                                                                                                              |
| PostgreSQL, TLS, credential and integration procedures | NOT RUN: explicitly excluded; no infrastructure acceptance inferred                                                                                                                             |

Commit/push/open PR and
required head-specific commercehub-quality success are authorized; merge is not.
Final head, CI URL and conclusion belong in the PR delivery evidence.

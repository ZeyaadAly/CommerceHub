# CH-P0-006 infrastructure approval proposal

Date: 2026-10-20 (Africa/Cairo). **PROPOSED - owner decision pending.** This is
read-only provider discovery plus documentation, not an approved ADR, service
order, spending authorization or integration implementation. OPS-01 and every
other specialist gate remain OPEN. No production architecture or story edge changes.

## Decision requested

Prefer a dedicated, non-production **Supabase Free PostgreSQL** development project,
conditional on verified quota and explicit target designation. Prefer **paid Redis
Cloud Essentials**, single-region TCP/TLS, no eviction and persistence, only after
an exact regional quote and owner budget approval. These are recommendations,
not selections already authorized. With no spending approval, Redis stays blocked.
Native PostgreSQL is the Docker-free fallback if Supabase eligibility cannot be
resolved. No third PostgreSQL host is needed for this checkpoint.

Already approved: Docker-free Windows development, Node Next.js/NestJS processes,
PostgreSQL/Prisma, Redis/BullMQ when phase needs it, backend-only credentials and
real isolated tests. [PR #13](https://github.com/ZeyaadAly/CommerceHub/pull/13) merged
the limited environment phase; the full CH-P0-006 story remains BLOCKED, not DONE.
[Verification](../verification/CH-P0-006-infrastructure-checkpoint.md) records merge,
protection, metadata-only inventory and documentation checks. Earlier
[decision](CH-P0-006-container-free-decision.md) and all 15 criteria remain intact.
This story-scoped proposal does not consume reserved ADR-010/011 identifiers or
start CH-P0-008.

## PostgreSQL evidence and comparison

Official sources were checked on the date above. USD list prices exclude taxes,
FX, optional add-ons and future changes. No invoice/usage estimate is a binding
quote. Refresh eligibility, prices, version and regional capacity before any
separately authorized action.

| Option                         | Verified cost/quota and version                                                                                                                                                                                                                                                                                                                   | Prisma/connection implications                                                                                                                                                                                                                                                                            | Isolation, lifecycle and tradeoffs                                                                                                                                                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A. Dedicated Supabase Free dev | $0/month, 500 MB database/project; 5 GB egress allowance, shared across the organization; two active Free projects across qualifying owner/admin organizations. Free pauses after one inactive week; no automatic backups, PITR or branching. Visible candidates currently use PostgreSQL 17.11; new-project version is not attested.             | PostgreSQL 17 is supported by the published Prisma v7 matrix; no Prisma version is installed/chosen here. Direct 5432 normally needs IPv6; Session pooler 5432 offers IPv4. Transaction pooler 6543 has prepared-statement restrictions. Validate future driver/version and separate migration authority. | Dedicated project, synthetic data only. No destructive tests on a persistent development project. Free pause/size limits and absent backup guarantees make it unsuitable for production/recovery acceptance. Owner must approve target, access and any reset separately. |
| B. Native Windows PostgreSQL   | PostgreSQL software licence has no fee; disk, RAM, electricity, administration and backup have local cost. No hosted free-tier quota; capacity is bounded by hardware and configured connections. Official Windows installers include supported majors 17/18; propose supported 17.x to align with observed hosted major, not an exact patch pin. | Standard PostgreSQL protocol; direct loopback connection, no pooler required for a small dev process. Same future Prisma compatibility review. Separate non-superuser runtime and migration/test roles; a separate approved shadow DB if migration tooling requires one.                                  | Separate dev and disposable-test databases/roles; service/data-directory ownership, disk encryption and backup/teardown responsibility must be approved. No Docker/WSL. Installation/admin permission and patching are separate work; no installer or service run here.  |
| C. Other isolated hosting      | Not needed or selected: A plus B cover this decision.                                                                                                                                                                                                                                                                                             | No new provider/driver contract proposed.                                                                                                                                                                                                                                                                 | Reopen comparison only if owner rejects A/B or their prerequisites cannot be met; do not silently choose another cloud.                                                                                                                                                  |

Sources: [Supabase pricing](https://supabase.com/pricing),
[billing/quota scope](https://supabase.com/docs/guides/platform/billing-on-supabase),
[connection modes](https://supabase.com/docs/guides/database/connecting-to-postgres),
[Prisma guidance](https://supabase.com/docs/guides/database/prisma),
[Prisma v7 supported databases](https://www.prisma.io/docs/orm/v7/reference/supported-databases),
[Windows installers](https://www.postgresql.org/download/windows/),
[PostgreSQL licence](https://www.postgresql.org/about/licence/),
[support policy](https://www.postgresql.org/support/versioning/).
Compatibility is documentation-based, not a runtime PASS or permission to copy
provider example grants into the app.

Authenticated management metadata revealed one visible Free organization:

| Candidate         | Observed state | Region / engine                       | Eligibility conclusion                                                                                                                   |
| ----------------- | -------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `commercehub`     | ACTIVE_HEALTHY | eu-central-1 / PostgreSQL 17.11.0.003 | Candidate name only. Purpose, contents, consumers, sensitivity, grants and disposability UNKNOWN; not approved for connection/use/reset. |
| `expense-tracker` | ACTIVE_HEALTHY | eu-central-1 / PostgreSQL 17.11.0.002 | Unrelated workload; exclude from CommerceHub use.                                                                                        |

Only list-projects, list-organizations and organization-plan metadata were read.
No table/query/log/key/connection-string endpoint was called. IDs and database
hosts are omitted from this public proposal. Two visible active projects appear
to consume the published Free allocation; exact effective entitlement, remaining
egress/storage and account-wide owner/admin quota are not exposed by these tools.
Treat new Free creation as BLOCKED until the owner verifies a slot. Do not pause,
delete, transfer, upgrade or create another organization to evade that decision.
The existing `commercehub` project may be designated only after owner attestation
of exclusive non-production purpose and an approved access/disposability review;
its name is not that evidence. Otherwise approve a quota resolution or B.

Supabase Nano defaults are 60 database connections and 200 pooler clients, not
200 SQL backend connections; reserve headroom and approve small explicit pools
after measuring actual limits. [Compute evidence](https://supabase.com/docs/guides/platform/compute-and-disk).
An upgrade is not assumed: Pro advertises $25/month with compute credits for one
Micro; additional projects/usage/add-ons may add cost. No paid transition is approved.

For an eventual NestJS long-running client, prefer direct TLS if reachable, else
review Session pooler TLS. Migration tools require a stable session/direct path,
not blind reuse of transaction pooling; Supabase's Prisma guide supports Session
pooler for migrations. Keep runtime and migration roles/credentials separate even
if they use the same endpoint. Do not freeze new URL variable names or Prisma
config syntax before the owning story selects a supported version.

Remote connections must verify certificates and hostnames, with no insecure
fallback; PostgreSQL's `verify-full` is the documented model, mapped to the
eventual Prisma/driver's actual options. Confirm server-side enforcement separately.
[TLS evidence](https://supabase.com/docs/guides/platform/ssl-enforcement).
Local native tests must cover loopback restriction and authenticated TLS, with
trusted test certificates; local convenience does not waive the security boundary.

The requested changelog markdown fetch was unsupported by the browsing transport;
the [official filtered HTML changelog](https://supabase.com/changelog?types=breaking-change)
was reviewed instead. It flags PostgreSQL 15.19/17.11 extension/index/encryption
upgrade considerations and a forthcoming HTTP TLS-cipher change. No extension or
existing project was inspected/mutated; revisit applicable changes before setup.

## Redis and BullMQ evidence

BullMQ requires real Redis semantics, not only a product label or REST API.
[Compatibility guidance](https://docs.bullmq.io/guide/redis-tm-compatibility/) states
Redis 6.2+ compatibility, while cautioning about alternatives. Exact future
BullMQ/client/server versions remain unselected. The current scaffold has no
BullMQ or Redis dependency or suite.

| Candidate                                           | TCP/TLS/auth and BullMQ basis                                                                                                                                                                                                     | Limits and durability                                                                                                                                                                                                                                                                                                     | Disposition                                                                                                                                                                                          |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redis Cloud Free Essentials                         | Native Redis/password support, but detailed TLS documentation says TLS unavailable. A broader subscription table implies transit encryption; use the restrictive detailed requirement rather than assume secure access.           | $0, 30 MB, 30 connections, 100 ops/s, 5 GB monthly bandwidth, one CIDR rule. No persistence.                                                                                                                                                                                                                              | Reject for this proposed remote queue environment: TLS/durability requirements unmet. No real connection made.                                                                                       |
| Paid Redis Cloud Essentials, standard single-region | RESP2/3 native clients, password/RBAC; TLS available but must be enabled and verified. Published command matrix covers standard Redis semantics. Explicitly select no eviction rather than default volatile-lru.                  | Advertised from $5/month ($0.007/hour); not an exact Frankfurt RAM-plan quote. Published 250 MB plan: 256 connections, 1,000 ops/s, 100 GB/month bandwidth, four CIDR rules. AOF every second or snapshots supported; disk encryption documented. Replication/backups/options affect quote and loss windows.              | Recommended PROPOSED candidate, subject to exact quote, security configuration and actual compatibility tests. Neither memory/ops quota nor persistence is proof of recovery correctness.            |
| Upstash Redis Free / paid                           | Native TCP and HTTPS REST both exist; use TCP/TLS only for BullMQ. Vendor has explicit BullMQ guide. TLS always on; password auth. Custom ACLs are paid; encryption-at-rest is a Prod Pack feature. Eviction disabled by default. | Free $0: 250 MB, 500K commands/month, 10 GB/month, one Free DB; pricing capacity table separately says 256 MB, so plan against lower 250 MB until confirmed. Published connection limit 10K applies across plans; verify account effective limit. Persistence always enabled, but not a tested backup/recovery guarantee. | Free is not recommended against existing least-privilege/at-rest requirements; no policy waiver proposed. Paid remains alternative only after exact security-inclusive quote and TCP blocking tests. |

Price/limit sources: [Redis pricing](https://redis.io/pricing/),
[Essentials quotas](https://redis.io/docs/latest/operate/rc/subscriptions/view-essentials-subscription/essentials-plan-details/),
[Upstash pricing](https://upstash.com/pricing/redis),
[Upstash connection-limit update](https://upstash.com/blog/limits-increase).
Security/durability sources: [Redis TLS plan limitation](https://redis.io/docs/latest/operate/rc/security/database-security/tls-ssl/),
[Redis persistence](https://redis.io/docs/latest/operate/rc/databases/configuration/data-persistence/),
[Redis disk encryption](https://redis.io/docs/latest/operate/rc/security/encryption-at-rest/),
[Redis eviction policies](https://redis.io/docs/latest/operate/rc/databases/configuration/data-eviction-policies/),
[Upstash security](https://upstash.com/docs/redis/features/security),
[Upstash durability](https://upstash.com/docs/redis/features/durability),
[Upstash eviction](https://upstash.com/docs/redis/features/eviction).
Redis Cloud throughput figures assume 1 KiB requests in its published table;
these are quota ceilings, not measured CommerceHub capacity.

Upstash PAYG advertises $0.20/100K commands; Fixed 250 MB is $10/month plus
$5/read region; security Prod Pack is another $200/month and unavailable on Free.
These are alternatives, not spending approval or a recommended minimum bill.
BullMQ idle polling/heartbeats consume commands: its vendor guide recommends Fixed
for predictable usage. Even a hypothetical one billable command/second would be
2.592M/30 days, exceeding 500K; this is arithmetic, not a measured workload or a
complete bill. [Vendor BullMQ guide](https://upstash.com/docs/redis/integrations/bullmq).
Disable paid auto-upgrade and review usage/budget controls in any later approval.

[Redis Cloud regions](https://redis.io/docs/latest/operate/rc/supported-regions/)
and [Upstash regions](https://upstash.com/docs/redis/features/globaldatabase) include
Frankfurt; [Supabase regions](https://supabase.com/docs/guides/platform/regions)
and observed candidate metadata support Frankfurt as a proposed alignment. This
is not a latency measurement from Egypt or a guarantee of regional Free capacity.
Prefer one writable region for queue state, not read replicas/eventual-read routing.
Long-running workers remain backend-owned; no serverless worker substitution.

Before approving a concrete Redis configuration, retain the exact-version command
manifest and verify auth/TLS, Lua EVAL/EVALSHA and script reload, hashes/lists/sorted
sets, transactions/pipelines, BZPOPMIN-style blocking dequeue, stream XADD/XREAD
BLOCK for events, TTL/time/lock-renewal semantics and duplicate dedicated
connections. [Redis command matrix](https://redis.io/docs/latest/operate/rs/references/compatibility/commands/)
and [BullMQ connections](https://docs.bullmq.io/guide/connections) are documentary
basis only; the latter requires noeviction and explains extra blocking connections.
Use BullMQ's own key prefix, not a client keyPrefix. Provider configuration APIs
may differ from raw CONFIG permissions; do not require admin commands in runtime ACLs.

For Upstash specifically, native protocol and vendor integration documentation
support candidacy; exact blocking timeout/reconnect/script behavior is NOT VERIFIED
on an account. The [REST command restrictions](https://upstash.com/docs/redis/features/restapi)
exclude blocking sorted-set operations, so neither @upstash/redis nor a successful
REST PING proves BullMQ suitability. This checkpoint generates no credentials and
does not follow any documentation's offer to auto-create a scratch database.

## Proposed environment and secret ownership

Local Next.js apps call only the future NestJS API; neither frontend process holds
database/cache credentials. Node apps still start independently of those services.
Only API and future trusted workers hold approved runtime credentials. A separately
controlled migration runner holds DDL credentials; provider administration stays
with the named resource owner. Existing application auth/session policy is untouched.

Proposed names are labels only: `commercehub-dev-<owner>` for persistent dev,
`commercehub-test-<run-id>-<attempt>` for disposable CI, with environment/owner/expiry
metadata. Names alone never authorize deletion. Keep an approved nonsecret resource
manifest containing exact identity, endpoint identity, role, purpose, lifecycle owner
and permitted operations. Credential values belong in ignored API-local configuration
or a protected secret store, never this manifest, prompts, frontend env, CI logs or
fixtures. Do not add mandatory service variables before an authorized integration.

Require least privilege, verified TLS, bounded pools/timeouts, no public Data API
grants as an alternative to backend authorization, synthetic data only and explicit
rotation/revocation handoff. Approve expiration/review and cost owner before creation;
no invented retention/RPO/RTO policy. Persistent dev is not disposable test isolation.
No shared flush/reset, no automatic production fallback, no existing-project deletion.

## Designed CI strategy - no workflow implementation

Use reviewed PostgreSQL and Redis service images on **GitHub-hosted Linux**, with
approved exact versions/digests and bounded health checks. Containers run on the
hosted runner, not the Windows workstation. GitHub documents both
[PostgreSQL services](https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers)
and [Redis services](https://docs.github.com/en/actions/tutorials/use-containerized-services/create-redis-service-containers).
Keep existing read-only permissions, pinned actions, concurrency cancellation,
secret scan/audit policy and unconditional `commercehub-quality` protection.

1. Validate job-owned target manifest and environment before any connection. Allow
   only exact job network/service identities for the test operation; reject absent,
   malformed, mismatched, production/staging/shared identities, unexpected role or
   TLS downgrade. Do not rely on a name containing test, or a hostname substring.
   Negative cases must record zero connection/mutation attempts and redacted errors.
2. Start isolated services with synthetic job-only credentials, authenticated
   pg_isready/SQL identity checks and Redis AUTH/PING/capability readiness. Bound
   retries and distinguish missing image, startup timeout, auth and certificate errors.
   PostgreSQL pg_isready alone does not establish correct credentials or target.
3. Provision a job-owned disposable database and least-privilege runtime/test roles
   only under the later explicit test-resource authorization. Namespace by run and
   attempt; any per-suite databases/shadow DBs must be independently disposable.
   Do not pass developer/hosted/production secrets to PR jobs.
4. Apply only reviewed migrations in the CH-P0-010-or-later owning job after DB-0
   review. No Prisma schema, db push, startup migration or fake empty business suite
   is introduced in 006. Later integrity/concurrency suites belong to actual modules.
5. Use a dedicated Redis service per job. Per-test BullMQ prefixes supplement that
   isolation; a prefix or logical DB number is not isolation from shared infrastructure.
   Enable noeviction, authenticated access and a reviewed persistence mode for
   restart tests. Exercise exact scripts/blocking/event/reconnect behavior only
   when the owning queue/client module exists; no worker is fabricated for 006.
6. Design an explicit TLS-authentication lane with trusted test CA/server names,
   wrong-CA/hostname/plaintext/bad-password denial and no verification bypass.
   Default plaintext service examples are insufficient TLS evidence. Initial
   connectivity probes, if separately authorized, are not full Prisma/BullMQ tests.
7. Later tests cover startup unavailable, quota/pool exhaustion, timeout/unknown
   outcome, Redis noeviction capacity errors, worker restart and script cache miss.
   Business rollback/idempotency/oversell/outbox tests wait for their owning stories;
   SQL state remains authoritative during worker/cache failure.
8. Close pools, workers and blocking sockets. Always-run cleanup deletes only
   positively identified run-owned resources; runner teardown removes containers
   and volumes. Cleanup failure must be visible, without replacing a test failure.
   No FLUSHALL or shared reset. Hosted cleanup/TTL is a separate approved mechanism.
9. Bound image-pull/startup/test deadlines, worker count and connection budgets to
   runner CPU/RAM/disk and existing 20-minute job budget. Measure before choosing
   numeric performance acceptance or extending timeout. Cache no DB data/secrets;
   upload only redacted diagnostics. Hosted Linux availability/minutes and future
   repository billing must be rechecked; no runner quota/spend exemption is assumed.

## AC status and dependency-aware next boundary

PASS below is retained **merged PR #13 evidence**, not a new infrastructure test.
AC-006-10's prior commit-time pending check is resolved by its actual successful
required [run 39415340066](https://github.com/ZeyaadAly/CommerceHub/actions/runs/39415340066).
This proposal itself must independently pass CI after delivery.

| Criterion | Actual status | Existing evidence / remaining dependency                                                  |
| --------- | ------------- | ----------------------------------------------------------------------------------------- |
| AC-006-01 | PASS          | Merged ownership inventory/templates; future credential enforcement still required        |
| AC-006-02 | PASS          | Merged Windows Node startup/HTTP evidence, no Docker prerequisite                         |
| AC-006-03 | PASS          | Merged examples/ignore/redaction/scan and 42-file canary evidence                         |
| AC-006-04 | BLOCKED       | Owner-designated isolated PostgreSQL resource/roles and executable forbidden-target guard |
| AC-006-05 | BLOCKED       | Redis quote/security/compatibility approval, then actual capabilities when used           |
| AC-006-06 | BLOCKED       | Approved resources plus repeatable bounded connection/bootstrap proof                     |
| AC-006-07 | BLOCKED       | Config/port errors passed; service/auth/TLS negative cases not executed                   |
| AC-006-08 | BLOCKED       | CI inspection retained; new forbidden-target rejection before connections not implemented |
| AC-006-09 | BLOCKED       | Strategy designed; runnable real integration modules/suites do not yet exist              |
| AC-006-10 | PASS          | PR #13 required CI SUCCESS and protected-main read; this new PR needs its own check       |
| AC-006-11 | PASS          | No schema/migration/DB integration in merged limited phase or this checkpoint             |
| AC-006-12 | BLOCKED       | Exact approved service runbook/owned reset/restart/TLS lifecycle unimplemented            |
| AC-006-13 | PASS          | Actual commands/results and precise NOT RUN limitations recorded                          |
| AC-006-14 | BLOCKED       | App-only repeatability passed; resource-backed clean setup still pending                  |
| AC-006-15 | PASS          | No resource creation/cost/use authorization inferred; none performed                      |

Sequence is decision approval -> resource-specific setup authorization -> isolated
configuration/target guards and bounded probes -> resource-backed positive/negative
repeatability -> later module-owned integration suites. Do not make a non-existent
BullMQ worker or business schema a new prerequisite of 006. Conversely, the full
AC-006-09 wording cannot be declared PASS until real runnable evidence exists.
This remaining acceptance/sequencing issue is BA-19/22: request a separately
reviewed evidence handoff/refinement if needed, never silently alter criteria,
dependencies or mark DONE to unblock 007/009/010. CH-P0-007 does not start here.

## Owner approval checklist and risks

| Decision               | Required evidence / proposed boundary                                                                                                                                                  | Current state                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| PostgreSQL target      | Designate the candidate only with exclusive dev-purpose/safety attestation; otherwise authorize a new dedicated Free target after quota resolution, or approve native 17.x setup       | NOT APPROVED                                    |
| Redis and spending     | Exact provider/plan/Frankfurt-or-approved-region quote including TLS, at-rest protection, persistence, limits, tax and recurring cap; paid Redis Cloud preferred, no automatic upgrade | NOT APPROVED; budget not assumed                |
| Security and lifecycle | Named owner, exact nonsecret identity manifest, least-privilege role/ACL design, credential custody, rotation, disposability/reset/teardown and review date                            | Pending OPS-01/security review; no gate closure |
| CI extension           | Separate reviewed change for isolated Linux services, target guard, TLS lane and future suite ownership; preserve required job/security/20-minute budget                               | DESIGN ONLY                                     |
| Next implementation    | Separately authorize only approved-resource setup/runbook and bounded connectivity/auth/TLS/target-denial verification; no commerce, migrations or worker integration                  | NOT AUTHORIZED by this checkpoint               |

Primary risks are quota/eligibility uncertainty, accidentally reusing existing data,
free pausing/no backups, pool/session mistakes, Redis eviction/data loss, command
quotas/idle cost, insecure Free-tier substitutions, unmeasured regional latency,
unimplemented test modules and a proposal mistaken for execution authority. Keep
production/shared resources excluded and stop the dependent slice when an approval
or capability is missing. Resource approval may discharge a scoped OPS-01 decision
dependency only when its designated owner records it; it cannot close the entire
operations/recovery gate or any financial/security/inventory/payment/legal gate.

Human review of this proposed document is next. No infrastructure, SQL, migration,
application integration, credentials, workflows, dependencies or deployment was
created or modified. No next story is authorized.

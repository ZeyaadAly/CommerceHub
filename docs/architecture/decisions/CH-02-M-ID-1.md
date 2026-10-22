# CH-02/M-ID-1 — approved offline users contract

## Current approval and exact final mapping — 2026-10-22

**Product, Backend/Data and Security bounded technical decision APPROVED. Offline
User-only Prisma implementation AUTHORIZED; implementation at REVIEW.**
Source: owner's “Finalize Approved User Contract and Implement Offline Prisma
Model” instruction, October 22, 2026. Reviewer identity **ZeyaadAly**, acting as
Project/Product Owner, Backend/Data reviewer and Security reviewer for this one
decision. No independent specialist review by another person is claimed. This
new explicit approval/authority supersedes earlier pending/no-implementation
records preserved below. It is not closure of SEC-01, DB-0/DB-01 or any gate.

Reconciled with DB §4.1: exactly the existing eleven baseline columns, lengths
and nullability; reviewed direction/details finalized as follows:

| Column            | PostgreSQL type | Nullable | Database default                        |
| ----------------- | --------------- | -------- | --------------------------------------- |
| id                | UUID            | No       | None; trusted backend supplies UUID v4  |
| email             | VARCHAR(320)    | No       | None                                    |
| email_normalized  | VARCHAR(320)    | No       | None; C collation required later in SQL |
| email_verified_at | TIMESTAMPTZ(6)  | Yes      | NULL (implicit)                         |
| display_name      | VARCHAR(160)    | No       | None                                    |
| phone_e164        | VARCHAR(20)     | Yes      | NULL (implicit)                         |
| status            | VARCHAR(20)     | No       | None                                    |
| created_at        | TIMESTAMPTZ(6)  | No       | now()                                   |
| updated_at        | TIMESTAMPTZ(6)  | No       | now()                                   |
| deactivated_at    | TIMESTAMPTZ(6)  | Yes      | NULL (implicit)                         |
| version           | INTEGER         | No       | 1                                       |

Mapped User → users, users_pkey PK(id), users_email_normalized_key global
UNIQUE(email_normalized), both ordinary immediate B-tree keys. No other indexes,
phone uniqueness, enum, UUID/@updatedAt default or relation to absent tables.
Category/CategoryClosure preserved. UUID/created_at immutable; DB updated_at uses
statement_timestamp() on UPDATE. Status values ACTIVE/SUSPENDED/DEACTIVATED;
DEACTIVATED iff deactivated_at non-NULL. Controlled writes supply OLD.version+1;
DB guard rejects invalid increments/overflow. Sensitive writes require expected
version, not a customer-assigned stored version. These SQL guards are not installed.

The precise reviewed ID-D1 grammar below is finalized for the helper: ASCII
dot-atom local part 1–64 octets, total <=254, domain dot-separated nonempty ASCII
labels <=63, alphanumeric ends/hyphen interior; no trailing dot. Preserve local
spelling, lowercase domain for display email, ASCII lowercase the complete
identity key. Preserve dots and plus tags; no trim, aliasing, Unicode/IDNA
conversion, truncation or citext. Global uniqueness includes inactive identities;
collision never merges accounts. This is the explicitly chosen account identity
policy despite SMTP local-part case distinctions, not a deliverability claim.

Required registration displayName amendment is recorded in API §4; no fallback
or handler is implemented. Phone remains optional/nonunique canonical + followed
by 1–15 ASCII digits, first nonzero; no inferred country prefix. Shape does not
establish possession. Names are not constrained by the email ASCII policy.
Empty displayName is invalid; presentation whitespace/Unicode normalization is
deferred to later API/UX review rather than invented by this schema/helper.

Verified replacement retains current email until a bound one-time challenge is
consumed and finalization atomically commits new email/key/verification with
version and uniqueness recheck. No challenge, session, credentials, membership,
RBAC or auth endpoints are implemented. Session revocation/reauthentication/
notification consequences require their later SEC-01/AUTH decision before that
workflow; they are not a prerequisite for an inert User storage declaration.

M owns this offline contract; DB owns actual constraint/collation/trigger/grant
application after prerequisites and explicit execution authority. AUTH/ACCOUNT
own future authorized mutations with A atomic audit; future referencing owners
add real RESTRICT FKs under M-04, never fabricated forward references. All
[SQL/service obligations](CH-02-M-ID-1-sql-manifest.json) DESIGNED — NOT IMPLEMENTED.
Future PostgreSQL proofs and approved negative cases remain NOT RUN. No material
storage-policy conflict remains; deferred workflows are not implemented here.

No new dependency/version, runtime PrismaClient, generator, SQL, migrations,
credentials, database access, infrastructure or deployment. Exceptions: no
exception to this bounded offline mapping; later workflows/SQL proof remain
explicit exclusions. Full M-01 and wider M-04 remain incomplete outside users;
remaining M-02/M-03 and all gates unchanged. See [implementation evidence](../../verification/CH-02-M-ID-1.md).

## Historical proposal and Product-only checkpoints

The earlier unsigned proposal/checklists/results below are preserved historical
evidence and do not override the current explicitly approved subset above.

# CH-02/M-ID-1 — users identity contract for approval

2026-10-22 (Africa/Cairo). **Product policy APPROVED; Security and Backend/Data
technical signatures PENDING. Offline implementation NOT AUTHORIZED.** No User
model implemented. Proposal prepared by Codex (AI), not a human specialist
signature. The owner's follow-up “Identity Schema Technical Approval” explicitly
confirms only the Product policies below and withholds implementation authority.

## Product policy decision — October 22, 2026

Recorded from the current owner instruction:

1. ASCII-only email acceptance with case-insensitive lowercase identity keys.
2. Atomic verified-email replacement; retain the current email until verification.
3. DEACTIVATED iff deactivated_at IS NOT NULL.
4. Optional, nonunique, canonical E.164 phone.
5. Initial version 1, controlled increments and expected-version checking.
6. Required displayName at registration, with the scoped API amendment below.

These policies do not sign the eleven-column native mapping, exact email grammar,
normalization/collision implementation, SQL enforcement, session consequences or
future relationships. The Backend/Data and Security checklists are review
requirements, not completed approvals. Reviewer identities/roles, review dates
and signatures remain PENDING; no exceptions approved. No SQL, migration,
Supabase/credential access, infrastructure change or specialist gate closure.

Starting fetched main: `c6b96f26d3db947619ac4d1a71b3b01e912c21ff`.
GitHub confirms [PR #30](https://github.com/ZeyaadAly/CommerceHub/pull/30) merged
at that SHA, head `e6a751043cbf12c4f772b19e68827d0e6b5d6856`. Existing category
models, config, dependencies, tests and [CAT-1 SQL manifest](CH-02-M-CAT-1-sql-manifest.json)
are preserved unchanged. Branch: `feat/CH-02-M-ID-1-users-schema` from main;
earlier completed local merge remains on its prior branch.

## Exact proposed mapping

Baseline authority: [DB §§4.1/5/12–13/16–18](../../05-database-design.md),
[architecture §§6–7](../../04-architecture.md), [API §§2/4/9](../../06-api-design.md),
[PRD CH-AUTH-001–004](../../02-prd.md), [M-01/M-04 inventory](CH-02-M-specialist-review.md)
and [decision matrix](decision-matrix.md). All baseline fields/types/nullability
below are retained. Generation, defaults beyond existing conventions, precision,
normalization, lifecycle and concurrency choices are **recommendations requiring
signature**, not approvals. No extra identity, authority or financial column.

| Column / future Prisma property     | PostgreSQL type                         | Nullable | Proposed database default                                      |
| ----------------------------------- | --------------------------------------- | -------- | -------------------------------------------------------------- |
| id / id                             | UUID                                    | No       | None; trusted backend supplies UUID v4                         |
| email / email                       | VARCHAR(320)                            | No       | None                                                           |
| email_normalized / emailNormalized  | VARCHAR(320), deterministic C collation | No       | None; trusted backend supplies canonical value                 |
| email_verified_at / emailVerifiedAt | TIMESTAMPTZ(6)                          | Yes      | NULL (implicit)                                                |
| display_name / displayName          | VARCHAR(160)                            | No       | None                                                           |
| phone_e164 / phoneE164              | VARCHAR(20)                             | Yes      | NULL (implicit)                                                |
| status / status                     | VARCHAR(20)                             | No       | None; explicit use-case choice                                 |
| created_at / createdAt              | TIMESTAMPTZ(6)                          | No       | now()                                                          |
| updated_at / updatedAt              | TIMESTAMPTZ(6)                          | No       | now()                                                          |
| deactivated_at / deactivatedAt      | TIMESTAMPTZ(6)                          | Yes      | NULL (implicit)                                                |
| version / version                   | INTEGER                                 | No       | 1 (Product-approved initialization; technical mapping pending) |

Proposed immediate keys/indexes: `users_pkey` PK(id),
`users_email_normalized_key` UNIQUE(email_normalized), both B-tree. No raw-email
UNIQUE, phone UNIQUE, status/deactivation index, partial active-email unique or
extension. Add other indexes only for separately reviewed workloads. Uniqueness
includes suspended/deactivated rows; no recycling or automatic account merging.
No outgoing or fabricated future FK. All later incoming historical user FKs must
explicitly use RESTRICT deletion/update under their owning schema decisions.

UUID and created_at immutable; DB BEFORE UPDATE sets updated_at to
statement_timestamp(). No Prisma UUID default or @updatedAt substitution.
TIMESTAMPTZ(6) aligns CAT-1 without implying CAT-1 approves identity semantics.
Alternatives: approved DB UUID generator, other timestamp precision, or strictly
controlled application timestamps. Each would require an explicit signed change.
VARCHAR(20) plus CHECK preserves the users baseline; a PostgreSQL enum would
change representation and adds enum-evolution coupling, so is not recommended.

## Decisions to approve, with rationale and alternatives

**ID-D1 — Email identity: Security + Backend/Data technical signatures pending;
Product ASCII/lowercase-key policy approved.** Proposed exact grammar: ASCII dot-atom local part
and ASCII DNS-label domain; one @, no whitespace/control/non-ASCII character,
comments, display-name wrapper, quoted local part or domain literal. Local part
1–64 octets; complete address at most 254 octets; each nonempty domain label
1–63 characters, starts/ends alphanumeric, interior alphanumeric/hyphen; dot
separates labels, no trailing dot. Dot-atom local part is nonempty segments
separated by single dots; segment characters are ASCII letters/digits and
`!#$%&'*+-/=?^_` plus backtick, `{`, `|`, `}`, `~`. These are proposed input
restrictions, not a claim that other RFC mailbox forms are invalid.

Store email with local-part spelling preserved and ASCII domain lowercased.
Compute email_normalized by converting only ASCII A–Z to a–z across that address.
Never trim, truncate, remove dots/plus-tags, resolve aliases, remove accents,
apply Unicode folding or normalize against a provider-specific rule. SQL must
verify normalized value equals the same explicit ASCII translation of email.
Use C-collated canonical equality and UNIQUE; do not silently substitute citext
or database-locale lower(). A supplied ASCII domain, including an xn-- label,
is treated as an ASCII identifier; no Unicode/IDNA conversion or deliverability
claim is made. Delivery proof belongs to later AUTH.

Rationale: deterministic account lookup and collision handling, no provider
alias guesses. **Lowercasing the local part is a CommerceHub account-identity
policy, not SMTP equivalence:** RFC 5321 preserves local-part case sensitivity.
It could collapse distinct case-sensitive mailboxes. Product has now selected
lowercase account keys; Security acceptance of the precise mapping remains pending.
Alternative for historical comparison: preserve local-part case in the
unique key, accepting possible parallel accounts for a provider's same mailbox.
Unicode local parts require an explicitly designed SMTPUTF8 identity/delivery
contract; Unicode domains require a selected IDNA policy. Neither is inferred
from Egypt-first scope. VARCHAR(320) capacity does not itself approve 320-octet
SMTP ingress. Sources: [RFC 5321 §§2.3.11/4.1.2/4.5.3.1](https://www.rfc-editor.org/rfc/rfc5321.html),
[RFC 6531](https://www.rfc-editor.org/rfc/rfc6531.html),
[PostgreSQL citext limitations](https://www.postgresql.org/docs/current/citext.html).

Normalized collision on create/rename rejects the mutation; never merge,
overwrite, reassociate orders or add staff access. Unique constraint, not a
prior SELECT, is the concurrency authority. Future normalization changes require
separately reviewed collision inventory/backfill/rollout; never silently re-key
existing identities or resolve collisions by deleting accounts.

**ID-D2 — Email mutation/verification: Security + Backend/Data + Product.**
Recommend current address remains unchanged while a replacement is unverified.
Later AUTH finalization consumes a single-use challenge bound to user ID,
target normalized address and expected identity version, and atomically commits
email, normalized email and server-controlled verification time. Revalidate
unique ownership at commit; stale/conflicting/replayed proof never transfers
another account. Generic profile writes cannot change any email field or clear
verification. No pending-email/token column or table is added in ID-1.
Any exceptional maintenance change without accepted delivery proof must leave
verification NULL and cannot be an unrestricted runtime update path. Exact
challenge, reauthentication, notification and session-revocation policies remain
SEC-01/AUTH decisions; this schema does not authorize that workflow. Alternative
immediate-switch/unverified behavior changes account access and needs explicit
Product/Security review. SQL cannot infer challenge possession from a timestamp;
later controlled finalization and permissions must enforce the proof boundary.

**ID-D3 — Status/history: Product coherence approved; technical review pending.**
Recommend required VARCHAR(20), allowed ACTIVE/SUSPENDED/DEACTIVATED, no default.
Product-approved invariant, with SQL mechanism still proposed:
`(status = 'DEACTIVATED') = (deactivated_at IS NOT NULL)`. Deactivation records
database time and retains identity, normalized-email reservation and historical
links. No automatic restoration, retention period, erasure/anonymization or
suspension duration is selected. Deny ordinary runtime DELETE/TRUNCATE; future
referencing tables add real RESTRICT FKs, not dummy relationships now. Alternative
timestamp-as-last-event semantics would need a different CHECK and signed lifecycle
contract. Disabling a shared user cannot bypass future last-active-Super-Admin
safeguards; SQL status validity is not transition authorization.

**ID-D4 — Phone/profile: Security + Backend/Data + Product/API.** Recommend phone
is optional, nonunique contact data, stored NULL or a plus sign followed by 1–15
ASCII digits with nonzero first digit; no spaces, punctuation, extension or local
number conversion. Empty is rejected, clearing uses explicit NULL; no country
prefix guessed. Shape is not proof of a real/owned number and cannot become
login/recovery authority. Duplicate shared-family phone numbers allowed.
Alternative uniqueness requires an approved ownership/reassignment/recovery
policy. [E.164](https://www.itu.int/rec/T-REC-E.164) limits the international number
to 15 digits; actual allocation validation requires later reviewed tooling.

Preserve display_name VARCHAR(160) NN with no generated fallback. DB §4.1 requires
it while API §4 register has displayName optional: **API-01 conflict requiring
Product/Backend/Frontend decision** in the earlier proposal. The owner now
approves required displayName and the scoped [API §4 amendment](../../06-api-design.md):
remove the optional marker from registration only. Empty or invalid display names
must be rejected; do not generate a fallback from the email or a blank string.
Exact whitespace/normalization validation still requires technical review, without
silently extending the email ASCII restriction to display names. API PATCH /me
permits displayName/phone, never account or authority fields; phone → phone_e164
wire mapping is a later explicit adapter contract, not a new schema column.

**ID-D5 — Version/concurrency: Backend/Data + Security.** Recommend initial
version 1 (now Product-approved), CHECK >=1, controlled writes increment
OLD.version+1 on every UPDATE and a DB guard rejects other increments and INTEGER
overflow. Unlike the earlier overwrite proposal, invalid stored-version assignments
must be rejected to match the owner's explicit negative case. Exact enforcement
remains unsigned. Trusted service
updates use a parameterized predicate `(id, expectedVersion)`; zero affected rows
means stale/deleted identity and no successful mutation. Do not silently retry
user edits or reset/wrap the version. DB increments alone do not prove optimistic
concurrency: every trusted writer, including future identity-finalization and
maintenance paths, must supply/revalidate the expected version. Lock/re-read for
multi-step updates and final verification in one transaction; audit/outbox side
effects share that transaction when their approved owners exist. Alternative
pessimistic serialization or service-managed increments requires explicit writer
protocol and race tests. Client expectedVersion is a precondition, never a
mass-assigned stored version. Later API request/response precondition mapping is
API-01 work, not an ID-1 handler.

## Prisma, SQL and service ownership

All SQL entries here are **DESIGNED — NOT IMPLEMENTED**. No SQL file is created.

| Invariant                                                           | Future implementation / owner                                                                                     | Required real proof                                                                                                 |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Exact fields/defaults/native types, PK and global normalized UNIQUE | M Prisma mapping only after signatures; DB applies actual keys                                                    | null/length/default roundtrip; concurrent canonical duplicate produces at most one identity                         |
| C collation and email syntax/canonical equality                     | DB reviewed column collation and CHECK/immutable normalization function; Security signs ID-D1                     | locale/case/whitespace/Unicode/length and mismatched raw/key direct-write cases                                     |
| Status domain, deactivation iff, version >=1 and phone shape        | DB CHECKs, required columns remain NN                                                                             | reject every invalid domain/coherence/shape/zero-version case                                                       |
| Immutable UUID/created_at; DB updated_at and monotonic version      | DB BEFORE UPDATE guards; controlled writer supplies exactly OLD.version+1                                         | direct writer cannot forge ID/creation/update/version; invalid increments and overflow rejected                     |
| No runtime hard deletion or identity-field bypass                   | DB grants/denials and controlled identity-write boundaries; Security/OPS review; no broad PUBLIC helper execution | intended runtime cannot DELETE/TRUNCATE or directly forge verification/status; approved profile writes still work   |
| Expected-version updates and final verified email replacement       | AUTH/ACCOUNT trusted services with reviewed DB helpers/privileges and A atomic audit; no token schema in ID-1     | stale/racing updates, replayed challenge, collision and mid-operation fault leave durable identity/audit consistent |
| Historical user references                                          | Later owning M-04 contributions add actual RESTRICT FK, DB applies in reviewed order                              | referenced identity deletion/ID replacement rejected, order/audit history unchanged                                 |

Prisma represents the ordinary fields/keys, not CHECKs, DB triggers, column
collation, runtime grants or verification authorization. No @updatedAt or
Prisma-level UUID default substitutes for the selected future DB/backend owners.
Backend validates allowlisted inputs independently of frontend. Customer DTOs
must reject id, email_normalized, email_verified_at, status, deactivated_at,
created_at, updated_at, stored version, userId, roleIds, membershipIds, permissions,
isAdmin/isSuperAdmin and equivalent camelCase fields. Only approved profile fields
may reach profile persistence; identity changes require their separate workflow.

User row is never an authorization shortcut: no role/customer-vs-staff boolean,
session audience, permission array, password/hash/token or provider payload.
Registration never creates membership. Future protected backend checks require
active user, correct STOREFRONT/ADMIN audience, eligible ACTIVE staff membership
where relevant, resource ownership/policy and effective capabilities. Sessions,
credentials, tokens, memberships, roles, addresses and their FKs belong to later
approved slices. User has no relationship to Category/CategoryClosure in ID-1.

## Negative/normal test specification — planned, NOT RUN

- Valid synthetic address/profile, nullable phone/timestamps and each coherent
  status roundtrip with exact PostgreSQL types. Missing required/overlong fields
  fail. No fixture contains a real address or identity.
- Under ID-D1: Alice@Example.test and alice@example.test share the key; domain
  case folds; dots and plus-tags remain significant. Reject controls/newlines,
  whitespace, empty parts, Unicode, quoted forms, invalid labels, repeated/edge
  local dots, >64 local or >254 total octets. No truncation or hidden transforms.
- Direct SQL cannot supply an inconsistent normalized key. Two canonical
  duplicate inserts/renames, including against a deactivated identity, cannot
  commit two identities or overwrite existing ownership. No email recycling.
- Invalid status, deactivation mismatch, NULL/zero version, forged immutable
  fields and invalid phone shapes rejected. Shared valid phone permitted, and
  phone changes confer no verification or recovery authority.
- Negative versions, invalid increments and empty/invalid display names rejected.
  Required registration displayName has no synthesized fallback. These are future
  requirements, not evidence of passing tests.
- Two updates with the same expectedVersion: at most one succeeds; loser gets
  a safe stale result. No lost update, version reset or overflow wrap. Injected
  failure leaves all identity/audit effects unchanged after durable reread.
- Existing verified email stays active until accepted replacement proof.
  Reject another user's proof, wrong target/version, expired/replayed challenge,
  duplicate target and partial finalization; no partial identity transfer.
- Forged privileged fields, profile email changes and direct runtime privileged
  writes denied; neither ACTIVE status nor registration grants staff/admin access.
- Registration/recovery duplicate paths retain neutral outward responses and
  sanitized diagnostics; measure relevant timing/rate behavior later. Internal
  UNIQUE violation never leaks raw identity/SQL details. No arbitrary timing or
  rate threshold is selected by this schema proposal.
- Runtime hard deletion denied; later history references survive deactivation.
  Existing category schema/parser tests remain unchanged. Offline tests cannot
  replace actual PostgreSQL uniqueness/concurrency/privilege evidence.

## Scoped approval checklist and record

- [ ] Security reviewer: name, role, date, exact document revision and evidence.
- [ ] Backend/Data reviewer: name, role, date, exact document revision and evidence.
- [x] Product policies 1–6 recorded above, including required registration displayName.
- [ ] Security/Backend confirm exact grammar/limits/normalization, field and SQL
      details and session-security consequences; Product approval alone does not
      sign all proposed ID-D1–ID-D5 technical details.
- [ ] Both specialists accept the exact eleven columns/defaults, indexes,
      normalization/collision rules, DB/service boundary, ID-D5 race protocol and
      future negative/PostgreSQL proof obligations. Record exceptions explicitly.
- [ ] Approve bounded M-04 ownership: M users contract; DB future application;
      AUTH/ACCOUNT verified mutation; later identity/history FK owners; no forward FK.
- [ ] Obtain explicit offline User-only implementation authorization after technical
      signatures. Current owner record explicitly says NOT AUTHORIZED; earlier
      conditional workflow does not override that restriction. Categories unchanged.

Security: **PENDING — identity/date/signature NOT RECORDED**.
Backend/Data: **PENDING — identity/date/signature NOT RECORDED**.
Review dates: **PENDING**. Exceptions: none approved. Technical recommendations
remain unsigned; the six Product policies above are approved.
M-01 Product policy approved / technical mapping pending; M-02 partial;
M-03 pending; wider M-04 pending; CH-02/M incomplete;
DB blocked; T manual acceptance outstanding; full 006 BLOCKED; all specialist
gates OPEN; Redis DEFERRED; Docker/WSL not mandatory. No empty feature PR/commit.

## Initial review verification — before Product policy follow-up

Executed for this review-only task:

- `node docs/planning/backlog-consolidation/verify.mjs`: PASS; 21 operative
  stories/48 unchanged milestones, 59 legacy stories, 295 original clauses,
  706 local links and 32 rejected governance mutations. No gate/acceptance change.
- Explicit installed Prettier formatting/check of this new contract using the
  existing .gitignore: PASS. Historical register/baseline formatting preserved.
- `node scripts/secret-scan.mjs`: PASS, 212 files, four existing binaries,
  zero findings. `git diff --check`: PASS.
- Diff against fetched main for apps, packages, manifests/lockfile/workspace,
  scripts, security, infrastructure and CI: empty. Exactly two local documentation
  changes: this contract and the approval-register pending-review entry.

NOT RUN: installation, full format/lint/typecheck/build/application/quality/live
audit/browser suites, Prisma validation and new implementation tests: no schema,
code or dependency implementation is approved or changed. PostgreSQL/Supabase,
SQL/migration/concurrency/constraint proofs: NOT RUN, explicitly forbidden. No
credential retrieval, connection, client initialization, new commit, PR or CI run.
Prior PR #30 exact-head CI success is historical category evidence, not a new
users-schema test result. Stop at REVIEW pending the named scoped signatures.

## Product policy follow-up verification — 2026-10-22

Current scope: this contract, approval register and decision-matrix status;
exactly one API registration cell; governance verifier for that explicit amendment.
No application/schema/dependency change. The original registration text remains
in historical Git evidence; the verifier compares the full live API document
against that original with only the approved displayName? → displayName edit.

- Governance PASS: unchanged 21 stories/48 milestones and historical acceptance;
  710 local links, existing 32 rejected mutations plus two amendment regressions
  rejecting an optional displayName rollback and any extra API-document edit.
- Contract and verifier formatting PASS; focused verifier ESLint PASS, zero
  warnings; diff check PASS; secret scan PASS, 212 files, zero findings.
- No Backend/Data or Security signature recorded, no gates closed. Product
  policies and future negative tests do not constitute technical/test acceptance.
- Prisma/app/build/database/integration suites NOT RUN for this policy-document
  amendment; no User model, runtime code, dependency, SQL or migration changed.
  No new commit/PR/CI or external database/infrastructure action.

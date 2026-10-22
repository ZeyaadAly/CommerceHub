# CH-02/M bounded nonmonetary catalog technical review

Historical proposal and earlier review evidence preserved below. Current
2026-10-22 [CH-02/M-CAT-1 approval](CH-02-M-CAT-1.md) supersedes pending labels
only for categories/category_closure and their bounded ownership contract. The
other catalog/identity/financial decisions remain pending; no gate is closed.

2026-10-22 (Africa/Cairo). **PROPOSED mapping; specialist sign-off PENDING.**
Technical review by Codex, not a human Backend/Data, Security or Product approval.
No table is approved for implementation by this review. CH-02/M remains incomplete.

## Authority and verified starting state

The owner's October 22 request, “Approve and Implement the Bounded Nonmonetary
Catalog Schema”, authorizes technical review and conditional offline Prisma
implementation only after applicable specialist approvals. It does not sign
technical mappings, close gates or authorize database operations. This supplements
the earlier documentation-only authorization; it does not retroactively approve it.

Fetched `origin/main`: `334178d0a9610d3a4792a8e5029c08171ac69929`, matching
the requested starting revision. Initial working tree clean, on
`docs/CH-02-M-owner-decisions` at `2c9b8b447e50a32bd049ce4121d7c631fd652fdc`;
that commit is an ancestor of fetched main. Review branch
`feat/CH-02-M-catalog-schema` created from fetched main.

M's C/D predecessors are accepted in the [execution record](../../planning/backlog-consolidation/adoption.json):
C PR #23, merge `5c31a735251eeb179ae3a8b174b49f8ac13004d6`, and D PR #24,
merge `ffa113804b4c38237576e6fafaf637cb50779f01`. E_DB is not an M
predecessor. It remains separately required for DB. No later milestone begins.

Review plan: compare all eleven catalog rows against approved sources; identify
each unresolved mapping and DB enforcement seam; implement only independently
signed, self-contained subsets; verify the resulting scope. No attributable
specialist sign-off exists in the supplied request or repository packet, so the
implementation condition is unmet for every candidate table.

## Category direction recorded — October 22, 2026

Source: the owner's follow-up, “CommerceHub CH-02/M — Category Schema Decision”.
Status: **OWNER-APPROVED DIRECTION; BACKEND/DATA TECHNICAL SIGN-OFF PENDING.**
Scope is the bounded offline category hierarchy contract only.

The owner/Product selects categories with UUID PK, nullable self-referencing
parent_id, unique slug, name, description, sort order, lifecycle status and
created/updated/archive timestamps; category_closure with composite PK
(ancestor_id,descendant_id), both category FKs, nonnegative integer depth and
reverse lookup index. All FK deletion behavior is RESTRICT. Cycles are prohibited;
parent and closure updates must be coordinated atomically. Database-enforceable
constraints cannot be silently replaced with frontend validation.

Ownership direction is confirmed: M defines the offline contract, DB handles
approved migration application, and Catalog API owns hierarchy mutations.
This does not sign the detailed SQL-only enforcement design or authorize SQL.

Before implementation, Backend/Data must confirm final nullability, physical
status representation, slug normalization, closure self-row/completeness
invariants, concurrent subtree-update protection and SQL-only enforcement
ownership. Common unresolved UUID/timestamp/default/update-action details in
this review also need an exact mapping. The owner's selected structure above is
approved direction; the remaining technical recommendations below remain unsigned.
No additional Product direction approval is needed for that same structure.
Any proposed change to its business meaning requires affected Product review.

Financial and identity/RBAC schema, database connections, SQL execution,
migrations, provisioning and specialist gate closure remain unauthorized.
No Backend/Data reviewer identity, signature, date or supporting approval evidence
was supplied. No schema implementation follows from this direction alone.

## Source contract and acceptance

The [M-02 inventory and M-04 manifest](CH-02-M-specialist-review.md) remain the
field-by-field contract under review, including their explicit U (unspecified)
markers. This supplement does not silently fill those markers. Sources:

- [DB](../../05-database-design.md) §§4, 6.1–6.4, 12–14, 17–18, 20;
  [architecture](../../04-architecture.md) §§6–8, 14, 18;
  [API](../../06-api-design.md) §§2, 4–5, 8–9.
- [PRD](../../02-prd.md) CH-CAT-001–005, CH-ADM-CAT-001–004,
  CH-CHECK-003 and BR-003; [UX](../../03-ux-specification.md) J-UX-03.
- [Decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md),
  [approval register](../../implementation/approval-register.md),
  [adopted backlog](../../planning/backlog-consolidation/README.md) and unchanged
  [48-milestone graph](../../planning/backlog-consolidation/milestones.json).
- [Legacy CH-P0-009](../../08-epics-and-stories.md): all five acceptance clauses,
  safe deletion, signed affected gates/dependencies, negative cases, migration
  review and schema-test obligations remain. Documentation is partial evidence,
  not completion of full identity/catalog M or DB.

BA-03/05/15 affect schema integrity and execution ordering; BA-19/21 require
semantic ownership/dependency review. BA-13 and SEC/OPS/API reviews affect media.
No finding or proposed ADR is accepted by this review.

## Table review and exact remaining decisions

Each row inherits all explicit baseline fields, lengths, PKs, FKs, uniques and
indexes from M-02. Preserve explicit defaults only; absence of a default does
not permit inventing one. All recommendations below are unsigned alternatives
for specialist decision, not executable schema choices.

| Table                    | Review finding and recommended mapping                                                                                                                                                                                                                                                                                          | Alternative / required decision                                                                                                                                                                                                                                                                                                        | Reviewer and blocked slice                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| categories               | Preserve UUID PK, nullable parent UUID RESTRICT, globally unique slug VARCHAR(150), name VARCHAR(160), description TEXT, integer sort order default 0. Recommend nullable description/archive time, required sort/status, baseline ACTIVE/HIDDEN/ARCHIVED vocabulary with an explicit domain CHECK. No status default inferred. | Sign physical status type, nullability, slug normalization/collision behavior, archive transitions and common timestamp/UUID choices. Recommend TEXT plus CHECK; bounded VARCHAR plus CHECK is an alternative needing an explicit length.                                                                                              | Backend/Data + Product; categories and closure.                                                            |
| category_closure         | Composite PK (ancestor_id,descendant_id), both category FKs RESTRICT, required integer depth >=0; reverse (descendant_id,ancestor_id) index. Recommend self rows depth 0, distinct-node rows positive, full transitive closure, DB guard plus one serialized hierarchy mutation protocol.                                       | Reviewed recursive validation/trigger design vs guarded closure maintenance; sign lock scope and direct-write protections. Pair uniqueness and depth CHECK alone do not prove completeness or prevent cycles.                                                                                                                          | Backend/Data + Product; hierarchy slice.                                                                   |
| brands                   | Preserve UUID PK, global unique slug VARCHAR(150), name VARCHAR(160), nullable logo UUID targeting media_assets. Recommend nullable TEXT description, required ACTIVE/ARCHIVED status without inferred default, RESTRICT logo deletion.                                                                                         | Sign description/status type and nullability, slug policy and disabling behavior. Include real media target in the same approved model set or explicitly approve omission/deferred FK as a partial contract; never fake a relationship.                                                                                                | Backend/Data + Product; Security for media seam; brands.                                                   |
| products                 | Preserve optional brand FK, global unique slug VARCHAR(200), name VARCHAR(240), baseline description/SEO lengths, nullable published/archive times. Recommend nullable optional content, required status/version, version >=1 without an invented initial default; archive never changes historical snapshots.                  | Sign publication/archive timestamp consistency, status default (or none), creator nullability and deferred identity FK. Explicit users dependency is unsigned M-01.                                                                                                                                                                    | Backend/Data + Product; Security for creator; products and all descendants.                                |
| product_categories       | Preserve composite PK, both FKs RESTRICT, category index; recommend required is_primary default false and partial unique product_id WHERE is_primary.                                                                                                                                                                           | Sign zero-or-one primary semantics and serialized switching protocol. Exactly-one primary is not implied. SQL fallback ownership must be signed if selected Prisma cannot express the index.                                                                                                                                           | Backend/Data + Product; assignments.                                                                       |
| product_variants         | Preserve UUID/product FK, global SKU VARCHAR(80) uniqueness, optional unique barcode VARCHAR(120), title VARCHAR(200), derived JSONB default {}, optional nonnegative weight, requires_shipping default true, product/status index. Financial columns excluded.                                                                 | Sign SKU/barcode normalization, status/version/archive nullability/defaults, JSON bounds and required selections. Recommend canonical combination identity enforced by DB with product-scoped serialization; exact serialization, length/bounds, empty/default state and mutation timing need approval. No NULL-key uniqueness bypass. | Backend/Data + Product; all variants. M-03 remains separate for unit_price, compare_at_price and currency. |
| variant_attributes       | Preserve UUID PK, product FK RESTRICT and unique (product_id,key). Recommend required key/label/sort_order, explicit absence of a default until selected; TEXT key/label is a review option, not an approved unbounded ingress policy.                                                                                          | Bounded VARCHAR alternative needs signed lengths; sign key normalization, sort range/default, timestamp convention applicability and referenced-axis edit/archive policy. No guessed length or new lifecycle column.                                                                                                                   | Backend/Data + Product; axes.                                                                              |
| variant_attribute_values | Preserve UUID PK, attribute FK RESTRICT and unique (attribute_id,value_key). Recommend required identity/display/sort fields, with lengths/defaults and mutation rules explicitly signed as for axes.                                                                                                                           | TEXT vs bounded VARCHAR, normalization/collision behavior and immutable referenced meaning need decisions. Same value_key on different axes must remain distinct.                                                                                                                                                                      | Backend/Data + Product; values.                                                                            |
| variant_value_selections | Composite PK (variant_id,value_id), both FKs RESTRICT. Recommend DB constraint trigger checking product membership and one value per axis, under the same product lock used for canonical identity.                                                                                                                             | Extra product/attribute columns plus composite candidate/FKs and unique (variant_id,attribute_id) are an alternative requiring approval of additional columns/keys. Two ordinary FKs cannot enforce either invariant. Sign axis/value reassignment behavior too.                                                                       | Backend/Data + Product; selections/combinations.                                                           |
| media_assets             | Preserve provider/object/mime lengths, global object_key unique, positive BIGINT byte_size, optional CHAR(64) checksum and user FK. Recommend nullable dimensions with positive values when supplied, explicit pending/clean/rejected domain, logical deletion preserving references.                                           | Sign dimensions pairing, scan-status type/nullability/default, uploader requirement, checksum validation and deletion/publication rules. Provider-scoped object-key uniqueness would change baseline global uniqueness and needs explicit correction approval.                                                                         | Backend/Data + Security + Product; OPS for storage lifecycle; media.                                       |
| product_images           | Preserve UUID PK, optional variant, product/asset references, VARCHAR(240) alt_text, sort default 0 and primary default false. Recommend required product/asset/sort/primary and composite (variant_id,product_id) FK to variants(id,product_id), with candidate unique (id,product_id).                                        | Sign alt-text null/empty/decorative behavior and nullable composite-FK semantics, or choose reviewed trigger alternative. Preserve separate product-only and variant primary uniqueness; neither a nullable combined UNIQUE nor two independent FKs suffices.                                                                          | Backend/Data + Product + Security; images.                                                                 |

Common outstanding decisions: UUID generation location/function, native timestamp
precision, DB vs application updated_at maintenance, FK update actions and exact
index definitions/names. Recommend immutable identifiers, explicit RESTRICT
deletion, no UUID default until generation is selected, and DB-owned updated_at
maintenance so trusted maintenance writes cannot bypass it. Alternative application
maintenance needs a reviewed trusted-writer protocol. Prisma @updatedAt alone is
not evidence of DB enforcement. No automatic enum, status default, normalization
algorithm, text length, timestamp precision or business limit is chosen here.

## Constraint coverage and negative specifications

These are planned acceptance tests, **NOT RUN**. Normal writes must succeed as
well as invalid ones fail. Test actual installed constraints and trusted write
protocols on disposable PostgreSQL after separate authorization, including direct
SQL bypass attempts by the intended runtime role. Error/rollback checks require
re-reading durable state. Static/schema validation cannot prove these outcomes.

| Packet proof | Required positive, negative and concurrent evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Enforcement contribution to sign                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| C-01–02      | Create root/child/self closure; reject missing parent, negative depth, duplicate pair, self-parent and indirect cycle; detect missing/excess/wrong-depth transitive rows. Two opposing subtree moves must not form a cycle; rollback preserves old tree and closure.                                                                                                                                                                                                                                                      | DB FKs/PK/depth/domain checks; reviewed hierarchy locks/guards; CAT_API transaction owner.                                     |
| C-03–04      | Distinct brand/product slugs succeed; duplicate normalized collision and unknown brand/actor fail. Draft/archived product is not publicly sellable; edit/archive preserves order snapshots.                                                                                                                                                                                                                                                                                                                               | DB uniques/FKs/status/version checks; CAT_API visibility/publication; later PERSIST immutable snapshots.                       |
| C-05         | Multiple nonprimary categories and zero primary allowed; reject duplicate pair/orphans. Concurrent attempts to assign different primary categories leave at most one; failed switch rolls back.                                                                                                                                                                                                                                                                                                                           | DB partial unique and CAT_API switch transaction.                                                                              |
| C-06–09      | Distinct SKU/options succeed, same axis keys on different products allowed, multiple NULL barcodes allowed under ordinary unique. Reject duplicate SKU/non-NULL barcode/axis/value/pair; reject cross-product selection and two values of one axis. Reordered equivalent combinations conflict; two concurrent equivalent combinations yield at most one committed SKU. Axis/value edits cannot invalidate existing ownership or create duplicates. Empty/default selection behavior needs signed expected results first. | DB ordinary/composite/partial keys and reviewed trigger/canonical key, not JSON identity; deterministic product lock protocol. |
| C-10         | Valid asset accepted; unknown uploader, duplicate object key, nonpositive bytes and invalid signed dimension/status cases rejected. Unscanned/rejected/deleted media cannot gain public authority.                                                                                                                                                                                                                                                                                                                        | DB checks/FKs; CAT_API media lifecycle and Security/OPS policy.                                                                |
| C-11         | Valid product-only and variant images coexist with their separate primaries. Reject foreign-product variant, absent asset, second product-only primary and second primary for the same variant, including concurrent inserts.                                                                                                                                                                                                                                                                                             | DB composite FK or approved trigger; two partial uniques. Nullable variant must still require valid product/asset.             |
| C-12         | Referenced catalog rows cannot be destructively deleted; archive/edit leaves historical title/options/price/address snapshots intact. Failure midway through multi-table change rolls back all related rows.                                                                                                                                                                                                                                                                                                              | DB RESTRICT plus trusted lifecycle transaction; later PERSIST references/snapshots; no imaginary order FKs in M.               |

Additional canonical-key review: a UNIQUE key only works if every complete
combination has a deterministic non-bypassable key. A nullable/stale/client-chosen
key, or unchecked digest collision, defeats the invariant. Recommend guarded
canonicalization of stable axis/value identity with no truncation and DB-backed
uniqueness under the product lock; alternative digest representation needs
collision handling. Exact serialization, axis count/size bounds and how an
incomplete draft reaches a complete combination must be signed before code.

## Deferred constraints and ownership

This is a proposed constraint manifest, not SQL or migration authority.

| Deferred contribution                                                                     | Reason / intended owner                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| products.created_by_user_id and media_assets.uploaded_by_user_id → users                  | M-01 unsigned. Preserve intended UUID identity and RESTRICT FK in contract; no dummy users, omitted-authority fiction or forward FK to absent model. M maps only after review; DB applies after users exist.                              |
| brands.logo_asset_id → media_assets                                                       | Media mapping unsigned. DB creates media before adding logo FK; offline Prisma must include a real approved target or have explicitly reviewed partial omission.                                                                          |
| All catalog hierarchy, selection, canonical and image guards/checks/partial indexes above | Exact mapping and Prisma version support unsigned. M records the contract/SQL contribution; DB authors/applies reviewed constraints only with M + E_DB acceptance and DB-0 execution authority. No SQL generated here.                    |
| unit_price, compare_at_price, currency                                                    | Excluded financial group pending M-03/FIN-01; no placeholder decimals, price-free sellability claim or Finance sign-off inferred.                                                                                                         |
| Future order/item/inventory/payment references to product/SKU                             | Belong to later owning milestones; existing IDs do not justify forward relations to absent tables. PERSIST owns order snapshots/coordination, INV/RESERVE stock contributions.                                                            |
| Early audit / outbox and later coordination                                               | A owns early durable audit/minimal outbox seam; PERSIST owns order/payment/idempotency/outbox coordination. Existing A/PERSIST outbox ownership seam still needs signed contribution mapping; M/DB do not create unrelated future tables. |

No schema, dependency, generated client, browser package, SQL or migration was
added. No package version selected or installed: compatibility research is
deferred until implementation is actually eligible. Credentials, PostgreSQL,
Supabase, provisioning, spending and deployment were not accessed.

## Smallest approvable next slice and signature requirements

Recommend **categories + category_closure only**, excluding brands/media,
identity, product/variant and financial dependencies. Closure alone is not
self-contained because it references categories. This subset still requires:

1. Backend/Data identify themselves and sign the exact two-table
   field/null/default/status/normalization/index mapping, including all common
   UUID/timestamp/update-action decisions listed above. Owner/Product structure
   and ownership direction are now approved as recorded above; do not request
   duplicate direction approval. Product reviews any unresolved business semantics
   or proposed departure from that direction.
2. Backend/Data sign closure self/depth/completeness/cycle enforcement, lock and
   direct-writer protocol, rollback/concurrency cases C-01–02, and bounded M-04
   ownership: M offline contract, DB constraint application, CAT_API mutation
   transaction. No unrelated A/PERSIST ownership approval is inferred.
3. Record reviewer name, role, date, exact approved document revision/field subset,
   conditions and evidence link. Status for every such signature is currently
   **PENDING / NOT RECORDED**. An AI recommendation, successful check, merge or
   owner scope authorization cannot fill a specialist slot.

After those signatures, the present request conditionally authorizes only that
offline subset. Verify official Prisma/PostgreSQL/Node compatibility before
dependencies, use apps/api only, and inspect its nested instructions. Validate
schema offline and preserve SQL-only constraints in a manifest. DB operations
remain separately forbidden. Do not ask for unrelated Finance or identity
approval to implement a genuinely independent hierarchy subset.

M-01 technical mapping PENDING; M-03 financial policy PENDING; full M-04 ownership
PENDING; CH-02/M incomplete and schema implementation BLOCKED. All specialist
gates and applicable DB-0/DB-01 remain OPEN. The 21 parents/48 milestones,
CH-01 partial and legacy 006 BLOCKED remain unchanged. CH-10/T manual
accessibility obligations remain outstanding. No schema feature PR or commit
is warranted when no approved table can be implemented.

## Verification evidence

Executed for this documentation-only scope:

- `node docs/planning/backlog-consolidation/verify.mjs`: PASS; 21 parents,
  48 unchanged milestones, 59 legacy stories, 295 original clauses, 680 local
  links and 28 rejected governance mutations. Its `implementationAuthorized:
false` reflects the unchanged readiness record; the new conditional owner
  authorization above does not satisfy missing technical approvals.
- `node --test scripts/ci.test.mjs scripts/dependency-audit.test.mjs`: PASS,
  63 tests, zero failures/skips. These test audit policy and scanner behavior;
  they are not a fresh registry vulnerability audit.
- `node --test scripts/workspace.test.mjs`: PASS, three architecture/package
  boundary tests, zero failures/skips.
- `node node_modules/eslint/bin/eslint.js . --max-warnings=0`: PASS.
  This direct ESLint run does not claim the unavailable pnpm lint command's
  shared-package build prerequisite was rerun.
- `node node_modules/prettier/bin/prettier.cjs --ignore-path .gitignore --check
docs/architecture/decisions/CH-02-M-nonmonetary-review.md`: PASS. New review
  formatted explicitly; historical register bytes preserved outside the inserted
  authorization section. Default formatting ignores these governance paths.
- `node scripts/secret-scan.mjs`: PASS, 203 files, four existing binaries,
  zero findings. Tracked diff and the complete new document reviewed; only two
  documentation files changed. `git diff --check`: PASS.

NOT RUN: Prisma formatting/validation and executable relation/index checks
(no approved schema or Prisma dependency); PostgreSQL integration, SQL constraint,
concurrency and migration proof (explicitly forbidden); full app typecheck/build,
UI/browser and remaining application suites (documentation-only changes, no
application behavior changed); live dependency audit (no dependency changes and
pnpm unavailable). `pnpm.cmd` is absent from PATH; Corepack's attempt to obtain it
failed initializing its cache with EPERM. No tool installation or escalation
was undertaken. Existing Node/local modules supported the checks above.

No commit, push, feature PR or exact-head remote CI run was created: the request's
delivery condition requires meaningful approved schema implementation, and none
is eligible. The review documents remain local for specialist consideration.
No Prisma or PostgreSQL constraint/concurrency result is claimed for an absent
schema. All C-01–C-12 and relevant legacy migration/schema proofs remain NOT RUN.

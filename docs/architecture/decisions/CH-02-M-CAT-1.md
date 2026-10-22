# CH-02/M-CAT-1 — approved category hierarchy contract

Decision date: 2026-10-22 (Africa/Cairo). Product/Owner approval: RECORDED.
Backend/Data technical approval: **explicitly approved by project owner
ZeyaadAly acting in that reviewer capacity**, in the implementation request
“CH-02/M-CAT-1: First Offline Prisma Schema Implementation”. This is not an
independent review by another person. That request expressly accepts the complete
CH-02/M-CAT-1 contract proposed in the preceding conversation, including the
previously conditional ASCII slug and archive-coherence policies.

Implementation authority: two offline Prisma models only, plus tooling, tests,
governance evidence, commit/push/open PR; stop at REVIEW. No database connections,
SQL execution, client initialization/generation, migrations, resources, spending,
deployment, next milestone or merge. SEC-01, DB-0/DB-01 and all gates remain OPEN.

## Exact storage mapping

| Table / column                 | PostgreSQL type | Nullable | Database default               |
| ------------------------------ | --------------- | -------- | ------------------------------ |
| categories.id                  | UUID            | No       | None; backend supplies UUID v4 |
| categories.parent_id           | UUID            | Yes      | NULL (implicit)                |
| categories.slug                | VARCHAR(150)    | No       | None                           |
| categories.name                | VARCHAR(160)    | No       | None                           |
| categories.description         | TEXT            | Yes      | NULL (implicit)                |
| categories.sort_order          | INTEGER         | No       | 0                              |
| categories.status              | TEXT            | No       | None                           |
| categories.created_at          | TIMESTAMPTZ(6)  | No       | now()                          |
| categories.updated_at          | TIMESTAMPTZ(6)  | No       | now()                          |
| categories.archived_at         | TIMESTAMPTZ(6)  | Yes      | NULL (implicit)                |
| category_closure.ancestor_id   | UUID            | No       | None                           |
| category_closure.descendant_id | UUID            | No       | None                           |
| category_closure.depth         | INTEGER         | No       | None                           |

Names are not unique. Negative and duplicate sort positions remain allowed;
no additional range policy is approved. No closure timestamps/surrogate ID.
UUID/created_at are immutable; updated_at is database-maintained on update using
statement_timestamp(), not Prisma @updatedAt. Nullable implicit NULLs do not
introduce generator defaults.

## Keys and indexes

- categories_pkey: PK (id).
- categories_slug_key: global UNIQUE (slug), including archived rows.
- categories_parent_id_fkey: nullable parent_id → categories.id.
- categories_parent_sort_id_idx: B-tree (parent_id,sort_order,id).
- category_closure_pkey: composite PK (ancestor_id,descendant_id).
- category_closure_ancestor_id_fkey and category_closure_descendant_id_fkey:
  each endpoint → categories.id.
- category_closure_descendant_ancestor_idx: B-tree (descendant_id,ancestor_id).

All three FKs: ON DELETE RESTRICT, ON UPDATE RESTRICT. All ordinary keys/FKs
immediate/nondeferrable. Real PostgreSQL foreign keys, not relation emulation.
No forward FK to users, products or other absent tables. Ordinary category
operations never hard-delete identities; closure paths are derived rows that
reviewed routines may replace atomically. No CASCADE or history deletion.

## Slug and lifecycle policies

Canonical slug grammar is `[a-z0-9]+(-[a-z0-9]+)*`, length 1–150. Trusted backend
may lowercase ASCII A–Z before validation. No trimming, transliteration, Unicode
case folding, punctuation removal, hyphen collapsing or truncation. DB accepts
only canonical values; UNIQUE preserves identity across archival. Name changes
do not regenerate slugs. Arabic/Unicode slugs, redirects and automatic renames
require separate decisions.

Status TEXT permits only ACTIVE, HIDDEN, ARCHIVED, without default. Approved
coherence: `(status = 'ARCHIVED') = (archived_at IS NOT NULL)`. Archiving records
database time. Restoration, recursive archive, publication and ancestor visibility
workflows are not implemented or inferred from this storage rule.

## Hierarchy and concurrency contract

Parent graph is a forest with multiple roots allowed. For every category c,
exactly one self-row (c,c,0) exists. Equal endpoints iff depth=0; otherwise depth
is positive. Closure contains exactly every reachable ancestor/descendant pair
with its actual parent-edge distance: no missing, extra or misweighted paths.
Every direct parent edge has depth 1. No category is its own proper ancestor.
Hidden/archived categories remain in structural closure.

READ COMMITTED; globally serialize structural writes with SHARE ROW EXCLUSIVE
table locks on categories, then category_closure, before inspecting hierarchy or
writing either table. Hold until commit/rollback. Read topology in subsequent
statements after obtaining locks, never from pre-lock cached state. Reviewed DB
helper routines acquire locks before inspecting topology; runtime has no direct
table INSERT/UPDATE/DELETE/TRUNCATE rights. Ordinary SELECT remains possible.
These are future mechanical persistence helpers; NestJS retains authorization,
business decisions and the single surrounding transaction coordinator.

Create root: category plus self-row. Create child: those plus all parent ancestor
paths with depth+1. Reparent root r: reject r/new-parent equality or new parent
within r's subtree; preserve internal subtree paths, remove old external paths,
update parent, add new ancestor/subtree paths with depth ancestor-to-parent + 1 +
root-to-descendant. Moving to NULL adds no external paths. Same-parent replay is
a structural no-op. Use wider intermediate depth arithmetic; reject INTEGER
overflow atomically. Failed operations roll back parent, closure and timestamps.

Independent valid concurrent moves may both succeed sequentially. Opposing moves
must not form a cycle. No stale-edit conflict/version-column policy is invented.
Deferred constraint triggers on relevant changes to both tables validate final
acyclicity and exact closure against parent graph before commit. Ordinary CHECKs
do not prove cross-row completeness. DB runtime grants/denials and controlled
routine search paths/ownership require later SQL review. Privileged maintenance
writers follow the same protocol; superuser bypass is not claimed impossible.

## Ownership, alternatives and implementation boundary

M owns this offline contract and [SQL manifest](CH-02-M-CAT-1-sql-manifest.json).
DB owns reviewed constraint/routine/grant migration application after M + E_DB
acceptance and separate execution approval. Catalog API owns transactional
hierarchy operations, permission checks, input allowlisting, safe errors and
future business policies; browser validation never substitutes for DB integrity.

Approved rationale: backend UUIDs avoid DB generation dependency; nullable
description represents absence; TEXT plus CHECK avoids enum lifecycle coupling;
explicit status avoids accidental publication; DB timestamps cover non-Prisma
writes; global locking simplifies the overlapping-subtree correctness argument.
Native enums, database UUID generation, Unicode slugs, application-only timestamps,
advisory locks, serializable/retry and finer subtree locks are alternatives, not
selected implementation options. A changed policy requires an explicit revision.

Prisma represents columns, defaults, PK/UNIQUE/FKs, relation names and ordinary
indexes. Mandatory CHECKs/triggers/routines/grants remain **DESIGNED — NOT
IMPLEMENTED**. The offline schema must never be used as a complete production
DDL contract. No runtime client or generator is present. Full M-01, remaining
M-02, M-03 and M-04 outside this slice remain pending. CH-02/M is incomplete.

## Required proof and provenance

The manifest enumerates negative/concurrent PostgreSQL proof obligations, all
NOT RUN until separately authorized. Offline tests use Prisma's actual parser
and DMMF, CLI format/validate, schema mutations, slug cases and package boundaries;
none is PostgreSQL enforcement evidence.

Baseline: [DB §§4/6.1/12–13/17–18](../../05-database-design.md),
[architecture §7](../../04-architecture.md), [API](../../06-api-design.md),
[historical unsigned packet](CH-02-M-specialist-review.md),
[earlier proposed review](CH-02-M-nonmonetary-review.md). Earlier pending labels
are historical for this approved subset only; no broad packet/gate is closed.

Compatibility verified 2026-10-22: official [release status](https://www.prisma.io/docs/orm/release-status)
identifies v8 as RC; public publisher registry reports latest 8.0.0-rc.25 and prev
7.10.1. Selected stable Prisma/internals **7.10.1**; its package engines support
Node ^20.19 / ^22.12 / >=24.0, and [v7 requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements)
support TypeScript 5.4+. Existing Node 24.19.0, TypeScript 5.9.3 and pnpm 11.28.6
meet requirements. Backend remains CommonJS; CLI config is isolated .mjs,
a [supported config extension](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference),
with no datasource URL or dotenv loading. No runtime ESM migration or pg
replacement. Prisma/internals are dev-only (matching internal parser pin is a
test-tool coupling). No client/adapter needed until separately authorized runtime
integration. PostgreSQL target version is not probed or changed.

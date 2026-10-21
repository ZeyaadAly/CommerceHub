# ADR-005 — Granular authorization and staff delegation

Status: PROPOSED — decision preparation only. 2026-10-21. CH-01/D (legacy CH-P0-008).
Owner: Security + Backend/Frontend/Product; named individual/signature NOT RECORDED.
Gate: SEC-01 / API-01 / DB-01; OPEN. No policy approval or implementation follows from this record.

## Context and approved constraints

CH-03 STAFF_API/STAFF_UI; all privileged inventory/catalog/order consumers. Sources: PRD staff scope, architecture §6.4, database §4, API §§8–9; BA-04/07.

Default-deny backend guard/service permissions plus resource ownership, protected capability checks, last-active-Super-Admin and self-escalation safeguards are mandatory. UI hiding and broad admin labels are never authority.

## Options and trade-offs

A: Super-Admin-only staff/permission administration: smaller privilege surface and matches restrictive PRD language, with operational bottleneck. B: explicitly bounded delegated grants: improves operations, but needs grant-scope checks, protected capabilities, step-up and audit/revocation rules. Neither option allows granting beyond effective delegator authority or bypassing the protected Super Admin invariant.

## Recommendation and owner decision

Use the restrictive PRD staff-management rule as the review starting point; approve a delegated exception only through a signed exact endpoint/action/resource matrix. Do not select B from permissive API examples. Resolve canonical permission names before freezing DTOs or seeds; no union of incompatible spellings.

## Security and operational effects

Assess last-admin races, staff disable/session invalidation, protected self-modification, horizontal ownership and permission-check caching. Critical grant changes need the early atomic audit writer A, not the later explorer. Recovery/bootstrap must be separately approved and auditable.

## API and database effects

Align catalog.write versus create/update/manage and rbac.assign/permissions.manage versus roles.assign. Correct user_roles versus staff_role_assignments through reviewed mapping, not an undocumented schema rename. UI capabilities are minimal projections, never client-supplied claims.

## Evidence, approval and reversal

Security/Product approve capability catalog, delegation and step-up matrix; Backend/Data review grants and locking; later tests include concurrent last-admin removal, self-escalation, direct URL/API denial and stale-session revocation. Reopen when adding capabilities or changing delegation.

Approval date/signature: NOT RECORDED. Decision verification: NOT RUN; later implementation proof requires separate authorization. Reversal must preserve historical financial/stock/audit evidence, keep mandatory security constraints and receive the affected owners' review.

See the [single decision matrix](decision-matrix.md), [gate register](../../implementation/gate-register.md), [architecture baseline](../../04-architecture.md), [database baseline](../../05-database-design.md) and [API baseline](../../06-api-design.md).

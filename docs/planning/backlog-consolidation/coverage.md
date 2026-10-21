# Adopted backlog definition — coverage.md

**ADOPTED by explicit owner approval on 2026-10-21 after PR #21 merge
`8543df03c23423ff58d383dde0de2a5192725dbb`.**

The 21-story mapping, five ownership moves, missing-feature assignments and exact
48-milestone definitions/dependencies are approved. Current execution/readiness
comes from [adoption.json](adoption.json) and
[the operative tracker](../../implementation/story-tracker.md). CH-01 is partial
IN PROGRESS; CH-02–CH-21 NOT STARTED. No feature or specialist policy is authorized.

[verify.mjs](verify.mjs) validates immutable legacy evidence from its recorded Git
baseline, then [verify-adoption.mjs](verify-adoption.mjs) checks live synchronization.
[Adoption review evidence](adoption-verification.md) records actual checks.

The approved proposal text below is preserved verbatim. Its PROPOSED/pending
adoption/status fields and instruction to await adoption are historical metadata,
now superseded by this explicit adoption. Its substantive scope, acceptance,
phase, gate and milestone definitions remain binding without change. There are
48 milestone tasks; the old phrase "not 46 new stories" is historical editorial
wording and does not change that count. No original IDs/history are deleted.
<!-- LEGACY BASELINE: 8543df03c23423ff58d383dde0de2a5192725dbb -->

# Requirements, contracts and gap coverage

Proposed requirement owners include delivery and enabling schema/test contributors;
one requirement can span several parents. Every original story still has exactly
one parent. Original source traceability is stored separately, unchanged. Existing
PARTIAL/GAP/PLANNED rows are dated planning evidence and do not reverse accepted
tooling work. Neither a mapped ID nor a source hash proves implementation coverage.

PROPOSED assignment, not acceptance. Full 59 functional/19 NFR source rows and original acceptance text are in [inventory.json](inventory.json); the source baselines are unchanged. Source-unit ranges/hashes cover every line of all eight BMAD documents plus live governance/evidence. Every table row (personas, endpoints, screens, invariants, tests, policies, ADR candidates) is indexed verbatim with source line and review owners. This ensures structural retention, not proof that every semantic conflict is solved or implementation is complete.

| Requirement    | Source phase | Proposed owner(s)                                      | Existing coverage / blocker retained                                 |
| -------------- | ------------ | ------------------------------------------------------ | -------------------------------------------------------------------- |
| CH-AUTH-001    | P0           | CH-03, CH-11, CH-02                                    | PLANNED; name default unresolved BA-14                               |
| CH-AUTH-002    | P0           | CH-03, CH-11, CH-02                                    | PLANNED; SEC-01 audience/transport open                              |
| CH-AUTH-003    | P0           | CH-03, CH-11, CH-02                                    | PARTIAL; explicit recovery/delivery/session policy needs AC          |
| CH-AUTH-004    | P0           | CH-11, CH-02                                           | GAP; backend owner and email-change contract BA-08/14                |
| CH-AUTH-005    | P0           | CH-11, CH-02                                           | GAP; backend/migration owner BA-08                                   |
| CH-AUTH-006    | P1           | CH-18                                                  | GAP; no explicit implementation owner/list DTO                       |
| CH-CAT-001     | P0           | CH-04, CH-11, CH-02                                    | PLANNED                                                              |
| CH-CAT-002     | P0           | CH-04, CH-11, CH-02                                    | PLANNED; stable sort/search normalization fixture refinement         |
| CH-CAT-003     | P0           | CH-04, CH-11, CH-02                                    | PARTIAL; default SKU/unique combination BA-15                        |
| CH-CAT-004     | P0           | CH-04, CH-11, CH-02                                    | PARTIAL; reorder/remove/cleanup BA-13                                |
| CH-CAT-005     | P0           | CH-11, CH-02                                           | PLANNED; explicit SEO tests refine before READY                      |
| CH-CAT-006     | P1           | CH-17                                                  | GAP; no dedicated story/contract                                     |
| CH-CAT-007     | P1           | CH-17, CH-20                                           | PARTIAL; product vs variant granularity differs in DB                |
| CH-CAT-008     | P1           | CH-17, CH-20                                           | PARTIAL; eligibility/edit/moderation details pending P1              |
| CH-CART-001    | P0           | CH-06, CH-11, CH-12                                    | PARTIAL; guest merge conflict/cart page owner BA-02/09               |
| CH-CART-002    | P0           | CH-06, CH-12                                           | PARTIAL; cart summary/page acceptance BA-09; FIN-01                  |
| CH-CHECK-001   | P0           | CH-06, CH-07, CH-12                                    | PARTIAL; address API BA-08; FIN-01/SEC-01                            |
| CH-CHECK-002   | P0           | CH-07                                                  | PARTIAL; persistence ordering BA-06; PAY-01 also applies             |
| CH-CHECK-003   | P0           | CH-06, CH-07, CH-08                                    | GATED; FIN-01 inclusive formula/state reconciliation                 |
| CH-CHECK-004   | P0           | CH-08, CH-12                                           | GATED; INV-01/PAY-01 exception actions BA-12/25                      |
| CH-CHECK-005   | P1           | CH-17, CH-20                                           | GAP; explicit apply/remove DTO, FIN-01 revision                      |
| CH-ORD-001     | P0           | CH-12                                                  | PLANNED                                                              |
| CH-ORD-002     | P0           | CH-08, CH-13, CH-12                                    | PARTIAL; inconsistent aggregate states BA-03                         |
| CH-ORD-003     | P0           | CH-13                                                  | PARTIAL; tracking requiredness/items split contract BA-12            |
| CH-ORD-004     | P0           | CH-07, CH-08, CH-09, CH-13                             | GAP; unpaid void/exception contract BA-12                            |
| CH-ORD-005     | P1           | CH-16                                                  | GAP; no explicit story owner/complete DTO                            |
| CH-ORD-006     | P1           | CH-16, CH-20                                           | PARTIAL; richer tracking and quantity/window details missing         |
| CH-PAY-001     | P0           | CH-08, CH-12                                           | GATED PAY-01; production/test surface BA-25                          |
| CH-PAY-002     | P0           | CH-08, CH-09                                           | PARTIAL; enums/order BA-03/06; PAY-01                                |
| CH-PAY-003     | P0           | CH-08, CH-13, CH-09                                    | GATED FIN-01/PAY-01; bounded oversight vs P1 advanced UI             |
| CH-PAY-004     | P1           | CH-19, CH-20                                           | GATED PAY-LIVE; no provider approved                                 |
| CH-PAY-005     | P1           | CH-18, CH-19, CH-20                                    | PARTIAL; P0 bounded sandbox oversight only, advanced P1 AC missing   |
| CH-PAY-006     | P1           | CH-16, CH-19, CH-20                                    | GATED FIN-02/PAY-LIVE; customer status/refund-request DTO incomplete |
| CH-ADM-CAT-001 | P0           | CH-04, CH-02                                           | PARTIAL; unpublish/media minimum contract BA-13                      |
| CH-ADM-CAT-002 | P0           | CH-04, CH-02                                           | PLANNED; archive/hierarchy exact DTO refinement                      |
| CH-ADM-CAT-003 | P0           | CH-04, CH-02                                           | PARTIAL; zero/default/combination and archive BA-13/15               |
| CH-ADM-CAT-004 | P0           | CH-04, CH-02                                           | GAP; reorder/remove lifecycle BA-13; OPS-01                          |
| CH-INV-001     | P0           | CH-05, CH-07                                           | GATED INV-01; conservation proof not run                             |
| CH-INV-002     | P0           | CH-05                                                  | PARTIAL; early audit and idempotency BA-07                           |
| CH-INV-003     | P0           | CH-07, CH-08, CH-09                                    | GATED INV-01/PAY-01; order FK ordering BA-06                         |
| CH-INV-004     | P0           | CH-05, CH-13                                           | GAP; BA-11 configurable threshold model/contract                     |
| CH-INV-005     | P1           | CH-18                                                  | GAP; no explicit alert story owner                                   |
| CH-SEC-001     | P0           | CH-03, CH-13, CH-02                                    | GAP; BA-14 staff auth contract; SEC-01                               |
| CH-SEC-002     | P0           | CH-03, CH-02                                           | GATED SEC-01; permission/delegation BA-04                            |
| CH-SEC-003     | P0           | CH-03, CH-02                                           | PARTIAL; invite acceptance and early audit BA-07/14                  |
| CH-SEC-004     | P0           | CH-03, CH-05, CH-13, CH-09, CH-02                      | PARTIAL; writer scheduled too late BA-07                             |
| CH-SEC-005     | P0           | CH-03, CH-06, CH-12, CH-02                             | PLANNED; every handler denial matrix required                        |
| CH-SEC-006     | P1           | CH-18                                                  | GAP; expanded role/audit workflow owner missing                      |
| CH-DASH-001    | P0           | CH-13, CH-14                                           | GAP; BA-10 backend owner/metric definitions                          |
| CH-CUST-001    | P1           | CH-18, CH-20                                           | PARTIAL; endpoint/retention details pending                          |
| CH-MKT-001     | P1           | CH-17, CH-20                                           | PARTIAL; campaign detail and FIN-01 revision                         |
| CH-AN-001      | P1           | CH-18, CH-20                                           | PARTIAL; exports not P2 despite API §16 example                      |
| CH-NOTIF-001   | P1           | CH-18                                                  | GAP; no explicit notification implementation owner                   |
| CH-FUT-001     | P2           | CH-21                                                  | RESEARCH ONLY; advanced search scope needs review                    |
| CH-FUT-002     | P2           | CH-21                                                  | PARTIAL RESEARCH; gift-card/referral depth unspecified               |
| CH-FUT-003     | P2           | CH-21                                                  | RESEARCH ONLY; forecasting scope unspecified                         |
| CH-FUT-004     | P2           | CH-21                                                  | RESEARCH ONLY; language release ambiguity BA-26                      |
| CH-FUT-005     | P2           | CH-21                                                  | RESEARCH ONLY                                                        |
| CH-FUT-006     | P2           | CH-21                                                  | GAP; no dedicated feasibility owner, association only                |
| NFR-SEC-01     | P0           | CH-03, CH-11, CH-13, CH-14                             | SEC-01 transport/revocation proof                                    |
| NFR-SEC-02     | P0           | CH-03, CH-14                                           | SEC-01 policy/rates; delivery adapter scope                          |
| NFR-SEC-03     | P0           | CH-03, CH-12, CH-14                                    | SEC-01 permission drift BA-04                                        |
| NFR-SEC-04     | P0           | CH-03, CH-04, CH-14                                    | OPS/SEC limits; media BA-13                                          |
| NFR-SEC-05     | P0           | CH-01, CH-09, CH-14                                    | OPS/SEC/LEG data boundaries                                          |
| NFR-SEC-06     | P0           | CH-01, CH-14                                           | Toolchain/CI absent; no scan result claimed                          |
| NFR-DATA-01    | P0           | CH-07, CH-08, CH-14, CH-02                             | INV/PAY; persistence BA-06                                           |
| NFR-DATA-02    | P0           | CH-02, CH-05, CH-07, CH-08, CH-09, CH-14, CH-15        | DB-0/DB-01/OPS/LEG; BA-05–07                                         |
| NFR-PERF-01    | P0           | CH-04, CH-11, CH-14                                    | Load/device budgets and Lighthouse target pending                    |
| NFR-PERF-02    | P0           | CH-13, CH-14                                           | BA-10/18 complete route fixture ownership                            |
| NFR-A11Y-01    | P0           | CH-10, CH-14                                           | UX tokens/wireframes/contrast evidence absent                        |
| NFR-RESP-01    | P0           | CH-10, CH-11, CH-04, CH-05, CH-14                      | UX approval and full screen matrix BA-18/23                          |
| NFR-REL-01     | P0           | CH-03, CH-09, CH-14                                    | Health contract gaps; OPS-01                                         |
| NFR-REL-02     | P0           | CH-01, CH-09, CH-14, CH-15                             | OPS-01 RTO/RPO/SLO unset; BA-19                                      |
| NFR-TEST-01    | P0           | CH-01, CH-14                                           | CI absent; coverage candidate, not passed                            |
| NFR-API-01     | P0           | CH-01, CH-03, CH-14                                    | API-01 states/permissions/completeness BA-03/04                      |
| NFR-OPS-01     | P0           | CH-01, CH-15                                           | OPS/SEC; no provider deployment verified                             |
| NFR-OPS-02     | P1           | CH-18                                                  | GAP: explicit P1 notification owner; OPS-01                          |
| NFR-UX-01      | P0           | CH-10, CH-11, CH-12, CH-13, CH-04, CH-05, CH-03, CH-14 | UX readiness gate; BA-22/23                                          |

## Complete source inventory boundaries

- Roles: guest, registered customer, catalog/inventory/fulfillment staff bundles, protected Super Admin and machine worker; expanded support/marketing/finance permission responsibilities stay explicit in PRD/UX/API tables. UI hints never grant authority.
- APIs: all endpoint and DTO/error/pagination/idempotency/CSRF responsibilities in API §§1–22; absent endpoints remain gaps, never invented approved routes.
- Data: every entity, key/CHECK/FK/index, role boundary, snapshot, append-only ledger, transaction/locking and migration rule in DB §§1–22; illustrative SQL is not migration authority.
- UX: all routes, route-owned data, interaction states, personas/journeys, responsive/a11y/SEO and test matrices in UX §§1–16; P1/P2 tables retain phase.
- Security/commerce/operations: all PRD business rules/journeys/edge cases/NFRs, architecture threat/decision/recovery clauses, DB/API tests, original story AC and gates.
- In inventory, tableFacts are verbatim responsibilities (including rows without IDs); sources.units cover non-table prose. OriginalStories preserves each complete specification, including all five original AC. The separate Docker-free 006 source is hashed/section-indexed; AC-006-01–15 are retained as source text and table facts are added by the verifier report when checked.

## Gaps assigned without inventing policy

| Gap / source requirement                                                        | Proposed owner and release                                                      | Unresolved decision/contract                                                                          |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Profile, address, default-address concurrency, verified email change (BA-08/14) | CH-11 P0, identity services CH-03                                               | SEC-01 and exact API/DB workflow before implementation                                                |
| Full editable cart page; guest cart/login merge conflict (BA-02/09)             | CH-06 P0; CH-11 add-to-cart                                                     | Product reconciles contradictory baseline; merge remains blocked, not omitted                         |
| Overview aggregate/date/sandbox/permitted metrics (BA-10)                       | CH-13 P0                                                                        | Metric/permission/date definitions; no invented KPI                                                   |
| Low-stock threshold configuration/filter (BA-11)                                | CH-05 P0; alerts CH-18 P1                                                       | INV-01 persistence/default/edit policy unresolved                                                     |
| Unpaid void/manual sandbox exception handling (BA-12)                           | CH-13 P0, CH-07/08 domain policies                                              | PAY-01/INV-01 state/permission contract                                                               |
| Unpublish/variant archive/media lifecycle/default SKU/price (BA-13/15)          | CH-04 P0                                                                        | SEC/FIN/OPS/DB reviewed rules; no zero-price assumption                                               |
| Staff audience/invite acceptance (BA-04/14)                                     | CH-03 P0                                                                        | SEC-01 allow/deny/delegation/step-up matrix                                                           |
| Shipping zones/flat fees and simple shipment/tracking                           | CH-06 quote policy + CH-13 fulfillment + CH-12 shopper projection P0            | FIN/OPS/LEG shipping/tax values gated; no live carrier service                                        |
| Settings summary versus controls                                                | CH-13 P0 summary or specifically approved constrained fields; CH-18 P1 controls | Preserve UX conditional scope, SEC/FIN/OPS confirmation; no new settings mutation authority           |
| Customer cancellation, eligibility/shipment/capture race                        | CH-16 P1                                                                        | Cutoff, void/refund/restock policies require owner decision; not P0                                   |
| Enhanced discovery, wishlist/reviews/campaign details                           | CH-17 P1                                                                        | Detailed P1 contracts and FIN-01 revision; advanced ranking remains P2                                |
| Active sessions, notifications/preferences, stock alerts, extended tracking     | CH-18 P1                                                                        | SEC/OPS/LEG templates/recipients/retry/retention/notice rules                                         |
| Advanced audit/bundles, customer ops, reporting/exports                         | CH-18 P1                                                                        | Permissions, privacy, Cairo/DST, captured/refund/net metrics; exports stay P1 despite API §16 example |
| Native mobile/fraud, localization, gift cards/referrals/forecasting             | CH-21 P2 research                                                               | BA-26 separate research scope/AC; no implementation or phase promotion                                |

The above assigns existing approved requirements missing or weakly assigned in the 59 stories. It does not accept audit recommendations as policy. Cross-document phase conflicts (guest merge, exports, localization, advanced search wording) remain explicit owner decisions; no requirement is retired. All source phase tags are preserved in inventory.

## Audit finding accountability

All 26 BA findings are retained verbatim with formal-review disposition; their recommendations are unapproved. BA-16 directory convention alone is resolved historically; other aspects follow formal review.

| BA    | Proposed review owner(s)                                                                                                                          | Disposition                                                         |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| BA-01 | CH-01                                                                                                                                             | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-02 | CH-06, CH-11, CH-12                                                                                                                               | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-03 | CH-02, CH-07, CH-08, CH-13                                                                                                                        | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-04 | CH-03, CH-13, CH-18                                                                                                                               | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-05 | CH-02, CH-04                                                                                                                                      | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-06 | CH-02, CH-07, CH-08, CH-09                                                                                                                        | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-07 | CH-03, CH-05, CH-09, CH-13                                                                                                                        | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-08 | CH-06, CH-11                                                                                                                                      | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-09 | CH-06, CH-11                                                                                                                                      | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-10 | CH-13                                                                                                                                             | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-11 | CH-05                                                                                                                                             | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-12 | CH-07, CH-08, CH-13                                                                                                                               | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-13 | CH-04                                                                                                                                             | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-14 | CH-03, CH-11                                                                                                                                      | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-15 | CH-02, CH-04, CH-06                                                                                                                               | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-16 | CH-01                                                                                                                                             | Directory convention historically resolved; no new ADR acceptance   |
| BA-17 | CH-01                                                                                                                                             | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-18 | CH-04, CH-05, CH-11, CH-12, CH-13, CH-14                                                                                                          | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-19 | CH-01, CH-09, CH-14, CH-15                                                                                                                        | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-20 | CH-16, CH-17, CH-18, CH-20                                                                                                                        | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-21 | CH-16, CH-19                                                                                                                                      | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-22 | CH-01, CH-02, CH-03, CH-04, CH-05, CH-06, CH-07, CH-08, CH-09, CH-10, CH-11, CH-12, CH-13, CH-14, CH-15, CH-16, CH-17, CH-18, CH-19, CH-20, CH-21 | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-23 | CH-10, CH-11, CH-12, CH-13, CH-14                                                                                                                 | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-24 | CH-01                                                                                                                                             | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-25 | CH-08, CH-15                                                                                                                                      | OPEN/scoped as formal review; proposed assignment is not resolution |
| BA-26 | CH-21                                                                                                                                             | OPEN/scoped as formal review; proposed assignment is not resolution |

## Review limits

Inventory completeness is a reproducible check of retained text, IDs, references, phases, edges and gates. It is not an automatic semantic acceptance guarantee. Approved source requirements remain normative; their contradictory/underspecified clauses must be resolved through named owners/gates before implementation. No numerical candidate, retention policy, permissions scheme, provider or TTL is selected here.

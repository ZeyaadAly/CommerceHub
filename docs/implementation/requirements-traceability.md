# CommerceHub adopted requirement traceability

2026-10-21 (Africa/Cairo). **CH-01–CH-21 ADOPTED as operative planning baseline.**
Owner explicitly approved adoption, five ownership moves, feature coverage and the
48-milestone schedule after [PR #21](https://github.com/ZeyaadAly/CommerceHub/pull/21)
merged at `8543df03c23423ff58d383dde0de2a5192725dbb`. The adoption decision alone authorized governance synchronization;
separate scoped implementation authority is recorded below. No specialist gate closes.

Default to the [adopted backlog](../planning/backlog-consolidation/README.md), [definitions](../planning/backlog-consolidation/stories.json),
[full acceptance](../planning/backlog-consolidation/backlog.md), [milestone graph](../planning/backlog-consolidation/milestones.json) and
[current adoption/status record](../planning/backlog-consolidation/adoption.json). Legacy CH-P0-001–CH-P2-059 IDs remain
immutable traceability/history, not a competing top-level work queue.
Every inherited requirement/AC/test and gate remains binding; the original
100 edges are historical while the approved scoped milestone repairs now govern
readiness. [Mapping](../planning/backlog-consolidation/mapping.md) and [coverage](../planning/backlog-consolidation/coverage.md) retain all assignments.

The material below the LEGACY BASELINE marker is preserved verbatim history and
is not the operative status/dependency model. Stale proposed/pending and 59-story
execution instructions there are superseded by this adopted header.

## Current C acceptance and D preparation — 2026-10-21

C/007 is **DONE for bounded scope**, after all five acceptance clauses, package/consumer/security tests, exact-head CI and owner PR #23 merge at `5c31a735251eeb179ae3a8b174b49f8ac13004d6` were checked. CH-01 remains partial, full 006 BLOCKED. D/008 is **REVIEW** for decision preparation only.

The [single decision matrix](../architecture/decisions/decision-matrix.md) provides nine PROPOSED ADR packets, all owner/evidence/blocking requests, acceptance/protection visibility limits and deferred decisions. No specialist gate closes. The owner separately authorized CH-03/API transport only; its bounded implementation is now DONE after the separately authorized PR #25 evidence reconciliation, with the API-01 handoff recorded and API-01 still OPEN. CH-03 is IN PROGRESS, never DONE. AUTH/STAFF/DB are unstarted; T has C satisfied but implementation remains UX/quality BLOCKED. No successor starts. Redis spending remains DEFERRED; Docker/WSL not required.

## Operative requirement ownership

| Requirement    | Phase | Adopted delivery/contributor parent(s)                 | Acceptance evidence                                                                                     |
| -------------- | ----- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| CH-AUTH-001    | P0    | CH-03, CH-11, CH-02                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-AUTH-002    | P0    | CH-03, CH-11, CH-02                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-AUTH-003    | P0    | CH-03, CH-11, CH-02                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-AUTH-004    | P0    | CH-11, CH-02                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-AUTH-005    | P0    | CH-11, CH-02                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-AUTH-006    | P1    | CH-18                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CAT-001     | P0    | CH-04, CH-11, CH-02                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CAT-002     | P0    | CH-04, CH-11, CH-02                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CAT-003     | P0    | CH-04, CH-11, CH-02                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CAT-004     | P0    | CH-04, CH-11, CH-02                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CAT-005     | P0    | CH-11, CH-02                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CAT-006     | P1    | CH-17                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CAT-007     | P1    | CH-17, CH-20                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CAT-008     | P1    | CH-17, CH-20                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CART-001    | P0    | CH-06, CH-11, CH-12                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CART-002    | P0    | CH-06, CH-12                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CHECK-001   | P0    | CH-06, CH-07, CH-12                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CHECK-002   | P0    | CH-07                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CHECK-003   | P0    | CH-06, CH-07, CH-08                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CHECK-004   | P0    | CH-08, CH-12                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CHECK-005   | P1    | CH-17, CH-20                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ORD-001     | P0    | CH-12                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ORD-002     | P0    | CH-08, CH-13, CH-12                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ORD-003     | P0    | CH-13                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ORD-004     | P0    | CH-07, CH-08, CH-09, CH-13                             | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ORD-005     | P1    | CH-16                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ORD-006     | P1    | CH-16, CH-20                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-PAY-001     | P0    | CH-08, CH-12                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-PAY-002     | P0    | CH-08, CH-09                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-PAY-003     | P0    | CH-08, CH-13, CH-09                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-PAY-004     | P1    | CH-19, CH-20                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-PAY-005     | P1    | CH-18, CH-19, CH-20                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-PAY-006     | P1    | CH-16, CH-19, CH-20                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ADM-CAT-001 | P0    | CH-04, CH-02                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ADM-CAT-002 | P0    | CH-04, CH-02                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ADM-CAT-003 | P0    | CH-04, CH-02                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-ADM-CAT-004 | P0    | CH-04, CH-02                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-INV-001     | P0    | CH-05, CH-07                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-INV-002     | P0    | CH-05                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-INV-003     | P0    | CH-07, CH-08, CH-09                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-INV-004     | P0    | CH-05, CH-13                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-INV-005     | P1    | CH-18                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-SEC-001     | P0    | CH-03, CH-13, CH-02                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-SEC-002     | P0    | CH-03, CH-02                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-SEC-003     | P0    | CH-03, CH-02                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-SEC-004     | P0    | CH-03, CH-05, CH-13, CH-09, CH-02                      | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-SEC-005     | P0    | CH-03, CH-06, CH-12, CH-02                             | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-SEC-006     | P1    | CH-18                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-DASH-001    | P0    | CH-13, CH-14                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-CUST-001    | P1    | CH-18, CH-20                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-MKT-001     | P1    | CH-17, CH-20                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-AN-001      | P1    | CH-18, CH-20                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-NOTIF-001   | P1    | CH-18                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-FUT-001     | P2    | CH-21                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-FUT-002     | P2    | CH-21                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-FUT-003     | P2    | CH-21                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-FUT-004     | P2    | CH-21                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-FUT-005     | P2    | CH-21                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| CH-FUT-006     | P2    | CH-21                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-SEC-01     | P0    | CH-03, CH-11, CH-13, CH-14                             | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-SEC-02     | P0    | CH-03, CH-14                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-SEC-03     | P0    | CH-03, CH-12, CH-14                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-SEC-04     | P0    | CH-03, CH-04, CH-14                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-SEC-05     | P0    | CH-01, CH-09, CH-14                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-SEC-06     | P0    | CH-01, CH-14                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-DATA-01    | P0    | CH-07, CH-08, CH-14, CH-02                             | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-DATA-02    | P0    | CH-02, CH-05, CH-07, CH-08, CH-09, CH-14, CH-15        | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-PERF-01    | P0    | CH-04, CH-11, CH-14                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-PERF-02    | P0    | CH-13, CH-14                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-A11Y-01    | P0    | CH-10, CH-14                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-RESP-01    | P0    | CH-10, CH-11, CH-04, CH-05, CH-14                      | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-REL-01     | P0    | CH-03, CH-09, CH-14                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-REL-02     | P0    | CH-01, CH-09, CH-14, CH-15                             | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-TEST-01    | P0    | CH-01, CH-14                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-API-01     | P0    | CH-01, CH-03, CH-14                                    | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-OPS-01     | P0    | CH-01, CH-15                                           | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-OPS-02     | P1    | CH-18                                                  | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |
| NFR-UX-01      | P0    | CH-10, CH-11, CH-12, CH-13, CH-04, CH-05, CH-03, CH-14 | Exact original requirement/AC and coverage flags retained in inventory; no implementation pass inferred |

All 78 requirement IDs, original source text/AC and phase assignments remain
unchanged. Multiple parents can contribute to one requirement; every legacy story
still has exactly one parent. Existing missing-feature assignments and all 26 BA
findings now use the approved owners in coverage.md, without settling their policy
choices. The legacy row associations below are preserved as historical evidence.

## Historical C implementation checkpoint — 2026-10-21

This REVIEW checkpoint is superseded by the current acceptance above; its preparation evidence is retained.

The owner separately authorized Milestone C only after PR #22 merged at
`09fc6aa04d8df8a20cc5eb6e3752ae25d5e42bd7`. Bounded shared transport/schema/client
implementation is **REVIEW**, not DONE; human acceptance and merge are pending.
[Milestone C evidence](../verification/CH-01-C.md) maps all five inherited CH-P0-007 clauses, public exports,
negative tests and unresolved API policies. Canonical schemas own inferred types;
no domain policy or specialist gate closes. CH-01 stays partial, 006 BLOCKED,
D/008 and every later milestone unstarted; Redis/spending DEFERRED.

## Historical CH-03/API pre-acceptance transport checkpoint — 2026-10-21

[Technical handoff, inherited acceptance and actual verification](../verification/CH-03-API.md) record transport-only REVIEW. PR #24 merge `ffa113804b4c38237576e6fafaf637cb50779f01` was verified before work; its ADR recommendations remain unsigned PROPOSED. Existing F/C acceptance is unchanged. No authentication, staff governance, persistence or business implementation is accepted. API-01 and all specialist gates remain OPEN; full 006 BLOCKED, Redis spending DEFERRED, Docker/WSL not required. Independent CH-10/T design preparation is a possible next separately authorized task; T implementation awaits UX/quality evidence, and no next milestone starts here.

## Current CH-10/T readiness and API reconciliation — 2026-10-21

[Single concise handoff](../design/CH-10-T-handoff.md): D1–D4 PROPOSED, readiness REVIEW; T implementation BLOCKED on named UX/Product + QA approval and separate implementation authority. C is sufficient predecessor; no full CH-01/API/DB dependency added. API bounded transport is DONE after PR #25's implementation, all inherited AC, exact-head CI and owner merge were assessed; CH-03 stays IN PROGRESS, AUTH/STAFF/DB unaccepted, API-01 OPEN. This task implements no components. All gates/ADRs, historical 001–005 DONE, full 006 BLOCKED, Redis DEFERRED and security-exception dates remain unchanged.
<!-- LEGACY BASELINE: 8543df03c23423ff58d383dde0de2a5192725dbb -->

# CommerceHub requirements traceability

2026-10-20 limited CH-P0-006 evidence: [configuration preparation report](../verification/CH-P0-006-limited.md) and [environment ownership/runbook](../development/docker-free-setup.md) cover only current scaffold preparation toward NFR-SEC-05/06, NFR-OPS-01 and NFR-TEST-01. This supplements the planning snapshot below; it does not claim real PostgreSQL/Redis integration, recovery proof (NFR-REL-02), business acceptance or gate closure.

As of 2026-10-18; planning coverage only. Source requirement text/acceptance: [02 §§7/13](../02-prd.md). Architecture owner/invariants: [04 §§4–17](../04-architecture.md). Entity names: [05 §§4–11/18](../05-database-design.md). Endpoint paths omit /api/v1: [06 §§4–15/18](../06-api-design.md). Screens and UX-* tests: [03 §§4/13](../03-ux-specification.md). Story IDs: [07 §12](../07-implementation-plan.md), checked against [08](../08-epics-and-stories.md).

Each row identifies existing parent-story association; PARTIAL/GAP flags are not solved by that association. Proposed assignment to a broad story requires reviewed child acceptance before READY. PLANNED also means not implemented or tested. No API, database or UX test suite exists. Named tests below are source specifications or explicitly described required tests, never executed evidence. IDs 001–048 expand to CH-P0, 049–056 CH-P1, 057–059 CH-P2. Owner roles: identity/RBAC=Backend+Security; catalog/shopping/stock/orders/payments=Backend/Data with Finance/Product for money and INV/PAY gates; UI=Frontend/UX; governance=Lead/Product; quality=QA; runtime/recovery=Operations. No individual owner signed off.

Inventory verified against PRD: 59 functional requirements (37 P0, 16 P1, 6 P2) and 19 NFRs (18 P0/foundation, 1 P1). Every ID has its own row. All 55 P0/foundation requirement IDs are traceable; partial/gap labels prevent interpreting that inventory completeness as complete implementation coverage.

| Requirement | Priority / release | Epic; associated stories | API endpoints / missing contract | Database entities | UX screens | Planned tests / acceptance evidence | Coverage / blockers |
|---|---|---|---|---|---|---|---|
| CH-AUTH-001 | P0 / MVP | E1; CH-P0-012, CH-P0-037 | POST /auth/register | users,user_credentials,verification_tokens | /register | API-009; DB-001/002; UX-05 | PLANNED; name default unresolved BA-14 |
| CH-AUTH-002 | P0 / MVP | E1,E4; CH-P0-013, CH-P0-037 | POST /auth/login,/auth/logout; GET /me | sessions,users | /login; account shell | API-007/008; DB-003; UX-18 | PLANNED; SEC-01 audience/transport open |
| CH-AUTH-003 | P0 / MVP | E1,E4; CH-P0-012, CH-P0-013, CH-P0-037 | POST /auth/email-verification/request,/confirm; /auth/password-recovery/request,/confirm | verification_tokens,sessions,user_credentials | /verify-email,/forgot-password,/reset-password | API-009; DB-002; UX-05 | PARTIAL; explicit recovery/delivery/session policy needs AC |
| CH-AUTH-004 | P0 / MVP | E1,E4; CH-P0-037 | GET/PATCH /me | users | /account | API-004/025; DB-017; UX-15 | GAP; backend owner and email-change contract BA-08/14 |
| CH-AUTH-005 | P0 / MVP | E1,E4; CH-P0-037, CH-P0-022 | GET/POST /me/addresses; PATCH/DELETE /me/addresses/{addressId}; POST .../make-default | addresses,orders.delivery_address_snapshot | /account/addresses; /checkout | API-004/023; DB-015/017; UX-08 | GAP; backend/migration owner BA-08 |
| CH-AUTH-006 | P1 / V1 | E5; CH-P1-049, CH-P1-056 | POST /me/sessions/{sessionId}/revoke; session-list contract missing | sessions | Advanced account sessions (P1) | Revocation/reauth/IDOR acceptance in PRD; API-007 foundation | GAP; no explicit implementation owner/list DTO |
| CH-CAT-001 | P0 / MVP | E1,E4; CH-P0-017, CH-P0-035 | GET /catalog/products | products,product_variants,product_categories | /products; /categories/[slug]; / | API-002/026; DB-024; UX-01/02 | PLANNED |
| CH-CAT-002 | P0 / MVP | E1,E4; CH-P0-017, CH-P0-035 | GET /catalog/products?q&categoryId&brandId&minPrice&maxPrice&available&sort | products,brands,categories,product_variants | /products; URL query filters | API-002/026; DB-024; UX-02 | PLANNED; stable sort/search normalization fixture refinement |
| CH-CAT-003 | P0 / MVP | E1,E4; CH-P0-015, CH-P0-036 | GET /catalog/products/{slug} | product_variants,variant_attributes,variant_attribute_values,variant_value_selections | /products/[slug] | UX-03; API-002; SKU-combination tests per PRD | PARTIAL; default SKU/unique combination BA-15 |
| CH-CAT-004 | P0 / MVP | E1,E4; CH-P0-016, CH-P0-035, CH-P0-036, CH-P0-041 | GET /catalog/products/{slug}; POST /admin/media/upload-intents; POST /admin/media/{mediaId}/attach | media_assets,product_images | Gallery/cards; admin media editor | UX-03/09; malicious upload/content/alt/fallback checks per PRD | PARTIAL; reorder/remove/cleanup BA-13 |
| CH-CAT-005 | P0 / MVP | E4; CH-P0-035, CH-P0-036 | GET /catalog/products/{slug},/catalog/categories/{slug}; frontend metadata/robots/sitemap | products.seo_title/seo_description,categories,slugs | Public product/category; private noindex | UX-01; canonical/publish/robots SEO assertions per PRD | PLANNED; explicit SEO tests refine before READY |
| CH-CAT-006 | P1 / V1 | E5; CH-P1-049, CH-P1-056 | P1 attribute-filter/merchandising DTO missing | variant attributes,products | Category-specific filters (P1) | PRD relevance/composition/visibility acceptance | GAP; no dedicated story/contract |
| CH-CAT-007 | P1 / V1 | E5; CH-P1-053, CH-P1-056 | GET/POST /wishlist/items; DELETE /wishlist/items/{itemId} | wishlists,wishlist_items | /account/wishlist | Duplicate/ownership/archive/no-reserve tests per PRD | PARTIAL; product vs variant granularity differs in DB |
| CH-CAT-008 | P1 / V1 | E5; CH-P1-053, CH-P1-056 | GET/POST /catalog/products/{productId}/reviews | product_reviews,order_items | Product reviews/write flow | API-032; verified-purchase/moderation/dedupe tests | PARTIAL; eligibility/edit/moderation details pending P1 |
| CH-CART-001 | P0 / MVP | E2,E4; CH-P0-020, CH-P0-036, CH-P0-038 | GET /cart; POST /cart/items; PATCH/DELETE /cart/items/{itemId} | carts,cart_items | /cart; product add; login reconciliation | DB-005; UX-04; quantity/ownership tests | PARTIAL; guest merge conflict/cart page owner BA-02/09 |
| CH-CART-002 | P0 / MVP | E2,E4; CH-P0-020, CH-P0-021, CH-P0-022, CH-P0-038 | GET /cart; POST /checkout/quotes | cart_items,checkout_quotes,checkout_quote_items | /cart; /checkout summary | API-003/010/011; DB-016; UX-06 | PARTIAL; cart summary/page acceptance BA-09; FIN-01 |
| CH-CHECK-001 | P0 / MVP | E2,E4; CH-P0-022, CH-P0-025, CH-P0-038 | POST /checkout/quotes,/checkout/orders; GET /shipping/zones | addresses,checkout_quotes,product_variants | /checkout address/review | API-003/010; UX-05/06; zone/verification rejection tests | PARTIAL; address API BA-08; FIN-01/SEC-01 |
| CH-CHECK-002 | P0 / MVP | E2; CH-P0-023, CH-P0-024, CH-P0-025 | POST /checkout/orders + Idempotency-Key | orders,order_items,inventory_reservations,idempotency_records | Checkout submit/result | API-012/013/014/015; DB-006/007/012 | PARTIAL; persistence ordering BA-06; PAY-01 also applies |
| CH-CHECK-003 | P0 / MVP | E2,E3; CH-P0-021, CH-P0-024, CH-P0-025, CH-P0-029 | POST /checkout/quotes,/checkout/orders; GET /orders/{orderId} | checkout_quote_items,orders,order_items | Checkout breakdown; history/invoice snapshot | API-011/023; DB-015/016; UX-06/08 | GATED; FIN-01 inclusive formula/state reconciliation |
| CH-CHECK-004 | P0 / MVP | E3,E4; CH-P0-029, CH-P0-038, CH-P0-039 | GET /checkout/orders/{orderId}/payment-status; POST .../sandbox-payment-attempts | orders,payment_intents,payment_attempts,inventory_reservations | /checkout/result; /account/orders/[orderId] | API-015/016/017; DB-008/009/010/011; UX-07 | GATED; INV-01/PAY-01 exception actions BA-12/25 |
| CH-CHECK-005 | P1 / V1 | E5; CH-P1-052, CH-P1-056 | Coupon application/requote contract missing (P1) | coupons,coupon_redemptions,promotion_rules | Cart/checkout coupons (P1) | API-031; DB-023; PRD J-10 | GAP; explicit apply/remove DTO, FIN-01 revision |
| CH-ORD-001 | P0 / MVP | E3,E4; CH-P0-031, CH-P0-039 | GET /orders,/orders/{orderId},/orders/{orderId}/shipments | orders,order_items,order_status_history,shipments | /account/orders; detail | API-004/023; DB-015/017; UX-08 | PLANNED |
| CH-ORD-002 | P0 / MVP | E3,E4; CH-P0-029, CH-P0-032, CH-P0-039, CH-P0-043 | GET /orders/{orderId}; POST /admin/orders/{orderId}/fulfillment-transitions | orders,order_status_history | Order timeline; admin detail | API-019/022; UX-11; invalid-transition tests | PARTIAL; inconsistent aggregate states BA-03 |
| CH-ORD-003 | P0 / MVP | E3,E4; CH-P0-032, CH-P0-043 | GET /admin/orders/{orderId}; POST .../fulfillment-transitions,.../shipments; PATCH /admin/shipments/{shipmentId} | orders,shipments,order_status_history,audit_logs | Admin order queue/detail; customer timeline | API-022/027; UX-11; unpaid/permission denial | PARTIAL; tracking requiredness/items split contract BA-12 |
| CH-ORD-004 | P0 / MVP | E2,E3; CH-P0-023, CH-P0-029, CH-P0-030, CH-P0-032 | Internal expiry/release; unpaid-void endpoint MISSING | inventory_reservations,stock_movements,payment_events,orders | Expired/pending result; operator exception view | API-016/017/020; DB-009/010/019 | GAP; unpaid void/exception contract BA-12 |
| CH-ORD-005 | P1 / V1 | E5; CH-P1-049, CH-P1-056 | POST /orders/{orderId}/cancellation-requests | orders,order_status_history; cancellation model TBD | Owned order cancel action (P1) | PRD cutoff/duplicate/shipment/payment race acceptance | GAP; no explicit story owner/complete DTO |
| CH-ORD-006 | P1 / V1 | E5; CH-P1-050, CH-P1-056 | POST/GET /returns; GET /admin/returns; POST .../decisions | return_requests,return_items; shipment_items if approved | /account/returns; richer shipment tracking | API-030; DB-022; UX-19 | PARTIAL; richer tracking and quantity/window details missing |
| CH-PAY-001 | P0 / MVP | E3,E4; CH-P0-027, CH-P0-038 | POST /checkout/orders/{orderId}/sandbox-payment-attempts; GET .../payment-status | payment_intents,payment_attempts | Sandbox pay/result | API-028; adapter scenario suite; UX-07 | GATED PAY-01; production/test surface BA-25 |
| CH-PAY-002 | P0 / MVP | E3; CH-P0-026, CH-P0-027, CH-P0-028, CH-P0-029, CH-P0-030 | Sandbox attempts/status; POST /webhooks/payments/sandbox (test only) | payment_intents,payment_attempts,payment_transactions,payment_events,idempotency_records | Payment pending/status; admin evidence | API-014/015/018/019/020; DB-008/011/012/013 | PARTIAL; enums/order BA-03/06; PAY-01 |
| CH-PAY-003 | P0 / MVP | E3; CH-P0-026, CH-P0-029, CH-P0-032, CH-P0-033 | GET /admin/payments,/admin/payments/{paymentIntentId}; own order projection | payment_transactions,orders,audit_logs | Order amounts; minimal sandbox payment oversight | API-023/027; DB-016/018 | GATED FIN-01/PAY-01; bounded oversight vs P1 advanced UI |
| CH-PAY-004 | P1 / V1 | E5; CH-P1-055, CH-P1-056 | POST /webhooks/payments/{approvedProvider} | payment_events,payment_intents,payment_transactions | Hosted provider return/result (P1) | Provider signature/replay/reorder/certification; API-018/019 foundations | GATED PAY-LIVE; no provider approved |
| CH-PAY-005 | P1 / V1 | E5; CH-P1-054, CH-P1-055, CH-P1-056 | GET /admin/payments; POST .../{paymentIntentId}/reconcile; richer P1 filters DTO TBD | payment_attempts,payment_transactions,payment_reconciliations | Payments/discrepancy dashboard (P1) | Ledger aggregate/filter/redaction tests per PRD | PARTIAL; P0 bounded sandbox oversight only, advanced P1 AC missing |
| CH-PAY-006 | P1 / V1 | E5; CH-P1-051, CH-P1-055, CH-P1-056 | POST /admin/refunds/{refundRequestId}/approve,/execute; GET /admin/refunds | refund_requests,refunds,payment_transactions | Refund queue/detail and own status (P1) | API-029; DB-021; UX-19; PRD J-07 | GATED FIN-02/PAY-LIVE; customer status/refund-request DTO incomplete |
| CH-ADM-CAT-001 | P0 / MVP | E1,E4; CH-P0-015, CH-P0-041 | POST/PATCH /admin/products[/{productId}]; POST .../publish,.../archive | products,product_variants,product_images | Products/editor/review publish | UX-09; API-005/023/027; DB-015 | PARTIAL; unpublish/media minimum contract BA-13 |
| CH-ADM-CAT-002 | P0 / MVP | E1,E4; CH-P0-015, CH-P0-017, CH-P0-041 | GET/POST/PATCH /admin/categories[/{id}],/admin/brands[/{id}] | categories,category_closure,brands,product_categories | Admin categories/brands; public category | Cycle/slug/reference denial tests per PRD; UX-09 | PLANNED; archive/hierarchy exact DTO refinement |
| CH-ADM-CAT-003 | P0 / MVP | E1,E4; CH-P0-015, CH-P0-041 | POST /admin/products/{productId}/variants; PATCH /admin/variants/{variantId} | product_variants,variant_attributes,variant_value_selections | Variant editor; selectors | SKU/combination/concurrent/archival tests; UX-03/09 | PARTIAL; zero/default/combination and archive BA-13/15 |
| CH-ADM-CAT-004 | P0 / MVP | E1,E4; CH-P0-016, CH-P0-041 | POST /admin/media/upload-intents; POST /admin/media/{mediaId}/attach | media_assets,product_images | Admin gallery/upload controls | Malformed/oversize/polyglot/ownership tests per PRD | GAP; reorder/remove lifecycle BA-13; OPS-01 |
| CH-INV-001 | P0 / MVP | E2,E4; CH-P0-018, CH-P0-019, CH-P0-023, CH-P0-042 | GET /admin/inventory; internal atomic reserve | inventory_items,inventory_reservations | Stock table/detail; PDP advisory stock | DB-006/007/014; API-012/021; UX-10 | GATED INV-01; conservation proof not run |
| CH-INV-002 | P0 / MVP | E2,E4; CH-P0-018, CH-P0-019, CH-P0-042 | POST /admin/inventory/{variantId}/adjustments; GET .../movements | inventory_items,stock_movements,audit_logs | Adjustment drawer; movement history | API-021/027; DB-014/018; UX-10 | PARTIAL; early audit and idempotency BA-07 |
| CH-INV-003 | P0 / MVP | E2,E3; CH-P0-023, CH-P0-025, CH-P0-029, CH-P0-030 | Checkout acceptance; internal consume/release/expiry | inventory_reservations,inventory_items,stock_movements | Checkout expired/pending views | API-016/017/020; DB-006–010/019 | GATED INV-01/PAY-01; order FK ordering BA-06 |
| CH-INV-004 | P0 / MVP | E2,E4; CH-P0-019, CH-P0-040, CH-P0-042 | GET /admin/inventory; GET /admin/overview; threshold update MISSING | inventory_items; threshold persistence MISSING | Low-stock table/summary | ATS threshold/filter/default/permission boundary tests required | GAP; BA-11 configurable threshold model/contract |
| CH-INV-005 | P1 / V1 | E5; CH-P1-049, CH-P1-056 | P1 alert/hold controls contracts missing | stock_movements,notifications; holds TBD | Alerts/extended stock history (P1) | Dedupe/provenance/ledger consistency per PRD | GAP; no explicit alert story owner |
| CH-SEC-001 | P0 / MVP | E1,E4; CH-P0-013, CH-P0-014, CH-P0-040 | Staff login contract unresolved; protected /admin/** | users,sessions,staff_memberships | Separate staff login/admin shell | API-005/007/008; DB-003; session audience tests | GAP; BA-14 staff auth contract; SEC-01 |
| CH-SEC-002 | P0 / MVP | E1,E4; CH-P0-014, CH-P0-044 | /admin/staff; PUT .../{staffId}/roles; /admin/roles,/admin/permissions | staff_memberships,roles,permissions,role_permissions,staff_role_assignments,staff_permission_overrides | Permission matrix/staff edit | API-005/006; DB-003/004; UX-12 | GATED SEC-01; permission/delegation BA-04 |
| CH-SEC-003 | P0 / MVP | E1,E4; CH-P0-014, CH-P0-044 | POST /admin/staff/invitations; POST .../{id}/revoke; PATCH /admin/staff/{staffId} | staff_memberships,verification_tokens,sessions,audit_logs | Staff list/detail/invite | API-006/007/027; DB-003/004; UX-12 | PARTIAL; invite acceptance and early audit BA-07/14 |
| CH-SEC-004 | P0 / MVP | E1,E3,E4; CH-P0-014, CH-P0-019, CH-P0-032, CH-P0-033, CH-P0-044 | GET /admin/audit-logs; critical mutation writers | audit_logs,order_status_history,stock_movements | Bounded admin audit history | API-027; DB-018; log leak/fail-closed tests | PARTIAL; writer scheduled too late BA-07 |
| CH-SEC-005 | P0 / MVP | E1,E2,E3; CH-P0-013, CH-P0-014, CH-P0-020, CH-P0-031 | All protected /me,/cart,/checkout,/orders,/admin routes | Owner FKs; API predicates across private entities | Own account/orders; forbidden routes | API-004/005; DB-017; UX-08/15 | PLANNED; every handler denial matrix required |
| CH-SEC-006 | P1 / V1 | E5; CH-P1-049, CH-P1-054, CH-P1-056 | /admin/audit-logs; /admin/roles; sensitive export contract missing | audit_logs,roles,role_permissions,staff_role_assignments | Advanced audit/bundles UI (P1) | Grant immediacy/filter/export denial tests per PRD | GAP; expanded role/audit workflow owner missing |
| CH-DASH-001 | P0 / MVP | E4; CH-P0-040, CH-P0-045 | GET /admin/overview | Scoped order/payment/inventory aggregates | Admin overview | API-024; UX-13/14; exact metric/permission/timeframe fixtures | GAP; BA-10 backend owner/metric definitions |
| CH-CUST-001 | P1 / V1 | E5; CH-P1-054, CH-P1-056 | P1 support customer search/detail contracts missing | users,addresses,orders,audit_logs | Customers/support detail (P1) | PII masking/scope/retention/export tests per PRD | PARTIAL; endpoint/retention details pending |
| CH-MKT-001 | P1 / V1 | E5; CH-P1-052, CH-P1-056 | GET/POST/PATCH /admin/coupons[/{id}] | coupons,coupon_redemptions,promotion_rules | Coupon/campaign editor (P1) | API-031; DB-023; J-10 | PARTIAL; campaign detail and FIN-01 revision |
| CH-AN-001 | P1 / V1 | E5; CH-P1-054, CH-P1-056 | GET /admin/analytics/sales; export DTO missing | payment_transactions,refunds,orders; aggregates | Analytics/reports/export (P1) | UX-20; Cairo/DST/captured/refund/net fixtures per PRD | PARTIAL; exports not P2 despite API §16 example |
| CH-NOTIF-001 | P1 / V1 | E5; CH-P1-049, CH-P1-056 | GET /me/notifications; delivery/preferences contract missing | notifications,outbox_events | Order/return updates/preferences (P1) | Recipient safety/retry/dedupe/no-financial-effect per PRD | GAP; no explicit notification implementation owner |
| CH-FUT-001 | P2 / Future | E6; CH-P2-057 | Research only; /recommendations candidate | No committed P2 entity | Future personalization/search | New scoped feasibility AC required | RESEARCH ONLY; advanced search scope needs review |
| CH-FUT-002 | P2 / Future | E6; CH-P2-057 | Research only; /loyalty candidate | No committed balance entity | Future loyalty/referral/gift cards | New financial/legal feasibility AC required | PARTIAL RESEARCH; gift-card/referral depth unspecified |
| CH-FUT-003 | P2 / Future | E6; CH-P2-058 | Research only; /warehouses candidate | No committed warehouse model | Future allocation/logistics | Concurrency threat research per 058 | RESEARCH ONLY; forecasting scope unspecified |
| CH-FUT-004 | P2 / Future | E6; CH-P2-059 | Research only; international pricing candidate | No committed currency/tax model | Future localization/currency | New financial/legal/i18n feasibility AC | RESEARCH ONLY; language release ambiguity BA-26 |
| CH-FUT-005 | P2 / Future | E6; CH-P2-059 | Research only; marketplace/settlement candidate | No committed merchant/settlement model | Future vendor portals | New tenant/settlement/legal threat review | RESEARCH ONLY |
| CH-FUT-006 | P2 / Future | E6; CH-P2-057, CH-P2-059 | No committed native/fraud APIs | No committed native/fraud model | Future native/fraud | New acceptance scope required | GAP; no dedicated feasibility owner, association only |

## Nonfunctional requirement inventory

Cross-cutting requirements apply throughout the relevant stories; release verification is 046–048. Infrastructure/frontend-only rows legitimately have no business mutation endpoint/table. Exact thresholds are pending review, never assumed from candidates.

| Requirement | Release/priority | Epic / stories | API/data scope | UX | Planned evidence | Coverage / blocker |
|---|---|---|---|---|---|---|
| NFR-SEC-01 | P0 | E0–E4 as applicable; CH-P0-013, CH-P0-037, CH-P0-040, CH-P0-047 | Auth/unsafe routes; sessions | Login/admin/private shells | API-007/008; DB-003; UX-18 | SEC-01 transport/revocation proof |
| NFR-SEC-02 | P0 | E0–E4 as applicable; CH-P0-012, CH-P0-013, CH-P0-047 | /auth; user_credentials,verification_tokens | Register/verify/recover | API-009; DB-001/002; abuse fixtures | SEC-01 policy/rates; delivery adapter scope |
| NFR-SEC-03 | P0 | E0–E4 as applicable; CH-P0-014, CH-P0-031, CH-P0-044, CH-P0-047 | All protected routes; roles/permissions/owner FKs | Forbidden/admin/own data | API-004/005/006; DB-003/004/017 | SEC-01 permission drift BA-04 |
| NFR-SEC-04 | P0 | E0–E4 as applicable; CH-P0-011, CH-P0-016, CH-P0-047 | All DTOs/media; media_assets | Forms/upload/errors | API-003/025/026; malicious media tests | OPS/SEC limits; media BA-13 |
| NFR-SEC-05 | P0 | E0–E4 as applicable; CH-P0-006, CH-P0-033, CH-P0-047 | All outputs/logs; minimal PII/digests | Private screens; no secret bundles | Secret/bundle/log/fixture inspection | OPS/SEC/LEG data boundaries |
| NFR-SEC-06 | P0 | E0–E4 as applicable; CH-P0-004, CH-P0-005, CH-P0-047 | No business endpoint/entity; CI/dependency controls | No product screen | Dependency/secret scans and review evidence | Toolchain/CI absent; no scan result claimed |
| NFR-DATA-01 | P0 | E0–E4 as applicable; CH-P0-023, CH-P0-025, CH-P0-029, CH-P0-047 | Checkout/settlement; stock/order/effect tables | Checkout outcomes | API-012–020; DB-006–014/019 | INV/PAY; persistence BA-06 |
| NFR-DATA-02 | P0 | E0–E4 as applicable; CH-P0-010, CH-P0-018, CH-P0-024, CH-P0-026, CH-P0-033, CH-P0-047, CH-P0-048 | Historical data/controlled migrations | Stable order/history/admin audit | DB-015/018/020/025; restore proof | DB-0/DB-01/OPS/LEG; BA-05–07 |
| NFR-PERF-01 | P0 | E0–E4 as applicable; CH-P0-017, CH-P0-035, CH-P0-045, CH-P0-047 | /catalog; indexed products/variants | Home/catalog/product | DB-024; API-026; KPI-07 | Load/device budgets and Lighthouse target pending |
| NFR-PERF-02 | P0 | E0–E4 as applicable; CH-P0-040, CH-P0-045, CH-P0-046 | /admin/overview and active route only; bounded read models | All admin routes; principal caches | UX-13/14/18; API-024; HAR traces | BA-10/18 complete route fixture ownership |
| NFR-A11Y-01 | P0 | E0–E4 as applicable; CH-P0-034, CH-P0-046 | No dedicated endpoint/table; all error/form contracts | All priority screens/dialogs | UX-17; axe+manual keyboard/focus/zoom | UX tokens/wireframes/contrast evidence absent |
| NFR-RESP-01 | P0 | E0–E4 as applicable; CH-P0-034, CH-P0-035, CH-P0-041, CH-P0-042, CH-P0-046 | No dedicated endpoint/table | 360/768/1440 screens; scoped table scroll | UX-16; screenshots/layout checks | UX approval and full screen matrix BA-18/23 |
| NFR-REL-01 | P0 | E0–E4 as applicable; CH-P0-011, CH-P0-033, CH-P0-047 | Health/readiness endpoints not fully enumerated; audit/outbox | Errors/pending and operator diagnostics | API-025/027; redaction/readiness tests | Health contract gaps; OPS-01 |
| NFR-REL-02 | P0 foundation | E0–E4 as applicable; CH-P0-006, CH-P0-030, CH-P0-047, CH-P0-048 | Runtime/restore; durable outbox/stock/payments | Operator runbooks/recovery | DB-019/025; queue/restore drills | OPS-01 RTO/RPO/SLO unset; BA-19 |
| NFR-TEST-01 | P0 | E0–E4 as applicable; CH-P0-005, CH-P0-046, CH-P0-047 | All API/DB contracts and fixtures | Shopper/admin critical journeys | KPI-01–04; API/DB/UX source suites | CI absent; coverage candidate, not passed |
| NFR-API-01 | P0 | E0–E4 as applicable; CH-P0-007, CH-P0-011, CH-P0-045, CH-P0-047 | /api/v1 OpenAPI/client; wire schemas not Prisma | Both app API consumers | API-001/033/034; contract drift tests | API-01 states/permissions/completeness BA-03/04 |
| NFR-OPS-01 | P0 | E0–E4 as applicable; CH-P0-006, CH-P0-048 | Separate UIs/API/worker; API-only database access | Independently hosted apps | Environment/build/credential/smoke inspection | OPS/SEC; no provider deployment verified |
| NFR-OPS-02 | P1 | E5; E3 foundation; CH-P1-049, CH-P1-056 | P1 jobs/delivery; notifications/outbox | P1 notifications/exception ops | Durable retry/DLQ/metrics tests; P0 030 foundation only | GAP: explicit P1 notification owner; OPS-01 |
| NFR-UX-01 | P0 | E0–E4 as applicable; CH-P0-034, CH-P0-035, CH-P0-036, CH-P0-037, CH-P0-038, CH-P0-039, CH-P0-040, CH-P0-041, CH-P0-042, CH-P0-043, CH-P0-044, CH-P0-046 | Shared error/validation API; no extra table | Shared tokens/all route states | UX-01–18; visual/manual review | UX readiness gate; BA-22/23 |

## Business invariants, journeys and release acceptance

| PRD rule / journey | Stories / tests and domain ownership | Remaining review |
|---|---|---|
| BR-001/002/019 server money; J-04; EC-05/17/20 | 021/022/025; API-003/010/011, DB-016, UX-06; Finance/Backend | FIN-01 signed inclusive/exclusive/shipping/rounding fixtures; BR formula in CH-CHECK-003 must use approved tax inclusion semantics |
| BR-003/009/015 immutable/publication facts; J-08; EC-01/15/16 | 015/024/031; DB-015, API-002/023, UX-03/08/09; Data/Catalog | Archive/default SKU constraints and complete media/unpublish contracts |
| BR-004/005 checkout replay; EC-06/07/08 | 025/026/029; API-013/014/015, DB-012; Backend/Payments | PAY-01 scopes/retention; early idempotency schema |
| BR-006/007/016 stock; J-03; EC-02/03/04/09/10 | 018/019/023/025/029/030; DB-006–010/014/019, API-012/016/017; Inventory | INV-01 terminal race/late success; DB-0 migration graph |
| BR-008 fulfillment; J-06; EC-18 | 029/032/043; API-022, UX-11; Orders | Approved cross-state table; audit writer first |
| BR-010 refunds; J-07; EC-22/23/24 | P1 050/051/055/056; API-029/030, DB-021/022, UX-19; Finance | FIN-02/PAY-LIVE; cancellation owner and no automatic restock |
| BR-011/017/018 trusted payment; J-01/02; EC-08/21 | P0 027/028/029 and P1 055; API-018/019/028, DB-008/011/013; Payments | PAY-01 signed sandbox events; live signatures/provider separately PAY-LIVE |
| BR-012/013 customer/staff boundaries; J-05/09; EC-11/12/13/14/27 | 012/013/014/031/044/047; API-004–009, DB-001–004/017; Security | SEC-01 origin/session/permission/delegation matrix |
| BR-014/020 provenance/unique effects | 014/019/025/029/033; API-015/021/027, DB-018; Backend/Data | Split early atomic audit/outbox persistence; no historical edits |
| J-10; EC-25/26/28 | P1 052/054/056 and P0 recovery foundations 030/047; API-020/031, DB-023, UX-20 | FIN-01 revision, Cairo/DST report semantics, P1 notification ownership |

KPI-01/02/03 map to 046/047 and the purchase/concurrency/denial suites; KPI-04 coverage to 005/047; KPI-05/06 to 034/046; KPI-07 to 035/045/047; KPI-08 to 005/047/048; KPI-09 remains P1 051/056; KPI-10 applies to every seed/demo/environment. Numerical KPI values remain proposed where marked in source. P0 exit is 048 with all relevant approvals and real evidence; P1 exit 056 and separate live activation; P2 057–059 are research only.

## Coverage conclusion

Every P0 functional ID and P0/P0-foundation NFR has an explicit row; traceable does not mean fully covered. Open gaps include profile/address backend and verified email change, cart page/guest merge scope, overview aggregation semantics, low-stock threshold configuration, unpaid void/manual exception actions, staff audience/invite acceptance and media lifecycle. P1 omissions include advanced discovery, sessions, cancellation, notifications, advanced audit/bundles and tracking. P2 native/fraud has no dedicated feasibility owner. See BA-02–15/20/26 in [baseline audit](baseline-audit.md). No requirement is implemented or verified by these mappings. Refine the existing parent backlog through approved child slices; do not silently add stories, promote releases or approve policy.

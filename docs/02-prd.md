# CommerceHub — Product Requirements Document (PRD)

**Document ID:** CH-BMAD-02  
**Filename:** `02-prd.md`  
**Version:** 1.0 — Requirements baseline candidate  
**Date:** 2026-10-18  
**Status:** Approved as requirements baseline on 2026-10-18; architecture and financial review gates remain open; no implementation authorized  
**Source baseline:** `01-project-brief.md` v1.0, scope approved by product owner on 2026-10-18  
**Product:** CommerceHub — Multi-category, single-merchant e-commerce platform  
**Initial market / currency:** Egypt / EGP  
**Workflow:** BMAD — Analysis → Planning → Design → Implementation → Testing → Deployment

> **Authority:** This PRD defines *what* must work and how acceptance is demonstrated. Subsequent UX, architecture, data, and API specifications define *how*. A proposed numerical target or operational policy marked **[PROPOSED]** must be accepted at the PRD gate before it becomes a committed target. No implementation is claimed.

---

## 1. Executive Summary

CommerceHub is a portfolio-grade, production-oriented multi-category store for **electronics, fashion, home and living, and accessories**, extensible to other physical-goods categories. It comprises an independently deployed **customer storefront**, an **administration dashboard**, a **shared NestJS REST API**, and **one PostgreSQL database** accessed only by the backend. The product is **single merchant**, not a marketplace.

The **MVP/P0** demonstrates a safe end-to-end sandbox purchase, catalog/stock administration, basic fulfillment, least-privilege staff management, and coherent order/payment/inventory records. **V1/P1** adds customer service, refund/return, coupon/review/wishlist and richer finance/operations capabilities. **Future/P2** includes marketplace, personalization, multi-currency, advanced logistics and other explicitly deferred complexity.

A product is **not shipped merely because its UI renders**: acceptance requires persisted backend state, appropriate authorizations, idempotency/retry handling where relevant, and tests of adverse cases.

## 2. Document Control, Traceability and Definitions

### 2.1 Approval and change control

- Approved input: project-brief scope, multi-category/single-merchant model and chosen technology direction.
- This PRD is **approved as a requirements baseline on 2026-10-18**. P0 boundaries are accepted; policies explicitly requiring architecture, security, tax or financial sign-off in §20 remain gated and are not final implementation authorization.
- Requirement IDs are permanent. If removed, mark *retired*, do not reassign. Record scope, rationale, dependency and test impact for changes.
- Product owner owns priority and policy; engineering owns feasibility/security design; QA owns verification evidence.
- Priority labels: **P0 = necessary to pass MVP gate; P1 = V1; P2 = Future**. A P1 dependency necessary for P0 must be split into a minimal P0 foundation and full P1 capability, not silently promoted.

### 2.2 Glossary

| Term | Meaning |
|---|---|
| Product | Merchandised item with shared title, category, brand and media |
| Variant / SKU | Independently sellable configuration (including a default variant for simple products) |
| Available-to-sell (ATS) | On-hand sellable stock less active reservations (and other explicitly defined holds) |
| Reservation | Temporary stock allocation to a checkout/order, with controlled expiry/consumption |
| Payment attempt | A provider-specific or mock attempt whose terminal outcome is recorded once |
| Capture | Money accepted/settled in the payment model; mock capture simulates it for tests |
| Refund | Authorized return of captured funds; not equivalent to marking an order cancelled |
| Ledger | Append-only or correction-based record of stock/financial events, not a mutable balance-only field |
| Idempotency key | Client/server identifier used to safely repeat a mutation without repeating its effect |
| Audit event | Actor, action, object, timestamp and permitted before/after context, excluding secrets |
| P0/P1/P2 | MVP / V1 / Future priority and release boundaries |

## 3. Goals, Non-Goals and KPIs

### 3.1 Goals

1. Let a registered shopper complete a reliable EGP-priced sandbox purchase and track the resulting order.
2. Give authorized staff safe catalog, stock and fulfillment tools in a separate professional application.
3. Keep identity, authorization, pricing, availability, order totals and payment truth on the backend.
4. Provide reproducible, secure, test-backed architecture and portfolio demonstrations.
5. Make P1 operational depth possible without replacing the MVP domain model.

### 3.2 Non-goals for MVP

Guest checkout, real-money payment activation, automated tax compliance, live shipping-carrier booking, marketplace/seller payouts, warehouse optimization, gift cards, loyalty programs, complex fraud scoring, international taxes/currencies, and mobile apps. User-visible cancellation/refunds/returns are **V1**; MVP admin can void an unpaid order and safely release stock only under defined control paths.

### 3.3 Quantitative acceptance targets [PROPOSED]

| ID | Goal / target | How measured | Gate |
|---|---|---|---|
| KPI-01 | 100% successful execution of critical purchase E2E scenarios on clean staging | Playwright run logs + backend assertions | MVP |
| KPI-02 | Zero oversold SKUs or duplicate orders/payments in defined concurrency/retry suite | Parallel integration test with invariant checks | MVP |
| KPI-03 | All protected endpoints exercised for unauthenticated, wrong-role and wrong-owner denial | Permission matrix automation | MVP |
| KPI-04 | ≥90% branch coverage on critical authentication/authorization, stock and financial calculation services | CI coverage reporting | MVP |
| KPI-05 | No critical/serious automated accessibility violations on key journeys; keyboard-only journeys complete | axe and manual review | MVP |
| KPI-06 | No unexpected horizontal overflow at widths 360, 768, 1440 px on priority pages | Automated viewport checks | MVP |
| KPI-07 | Mobile Lighthouse performance ≥85 on agreed reproducible representative pages, fixture/device/network | Recorded staging audit | MVP |
| KPI-08 | No known critical/high security findings; migration/restore drill and rollback instructions documented | CI, review, rehearsal | MVP release |
| KPI-09 | 100% of V1 refund test cases preserve `total_refunded ≤ captured_eligible` | Money/transaction integration tests | V1 |
| KPI-10 | All production-like demo flows use seeded/synthetic data and no raw payment-card data | Data/security inspection | All |

User acquisition and conversion are **not** MVP pass/fail KPIs because this is initially a portfolio demonstration without a real customer cohort. Product telemetry can establish baselines later.

## 4. Personas and Authorization Principles

| Persona | Tasks | Boundaries |
|---|---|---|
| Guest | Discover products, inspect product details | Public published inventory only; no guest checkout in P0 |
| Registered customer | Cart, checkout, profile, addresses, own order history | Own data only; no staff metadata |
| Catalog admin | Maintain products/categories/brands/variants | Only granted `catalog.*` actions |
| Inventory admin | Review/adjust stock | Only granted `inventory.*`; cannot change order prices |
| Fulfillment admin | Review and progress orders | `orders.*` actions only, not refunds unless granted |
| Super Admin | Invite/deactivate staff, grant permissions, configure store, inspect audits | Strong safeguards on privilege escalation and irreversible actions |
| System worker | Expire reservations, process notifications/reconciliation | Machine-scoped permissions; no implicit super-admin powers |

The examples above are **permission bundles**, not mandatory hard-coded role names. **Admins default to no operational permissions; Super Admin is a separate protected principal type/role.** Every sensitive API validates both action permission and resource scope; hiding buttons is not an authorization control.

## 5. Product Assumptions and MVP Policy Decisions

These are product proposals selected to make P0 implementable; §20 records which need explicit approval before design.

| Policy ID | Proposed requirement/policy | Status |
|---|---|---|
| POL-01 | One merchant/store, Egypt-first physical goods, checkout currency EGP only | Inherited/approved scope |
| POL-02 | Browsing and reading catalog public; account required for checkout; no guest checkout in MVP | Proposed |
| POL-03 | Guest cart may be client-only; after login merge by SKU with server reconciliation and max allowed quantity | Proposed |
| POL-04 | Email verification required before placing an order; resend with abuse throttles; login after sign-up allowed with restricted checkout | Proposed |
| POL-05 | One default variant/SKU even for a non-configurable product; SKU globally unique | Proposed |
| POL-06 | MVP ships flat-rate configurable Egyptian shipping zone/fee rules; unsupported destination blocks checkout; no live carrier API | Proposed |
| POL-07 | Prices in EGP with two decimal places; decimal-safe half-away-from-zero rounding at defined calculation steps | Proposed; needs financial sign-off |
| POL-08 | Display item price before shipping, tax and promotional adjustments; explicit cost breakdown and tax inclusivity flag; initial tax rule is configurable, not silently zero | Proposed; launch tax review needed |
| POL-09 | P0 excludes coupons and customer cancellations; no discount unless a rule is explicitly enabled and backend calculated | Proposed |
| POL-10 | Sandbox payment success is the only default path to `paid`; sandbox failure leaves unpaid/failed status and releases or eventually expires reserved inventory | Proposed |
| POL-11 | Temporary checkout stock reservations expire after **15 minutes** [PROPOSED]; retry and late-payment paths require reconciliation | Proposed |
| POL-12 | Products/variants with order references are archived/unpublished rather than hard deleted; financial and audit records are retained | Proposed |
| POL-13 | Customer address snapshot stored on order; changing customer address does not change submitted orders | Proposed |
| POL-14 | MVP basic fulfillment is manually entered tracking reference and statuses; V1 adds richer shipment details | Proposed |
| POL-15 | Multi-category seed fixtures include electronics configuration and fashion color/size variants plus a simple home/accessory item | Proposed |

## 6. Release Scope Matrix

**P0 / MVP**: public catalog/search/filter/sort/product detail; customer signup/signin/verification/recovery/profile/address; authenticated cart/checkout; shipping/tax breakdown; sandbox payment and attempts; immutable order price/address snapshots and status tracking; product/category/brand/variant/image CRUD; stock movements and reservation lifecycle; staff authentication and granular access; super-admin staff lifecycle; simple overview KPIs; audit log recording; secured shared API, tests and deployments.

**P1 / V1**: wishlist, verified-purchase reviews, discounts/coupons, customer cancellation, returns, partial/full refunds, reconciliation/payment webhooks for a vetted real provider (activation gated), richer delivery tracking, notifications, customer service views, advanced reports and exports, expanded role UX and searchable audit review, background jobs and performance optimization.

**P2 / Future**: loyalty/referrals, AI personalization, multiple warehouses, advanced forecasting/fraud, marketplace/multiple vendors, multi-currency/international taxes, internationalization and mobile applications.

**Release contract:** A higher-priority feature may not assume a lower-priority feature already exists. Real payment gateway integration is **never automatically approved** by finishing mock/sandbox checkout.

## 7. Requirements Format and General Acceptance Criteria

Each requirement specifies an ID, actor, functional behavior, priority/release and acceptance conditions. Acceptance checks marked `Given/When/Then` are examples; test implementation may use equivalent measurable assertions. Unless otherwise noted, all mutations must validate inputs, enforce auth/scope, supply stable errors, and be observable without leaking sensitive data.

### 7.1 Customer identity and accounts

**CH-AUTH-001 [P0] Customer registration.** As a guest, I can register using email/password so my orders are linked to me. **AC:** Given valid unique email and policy-conformant password, when registered, then a customer identity and verification challenge are created without exposing password hashes; duplicate identifiers produce a non-enumerating safe response; malformed input is rejected.

**CH-AUTH-002 [P0] Login/logout/sessions.** As a customer, I can sign in/out securely. **AC:** Correct credentials create secure HTTP-only cookie session; incorrect/revoked/expired session cannot access protected endpoints; logout revokes the relevant session; rate limits apply; no tokens stored in browser localStorage.

**CH-AUTH-003 [P0] Email verification/recovery.** As a customer, I can verify email and reset a forgotten password. **AC:** Verification/reset tokens are short-lived, single-use and stored non-reversibly; invalid/expired/reused tokens fail; verification gate for checkout enforced if POL-04 approved; recovery revokes sessions according to published policy; responses prevent email enumeration.

**CH-AUTH-004 [P0] Customer profile.** As a customer, I can view/edit allowed personal information. **AC:** Authenticated user reads/writes only own profile; immutable identity fields protected; changing email requires verified workflow; server rejects unexpected privileged fields.

**CH-AUTH-005 [P0] Addresses.** As a customer, I can create/edit/delete and select shipping addresses. **AC:** Ownership checked; required geographic fields and phone validated; unsupported shipping location communicated; deleting a saved address does not mutate historical order shipping snapshot.

**CH-AUTH-006 [P1] Advanced account controls.** As a customer, I can review active sessions and revoke others. **AC:** Revocation immediately prevents API access; sensitive changes require reauthentication as configured; no access to another user's session.

### 7.2 Catalog, discovery and storefront

**CH-CAT-001 [P0] Catalog listing.** As a visitor, I can view paginated published products. **AC:** Only active/published products/variants and public fields appear; pagination stable with a documented tie-breaker; empty/error states displayed; unlisted/archived items excluded.

**CH-CAT-002 [P0] Search, filters and sorting.** As a visitor, I can search by text and filter by category, brand, price and availability, sorting by price/newness/name. **AC:** Filters compose correctly; sort is deterministic; invalid bounds rejected; URLs encode reproducible query state; response uses pagination/caps rather than sending entire catalog.

**CH-CAT-003 [P0] Product detail and variants.** As a visitor, I see images, brand, category, attributes, price and availability for a selected SKU. **AC:** Selecting size/color/configuration changes SKU-specific price and stock; unavailable SKU cannot be added; non-configurable product has exactly one default sellable SKU.

**CH-CAT-004 [P0] Product media.** As a visitor, I see product images with appropriate fallback. **AC:** Media have alt text, stable order and optimized delivery; unsafe user uploads are rejected; deleted media references do not break product listing.

**CH-CAT-005 [P0] SEO/discovery metadata.** As a visitor/search engine, published pages have crawlable titles/descriptions and canonical URLs. **AC:** Published product/category routes yield appropriate metadata and semantic markup; admin/private pages not indexed; no nonexistent SKU information exposed via indexing.

**CH-CAT-006 [P1] Enhanced discovery.** As a shopper, I can use richer attribute filters and merchandising. **AC:** Category-specific filters are relevant and composable; results remain consistent with active SKUs and permissions.

**CH-CAT-007 [P1] Wishlist.** As a customer, I can save/remove products. **AC:** Duplicates prevented, private ownership enforced, archived items handled gracefully, wishlisting does not reserve stock.

**CH-CAT-008 [P1] Reviews and ratings.** As a customer, I can review eligible purchased products. **AC:** Review eligibility enforced by backend fulfillment policy; moderation supported; customer cannot review an item without qualifying purchase or manipulate aggregate rating through repeat submissions.

### 7.3 Cart, pricing and checkout

**CH-CART-001 [P0] Persistent cart.** As a customer, I can add, update and remove SKU quantities and retain cart between sessions. **AC:** Cart items unique per SKU, quantity positive and capped by configured limits; unavailable/archived products surfaced for correction; server persists authenticated cart; visitor-cart merging follows POL-03 if approved.

**CH-CART-002 [P0] Cart totals.** As a shopper, I can see an indicative subtotal and final checkout amount. **AC:** All authoritative prices and totals recomputed by API from current catalog and active rules; tampered browser prices ignored; explicit EGP breakdown includes subtotal, shipping, tax and total; stale stock/price causes review/reconfirm flow.

**CH-CHECK-001 [P0] Checkout validation.** As a registered eligible shopper, I can select a supported shipping address and review my order. **AC:** Checkout rejects missing verification (if enabled), absent address, invalid SKU, unsupported zone, unavailable stock or server-invalid pricing; no order can be placed from client totals alone; checkout shows final agreed cost before payment.

**CH-CHECK-002 [P0] Atomic order initiation.** As a customer, I can submit checkout once despite retries. **AC:** A valid idempotency key and payload yield at most one logical order/reservation per customer/request; key reuse with different payload fails; reserved stock never exceeds sellable stock; failed initiation has no orphaned order/reservation.

**CH-CHECK-003 [P0] Pricing snapshots and calculations.** As a customer, I see accurate price charged at checkout. **AC:** Order items snapshot title/SKU/options/quantity/unit price/discount/tax allocations/currency; shipping address/cost and applied rule identifiers captured; after catalog changes invoice/history retain checkout amounts; invariant `total = subtotal - discounts + shipping + tax` under documented allocation/rounding policy; negative total never possible.

**CH-CHECK-004 [P0] Checkout outcome.** As a customer, I receive confirmation or actionable failure. **AC:** Confirmed order number/detail exists after successful mock capture; failure does not claim payment success; refresh/retry cannot create duplicate capture; expired reservations are safely released.

**CH-CHECK-005 [P1] Promotions.** As a shopper, I can apply permitted coupon or promotion. **AC:** Eligibility, active window, minimum spend, stacking, redemption cap and race conditions backend-enforced; no coupon self-fabricated; totals still balance precisely.

### 7.4 Orders and fulfillment

**CH-ORD-001 [P0] Customer history/details.** As a customer, I can list/view my orders. **AC:** Read-own-only; order detail displays historical lines, amount breakdown, payment and fulfillment status, order date, and address snapshot; pagination; nonexistent/other-user IDs do not leak data.

**CH-ORD-002 [P0] Status machine and history.** As a customer/operator, I can trust order progress. **AC:** All transitions conform to versioned allowed state machine; history includes actor/time/reason; out-of-order, repeated and forbidden transitions reject or idempotently no-op without false audit events; payment and fulfillment status represented separately.

**CH-ORD-003 [P0] Admin fulfillment.** As authorized fulfillment staff, I can inspect queue, mark processing/shipped/delivered and record simple shipping reference. **AC:** Only orders in eligible paid state can ship; tracking reference validated; only staff with relevant permission can transition; API produces audit and history records; customer sees result.

**CH-ORD-004 [P0] Failed/unpaid cleanup.** As operator/system, abandoned or failed sandbox attempts do not block inventory forever. **AC:** Expiry/release is idempotent, safe under payment outcome race; terminal paid order never reverted or its stock released as if unpaid; late callback handled as explicit exception/reconciliation event.

**CH-ORD-005 [P1] Customer cancellation.** As a customer, I can request/cancel eligible orders before a published cutoff. **AC:** Backend validates status, actor and stock/payment implications; shipping or captured-payment case follows refund/void rules; duplicate request safe; outcomes timestamped.

**CH-ORD-006 [P1] Returns and shipment tracking.** As a customer, I can request return for eligible delivered items and track shipments. **AC:** Eligibility window, quantities, status and reasons backend-validated; multiple return requests cannot exceed delivered unreturned quantities; staff decisions auditable; carrier integration optional.

### 7.5 Payments and financial records

**CH-PAY-001 [P0] Payment adapter and mock/sandbox.** As a customer, I can pay through a safe sandbox test path. **AC:** Adapter returns deterministic success/failure/pending scenarios for tests; provider-secret logic server-side; payment state not writable by customer; no raw card data stored; provider selection is configuration-driven.

**CH-PAY-002 [P0] Idempotent payment lifecycle.** As an operator, I can trust payment records despite retries. **AC:** Each attempt records order, method/provider, status, external/test reference and timestamps; duplicate completion does not double-capture/fulfill/decrement; invalid state transition is rejected; financial entries reflect unique accepted events.

**CH-PAY-003 [P0] Financial auditability.** As an operator, I can explain what was charged. **AC:** Currency and exact amount recorded; order totals and payment amounts reconcile to invariant rules; changes use immutable event/correction records rather than editing historical fact; customer sees only permitted payment information.

**CH-PAY-004 [P1] Verified provider integration and callbacks.** As an operator, I can reconcile real gateway events. **AC:** Before enabling live processing, Egyptian merchant eligibility and provider capabilities validated; signature/authenticity checked, replay deduped, callbacks out of order safely handled, retry supported and secret redacted; sandbox and reconciliation test evidence approved. **Live enablement remains a separate operational gate.**

**CH-PAY-005 [P1] Payments dashboard/reconciliation.** As permitted finance staff, I can inspect attempts, captured transactions, discrepancies and refunds. **AC:** Search/filter by status/date/order, sensitive fields redacted, aggregation consistent with ledger, mismatches flagged not silently overwritten, finance permissions enforced.

**CH-PAY-006 [P1] Partial/full refunds.** As permitted refunds staff, I can approve or deny a request and initiate refund. **AC:** Refund references captured payment and eligible order items; sum of successful and in-flight reserved refunds never exceeds refundable captured amount; unique idempotency ensures no duplicate; failed refunds release refundable hold correctly; approval chain/event history recorded; no raw card data.

### 7.6 Inventory and catalog administration

**CH-ADM-CAT-001 [P0] Product CRUD/publication.** As catalog staff, I can create/edit/preview/publish/unpublish products. **AC:** Required fields validated; drafts not publicly purchasable; product mutation permissions distinct; archive preserves purchase history; publishing requires at least one valid SKU and required media/data policy.

**CH-ADM-CAT-002 [P0] Category and brand management.** As catalog staff, I can manage nested categories and brands. **AC:** No category cycles, stable slugs, uniqueness in relevant scope, safe disabling of referenced entities; public catalog remains navigable.

**CH-ADM-CAT-003 [P0] Variants and SKU attributes.** As catalog staff, I can configure options (e.g. apparel size/color and electronics storage/color) and prices. **AC:** Unique SKU, unique option combination within product, valid positive price and currency; variant archive never rewrites historical order; default SKU exists for simple product; overspecified/duplicate attributes rejected.

**CH-ADM-CAT-004 [P0] Image upload management.** As catalog staff, I can attach/reorder/remove images. **AC:** Upload path validates content type, signature, size and authorization; object URLs/keys controlled by backend; private/temporary uploads inaccessible if not authorized; no arbitrary executable content; safe replacement and cleanup semantics.

**CH-INV-001 [P0] Inventory counts and available quantity.** As inventory staff, I can view per-SKU on-hand, reserved and available stock. **AC:** Values are nonnegative where policy requires; available cannot exceed on-hand; concurrent checkouts cannot oversell; all writes backend controlled.

**CH-INV-002 [P0] Stock adjustments and movement history.** As authorized inventory staff, I can receive/adjust stock with reason. **AC:** Positive/negative adjustment validated and atomic; resulting on-hand cannot violate reservations; movement ledger captures actor, reason, delta, SKU, timestamp and reference; history immutable/compensated, not silently deleted.

**CH-INV-003 [P0] Reservation lifecycle.** As platform, I reserve stock for checkout, consume it exactly once after accepted payment, and release it after failure/expiry. **AC:** Reserve, consume and release are safe under concurrency and repeat events; reservation expiration policy configurable; paid/fulfilled stock cannot be restored through an expired-session race; tests assert stock conservation.

**CH-INV-004 [P0] Low-stock visibility.** As inventory staff, I can see SKUs below configurable threshold. **AC:** Threshold settable by permitted user or configured default; correct ATS-derived indication; no false positive when negative stock is disallowed; pagination/filtering.

**CH-INV-005 [P1] Inventory alerts and operational controls.** As inventory staff, I can track recurring low-stock alerts, holds and extended stock history. **AC:** Notification dedupe, actor attribution and data consistency demonstrated; no hidden adjustment around ledger.

### 7.7 Admin authentication, permissions and governance

**CH-SEC-001 [P0] Separate staff login.** As staff, I sign into protected admin application. **AC:** Customer credentials alone do not grant staff access; session route scope enforced API-side; secure cookies/session invalidation, rate-limiting and anti-CSRF protections; inactive staff rejected.

**CH-SEC-002 [P0] Least-privilege RBAC.** As Super Admin, I assign explicit granular permissions to admins. **AC:** Default deny; route/service checks match a maintained permission matrix; lacking permission returns safe 403; forged admin roles/IDs in client payload ignored; backend never infers authorization from UI state.

**CH-SEC-003 [P0] Staff lifecycle.** As Super Admin, I invite/create, deactivate and manage admin assignments. **AC:** Only authorized Super Admin can grant/revoke; privileged changes audited; deactivation revokes active sessions; prevent removal of last active Super Admin; self-demotion/escalation safeguards specified and tested.

**CH-SEC-004 [P0] Audit logging.** As privileged operator, I can establish who changed products, stock, fulfillment and permissions. **AC:** Event contains actor, action, resource, timestamp, result and safe change metadata; secrets/PII minimized; event records protected from ordinary staff modification; write failure policy for critical operations designed explicitly.

**CH-SEC-005 [P0] Customer ownership and API boundaries.** As customer, I cannot access staff resources or other shoppers' records. **AC:** Cross-customer direct object references yield no data; unauthenticated/unauthorized requests rejected; server-side validation and query scoping used for lists and details.

**CH-SEC-006 [P1] Audit review and permissions UX.** As Super Admin, I can filter audit events and manage reusable permission bundles. **AC:** Only privileged actors can access audit log; all permission changes logged and effective immediately or on documented session refresh; sensitive export protected.

### 7.8 Overview, customers, marketing and reporting

**CH-DASH-001 [P0] Minimal admin overview.** As an authorized admin, I see useful high-level metrics such as order counts, sandbox revenue, pending fulfillment and low-stock SKU count. **AC:** Metrics have explicit definitions and date ranges, correct permission filtering and empty states; display distinguishes sandbox from real sales; overview fetches only necessary endpoints, not every admin module.

**CH-CUST-001 [P1] Customer administration.** As authorized support staff, I can search customer profiles and order history with privacy protections. **AC:** Sensitive fields masked, least-privilege applied, audit for privileged changes, no access to secrets or password hashes; retention/deletion requests follow policy.

**CH-MKT-001 [P1] Coupon and campaign management.** As marketing staff, I can create/schedule/disable campaigns, set eligibility and usage limits. **AC:** Redemption counted transactionally; duplicates and over-redemption prevented during concurrent checkouts; expired/deactivated coupons rejected; checkout snapshots discount.

**CH-AN-001 [P1] Analytics and exports.** As authorized admin, I can view revenue, trends, product performance and operational outcomes. **AC:** Definitions distinguish paid/captured/refunded/net, exclude failed sandbox payments, honor time zone/currency and returned/refunded data, export respects permission and sensitive-data limits.

**CH-NOTIF-001 [P1] Customer notifications.** As a customer, I receive important order/payment/return updates. **AC:** Templates safe, recipients verified, retries and dedupe implemented, failure does not silently change financial state, user preferences follow mandatory-notice rules.

### 7.9 Deferred requirements

**CH-FUT-001 [P2]** Personalized recommendations and advanced search.  
**CH-FUT-002 [P2]** Loyalty/referral and gift cards with auditable balances.  
**CH-FUT-003 [P2]** Multi-warehouse, advanced logistics and forecasting.  
**CH-FUT-004 [P2]** Multi-currency, international taxes and localized languages.  
**CH-FUT-005 [P2]** Marketplace vendors, commissions and seller payouts.  
**CH-FUT-006 [P2]** Native mobile clients and advanced fraud detection.

## 8. Key Business Rules and Calculation Invariants

| Rule ID | Invariant / rule | Validation |
|---|---|---|
| BR-001 | Server determines SKU availability, price, shipping, taxes, promotions and totals | Tampered request rejected/repriced |
| BR-002 | Monetary values use PostgreSQL NUMERIC and exact decimal arithmetic; EGP explicit per record | Fractional and boundary unit tests |
| BR-003 | Order historical snapshots never follow mutable catalog prices, descriptions or addresses | Edit catalog/address after purchase |
| BR-004 | Single checkout idempotency key cannot create multiple orders for same logical request | Parallel identical requests |
| BR-005 | A key reused with different request payload conflicts; expires only per documented safe retention policy | Negative API tests |
| BR-006 | `ATS = on_hand - active_reserved` (subject to documented additional holds), never negative | Concurrency integration tests |
| BR-007 | One reservation can be consumed or released at most once; terminal transitions are monotonic | Races, expiry and retry tests |
| BR-008 | Only eligible paid orders may be shipped; status machines are explicit | Illegal-transition tests |
| BR-009 | Only valid published sellable SKUs enter checkout | Draft/archived SKU tests |
| BR-010 | Refunds cannot exceed unrefunded eligible captured value including pending refund holds | Concurrent refund attempts |
| BR-011 | Payments cannot be marked successful based on browser data; provider adapter/mock server decides | Forged payment status tests |
| BR-012 | Customer resources are scoped by authenticated identity regardless of guessed ID | Cross-account tests |
| BR-013 | Admin permissions enforced per action and resource on backend | Permission matrix tests |
| BR-014 | Privileged mutations and stock movement have durable provenance | Audit/ledger assertions |
| BR-015 | Historical monetary, payment and order records are never casually hard-deleted | Archive/delete tests |
| BR-016 | Cart does not reserve stock; reservation begins at validated checkout boundary | Inventory state tests |
| BR-017 | No raw PAN/CVV/cardholder sensitive authentication data stored anywhere | Code/log/schema review |
| BR-018 | Every payment/capture/refund external event deduped with immutable/provider-scoped reference | Duplicate callback tests (V1) |
| BR-019 | Shipping, tax and rounding precedence documented before implementing payment totals | Golden calculation fixture tests |
| BR-020 | One logical stock movement/financial event maps to one committed durable event | Retry and duplicate tests |

### 8.1 Proposed price calculation order (requires approval)

1. Resolve server-side current **unit price** for each SKU in EGP; calculate extended line prices with decimal-safe arithmetic.
2. Apply eligible line-level discounts, then order-level discount allocation (**P1**, zero in default MVP).
3. Calculate tax base according to configured **tax-inclusive/exclusive** rules, and separately compute taxable shipping if applicable.
4. Compute configured shipping fee and any shipping discount; allocate and round amounts under documented deterministic policy.
5. Calculate `grand_total = merchandise_subtotal − discounts + shipping + tax` when prices are tax-exclusive. For tax-inclusive prices, tax is **included within** the merchandise/shipping amount rather than added again.
6. Persist line-level allocations, order aggregates, currency, rule/tax version identifiers and an immutable calculated snapshot.

**Financial-design open point:** Tax treatment, line-vs-invoice rounding and half-away-from-zero rounding in POL-07 must be reviewed against Egyptian commerce/tax needs before implementing tax calculations or accepting real payment. No assertion is made that a zero-rate or a given tax structure is legally correct.

### 8.2 Candidate P0 state models (final enum/transitions in architecture)

- **Order:** `pending_payment → confirmed → processing → shipped → delivered`; exceptional `payment_failed` / `expired` from pending. Avoid conflating customer-facing order state with independent payment and fulfillment state.
- **Payment:** `created → pending → succeeded | failed | cancelled` (mock/sandbox). Terminal success not overwritten by a late failed event.
- **Reservation:** `active → consumed | released | expired` with safe terminal behavior.
- **Staff:** `invited → active → deactivated` (reactivation only by authorized Super Admin).
- **Return/refund (P1):** return `requested → approved | rejected → received → resolved` as applicable; refund `requested/approved → processing → succeeded | failed` with clear compensation and quantity rules.

These are **illustrative names**, not database enums or endpoints yet. Cancellation/void/retry paths must be exhaustively enumerated in architecture and API design.

## 9. End-to-End Journeys and Gherkin Acceptance Scenarios

### J-01: Standard sandbox purchase (P0)

**Given** a verified customer, supported delivery address, published SKU with ATS ≥ 2 and valid EGP price; **When** the customer adds quantity 2, confirms the backend summary and pays using sandbox success; **Then** exactly one order exists with immutable snapshots, exactly one successful mock payment effect, inventory decreases/consumes reserved quantity exactly once, and the shopper can see the order.

### J-02: Failed payment and retry (P0)

**Given** valid checkout reservation; **When** sandbox payment fails or callback repeats; **Then** no success is recorded, no paid shipment is allowed, reservation releases/expiries safely, and retry follows a documented attempt/order policy without duplicate order/capture.

### J-03: Stock race (P0)

**Given** 1 unit ATS; **When** two buyers concurrently attempt to reserve 1 each; **Then** at most one checkout owns a valid reservation; other receives out-of-stock/conflict; on-hand and movements remain explainable.

### J-04: Price change during checkout (P0)

**Given** product price changes after an item entered cart; **When** customer submits old totals; **Then** API recomputes and requires current-price confirmation; no charge uses an unacknowledged stale price.

### J-05: Permission boundary (P0)

**Given** an inventory-only admin; **When** they attempt to publish a product or grant permissions; **Then** the API returns 403 and no mutation occurs, regardless of UI manipulation; permitted stock adjustments are recorded with actor and reason.

### J-06: Fulfillment (P0)

**Given** sandbox-paid order and fulfillment permission; **When** staff marks processing, shipped with tracking, delivered; **Then** allowed transitions and timestamps are recorded, and customer tracking reflects status; a pending-payment order cannot be shipped.

### J-07: Refund conflict (P1)

**Given** captured refundable EGP 100 with no refund; **When** two authorized operators concurrently request EGP 80 refunds; **Then** at most EGP 100 can be reserved/processed, excess request rejected, unique financial events recorded, and external refund retries do not duplicate settlement.

### J-08: Catalog archival after purchase (P0)

**Given** a paid order for a SKU; **When** staff archives that SKU or deletes a saved address; **Then** catalog no longer sells SKU while previous order retains original title, options, quantity, price and shipping snapshot.

### J-09: Customer data isolation (P0)

**Given** two different shoppers; **When** one guesses the other's order/address ID; **Then** private data is not returned or mutated; logs do not disclose secrets.

### J-10: V1 coupon concurrency

**Given** one remaining redemption for a valid coupon; **When** two qualifying checkouts apply it concurrently; **Then** only one valid redemption is counted/committed, and refunds/cancellations follow a defined reuse rule.

## 10. Edge-Case Matrix

| ID | Edge case | Required behavior | Release |
|---|---|---|---|
| EC-01 | SKU unpublished between cart and pay | Revalidate and require correction | P0 |
| EC-02 | Quantity changes stock while carts remain open | Cart can render but checkout rejects unavailable quantity | P0 |
| EC-03 | Last SKU unit purchased concurrently | Only one reservation succeeds | P0 |
| EC-04 | Customer sends negative/fractional/excess quantity | Validation error; no mutation | P0 |
| EC-05 | Forged line price, tax, shipping or payment success | Ignore/reject untrusted data | P0 |
| EC-06 | Two checkout requests with same idempotency key, identical body | Same logical result; no double decrement | P0 |
| EC-07 | Same idempotency key, conflicting body | Conflict response; no second order | P0 |
| EC-08 | Network disconnect after successful payment | Poll/retrieve authoritative state; safe retry | P0 |
| EC-09 | Sandbox fails while reservation expiry job runs | Exactly one release; no negative reserved stock | P0 |
| EC-10 | Sandbox succeeds at reservation expiry boundary | Explicit precedence and reconciliation; no overselling | P0 |
| EC-11 | Unverified email attempts checkout | Rejected and guided to verification if POL-04 approved | P0 |
| EC-12 | Password reset token replay/expired | Reject; no password change | P0 |
| EC-13 | Admin deactivated with active session | Immediate API denial/revocation | P0 |
| EC-14 | Last Super Admin tries self-removal/demotion | Rejected with auditable reason | P0 |
| EC-15 | Product deleted after order | Archive product; preserve order history | P0 |
| EC-16 | Invalid category hierarchy and duplicate SKU | Reject transaction; preserve valid prior state | P0 |
| EC-17 | Multiple tax/rounding fractional values | Deterministic exact sum with no stray cent | P0 |
| EC-18 | Ship order with failed/unpaid payment | Reject; log permitted diagnostic event | P0 |
| EC-19 | Invalid/oversized/malicious product upload | Reject; no executable public file | P0 |
| EC-20 | Delivery to unsupported governorate/zone | No checkout; clear user correction | P0 |
| EC-21 | Payment webhook duplicated/reordered/forged | Authenticate, dedupe, reconcile; no duplicate financial event | P1 |
| EC-22 | Partial refund after previous partial refund | Remaining refundable amount enforced | P1 |
| EC-23 | Refund request and cancellation race | No duplicate stock return or refund | P1 |
| EC-24 | Return qty exceeds eligible purchased qty | Reject; preserve prior approved returns | P1 |
| EC-25 | Coupon revoked while carts still display it | Checkout recalculates and requires confirmation | P1 |
| EC-26 | Reports span refunds, failed payments, daylight-saving changes | Explicit business-timezone aggregation and finance definitions | P1 |
| EC-27 | Customer private data used in staff exports | Scope, permission, retention and redaction enforced | P1 |
| EC-28 | Redis/worker/email service unavailable | Critical checkout data remains consistent; queued work recoverable | P1 |

## 11. Admin Module Inventory and Page Scope

| Module | P0 pages / operations | P1 additions | Permissions (illustrative; final catalog TBD) |
|---|---|---|---|
| Overview | KPIs, pending orders, low-stock summary | Trend charts, drilldown, financial metrics | `overview.read` |
| Catalog | Products, product editor, variants, categories, brands, media | Bulk edit, merchandising | `catalog.read`, `catalog.write`, `catalog.publish` |
| Inventory | SKU stock table, adjustments, movement history | Alerts/advanced reservations view | `inventory.read`, `inventory.adjust` |
| Orders | List/detail, status fulfillment, shipping reference | Customer cancellations, returns and advanced shipping | `orders.read`, `orders.fulfill` |
| Customers | Not in P0 beyond restricted order context | Search, support detail and history | `customers.read` |
| Payments | P0 internal attempts/reference only, no advanced finance UI | Finance lists, reconciliation, discrepancy queue | `payments.read`, `payments.reconcile` |
| Refunds | Not customer-facing in P0 | Request review and partial/full execution | `refunds.read`, `refunds.approve`, `refunds.execute` |
| Marketing | Not in P0 | Coupons, promotions, banners | `marketing.*` |
| Analytics | Minimal overview only | Reports/charts/export | `analytics.read`, `analytics.export` |
| Administration | Staff list/invite/deactivate, grant/revoke minimum permissions, high-impact audit records | Permission bundles and audit search/filter | `staff.manage`, `permissions.manage`, `audit.read` |
| Settings | Minimal shipping/tax/site defaults via approved seed/admin configuration | UI for shipping/tax/payment configuration | `settings.read`, `settings.manage` |

**Default dashboard data-fetch rule:** Render only the active route's queries, permission-filtered, with deduplication and bounded refetch. No mount-time request waterfall covering unrelated modules.

## 12. Customer Storefront Page Scope

| P0 route concept (not final URL) | User purpose | Important states |
|---|---|---|
| Home | Featured categories and selected products | Loading, no featured products, error |
| Catalog/category | Search/filter/sort/paginate | Zero results, invalid filters, stale inventory |
| Product detail | Choose variant and quantity | Out of stock, missing media, unpublished SKU |
| Cart | Review/edit items | Empty cart, price/stock changed, unauthenticated guest |
| Sign up / sign in / verify / recover | Establish verified identity | Invalid token, throttle, expired session |
| Profile / addresses | Edit own data and shipping locations | Address unavailable, validation errors |
| Checkout | Address, totals, sandbox payment | Reprice, unsupported zone, expired stock hold, pending provider |
| Confirmation | Resolved order state with safe retry/navigation | Unknown outcome, payment pending/failed |
| Order list/detail | Historical and current orders | Empty history, another-user ID, shipment in progress |

**P1 routes:** wishlist, product reviews, coupons within cart/checkout, return requests, cancellation, refund status and richer tracking.

## 13. Non-Functional Requirements (NFRs)

| ID | Requirement | Measurable acceptance | Priority |
|---|---|---|---|
| NFR-SEC-01 | Session protection | HTTP-only Secure cookies in production; SameSite strategy and CSRF defense; rotation/revocation and expiry tests | P0 |
| NFR-SEC-02 | Credential protection | Argon2id password hashes; password policy; non-enumerating recovery/verification; rate limits | P0 |
| NFR-SEC-03 | Authorization | RBAC plus object-level ownership enforced at API and service boundary, denial tests for all protected operations | P0 |
| NFR-SEC-04 | Input/output hardening | Zod/DTO validation, length caps, upload validation, secret redaction, safe CSP/CORS/headers | P0 |
| NFR-SEC-05 | Secret/data privacy | No secret/card data in frontend, source, logs or fixtures; environment-separated credentials | P0 |
| NFR-SEC-06 | Dependency and code review | Secret/dependency scanning; no known critical/high issues at release without documented exception | P0 |
| NFR-DATA-01 | Transactional consistency | No oversell, double payment or orphan reservations in concurrency and retry integration suites | P0 |
| NFR-DATA-02 | Durable records | Migrations reproducible; financial/order/audit changes preserved; backup/restore rehearsal documented | P0 |
| NFR-PERF-01 | Load and responsiveness | Catalog pagination; API indexed query budgets defined in architecture; Lighthouse KPI-07 | P0 |
| NFR-PERF-02 | Efficient fetching | Active-page-only data fetching, cache/invalidation contract, no repeated request loops | P0 |
| NFR-A11Y-01 | Accessible interaction | WCAG 2.2 AA target; keyboard/focus/labels/dialog behavior; KPI-05 | P0 |
| NFR-RESP-01 | Responsive layout | 360/768/1440 px reference viewport tests, no unexpected horizontal overflow; appropriate controls | P0 |
| NFR-REL-01 | Observable errors | Correlation/request IDs, structured sanitized logging, health/readiness endpoints, actionable stable API errors | P0 |
| NFR-REL-02 | Availability/recovery targets | Staging recovery drill; production SLO/RTO/RPO numeric targets approved before real launch | P0 foundation |
| NFR-TEST-01 | Automated verification | Unit+integration+E2E critical-path test coverage, CI pipeline and KPI-01 through KPI-04 | P0 |
| NFR-API-01 | Stable contracts | REST/OpenAPI versioning; typed API client; documented validation/error/idempotency semantics | P0 |
| NFR-OPS-01 | Deployment separation | Independently deployed storefront/admin, backend API and workers when needed; only backend DB access | P0 |
| NFR-OPS-02 | Background workflows | Durable retries/dead-letter paths and worker metrics for mail/reconciliation/notifications | P1 |
| NFR-UX-01 | Professional design quality | Shared design tokens, logical density, skeleton/error/empty states, interaction consistency and visual review | P0 |

**Performance budget caveat:** Final p95 endpoint timing, concurrency volume, catalog size, uptime, backup frequency, RTO/RPO and data-retention durations are **not invented** here. §20 and architecture must choose measurable baselines/test rigs before production readiness sign-off.

## 14. Data, Privacy and Retention Requirements

- **Identities:** distinct customer and staff permission scopes; verify email; hash passwords; secure session state and revocation. Never store plaintext secrets.
- **Catalog:** products, categories, brands, attributes, variants/SKUs, media, publication status and optional cost fields restricted to staff.
- **Shopping:** customer carts/items, addresses and order-time snapshots. Public APIs expose only approved fields.
- **Inventory:** SKU-level on-hand, reservations, stock movement ledger, reasons and actor references; reconciled quantities.
- **Orders:** stable order number, item snapshots, currency, totals, status history, fulfillment and shipment reference.
- **Finance:** payment intents/attempts, provider references, financial transaction events, refunds (V1), idempotency records and currency. No raw card data.
- **Governance:** permission assignment history and tamper-resistant audit records with PII minimization.
- **Deletion:** archived products/staff where history requires linkage; customer erasure/retention workflow is deferred for full policy design, not permission to store indefinitely; applicable privacy/law needs review before launch.
- **Time:** store event timestamps unambiguously (UTC instant) and define report/business day in `Africa/Cairo` for Egypt-first operations; date-only shipping/promotional windows need business-timezone policy.
- **Access:** NestJS is the only database client for business operations. Supabase is PostgreSQL infrastructure, not browser-side business data access.

## 15. Integrations and Technical Constraints

| Integration / system | MVP requirement | V1 extension / gate |
|---|---|---|
| PostgreSQL via Supabase | One centralized schema, Prisma migrations, least-privileged API DB role | Backup/restore and operations refinement |
| NestJS | Modular monolith REST/OpenAPI and domain services | Finance/reconciliation and job modules |
| Next.js (two apps) | Storefront and Admin, independent deployments | Richer dashboards and UX |
| Object storage | Controlled product image upload/delivery | Lifecycle automation and optimization |
| Email | Verification and recovery delivery adapter (dev sink acceptable for demos) | Transactional notifications, queues and real sender/domain readiness |
| Sandbox payment | Deterministic mock/provider adapter; no real funds | Egyptian provider verification, signed webhooks and live launch approval |
| Redis/BullMQ | Optional only if P0 implementation requires a durable expiry/job mechanism; architecture selects safe approach | Jobs, notification retries, scheduled workflows |
| Vercel | Frontend deployments | Independent environment promotion |
| NestJS hosting | Must support long-running API and required workers; provider TBD | Scale and observability |
| GitHub/GitHub Actions/Docker | Branch discipline, CI tests, build and staging setup | Release/rollback hardening |

No third-party payment, shipping, email or hosting vendor is declared approved simply because it appears in the technology direction. Verify current versions, geographic merchant support and terms when making vendor decisions.

## 16. MVP Demo Dataset and Test Fixtures

**Seed categories [PROPOSED]:** Electronics (e.g. phone with storage/color), Fashion (size/color), Home & Living (simple SKU), Accessories (configurable color). Include published and draft products, in-stock/zero-stock/low-stock variants, unique SKUs and media placeholders.

**Synthetic personas:** 2 customers with different orders/addresses; 1 catalog-only admin; 1 inventory/fulfillment admin with scoped operations; 1 Super Admin; optional disabled admin. **Never deploy public demo credentials that can mutate live financial or customer data.** Staging-only demo accounts are clearly marked.

**Mock payment scenarios:** success, failure, pending, repeated callback/result, delayed result, idempotent retry, and failure during reservation expiration.

**Validation fixtures:** EGP cents/rounding, unsupported delivery address, product price change, archived SKU, last-unit concurrency, token expiry, malformed upload and forbidden access.

## 17. Test Strategy and Evidence Matrix

| Test layer | Must validate | Minimum evidence |
|---|---|---|
| Unit | Decimal totals, tax-inclusive/exclusive rule variants, SKU options, state machines, permission predicates, input bounds | Named automated suites and coverage report |
| API integration (real PostgreSQL test DB) | Transactions, reservation concurrency, DB constraints, scope enforcement, idempotency, stock ledger | Repeatable isolated test runs and invariant assertions |
| Adapter/contract | Mock provider, email sink, storage signing, OpenAPI typed-client compatibility | Contract fixture/snapshot checks |
| E2E storefront | Browse → select variant → cart → login/verify → checkout success/failure → order history | Playwright screenshots/logs |
| E2E admin | Auth → catalog edit → stock adjustment → fulfillment → permission denial | Playwright and API assertions |
| Security | CSRF, cookie attributes, session invalidation, brute-force limiting, IDOR, privilege escalation, upload abuse | Negative suites and security checklist |
| Accessibility | Keyboard navigation, forms, focus states, contrast/semantics and axe | Automated report + manual checklist |
| Responsive/performance | Priority pages at 360/768/1440 px, Lighthouse representative audits, active-page query budget | Screenshots, performance report and request traces |
| Deployment/recovery | CI build, migration plan, staging smoke, secret scanning, backup/restore and rollback | Release checklist and logs |
| V1 finance | Webhook signature/replay/order, partial-refund concurrency, reconciliation discrepancies | Integration/contract tests against provider sandbox |

Test data must be deterministic; financial and stock tests must not rely on arbitrary request ordering. No acceptance test passes solely on front-end mocks when a persisted backend effect is required.

## 18. Phased Delivery and Explicit Exit Gates

### MVP / P0 — Purchase and core operations

**Scope:** All P0 requirements in §7, §13 plus §8 invariants applicable to MVP. **Exit requires:** verified customer sandbox purchase, correct order/stock/payment records under concurrency and retry, authorized staff fulfillment, permission/ownership denials, critical audits, responsive accessible customer/admin journeys, passing CI and staging deployment/runbook. **No claim of live financial commerce readiness.**

### V1 / P1 — Business operations and post-purchase

**Scope:** All P1 requirements including wishlist, reviews, coupons, cancellation, returns/refunds, payment reconciliation, richer notifications/analytics/support. **Exit requires:** end-to-end return/partial refund and idempotent finance records, reconciliation exception process, marketing redemption safety, expanded security and release tests. Enabling a real payment gateway demands a **separate** compliance/vendor/operational sign-off.

### Future / P2 — Expansion

Only after proven business need. Each P2 capability requires new research, PRD delta, threat model/financial impact if applicable, UX/data/API revisions and independent approval.

## 19. Dependencies, Sequence and Traceability

### 19.1 Planning dependencies

- `01-project-brief.md` — **approved scope baseline**, per user instruction on 2026-10-18.
- `02-prd.md` — **this draft**, requires approval before being adopted as baseline.
- `03-ux-specification.md` — page map, layouts, state inventory, responsive/accessibility interactions following PRD.
- `04-architecture.md` — modules, session/CSRF strategy, state machines, reservation races, provider abstractions, deployment/worker topology.
- `05-database-design.md` — normalized tables, constraints, indexes, transaction boundaries and retention.
- `06-api-design.md` — endpoint IDs, DTO validation, roles/permissions, idempotency and error envelopes.
- `07-implementation-plan.md` — granular task IDs, prerequisites, acceptance/test checks and review gates for Codex.

### 19.2 Requirement-to-system ownership (examples)

| Requirement set | Primary API/domain owner | Storefront | Admin | Primary verification |
|---|---|---|---|---|
| CH-AUTH-* | Identity/security | Sign-in, profile, addresses | Staff login (separate scope) | Session and ownership tests |
| CH-CAT-* | Catalog/search | Catalog/detail | Catalog CRUD | Search/filter and publication tests |
| CH-CART-*, CH-CHECK-* | Cart/pricing/checkout | Cart/checkout | Order visibility | E2E and transaction tests |
| CH-ORD-* | Orders/fulfillment | Order history | Queue/fulfillment | State transition tests |
| CH-PAY-* | Payments/finance | Checkout/status | Finance/refunds (V1) | Idempotency and accounting tests |
| CH-INV-* | Inventory | ATS indication | Stock adjustments | Concurrency/ledger tests |
| CH-SEC-* | Identity/RBAC/audit | Ownership gates | Staff governance | Permission matrix and audit tests |
| CH-MKT-*, CH-AN-* | Marketing/analytics | Promo UI (V1) | Campaigns/reports (V1) | Redemption/report invariants |

The system modules are planning labels and do not prescribe file paths or public endpoints. The implementation plan will link each task to specific requirement IDs and a test plan.

## 20. Open Decisions and Required Approvals

| Decision | Proposed default | Owner | Resolve by |
|---|---|---|---|
| DEC-01 Guest checkout/cart merge | Registered checkout only; optional guest cart merges on login | Product | PRD approval |
| DEC-02 Email verification gate | Required before first checkout | Product/security | PRD approval |
| DEC-03 Shipping footprint/rates | Egypt-only supported-zone flat fees; exact rates as fixtures | Product | PRD/UX approval |
| DEC-04 Tax display/calculation | Configurable inclusive/exclusive policy; no unverified legal rate asserted | Product/finance | Financial/architecture review |
| DEC-05 Decimal rounding | Two decimals, half away from zero for designated invoice/allocation steps | Product/finance | Financial/architecture review |
| DEC-06 Reservation duration | 15 minutes; safe expiration and late-payment reconciliation | Product/backend | Architecture approval |
| DEC-07 Order/payment state transitions | Candidate models in §8.2; detail race precedence | Backend/product | Architecture approval |
| DEC-08 Seed data/catalog rules | Four sample category families + configurable attributes/SKUs | Product | PRD approval |
| DEC-09 Customer cancellation | V1; MVP unpaid void and timeout only | Product | PRD approval |
| DEC-10 Refund policy | V1, eligibility/window/approvals and restock rules to specify | Product/finance | V1 PRD delta |
| DEC-11 Staff role matrix | Default-deny granular permission bundles; ensure last Super Admin | Security/product | Architecture approval |
| DEC-12 Security/session model | HTTP-only cookies, Argon2id, session revocation, CSRF defense | Security/backend | Architecture approval |
| DEC-13 KPI baselines | Proposed §3 values; load volumes and API p95 TBD | Product/QA | PRD/test-plan approval |
| DEC-14 Retention/privacy | Archival for financial/audit facts; user privacy compliance reviewed | Product/legal/security | Pre-live checklist |
| DEC-15 Hosting/worker stack | Vercel UI + independently hosted NestJS; Redis/BullMQ as needed | Architecture/DevOps | Architecture approval |
| DEC-16 Live Egyptian gateway | None selected; sandbox-first, verify eligibility, payouts/refunds/webhooks | Product/finance | Before V1 live enablement |
| DEC-17 Analytics monetary semantics | Gross captured, refunds and net definitions, Cairo reporting day | Product/finance | V1 data/report design |

**Hard blockers before implementation of dependent features:** Approved tax/shipping rounding policy, payment and reservation race policy, permission matrix, session/CSRF model and database transaction constraints. **Hard blockers before any live commerce launch:** provider eligibility, legal/regulatory/privacy review, tested gateway callback/refund/reconciliation, operations and recovery sign-off.

## 21. Risks and Mitigations

| ID | Risk | Severity | Mitigation / response |
|---|---|---|---|
| R-01 | Broad catalog/admin scope derails MVP | High | Release gate; P0-only tasks; scope-change review |
| R-02 | Overselling under concurrency | Critical | Atomic reserve/consume/release with DB constraints, tests |
| R-03 | Duplicate charge/refund from retries/webhooks | Critical | Idempotency, durable events, reconciliation and test fixtures |
| R-04 | Authorization/IDOR leaks sensitive data | Critical | Backend default-deny RBAC, ownership scoping, negative tests |
| R-05 | Unverified local tax or gateway assumptions | High | Financial decision gate; Egypt provider verification before live |
| R-06 | UX overflow, oversized controls, dashboard overfetch | High | UX specs, design tokens, viewport/query tests |
| R-07 | Worker/provider failure leaves inconsistent reservations | High | Durable state, bounded retries, exception tracking |
| R-08 | Production secrets or PII exposed | Critical | Secrets isolation, safe logs, scans and synthetic data |
| R-09 | Wrong variant/attribute data shape | Medium | Default SKU invariant, uniqueness, sample category fixtures |
| R-10 | Migration/backup recovery failure | High | Rehearsed migrations, backups, rollback/restore drills |
| R-11 | Admin action breaks historical finance/order facts | High | Archives, immutable snapshots and correction records |
| R-12 | Metrics mislabel sandbox/revenue/refunds | Medium | Explicit KPI contracts and reporting definitions |

## 22. Definition of Ready / Definition of Done

**Story ready for development only if:** requirement ID and release priority exist; actor and permission identified; acceptance includes normal/error/security cases; dependencies approved; UX/API/data contracts sufficiently defined; test type and fixtures listed; no unresolved blocker from §20.

**Story done only if:** correct frontend/backend/database behavior implemented (where applicable); acceptance and negative tests pass in CI; authorization, audit, idempotency and financial effects checked; responsive/a11y states verified; relevant OpenAPI/docs updated; reviewer verifies change against requirements; no claim of deployment without actual staging/prod evidence.

**MVP ready to sign off only if:** all P0-critical items pass; no known critical/high security defect, unresolved financial inconsistency, oversell issue or cross-user/admin data leak; portfolio demo and reproducible walkthrough verified.

## 23. BMAD Approval Record and Next Step

| Record | Status |
|---|---|
| `01-project-brief.md` scope | **Approved by product owner, 2026-10-18** |
| `02-prd.md` requirements | **Draft awaiting product-owner approval** |
| Architecture/UX/database/API | **Not yet approved or implemented** |
| Live payment provider | **Not selected/approved** |
| Coding authorization | **Not granted** |

**Next:** Review and approve this PRD—including the default MVP policies and explicit exceptions in §20—then author `03-ux-specification.md` for storefront and admin experiences. Architecture/data/API design follow in the agreed BMAD sequence. Do **not** code yet.

# CommerceHub — REST API Design Specification

**Document ID:** CH-BMAD-06  
**Filename:** `06-api-design.md`  
**Version:** 1.0 — approved API contract baseline  
**Date:** 2026-10-18  
**Status:** APPROVED API CONTRACT BASELINE — 2026-10-18; FIN-01, FIN-02, INV-01, SEC-01, PAY-01, OPS-01, LEG-01, PAY-LIVE and implementation verification remain gated; no implementation, endpoints, or tests executed  
**Baseline:** `01-project-brief.md`, `02-prd.md`, `03-ux-specification.md`, `04-architecture.md`, and `05-database-design.md` approved as **design baselines**, not proof of implementation.  
**Product context:** Single-merchant Egypt-first multi-category physical-products store; `EGP` for P0; Next.js storefront and separate Next.js administration frontend; shared NestJS REST API; Prisma/PostgreSQL, Redis/BullMQ where warranted.  
**Release key:** **P0** MVP / sandbox payments; **P1** V1; **P2** future. **GATED** means contract candidate but dependent implementation cannot start before named policy sign-off.

> **Approval boundary.** This is a precise contract proposal, not generated Swagger, running code, tested behavior, a live provider selection, or legal/tax advice. Values such as reservation duration, tax, shipping, rate limit, cookie origin, payment provider signing algorithm, and retention are *not* silently finalized. Financial/security/inventory/operations gates stay open even when API layout is approved. No coding or migration is authorized by this file alone.

---

## 1. Purpose, design principles, and scope

The API is the **single authoritative business and authorization boundary** for both web applications and trusted workers. API responsibilities include identity/session validation, granular permission evaluation, catalog visibility, server-priced checkout, atomic inventory holds and settlement, durable payment history, operational auditability and typed browser-facing contracts. Frontends must never connect directly to PostgreSQL/Supabase or trust client-sent money, stock, permissions, fulfillment, or payment status.

**Non-negotiable invariants:** (1) one request is authorized for the specific actor/resource/action; (2) all money is calculated server-side as exact decimal and returned as decimal **strings** with a currency; (3) replay or concurrency never oversells, duplicates orders, captures or refunds; (4) immutable order/address/line/financial snapshots survive edits; (5) signed external events are verified before state changes; (6) uncertainty is explicit, reconcilable and visible to operators; (7) all list operations are paginated; (8) administrative changes carry actor/audit context; (9) client API contracts cannot leak credential digests, provider secrets or internal persistence structures.

### 1.1 URL and audience boundaries

- Base URL: `https://api.<approved-domain>/api/v1` (illustrative hostname, **SEC-01** determines actual cookie/origin setup).
- Storefront routes: `/auth`, `/me`, `/catalog`, `/cart`, `/checkout`, `/orders` and `/shipping`.
- Staff routes: `/admin/**`; external receipt routes: `/webhooks/**`; internal health routes: `/health/**`.
- Version in **path** (`/api/v1`). All examples below omit that common prefix; no `/v2` until documented deprecation/migration.
- UTF-8 JSON over HTTPS, ISO-8601 UTC timestamps (`2026-10-18T12:00:00Z`), UUID identifiers, standard HTTP verbs, **no GET side effects**.
- REST DTO field names use `camelCase`, even though PostgreSQL uses `snake_case`. Mapping happens inside NestJS.
- P0 only **authenticated** persistent cart and checkout; guest checkout, guest cart merge, user-facing cancellation/refunds, live payments and coupon application are not P0.

### 1.2 NestJS module and ownership map

| Module | Route family | Owns | Dependencies / forbidden coupling |
|---|---|---|---|
| Identity/Auth | `/auth`, `/me` | credentials, verification, sessions, revocation | Auth never returns credential hashes |
| Authorization/Admin staff | `/admin/staff`, `/admin/roles`, `/admin/permissions` | permission checks, staff assignments | API guards AND domain policy; not Next.js UI gates |
| Catalog | `/catalog`, `/admin/products`, `/admin/categories`, `/admin/brands`, `/admin/media` | variants, publication, stable catalog DTO | Does not own stock or charge payments |
| Cart/Checkout | `/cart`, `/checkout` | cart state, authoritative pricing quote, checkout orchestration | Calls inventory/orders/payments transactionally, no client totals |
| Inventory | `/admin/inventory`, internal inventory orchestration | balances, reservations, stock movements | Atomic DB conditional updates, immutable movement ledger |
| Orders/Fulfillment | `/orders`, `/admin/orders` | order lifecycle, immutable snapshots, shipment updates | Paid transition requires trusted payment evidence |
| Payments | `/checkout/*payment*`, `/admin/payments`, `/webhooks/*` | intents, attempts, events, reconciliation | Adapter boundary; sandbox only in P0 |
| Audit/Outbox | `/admin/audit-logs`, worker-internal processes | append-only audit/outbox | Fail-closed for defined critical changes |
| P1 Returns/Refunds | `/returns`, `/admin/refunds` | eligibility, approved refunds, financial ceilings | **FIN-02/PAY-LIVE** gated |
| P1 Marketing/Reviews/Analytics | relevant P1 routes | promotion/review/aggregate workflows | Do not contaminate P0 scope |

## 2. Transport, representation, and compatibility rules

### 2.1 Common headers

| Header | Consumer | Rule |
|---|---|---|
| `Accept: application/json` | Client | JSON default |
| `Content-Type: application/json` | JSON writes | Reject unsupported types with `415` |
| `Cookie: <session cookie>` | Protected browser routes | HTTP-only credential sent by browser; no browser localStorage tokens |
| `X-CSRF-Token` | Cookie-authenticated unsafe methods | Validated against approved **SEC-01** CSRF model; not user-selected token |
| `Idempotency-Key` | Create order, payment attempt and refundable effect | Opaque high-entropy key, scoped and checked as defined in §10; required where marked |
| `If-Match` | Conflict-sensitive admin updates | Version-based optimistic precondition where supported; `412` on stale mutation |
| `X-Request-ID` | Optional client request correlation | Server generates canonical ID and logs it; sanitize untrusted input |
| `Cache-Control` | Response | `no-store` for PII, auth, cart, quotes, orders, admin; public catalog bounded policy |
| `Retry-After` | `429`/retryable `503` | Only when meaningful; never promise exact completion |

**CORS & cookies:** Allowlist exactly approved browser origins, use credentialed requests only with explicit origins, never `*` with credentials; `Secure`, `HttpOnly`, appropriate `SameSite`, `Path`, optional `Domain` after a subdomain/BFF proof. Origin/Referer defense, CSRF strategy, logout revocation and admin separation are **SEC-01 gated**. Proxies must be explicitly trusted before interpreting forwarded host/IP.

### 2.2 Envelope and serialization

Success **single resource**: `{ "data": { ... }, "meta": { "requestId": "..." } }`; success **collection**: `{ "data": [ ... ], "page": { ... }, "meta": { "requestId": "..." } }`. `204` contains **no** body. Error always uses a typed `error` object (§12). Business amounts are decimal strings, e.g. `"1499.00"`; currency explicit `"EGP"`. Dates are UTC ISO strings. Optional absent properties are omitted unless `null` has explicitly documented meaning; no database enum leaked without API enum mapping. Customer UI may show locally formatted prices, but only the server computes totals.

**Standard scalar types:** `Uuid`, `IsoInstant`, `MoneyString` (decimal string, valid scale and range determined by **FIN-01**), `CurrencyCode` (P0 only `EGP`), `Sku`, `Slug`, `SafeText`, `PositiveInt`. Max lengths, fields and enum candidates are contract proposals; freeze generated OpenAPI once review gates close.

### 2.3 Versioning and breaking changes

Backward compatible: adding optional response fields, new list filters and enum values **only** when clients are written to tolerate unknowns; otherwise treat enum expansion as a breaking change. Breaking: removing/renaming required fields, changing amount format, changing status meaning, narrowing behavior or raising mandatory field requirements. Deprecate with documented dates and a migration window, not silently; storefront/admin API clients are version-pinned. Do not surface Prisma model types to browser bundles.

## 3. Contract-first TypeScript, Zod, DTO, OpenAPI strategy

- `packages/validation`: safe shared **Zod** wire schemas (request, response, error, enum candidates) and inferred wire types; no secrets, database access, NestJS decorators or domain policy computation.
- `apps/api`: NestJS request DTO adapters validate via a single Zod validation pipe (or an explicitly documented alternative); domain commands are **separate** from inbound DTOs. OpenAPI schemas derived from the same canonical wire definitions using a maintained compatibility layer, with drift tests.
- `packages/api-client`: typed `fetch` client with credentials, CSRF negotiation, abort signals, timeout and retry classification; do not auto-retry **non-idempotent writes** without stable key. Browser/server entrypoints avoid leaking secrets.
- `packages/types`: share only published API models and stable enums; never Prisma client/schema internals as UI types.
- `apps/storefront`/`apps/admin`: TanStack Query keys scoped by resource/filter/user, route-aware queries, abort on navigation and explicit invalidation on writes. For server-rendered public catalog, choose Next.js caching policy per endpoint; private pages `no-store`.

**Illustrative contract (documentation, not implementation):**

```ts
import { z } from 'zod';
const MoneyString = z.string().regex(/^\d{1,15}(\.\d{1,4})?$/); // illustrative; FIN-01 controls final scale
const QuoteResponse = z.object({
  id: z.string().uuid(),
  status: z.enum(['OPEN', 'ACCEPTED', 'EXPIRED', 'INVALIDATED']),
  currency: z.literal('EGP'),
  subtotal: MoneyString,
  shipping: MoneyString,
  tax: MoneyString,
  discount: MoneyString,
  total: MoneyString,
  taxIncluded: z.boolean(),
  expiresAt: z.string().datetime({ offset: true }),
  version: z.number().int().nonnegative(),
});
```

No contract permits mass assignment: strip/reject `roleIds`, `isPaid`, `stock`, `total`, `unitPrice` or `userId` in public write DTOs. Prefer `.strict()` validation at protected input boundaries. Emit OpenAPI 3.1 with `/api/v1` `servers`, auth cookie security scheme, tagged routes, idempotency/CSRF parameters, status responses and canonical examples. Run OpenAPI schema lint and consumer contract tests before implementation acceptance.

## 4. Authentication, session and customer identity API — P0

| Method | Endpoint | Identity | Request fields / notes | Response / errors |
|---|---|---|---|---|
| POST | `/auth/register` | Guest | `email`, `password`, `displayName?` | `202` neutral confirmation; `422`; no account enumeration |
| POST | `/auth/login` | Guest | `email`, `password` | `200` public current user plus session cookie; `401`, `429` |
| POST | `/auth/logout` | Session | CSRF header; revoke current session | `204`, expire cookie; idempotent safe logout behavior |
| POST | `/auth/email-verification/request` | Guest/session | `email?` | `202` generic message; rate limited |
| POST | `/auth/email-verification/confirm` | Challenge holder | `token` | `204` once; invalid/reused/expired gives safe `400` |
| POST | `/auth/password-recovery/request` | Guest | `email` | `202` neutral response |
| POST | `/auth/password-recovery/confirm` | Challenge holder | `token`, `newPassword` | `204`; revokes relevant sessions per SEC-01 |
| GET | `/me` | Customer/staff | — | `200 {id,email,displayName,emailVerified,...}`; `401` |
| PATCH | `/me` | Customer/staff | Allowlisted `displayName`, `phone?` | `200`; immutable/privileged fields rejected |
| GET | `/me/addresses` | Customer | Paginated own addresses | `200` list |
| POST | `/me/addresses` | Customer | `recipientName`, `phone`, `line1`, `line2?`, `city`, `governorate`, `postalCode?`, `deliveryNotes?`, `isDefault?` | `201`; unsupported zone validated at quote |
| PATCH | `/me/addresses/{addressId}` | Owner | Allowed address fields | `200`; `404` for nonowner resource |
| DELETE | `/me/addresses/{addressId}` | Owner | — | `204`; snapshots remain unchanged |
| POST | `/me/addresses/{addressId}/make-default` | Owner | — | `200`; atomic one-default constraint |

**Security requirements:** Generic recovery/registration responses mitigate enumeration; avoid exposing account existence through latency where feasible. Login rotates session identifier, stores only opaque token digest in DB, binds revocation/expiry and sets cookie. Argon2id password policy, lockout/rate controls, privileged staff authentication and step-up operations remain **SEC-01** for final thresholds/transport. Do not put password reset tokens into access logs. Session cookie names/paths intentionally unspecified pending origin proof.

**Sample request/response:**

```http
POST /api/v1/auth/login HTTP/1.1
Content-Type: application/json

{"email":"shopper@example.test","password":"<not-a-real-password>"}
```

```json
{"data":{"id":"11111111-1111-4111-8111-111111111111","email":"shopper@example.test","displayName":"Example Shopper","emailVerified":true},"meta":{"requestId":"req_example_01"}}
```

## 5. Public catalog API — P0

| Method | Endpoint | Filters/payload | Response and rules |
|---|---|---|---|
| GET | `/catalog/products` | `q`, `categoryId`, `brandId`, `minPrice`, `maxPrice`, `available`, `sort`, `pageSize`, `cursor` | Published/sellable products only, page with stable tie-breaker; no cost price/private stock movements |
| GET | `/catalog/products/{slug}` | optional selected `variantId` | Public product, images/alt text, attributes, available variants and indicative stock flag; unpublished `404` |
| GET | `/catalog/categories` | `parentId?`, `depth?` | Published tree, bounded depth |
| GET | `/catalog/categories/{slug}` | — | Public category/detail, `404` if hidden |
| GET | `/catalog/brands` | `q?`, cursor | Public brand list |
| GET | `/catalog/brands/{slug}` | — | Public brand details |
| GET | `/shipping/zones` | public safe projection | Eligible governorates/zones, not confidential operational pricing rules |

`sort` enum: `newest`, `price_asc`, `price_desc`, `name_asc`. Cursor encodes sort tuple; **server signs/verifies or treats as opaque**. `pageSize` default 20, maximum 100 (candidate); `422` for invalid limit, illegal sorting/price bounds; `400` for tampered/malformed cursor. Cursor pages must retain deterministic `(sortValue, id)` ordering. Public catalog stock is advisory; final availability is proved only by transaction at checkout. Public caching must be bounded and invalidated on publication/price changes.

Example list item shape: `id`, `slug`, `name`, `brand`, `category`, `primaryImage {url,alt}`, `priceRange {min,max,currency}`, `isAvailable`, `createdAt`. Product detail includes `variants[{id,sku,attributes,price,available}]`; **exact** sellable variant price is always returned as a string/currency, and checkout still re-evaluates it.

## 6. Cart and checkout quotes — P0

| Method | Endpoint | Required fields | Returns/behavior |
|---|---|---|---|
| GET | `/cart` | — | current user's cart, server-priced *indicative* items, version, availability warnings |
| POST | `/cart/items` | `{variantId, quantity}` | `201` or `200` canonical item; duplicate SKU merges/increments only within policy; `409` unavailable SKU |
| PATCH | `/cart/items/{itemId}` | `{quantity}` | `200`; `409` if changed/unavailable; no negative/zero |
| DELETE | `/cart/items/{itemId}` | — | `204` |
| POST | `/checkout/quotes` | `{shippingAddressId, cartVersion}` | `201` immutable quote with full server calculation and expiry; no reservation yet; `409` cart version/price conflict |
| GET | `/checkout/quotes/{quoteId}` | — | owner's unexpired/expired quote, immutable line and address breakdown |
| POST | `/checkout/orders` | `{quoteId, acceptedQuoteVersion}` + `Idempotency-Key` | `201` order + payment intent OR replay same response; `409` stock/expired quote, `422` invalid state |
| GET | `/checkout/orders/{orderId}/payment-status` | — | Current authoritative status, retry/poll guidance; never trust return URL |
| POST | `/checkout/orders/{orderId}/sandbox-payment-attempts` | `{scenario}` + `Idempotency-Key` | `202` processing or `200` settled state; only explicit sandbox test scenarios, gated PAY-01 |

**Quote rules:** Quote must capture owner, validated address snapshot, SKU snapshot, quantity, price components, currency, pricing/shipping/tax rule versions and expiry. Reject stale SKU/category/cart and return actionable `QUOTE_STALE`/`PRICE_CHANGED`; require the user to review a **new quote**, not silently change total. `taxIncluded` determines correct formula; do not double-add inclusive tax. **FIN-01** blocks final formula, rounding, tax and shipping implementation. Quote TTL is separate from inventory hold TTL.

**Order acceptance:** Server checks authorization and state, locks necessary cart/quote/stock rows in deterministic SKU ordering and atomically (a) claims quote exactly once, (b) creates immutable order/lines, (c) reserves stock with conditional updates and inserts stock ledger/outbox records, (d) creates sandbox payment intent and idempotency record. External network calls occur *after commit*. With insufficient stock, roll back all reservation/order effects; return `409 STOCK_UNAVAILABLE` including safe SKU availability clues. Two simultaneous different keys for same quote must still resolve to a single order by unique persisted quote association. Worker expiry must lock and check reservation state before release.

**Example quote response (values illustrative; not approved FIN-01 tax policy):**

```json
{
  "data": {
    "id":"22222222-2222-4222-8222-222222222222",
    "status":"OPEN","currency":"EGP","version":1,
    "lines":[{"variantId":"33333333-3333-4333-8333-333333333333","sku":"SHIRT-BLK-M","name":"Cotton Shirt","quantity":2,"unitPrice":"250.00","lineSubtotal":"500.00"}],
    "subtotal":"500.00","discount":"0.00","shipping":"40.00","tax":"0.00","taxIncluded":false,"total":"540.00",
    "expiresAt":"2026-10-18T21:00:00Z",
    "address":{"city":"Mansoura","governorate":"Dakahlia","recipientName":"Example Shopper"},
    "policy":{"pricingVersion":"demo-1","shippingVersion":"demo-1","taxVersion":"demo-1"}
  },"meta":{"requestId":"req_quote_example"}
}
```

**Example order submission:**

```http
POST /api/v1/checkout/orders HTTP/1.1
Content-Type: application/json
Idempotency-Key: 6d5a4c57-35cb-471a-b366-df74e0cfaa6e
X-CSRF-Token: <approved-csrf-token>

{"quoteId":"22222222-2222-4222-8222-222222222222","acceptedQuoteVersion":1}
```

```json
{"data":{"orderId":"44444444-4444-4444-8444-444444444444","orderNumber":"CH-EXAMPLE-001","orderStatus":"PENDING_PAYMENT","paymentIntentId":"55555555-5555-4555-8555-555555555555","paymentStatus":"PENDING","currency":"EGP","total":"540.00"},"meta":{"requestId":"req_order_example","idempotencyReplayed":false}}
```

## 7. Customer orders and basic fulfillment — P0

| Method | Endpoint | Result |
|---|---|---|
| GET | `/orders` | Own order summaries, cursor pagination, filter by safe status/date |
| GET | `/orders/{orderId}` | Own immutable items, totals, address snapshot, shipping/payment public status, timeline |
| GET | `/orders/{orderId}/shipments` | Own shipment milestones, no privileged carrier credentials |

Other customers' resources yield `404` (avoid ownership disclosure). Historical snapshots are never recomputed from live catalog. Client order creation is **only** through quote acceptance, never `POST /orders` with arbitrary totals. P0 does not expose self-service cancellation/returns. Payment status alone is insufficient to mark order shipped; admin fulfillment transitions require guards below.

## 8. Staff administration — P0

Every `/admin/**` endpoint requires a valid **staff identity**, backend permission check, resource scope evaluation and appropriate CSRF/sensitive-action controls. Super Admin is not an unbounded UI boolean; management rights are explicit, with protection for last active Super Admin and immutable/audited grant changes.

### 8.1 Overview and catalog

| Method | Endpoint | Permission | Contract / notes |
|---|---|---|---|
| GET | `/admin/overview` | `overview.read` | Lightweight KPI summary only; bounded aggregates, no fetch of full orders/catalog by default |
| GET | `/admin/products` | `catalog.read` | cursor/filter (`q,status,categoryId,brandId`), compact table projection |
| POST | `/admin/products` | `catalog.create` | name, category, brand, description, variants; create DRAFT; `201` |
| GET | `/admin/products/{productId}` | `catalog.read` | full edit projection, variants and media |
| PATCH | `/admin/products/{productId}` | `catalog.update` | allowlisted mutable data, `If-Match`/version |
| POST | `/admin/products/{productId}/publish` | `catalog.publish` | explicit guard all sellable variants/media/categories valid |
| POST | `/admin/products/{productId}/archive` | `catalog.archive` | disable new sales; preserve order snapshots |
| POST | `/admin/products/{productId}/variants` | `catalog.update` | unique SKU/attributes; price policy enforced |
| PATCH | `/admin/variants/{variantId}` | `catalog.update` | pricing/attributes, optimistic version; no stock here |
| GET/POST | `/admin/categories` | `catalog.read` / `catalog.manage` | list/create category; slug uniqueness and hierarchy checks |
| PATCH | `/admin/categories/{categoryId}` | `catalog.manage` | safe parent moves, cycle prevention |
| GET/POST | `/admin/brands` | `catalog.read` / `catalog.manage` | list/create brand |
| PATCH | `/admin/brands/{brandId}` | `catalog.manage` | rename/archive; historical snapshots preserved |
| POST | `/admin/media/upload-intents` | `media.manage` | proposed signed short-lived object-upload grant after size/type constraints |
| POST | `/admin/media/{mediaId}/attach` | `media.manage` | verify ownership/upload inspection and valid product reference |

Object storage policy and malicious upload inspection are **OPS-01** operational gates. Media bytes are not sent through arbitrary JSON base64 and public images are served from approved media origin. No synchronous giant export/list from overview.

### 8.2 Inventory and fulfillment

| Method | Endpoint | Permission | Contract / notes |
|---|---|---|---|
| GET | `/admin/inventory` | `inventory.read` | per-variant onHand/reserved/available, cursor and filters |
| GET | `/admin/inventory/{variantId}/movements` | `inventory.read` | immutable movement ledger, paginated |
| POST | `/admin/inventory/{variantId}/adjustments` | `inventory.adjust` | `{delta, reasonCode, note?, expectedVersion}`; atomic balance+ledger+audit; require Idempotency-Key |
| GET | `/admin/orders` | `orders.read` | compact page by date, status, number; no unrelated endpoint fan-out |
| GET | `/admin/orders/{orderId}` | `orders.read` | detail + shipment and timeline |
| POST | `/admin/orders/{orderId}/fulfillment-transitions` | `orders.fulfill` | `{targetStatus, reason?, expectedVersion}`; guarded valid transition, audit + outbox |
| POST | `/admin/orders/{orderId}/shipments` | `orders.fulfill` | `{carrier?, trackingReference?, items?}`; verify supported shipment lifecycle |
| PATCH | `/admin/shipments/{shipmentId}` | `orders.fulfill` | allowed milestone/tracking changes, version precondition |

`adjustments.delta` is a signed bounded **integer** and cannot produce `onHand < reserved`, nor mutate balances without a movement row. A return/restock action is not an untracked adjustment. Customer status is derived from authoritative order/payment/fulfillment state; direct `isPaid=true`/`status=PAID` patches are forbidden.

### 8.3 Staff, roles, permissions, audits

| Method | Endpoint | Permission | Contract / notes |
|---|---|---|---|
| GET | `/admin/staff` | `staff.read` | minimal identities and role assignments |
| POST | `/admin/staff/invitations` | `staff.invite` | email, scoped roleIds; no arbitrary superadmin grants |
| POST | `/admin/staff/invitations/{id}/revoke` | `staff.manage` | revoke pending invitation, audited |
| GET | `/admin/staff/{staffId}` | `staff.read` | effective roles, status, permitted profile data |
| PATCH | `/admin/staff/{staffId}` | `staff.manage` | status/profile fields only; cannot demote final superadmin |
| PUT | `/admin/staff/{staffId}/roles` | `roles.assign` | full role ID set, `If-Match`/version, separation-of-duties |
| GET | `/admin/roles` | `roles.read` | list with permission sets, no hidden superadmin capabilities inferred |
| POST | `/admin/roles` | `roles.manage` | create bounded custom role |
| PATCH | `/admin/roles/{roleId}` | `roles.manage` | change role metadata/permissions with privileged grant checks |
| GET | `/admin/permissions` | `roles.read` | known server-defined permissions; never user-supplied arbitrary names |
| GET | `/admin/audit-logs` | `audit.read` | bounded, filtered, append-only projections; sensitive values masked |

**Admin trust policy:** Validate both actor's ability to assign **each** target permission and the target's resource scope. Never permit self-elevation via role editing, a forged role ID, or bulk assignment. Certain operations may require Super Admin plus step-up authentication under **SEC-01**; these are **not** finalized yet. Critical successful writes must persist audit in the same DB transaction or abort; rejected attempts logged through a privacy-safe security event channel.

### 8.4 Payments oversight — P0 sandbox

| Method | Endpoint | Permission | Result |
|---|---|---|---|
| GET | `/admin/payments` | `payments.read` | paginated intents/attempts/effects, sandbox clearly labeled |
| GET | `/admin/payments/{paymentIntentId}` | `payments.read` | reconciled financial evidence and safe provider refs |
| POST | `/admin/payments/{paymentIntentId}/reconcile` | `payments.reconcile` | queue/check current provider sandbox state, **not** force `SUCCEEDED` |

No arbitrary admin endpoint to overwrite a payment as paid; no admin endpoint exposing full payment card data or unredacted provider payloads.

## 9. Authorization and RBAC matrix

Default deny; an authenticated customer cannot access `/admin` even with guessed IDs. Super Admin controls administration via server-defined privileged capability, but **must still** pass policy checks for locked self-demotion/last-owner protection and audit. Roles and permissions are database-backed, versionable and evaluated in the domain service as well as guards.

| Action / resource | Guest | Customer | Admin (explicit permission) | Super Admin |
|---|---|---|---|---|
| View published catalog | Allow | Allow | Allow | Allow |
| Manage own cart/orders/addresses | No | Owner only | Own customer data only | Own customer data only; no implicit access to others |
| Read dashboard KPI | No | No | `overview.read` | Allowed |
| Manage catalog / publish | No | No | `catalog.*` granular matching action | Allowed |
| Adjust inventory | No | No | `inventory.adjust` | Allowed |
| Read/fulfill orders | No | No | `orders.read` / `orders.fulfill` | Allowed |
| Read/reconcile payment records | No | No | `payments.read` / `payments.reconcile` | Allowed |
| Invite/manage staff | No | No | `staff.invite` / `staff.manage` only within assignment rules | Allowed, guarded |
| Manage roles/assign grants | No | No | `roles.manage` / `roles.assign` only within delegated subset; **SEC-01 review** | Allowed, guarded |
| Read audit logs | No | No | `audit.read` | Allowed |
| Approve refund (P1) | No | No | `refunds.approve` and separation-of-duties gates | Allowed with same financial controls |
| Global production/secret settings | No | No | No by default | Explicit protected capability and step-up |

Permission names are contract candidates to reconcile with `roles`, `permissions`, `role_permissions`, `user_roles` in DB baseline. Endpoint-to-permission map must exist as executable policy metadata in NestJS **after** approval and be tested for every handler. Never implement `if(role === 'admin') allowAll` or rely on frontend menu hiding. Test horizontal ownership and vertical privilege escalation separately.

## 10. Idempotency, concurrency, and inventory — P0 (PAY-01/INV-01 gated)

### 10.1 Idempotency protocol

Mandatory for: `POST /checkout/orders`, sandbox payment-attempt creation, inventory adjustment, payment effect, and P1 refund execution. Client key: random opaque UUID/ULID or high-entropy string, max 128 chars (candidate). Persist composite scope **actor/operation/key** plus normalized request hash, processing state, linked object and stable outcome. Same scope/key + same canonical request -> return stored outcome (including stable resource identifiers) with replay metadata; same key + different payload -> `409 IDEMPOTENCY_KEY_REUSED`. A concurrent in-flight identical request -> bounded wait or `409 REQUEST_IN_PROGRESS` plus safe retry instruction. Do not promise exactly-once network delivery; ensure **at-most-once committed business effect**. Key TTL/retention and response replay masking are **PAY-01**. Authenticate **before** idempotency lookup to prevent cross-tenant key leaks.

### 10.2 Inventory hold transitions

`ACTIVE -> CONSUMED | RELEASED | EXPIRED` are exclusive terminal transitions. Reserve only within DB transaction with conditional availability update and stable row-lock order. For a reservation to count as available at checkout, evaluate `expiresAt` inside the transaction against DB current time; background expiry is a cleanup mechanism, **not** the safety gate. Payment success competes with hold expiry on locked state; only one wins. **INV-01** must define whether a late verified success leads to fulfillment exception, payment reversal/refund workflow or an alternative protected flow; do **not** create stock from thin air or silently fulfill. `15 minutes` is a **candidate**, not an approved TTL.

### 10.3 Payment and order transition candidates

| Aggregate | Allowed flow candidate | Prohibited shortcuts |
|---|---|---|
| Order | `PENDING_PAYMENT -> PAID -> PROCESSING -> SHIPPED -> DELIVERED`; `PENDING_PAYMENT -> PAYMENT_FAILED/EXPIRED`; exception review on out-of-order events | Customer/admin cannot patch `PAID` directly |
| Payment intent | `PENDING -> PROCESSING -> SUCCEEDED | FAILED | CANCELLED`; explicit `UNKNOWN/REQUIRES_RECONCILIATION` operational state where applicable | Timeouts are NOT automatically `FAILED` |
| Payment attempt | `CREATED -> SUBMITTED -> SUCCEEDED | FAILED | UNKNOWN` | Duplicate callback must not create duplicate transaction |
| Reservation | `ACTIVE -> CONSUMED | RELEASED | EXPIRED` | Terminal state cannot be consumed twice |

*Final enum spelling, cross-state transition matrix, retries, payment capture-vs-authorization semantics and late events require **PAY-01/INV-01** approval plus updates to database schema.* Payment attempts and provider evidence are append/history-preserving; a changed catalog price after order creation cannot change order charged total.

### 10.4 Atomic lifecycle and outbox

1. API validates identity and quote snapshot and acquires idempotency claim.
2. DB transaction locks quote, SKU stock rows, and commits order + hold + ledger + intent + outbox atomically.
3. Sandbox adapter runs with stable correlation ID and returns success/failure/unknown; verified result recorded in one DB transaction with idempotent effects.
4. On verified success, `PAID` order and reservation consumption occur in same commit; generate fulfillment notification outbox record.
5. On authoritative failure, release hold once; unknown remains pending reconciliation.
6. Expiry worker locks reservation and payment/order evidence; expire/release only when state permits; record ledger and outbox.
7. On queue outage, cron/reconciliation process resumes from DB outbox; never rely on exactly-once BullMQ execution.

No external HTTP call inside an open stock DB transaction. Deadlocks retry with bounded random jitter, same idempotency identity, and metrics; after budget exhaustion surface retryable `503` or conflict while preserving recoverable DB state.

## 11. Payment adapter, signed webhook receipt, and reconciliation

**P0 sandbox only:** payment adapter interface permits `createAttempt`, `getStatus`, `verifyWebhook`, `normalizeEvent`, optionally `refund` in P1; concrete provider selection is **PAY-LIVE** and must verify Egypt support. Do not store PAN/CVV/card tokens beyond legally and contractually safe opaque provider references. Payment UX never asserts success from redirect query parameters or frontend callback alone.

**Webhook processing candidate:**

1. `POST /webhooks/payments/{provider}` accepts provider-specific raw bytes within strict max-body size; bypasses browser CSRF but **requires independent provider HMAC/asymmetric verification** over precisely documented raw payload, timestamp freshness/replay tolerance and credential rotation (**PAY-LIVE** gate). Sandbox provider uses documented local signed-test fixture.
2. Reject invalid signature before parsing as trusted business input (`401 WEBHOOK_SIGNATURE_INVALID`); validate timestamp, supported event type, provider account and environment.
3. Store verified original event digest, sanitized metadata, provider event ID and receipt time under unique `(provider, externalEventId)`; duplicates are acknowledged without repeated effect.
4. Return `2xx` promptly **after durable inbox commit**, enqueue for processing through outbox; never acknowledge success if durable receipt failed.
5. Worker resolves internal intent by provider reference and verifies actual provider state when needed; transactionally updates payment attempt/intent, financial transaction, reservation/order and outbox exactly once.
6. Out-of-order/unknown/unmatched events go to reconciliation/exception queue and are auditable; do not discard or grant paid status.

**P0 route:** `POST /webhooks/payments/sandbox` (restricted to non-production/test signed events); real `/webhooks/payments/{provider}` is **P1 + PAY-LIVE**. An internal simulation/testing endpoint is never exposed in production. No unauthenticated generalized `POST /payments/mark-success` endpoint.

**Receipt examples:** `200 {"data":{"accepted":true,"duplicate":false}}`, repeated valid event `200 {"data":{"accepted":true,"duplicate":true}}`, unverified `401`, DB unavailable `503` so provider retries. Whether provider requires fixed `200`/`204` body is adapter-specific and documented at integration time.

## 12. Errors, HTTP status, validation and rate limits

```json
{
  "error": {
    "code":"STOCK_UNAVAILABLE",
    "message":"One or more items are no longer available at the requested quantity.",
    "details":[{"field":"items[0].quantity","code":"INSUFFICIENT_STOCK"}],
    "retryable":false
  },
  "meta":{"requestId":"req_error_example"}
}
```

| HTTP | Stable error codes (examples) | Rule |
|---|---|---|
| `400` | `INVALID_CURSOR`, `MALFORMED_JSON`, `WEBHOOK_PAYLOAD_INVALID` | Syntax/format failure |
| `401` | `AUTH_REQUIRED`, `SESSION_EXPIRED`, `INVALID_CREDENTIALS`, `WEBHOOK_SIGNATURE_INVALID` | No valid identity/trust evidence |
| `403` | `PERMISSION_DENIED`, `CSRF_FAILED`, `EMAIL_VERIFICATION_REQUIRED` | Authenticated but forbidden or CSRF invalid |
| `404` | `RESOURCE_NOT_FOUND` | Missing resource or resource owned by another user |
| `409` | `STOCK_UNAVAILABLE`, `QUOTE_STALE`, `PRICE_CHANGED`, `CART_VERSION_CONFLICT`, `INVALID_STATE_TRANSITION`, `IDEMPOTENCY_KEY_REUSED`, `REQUEST_IN_PROGRESS`, `SUPERADMIN_GUARD` | Business conflict, often re-fetch/review |
| `412` | `VERSION_MISMATCH` | Stale `If-Match` |
| `415` | `UNSUPPORTED_MEDIA_TYPE` | Unsupported body content-type |
| `422` | `VALIDATION_FAILED`, `UNSUPPORTED_SHIPPING_ZONE`, `INVALID_QUANTITY` | DTO parsed but invalid business input |
| `429` | `RATE_LIMITED` | Rate-limited with bounded retry info |
| `500` | `INTERNAL_ERROR` | Redacted, no SQL/provider secrets |
| `502` | `PAYMENT_PROVIDER_ERROR` | Provider unavailable/invalid response; financial state remains unknown if applicable |
| `503` | `SERVICE_UNAVAILABLE`, `PAYMENT_STATUS_UNKNOWN` | Retry/reconcile, never assert payment failure |

Use stable machine `code`, safe actionable customer message, request correlation, **no stack traces, raw SQL, provider credentials, password/session/token values**. Input size caps, nested JSON limits, image processing quotas, query complexity/cursor caps are essential. Rate policy classes: high protection auth/password/recovery, elevated protection checkout/payment, ordinary API/customer, higher-cost admin export/search. Final numeric thresholds are **SEC-01/OPS-01** and load-tested; user, IP, session and device identifiers are not treated as infallible proof of identity.

## 13. Pagination, filtering, sorting, and search conventions

All collections require bounded pagination. Default `pageSize=20`, max `100` candidate; `cursor` opaque and filter/sort-context-bound. Return `{nextCursor,hasMore,pageSize}`; no expensive exact total count by default. Searches normalize Unicode/trim with specified max length, parameterized queries, indexed search vectors/trigrams only after DB performance review. Escape user-provided wildcard syntax, enforce query cost budgets, reject unknown fields and unsupported sorts. Admin uses resource-specific filters (active page only), preserves UI query state in URL; no dashboard startup fan-out to every endpoint. Sensitive lists return field-minimized projections. P1 export tasks require async authorization, limited signed download lifespan and audit trail.

**Example:** `GET /api/v1/admin/orders?status=PAID&pageSize=25&sort=newest` returns only a 25-item page and next cursor. Changing to inventory aborts stale orders fetch, and inventory route requests inventory data—not every admin module. After mutation, invalidate only relevant Query keys.

## 14. Observability, audit and sensitive-data handling

Every request captures `requestId`, route template, authenticated actor ID when safely available, status, latency, deployment version and sanitized resource ID; distributed trace IDs correlate API -> PostgreSQL -> outbox -> worker -> provider. Metrics: p50/p95 latency by family, query count/slow queries, 4xx/5xx, queue lag, reservation expiry backlog, idempotency collisions, webhook signature failures/duplicates, checkout conversion, payment unknown aging, reconciliation exceptions, privileged permission denials. Never log raw Authorization/Cookie, password, reset tokens, complete addresses, full payment payloads or sensitive body fields. Audit records: actor, action, target, timestamp, reason, before/after *sanitized diff*, request ID, IP with retention privacy review, outcome. Admin audit filters have their own permission and pagination; logs append-only with dedicated DB protections and controlled retention (**LEG-01/OPS-01**).

## 15. P1 API expansion — **not** part of P0 implementation

| Method | Endpoint | Permission and essential conditions |
|---|---|---|
| POST | `/orders/{orderId}/cancellation-requests` | Customer owner, eligible order state; cancellation financial compensations defined first |
| POST | `/returns` | Customer owner; eligible delivered line/quantity and window; policy **FIN-02** |
| GET | `/returns` | Customer own requests only |
| GET | `/admin/returns` | `returns.read` |
| POST | `/admin/returns/{returnId}/decisions` | `returns.manage`; audited reason/eligibility |
| POST | `/admin/refunds/{refundRequestId}/approve` | `refunds.approve`, separation of duties, eligible captured balance |
| POST | `/admin/refunds/{refundRequestId}/execute` | `refunds.execute`, `Idempotency-Key`, external provider compensation, not direct DB-only mark |
| GET | `/admin/refunds` | `refunds.read`, sensitive monetary projection |
| GET/POST | `/wishlist/items` | Customer own list; duplicate prevention |
| DELETE | `/wishlist/items/{itemId}` | Customer owner |
| GET/POST | `/catalog/products/{productId}/reviews` | Public moderated read / verified-purchase write |
| GET/POST/PATCH | `/admin/coupons[/{id}]` | `marketing.manage`, budget and redemption constraints |
| GET | `/admin/analytics/sales` | `analytics.read`, bounded date range, aggregate projection |
| GET | `/me/notifications` | Customer own notifications |
| POST | `/me/sessions/{sessionId}/revoke` | Customer own session, secure reauth gates |
| POST | `/webhooks/payments/{approvedProvider}` | Provider signed events only; PAY-LIVE review |

**Refund invariant:** aggregate successful + pending/committed refund amounts cannot exceed eligible captured amount after prior refunds; enforce under locked payment rows and a unique provider effect reference. Partial refunds allocate discounts/tax/shipping according to **FIN-02**, not by arbitrary admin input. Return acceptance does not automatically restock; physical receipt/inspection must authorize a distinct ledger movement. No refunds in P0 sandbox MVP user journeys.

## 16. P2 candidate APIs — research only

Possible future namespaces include `/recommendations`, `/loyalty`, `/warehouses`, `/merchants`, `/marketplace/settlements`, `/international-pricing`, and `/reporting/exports`. Do not reserve concrete P2 models or expose placeholder routes in P0. Multi-vendor custody, wallet, foreign currency, and regional tax legalities require fresh domain architecture rather than adding endpoints casually.

## 17. Threat model by endpoint family

| Attack/failure | Boundary | Control and evidence |
|---|---|---|
| Credential stuffing, enumeration | `/auth` | Argon2id, generic messaging, rate limits, detection, safe reset lifecycle |
| Session fixation, cross-site action | Cookie endpoints | Rotate session, Secure/HttpOnly/SameSite + CSRF + origin check; SEC-01 PoC |
| IDOR | `/orders/{id}`, addresses, returns | Owner-aware DB predicates; `404` nonowner |
| Unauthorized admin action | `/admin` | Permission+scope guard and service policy, step-up for protected actions |
| Mass assignment | All PATCH/POST | Strict Zod DTO, domain commands; reject unknown fields |
| Price/payment tampering | Checkout | Server quote, snapshot version, verified adapter events, no browser-paid status |
| Overselling and double release | Stock/checkout/workers | Conditional update/locking, unique reservations, movement ledger, concurrency tests |
| Webhook forgery/replay | `/webhooks` | Raw-body signature verify, clock tolerance, deduplicated durable inbox |
| Out-of-order gateway events | Payment worker | State-machine guard + reconciliation exceptions |
| Privilege escalation via role grant | Staff/roles | Grant subset checks, last Super Admin guard, audit and step-up |
| Search/DoS/data scraping | Public/admin queries | Indexes, cursor caps, rate policies, resource budgets |
| PII exposure | Analytics/audit/logs | Minimum-field DTO, role gates, log redaction, retention |
| Duplicate refund / overrefund | P1 refund actions | Captured-balance lock, idempotency, provider-effect uniqueness |
| Backup or environment mixup | Production | Separation of sandbox vs live, secret rotation, test restore; OPS-01 |

## 18. Contract test matrix and acceptance criteria

| ID | Priority | Test / measurable expected result |
|---|---|---|
| API-001 | P0 | OpenAPI generated from validated DTOs; all handlers documented; no contract drift |
| API-002 | P0 | Guest catalog list excludes draft/archived items, stable 20/100 cursor and deterministic sorting |
| API-003 | P0 | Price/tax/stock fields forged in cart/checkout body rejected or ignored, never used for calculation |
| API-004 | P0 | Customer A requests B's order/address -> `404`, no PII in logs |
| API-005 | P0 | Customer/admin missing granular permission cannot perform protected admin mutation |
| API-006 | P0 | Role assignment cannot grant beyond actor authority, self-elevate, or remove final active Super Admin |
| API-007 | P0 | Login rotates session, logout revokes, expired/revoked token fails promptly |
| API-008 | P0 | CSRF fails on unsafe authenticated action; legitimate approved origin succeeds **SEC-01** |
| API-009 | P0 | Invalid/expired/reused verification/reset challenges rejected, enumeration-safe request |
| API-010 | P0 | Quotes recompute current prices and fail stale cart/quote with actionable `409` |
| API-011 | P0 GATED | Signed FIN-01 decimal fixtures including inclusive/exclusive tax, shipping, allocation, large values reconcile |
| API-012 | P0 | 20 simultaneous checkouts for final single unit -> at most one successful reservation/order committed |
| API-013 | P0 | Two keys racing to accept one quote -> at most one order associated with quote |
| API-014 | P0 | Same key same body -> same order/effect response; same key changed body -> `409` |
| API-015 | P0 | Lost response/retry/worker crash -> no duplicate paid ledger or stock consumption |
| API-016 | P0 | Hold consume/expiry/release races preserve `onHand >= reserved >= 0`, one terminal transition |
| API-017 | P0 GATED | Late sandbox success/unknown leaves explicit reconcilable state per INV-01/PAY-01 |
| API-018 | P0 | Forged webhook rejected without event/effect; duplicate valid event yields one effect |
| API-019 | P0 | Verified out-of-order events do not regress payment/order state |
| API-020 | P0 | API can recover durable inbox/outbox after queue outage; retry without duplicate effects |
| API-021 | P0 | Admin inventory adjustment atomically records ledger/audit and rejects unsafe negative available |
| API-022 | P0 | Fulfillment state guard rejects shipment of unpaid order; timeline persists |
| API-023 | P0 | Last-known old order prices/addresses unchanged after live catalog/profile edits |
| API-024 | P0 | Dashboard only queries overview on initial load; switching route fetches only relevant module |
| API-025 | P0 | Error DTOs stable; `500`/`502`/validation responses don't leak stack, SQL, tokens, secrets |
| API-026 | P0 | Pagination clamps or rejects oversized/invalid page/filter; search cost remains bounded |
| API-027 | P0 | Audited privileged action records actor/target/request ID, redacted diff and transaction outcome |
| API-028 | P0 | Sandbox simulation endpoints inaccessible on production config, real processor never selected by mistake |
| API-029 | P1 | Partial refunds concurrent requests never exceed eligible captured amount; duplicate provider event no overrefund |
| API-030 | P1 | Return workflow rejects non-owner/non-eligible quantities; restock requires inspection decision |
| API-031 | P1 | Coupon concurrent redemption respects max uses and total price reconciles |
| API-032 | P1 | Review submission enforces verified purchase/moderation and dedupe |
| API-033 | P0 | Pact/schema-like consumer tests validate admin/storefront API client against OpenAPI on CI |
| API-034 | P0 | Accessibility/UX error mapping supports retry, stale price, payment pending/unknown explicitly |

**Test layers:** Zod schema/property tests (Vitest/Jest), NestJS unit tests for policies/state machines, Supertest e2e with isolated Postgres, DB real-concurrency/rollback tests (not mocked), adapter webhook signature fixtures, queue crash/retry simulations, Playwright storefront/admin journeys, load/latency tests for catalog and pagination, OpenAPI contract-diff checks. No test is claimed executed.

## 19. Endpoint ownership & traceability matrix

| PRD family | P0 API families | Architectural/data invariants |
|---|---|---|
| `CH-AUTH-*` | `/auth`, `/me` | sessions, token digests, SEC-01 |
| `CH-CAT-*` | `/catalog`, `/admin/products`, categories/brands/media | public visibility and SKU integrity |
| `CH-CART-*`, `CH-CHECK-*` | `/cart`, `/checkout` | server quote snapshots, FIN-01, idempotency |
| `CH-ORD-*` | `/orders`, `/admin/orders` | state guards and history |
| `CH-PAY-*` | payment status/attempts, `/admin/payments`, `/webhooks` | event inbox, capture ledger, PAY-01 |
| `CH-INV-*` | `/admin/inventory`, internal hold coordinator | locks, movements, INV-01 |
| Admin/RBAC/audit requirements | `/admin/staff`, `/admin/roles`, `/admin/audit-logs` | granular grants and transaction audits, SEC-01 |
| P1 marketing/review/returns | §15 | deferred migrations and FIN-02, PAY-LIVE |

**Cross-doc consistency requirement:** Before implementation tasks, map every P0 PRD requirement ID to at least one handler, schema and test; reconcile enum names between this document and `05-database-design.md`, and map every protected handler to one permission. Any discrepancy becomes a documented change request, not silent drift.

## 20. Open decisions and preserved approval gates

| ID | Current status | Decision required / gate owner | Consequence |
|---|---|---|---|
| **FIN-01** | **GATED** | Finance/Product/Backend approve exact EGP scale/rounding, tax inclusion, taxable shipping, shipping zone fees, signed calculation fixtures | Block authoritative quote totals/charge implementation |
| **INV-01** | **GATED** | Product/Backend approve reservation timeout and late success/expiry policy (15 minutes only candidate) | Block final hold expiry/payment race implementation |
| **SEC-01** | **GATED** | Security/Frontend/Backend prove cookie domain/BFF/CSRF across deployments, session validity/step-up and RBAC governance | Block shipping production auth/admin security code |
| **PAY-01** | **GATED** | Backend/Finance approve idempotency scope/retention, capture lifecycle, unknown status handling and replay policy | Block final payment orchestration implementations |
| **FIN-02** | **DEFER P1** | Finance/Product approve refund policies, partial allocations, approval separation and stock disposition | No MVP refund endpoints |
| **OPS-01** | **GATED** | DevOps/Security approve Supabase roles/pooling/TLS, worker hosting, rate limits, storage, restore and RTO/RPO | Block deployment sign-off |
| **LEG-01** | **GATED before actual customers** | Legal/Product approve Egypt tax/privacy/retention/invoice/consumer rights | Block real-customer launch |
| **PAY-LIVE** | **DEFER P1** | Product/Finance/Security verify supported Egyptian gateway and signed-event contracts | No real-money integration in P0 |
| **DB-01** | **Baseline approved as design; implementation specifics pending** | Backend/Data ensure final enums/constraints/migrations match API states | No migration execution yet |
| **API-01** | **This document pending approval** | Product/Backend/Frontend/Security sign endpoint/auth/error/contract mapping | Freeze wire baseline before coding |

**Gate distinction:** Approval of this API **design document** authorizes a baseline for planning only, not implementation of unresolved payment, financial or security details. Technical conventions (e.g. `pageSize=20`, error codes, sample amounts) are proposed and may change through reviewed ADR/schema update.

## 21. Risks, mitigation and rollback strategy

| Risk | Severity | Mitigation |
|---|---|---|
| Bad tax/rounding charges wrong money | Critical | FIN-01 signed fixtures + invariant ledger tests; no invented Egypt tax rule |
| Cookie domain and CSRF break cross-origin auth | Critical | SEC-01 browser PoC, strict CORS/cookie matrix before implementation |
| Stock race oversells last SKU | Critical | DB-locked transactional reserve, 20+ parallel concurrency test |
| Payment timeout misclassified failed | Critical | UNKNOWN + reconciliation + provider lookup, never automatic duplicate charge |
| Forged/replayed signed webhook | Critical | raw bytes verification, timestamp, unique event and effect keys |
| Privilege grants enable admin escalation | High | least privilege, scope assignment, protected superadmin operations, audit |
| Large list/analytics queries degrade API | Medium/High | cursor pagination, indexes, route-based fetching, budgets and instrumentation |
| Missing API schema alignment blocks UI | High | contract-first package, CI OpenAPI diff and consumer fixtures |
| Payment simulation accidentally production-accessible | High | environment assertion and route exclusion, deploy smoke tests |
| Security/audit logs expose PII | High | redacted schemas, retention review, restricted read permission |

Rolling back incompatible API/data changes requires expand-migrate-contract rollout: add backward-compatible fields, dual support or version bump, update clients, measure, then remove after window. Never downgrade a successful payment or delete financial events as a rollback. Feature flags on business transitions require clear state-machine semantics and audit.

## 22. Release-by-release acceptance and sign-off

### P0 (MVP) contract scope

Registration/login/verification, own profile/addresses, catalog/public search, authenticated cart, quote/order creation, sandbox payment lifecycle and status, own orders, admin overview/catalog/stock/orders/staff/permissions/audit, backend authorization and operational health. **P0 is not claimed deployable** until FIN-01, INV-01, SEC-01, PAY-01, OPS-01 and relevant LEG-01 gates close. Public marketing/reviews/refunds are not slipped in by dependency creep.

### P1 (V1) contract scope

Refunds/returns/cancellations, coupons, reviews, wishlists, richer analytics, customer operations, notifications and verified Egypt payment provider. Complete FIN-02 and PAY-LIVE gates first; detailed P1 DTOs are to be refined through a reviewed extension before implementation.

### P2 (future) scope

Marketplace/multi-merchant, multi-warehouse, loyalty/recommendations, multi-currency and international tax/shipping are **not designed or committed** in MVP.

### API design approval checklist

- [ ] Product confirms P0/P1/P2 business boundaries match the PRD.
- [ ] Frontend confirms page-by-page DTO completeness, loading/error handling and route-aware request budgets.
- [ ] Backend confirms module ownership, exact state transition integration, DB transaction and outbox semantics.
- [ ] Data confirms every route maps to approved schema/constraints/keys and enum spellings are reconciled.
- [ ] Security confirms permission coverage and accepts SEC-01 as implementation blocker pending proven origin/session design.
- [ ] Finance acknowledges FIN-01/PAY-01 blockers and P1 FIN-02 deferral.
- [ ] Operations acknowledges OPS-01 + recovery/infrastructure approvals are not yet completed.
- [ ] API consumers agree on error envelope, money as strings, cursor pagination, idempotency and versioned path.
- [ ] Test owners approve API-001–API-034 and required CI/OpenAPI validation.
- [ ] No implementation, migrations, live provider connections or tests are reported as performed.

**Current recommendation:** Review and approve `06-api-design.md` as the next **design baseline**, retain all gates and then develop `07-implementation-plan.md` with tasks, dependencies, acceptance tests, approval checkpoints and Codex prompts. Do **not** start coding until required gates for each task are closed.

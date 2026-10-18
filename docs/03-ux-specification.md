# CommerceHub — UX/UI Specification

**Document ID:** CH-BMAD-03  
**Filename:** `03-ux-specification.md`  
**Version:** 1.0 — UX design baseline candidate  
**Date:** 2026-10-18  
**Status:** Approved as UX baseline on 2026-10-18; architecture/financial/security gates remain open; no implementation authorized  
**Inputs:** `01-project-brief.md` v1.0 (approved); `02-prd.md` v1.0 (approved 2026-10-18, subject to architecture/financial policy gates)  
**Product:** CommerceHub — multi-category, single-merchant physical-goods e-commerce, Egypt-first, EGP  
**Implementation direction:** Next.js App Router, React, TypeScript, Tailwind, shadcn/ui, Radix, TanStack Query, Zustand, React Hook Form, Zod, Recharts, Motion

> **Boundary:** This document specifies presentation, interaction, information architecture, responsive behavior, accessibility, and client data ownership. The backend remains authoritative for identity, prices, stock, shipping eligibility, totals, order/payment status, permissions, and audit trails. Routes and visual tokens are UX proposals until approved. Financial/tax/checkout mechanics remain gated by architecture and financial reviews; UX must render the approved server quote, not implement independent money logic.

---

## 1. Decision and change log

| Item | Decision | State |
|---|---|---|
| Store model | Single merchant; electronics, fashion, home/living, accessories; extensible category taxonomy | Approved from brief |
| Releases | P0 MVP = reliable sandbox commerce and minimal administration; P1 = refunds/returns, marketing, advanced reports; P2 = expansion | PRD approved |
| Market | Egypt-first; EGP shown consistently; English initial UI with future localization readiness | English initial UI **proposed** |
| Checkout | Account and verified email required for P0; guest browsing permitted | Accepted as proposed P0 policy, pending review gates where applicable |
| Staff | Least-privilege, backend-controlled granular authorization | Approved principle |
| Brand direction | Premium, restrained and trustworthy, not a clone of Amazon | Proposed, requires visual approval |
| Measurement | WCAG 2.2 AA target; 360/768/1440 viewport tests; no unwanted horizontal overflow | PRD target |
| Source authority | `02-prd.md` requirement IDs take precedence over UX examples | Mandatory |

**Change process:** Changes after UX approval require a decision-log row, impacted CH requirement IDs, revised interaction/visual tests, and impact assessment for architecture/API/schema. No implementation, testing or live UI is claimed by this specification.

## 2. Product experience strategy

### 2.1 Experience promise

- **Shopper:** Find a relevant product quickly, understand real configuration/availability and cost, pay in sandbox with predictable results, and reliably track the order.
- **Staff:** See only authorized work, act quickly and safely on complex operations, and understand the consequences of each action.
- **Super Admin:** Control staff permissions safely, with confirmation, auditability and clear guardrails.

### 2.2 Principles and non-goals

1. **Clarity over density** on consumer surfaces, **scanability over decoration** in the admin.
2. **Progressive disclosure:** one primary action per decision; advanced and destructive actions move into details/menus.
3. **State is explicit:** distinguish available vs out of stock, draft vs published, pending vs paid, sandbox vs real, permission denied vs unavailable.
4. **No fake certainty:** pending payments and reconciliation remain pending; confirmation must not announce success without confirmed API status.
5. **Consistency:** shared typography, spacing, status vocabulary and interaction primitives; distinct storefront/admin densities.
6. **Access is not authority:** permission-based navigation is a usability aid; the API independently enforces rights.
7. **Mobile-first and keyboard-operable:** no hover-only action, no critical content clipped or inaccessible.
8. **Don't fetch hidden modules:** route-level request ownership with measured refetch and invalidation.

**Not UX goals:** P0 guest checkout, live provider cards, coupons, refunds, complex analytics, carrier integration or fully featured customer-service CRM. Do not fabricate interactions for deferred features.

## 3. Audience, primary tasks and information architecture

| Actor | Primary task | Highest-priority information | UX concern |
|---|---|---|---|
| Guest | Browse and compare | Category, price, variants, stock and shipping context | Discoverability; account gate shown at checkout |
| Customer | Complete order and track | True quote, address, payment result, order status | Trust, recovery, privacy |
| Catalog admin | Manage merchandise | Product state, variants, SKU, media and category | Efficient editing; safe publish |
| Inventory admin | Adjust and inspect stock | ATS, on-hand, reserved, movement reason | Prevent accidental adjustments |
| Fulfillment admin | Process orders | Payment clearance, fulfillment status, address snapshot | Guarded transitions |
| Super Admin | Govern staff | Permission grants, active status, audit events | Prevent lockout/escalation |

### 3.1 Storefront navigation model

**Global shell:** announcement/utility strip (optional P1 campaign), skip link, logo, desktop search, categories link/menu, account, cart count, mobile search and navigation drawer; responsive footer with support/policies. Persistent nav must not consume excessive vertical space or hide content. Search offers keyboard-operable input; P0 does not depend on remote autocomplete.

- **Global routes:** Home `/`, Catalog `/products`, Category `/categories/[slug]`, Product `/products/[slug]`, Search as `/products?q=...`, Sign in `/login`, Sign up `/register`, Verify `/verify-email`, Forgot `/forgot-password`, Reset `/reset-password`.
- **Commerce routes:** Cart `/cart`, Checkout `/checkout`, Checkout result `/checkout/result` (state resolved by backend), Orders `/account/orders`, Order detail `/account/orders/[orderId]`.
- **Account routes:** Account `/account`, Addresses `/account/addresses`; profile settings in account overview for P0.
- **P1:** Wishlist `/account/wishlist`; reviews within product/order interfaces; `/account/returns` and `/account/returns/[id]`; order cancellation and refund status in owned order details.
- **P2:** AI-personalized surfaces, multi-language/currency switchers, loyalty.

Canonical paths are proposals; architecture and SEO review may change them, with redirects to prevent broken URLs. Product identifiers in URLs are not access grants.

### 3.2 Admin navigation model

**Shell:** collapsible left navigation (desktop), compact top bar (page title/breadcrumb, search only when scoped, account/actions), full-height content without duplicate scrolling; mobile sheet navigation with breadcrumb and clear module context. Route groups by business function, not arbitrary visual balance. Permission-aware navigation hides forbidden entries but deep links independently handle 403.

**Proposed menu order:** Overview; Catalog (Products, Categories, Brands); Inventory; Orders; [P1 Customers, Payments, Refunds, Marketing, Analytics]; Administration (Staff, Audit); Settings. Group headings are non-clickable, low-contrast. On small screens use a single overlay nav, not a shrinking icon rail that obscures text.

## 4. Route inventory and page-specific UX contracts

**Legend:** P0 = MVP; P1 = V1; P2 = Future. `Q:` indicates *route-owned* data; mutation calls are triggered only by explicit actions. All authenticated calls include applicable cookie/CSRF handling resolved by architecture. The UI must never directly access PostgreSQL or Supabase tables.

### 4.1 Storefront — P0

| Route / screen | Key components and action | Initial queries/data ownership | Empty/error/exception |
|---|---|---|---|
| `/` Home | Hero (not oversized), 4 featured categories, curated products, quick browse; no autoplay | `Q: home curated catalog` only, with appropriate caching | No featured products → categories; failure → retry catalog teaser |
| `/products` Catalog/search | Keyword, category filters, brand, price, in-stock, sort, pagination; desktop sidebar/mobile filter drawer | `Q: paged catalog + required filter metadata`, both keyed by URL parameters | Zero matches → clear active filters; invalid params normalized; errors scoped |
| `/categories/[slug]` | Category heading/intro, same catalog controls | `Q: category + category page catalog` | Unpublished/missing → 404 or safe empty catalog |
| `/products/[slug]` | Gallery, title, brand, validated variant selectors, price, availability, quantity stepper, add to cart, key specs | `Q: one published product, variant availability and images` | Deleted/unpublished → 404; out-of-stock disables add; media fallback |
| `/cart` | Line items, selected variants, editable qty, subtotal summary, checkout CTA | Guest: local cart; signed-in: `Q: cart` and quote/reconciliation only as needed | Empty illustration and browse CTA; price/stock change banner; item removal undo if feasible |
| `/login` | Email/password, show password, recovery link | No initial protected data query | Generic invalid credentials; loading/single submit |
| `/register` | Name/email/password, requirements, legal links | No initial queries | Conflict handled without leaking account metadata; validation inline |
| `/verify-email` | Verification status, resend, expiry recovery | Token verification request once per token/action | Expired/used/invalid token → safe re-request; rate-limit copy |
| `/forgot-password`, `/reset-password` | Non-enumerating request and token reset forms | Mutation only or token validation if API supports | Success language does not confirm email exists |
| `/account` | Profile view/edit, verification status, order link | `Q: current profile` | Signed-out → login with safe return URL |
| `/account/addresses` | Address list, add/edit sheet, default selection | `Q: addresses + permitted delivery regions where relevant` | Empty → add first address; invalid region/phone errors |
| `/checkout` | Steps: address → review → sandbox pay; sticky cost summary desktop, compact mobile summary | `Q: cart, eligible addresses, authoritative checkout quote/availability` for active checkout | Expired hold/reprice triggers review; invalid region; unavailable stock; login/email gate |
| `/checkout/result` | Outcome checker: paid, pending, failed, expired; view order, retry only if allowed | `Q: one own checkout/order status by opaque reference` | Unknown outcome = pending/recheck, not paid; refresh-safe |
| `/account/orders` | Order cards/table, date/status chips, view detail | `Q: own paginated order list` | Empty → explore catalog; failures retry list |
| `/account/orders/[orderId]` | Item and amount snapshot, payment and fulfillment timeline, address snapshot, tracking reference | `Q: single own order` | Other user's ID → no disclosure; pending/failed states explained |

**P0 account gating:** Guest can browse and maintain a client cart; entering checkout prompts sign-in/sign-up then returns to checkout. Guest-to-account cart merge uses server reconciliation and exposes each adjusted item before final review. Email-unverified customers can manage account but cannot place orders (per PRD proposal). Cart badges must reconcile with authoritative server state after login.

### 4.2 Storefront — P1 additions

| Feature/screen | Interaction | Fetch scope | Critical edge |
|---|---|---|---|
| Wishlist `/account/wishlist` | Add/remove and navigate back to product | `Q: own wishlist` on wishlist route; product toggle state where needed | Archived/out-of-stock products are clearly marked |
| Reviews (product + write flow) | Rating summary, verified-purchase eligibility, moderation indicators | `Q: reviews` on product review section with pagination | Double submit, moderation status, own review edits |
| Coupons at cart/checkout | Apply/remove code; explain eligibility | Requote on explicit change | Expiry, limit, concurrent redemption; backend truth |
| Returns/refunds | Request eligible item quantities/reasons; view process | `Q: own return/refund details` | Partial refunds, eligibility window, no double refund |
| Customer cancellation | Conditional action on eligible order; reason/confirmation | Mutation of single owned order | Cancellation no longer eligible, race with shipment |
| Enhanced tracking and notifications | Timeline and preferences | Route-scoped notifications | Notification failure does not alter order truth |

### 4.3 Admin — P0 screens

| Route / screen | Key interactions | Permission UI hint | Route-owned data (NOT all modules) |
|---|---|---|---|
| `/admin` Overview | Four compact KPIs, pending orders summary, low-stock summary, scoped date range, sandbox badge | `overview.read` | `Q: minimal overview aggregation` only; no large customer/payment/product datasets |
| `/admin/products` | Search/sort/filter/status, paged rows, create action, per-row overflow menu | `catalog.read`; create needs `catalog.write` | `Q: paged products + compact filters` |
| `/admin/products/new` | Product editor: identity, category, brand, description, media, variant section, publication | `catalog.write` | `Q: reference taxonomy` as needed; no global catalog request |
| `/admin/products/[id]` | Edit, duplicate (if approved), publish/unpublish/archive, variants and media | `catalog.read/write/publish` | `Q: one product + needed reference metadata` |
| `/admin/categories` | Category list/tree, create/edit/archive with association safeguards | `catalog.read/write` | `Q: categories` |
| `/admin/brands` | Brand list and editor | `catalog.read/write` | `Q: paged brands` |
| `/admin/inventory` | SKU table: on hand, reserved, ATS, low-stock; adjust action | `inventory.read/adjust` | `Q: paged stock summary` |
| `/admin/inventory/[sku]` | Movement history, reservations summary, adjust stock drawer with reason | `inventory.read/adjust` | `Q: single SKU and paginated movements` |
| `/admin/orders` | Paged list, status filters, search by allowed identifiers | `orders.read` | `Q: paged orders` |
| `/admin/orders/[id]` | Payment status, customer/address snapshot, items, fulfillment controls, shipment reference | `orders.read/fulfill` | `Q: one order`, mutation only for authorized transitions |
| `/admin/staff` | Staff list, invite, deactivate, permission assignment (minimum P0) | Super Admin / `staff.manage`, `permissions.manage` | `Q: staff page + permission catalog only when assignment opened` |
| `/admin/staff/[id]` | Status, effective permissions, safeguards against removing last Super Admin | Super Admin | `Q: one staff member and effective grants` |
| `/admin/audit` | P0 minimal high-impact audit history, no broad advanced investigation UI | `audit.read` | `Q: bounded recent privileged events` |
| `/admin/settings` | Read-only configuration summary or constrained P0 fields if approved | `settings.read/manage` | `Q: store/shipping/tax summary` ONLY |

**Clarification:** Admin prefix is conceptual; physical dashboard application can use `/` as its root and route paths without `/admin`. Domain isolation (e.g. separate admin subdomain) is a security/architecture decision.

### 4.4 Admin — P1 additions

| Module | Screens and interactions | Permission model | Scope |
|---|---|---|---|
| Customers | Customer search/detail/associated orders, privacy-safe support actions | `customers.read` and action-specific grants | Scoped customer queries; no wholesale customer dump |
| Payments | Attempts, transactions, reconciliation and exceptions | `payments.read/reconcile` | Only active payment route queries, lazy detail |
| Refunds | Queue, detail, request review, partial/full processing, receipts | `refunds.read/approve/execute` separated | Distinct approval/execution gates, safe totals |
| Marketing | Coupon list/editor, eligibility, campaign lifecycle, banners | `marketing.*` granular | Mutations revalidate applicable caches |
| Analytics | Date/channel/category filters, revenue trends, best sellers, export | `analytics.read/export` | Aggregated lazy chart/report queries, no raw per-order data by default |
| Administration | Permissions bundles, searchable audit explorer | `permissions.manage`, `audit.read` | Paginated server-filtered events |
| Settings | Shipping/tax/payment controls and rollout safeguards | `settings.manage` | Explicit confirmation for high-impact edits |

### 4.5 Explicitly deferred P2

Personalized recommendations; advanced search ranking; loyalty/referrals; multi-warehouse console; multi-currency/i18n UI; marketplace seller portal and commissions; native apps. Reserve no disabled placeholder tabs in P0 for unimplemented features.

## 5. Detailed critical user journeys

### J-UX-01: Guest discovers product, signs in and purchases (P0)

1. Guest arrives at Home, browses category or searches, opens product detail.
2. Selects variant and quantity; page displays inventory result, EGP price, and add-to-cart feedback in an accessible status region.
3. Opens Cart; reviews quantities and displayed estimate. Choosing checkout triggers sign-in if needed, with a safe destination return.
4. On login, server reconciles guest cart. Changed quantity, prices or unavailable SKUs appear with explicit remediation; user accepts/reviews.
5. If not email verified, show verification action and block only checkout submission.
6. Checkout requests eligible addresses and authoritative quote; user chooses an eligible address. Summary shows items, shipping, applicable tax breakdown and grand total from API.
7. User explicitly confirms sandbox payment. Button locks against repeat submit; request carries idempotency semantics defined by API.
8. Result resolves to **paid**, **pending**, or **failed**. Only backend-confirmed paid produces success copy; otherwise explain safe retry/recheck.
9. Order detail shows persisted line-item price/address snapshots and separate payment/fulfillment statuses.

**Acceptance:** Keyboard-only end-to-end path; failed/pending payment does not show paid; no client total used as authority; repeated click/refresh cannot duplicate order/payment; out-of-stock and changed price are handled before commitment. Trace: CH cart/checkout/payment/order P0 requirements and PRD J-01/02/04.

### J-UX-02: Product configuration and unavailable inventory (P0)

- SKU selectors have explicit labels (e.g. Size, Color, Capacity), including a default SKU for simple products.
- Illegal combinations are disabled or marked unavailable with a clear explanation, not silently substituted.
- Switching variant updates SKU identity, media if available, quoted display price and stock label; quantity clamps to valid maximum with announcement.
- Concurrent sellout after selection leads to a server-reported conflict with changed stock in the cart/checkout review; user must re-accept.

### J-UX-03: Catalog admin creates and publishes a product (P0)

1. Staff enters Products with `catalog.read` and sees server-paginated rows.
2. New product editor exposes sections: Identity → Classification → Variants/SKUs → Media → Review & Publish.
3. Inline validation catches duplicate form entries; backend catches global SKU conflict.
4. Save as Draft is separate from Publish; publication requires all mandatory fields and valid SKU/media policy.
5. Backend returns canonical product; detail screen shows success and current publication badge; audit event recorded server-side.
6. Archive/unpublish uses consequence dialog if product is referenced by orders, preserving historical order records.

**Acceptance:** Save errors preserve entered values; unauthorized action is neither shown as available nor permitted by direct API requests; no accidental publish.

### J-UX-04: Inventory operator adjusts stock safely (P0)

1. Filter Inventory table and inspect SKU movement history.
2. Open Adjust modal, choose increment/decrement/absolute correction according to approved API rule, enter amount and mandatory reason.
3. Show **estimated** resulting on-hand only as a preview; server returns authoritative new ATS and movement ID.
4. Conflict/stale stock disables blind overwrite and offers reload, never silent acceptance.
5. Critical negative stock prohibition and concurrent reservation behavior are enforced by backend.

### J-UX-05: Fulfillment operator processes a paid order (P0)

1. Open Orders filtered to actionable queue.
2. Detail separates payment and fulfillment status. Buttons appear only for permitted transitions.
3. Add shipment reference if required, confirm action and view new timeline event.
4. Stale state or unpaid order blocks fulfillment and shows safe correction.

### J-UX-06: Super Admin grants limited access (P0)

1. Open Staff, select account; inspect current effective privileges.
2. Select only needed granular permissions and see human-readable implications.
3. Show high-risk grants with explicit confirmation; backend checks grant authority, last-Super-Admin invariant and session revocation policy.
4. After save, refresh staff detail and display effective grants and audit reference.
5. If revoked admin had a current session, subsequent protected API actions fail; UI redirects to permission-aware page without leaking data.

### J-UX-07: Return/refund handling (P1, not MVP)

Customer submits eligible item/quantity/reason; authorized operator reviews request; separate privileged approval and execution, with partial/full breakdown. UI exposes pending/approved/processing/completed/failed states and never claims a refund before confirmed provider/backend result. Prevent double refund and refunds exceeding captured eligible amount.

## 6. Interaction patterns and content model

### 6.1 Global feedback rules

| State | Design pattern | A11y / correctness requirement |
|---|---|---|
| Initial loading | Structural skeleton matching final content, not large spinner | Reserve approximate geometry; not announced excessively |
| Background refetch | Retain useful stale data with subtle refresh status | Avoid flashing; expose stale timestamp if material |
| Empty first use | Concise explanation + relevant primary action | Not mistaken for API failure |
| Empty filtered result | Show active filters and Clear Filters | Preserve stable page and search context |
| Recoverable API error | Inline retry tied to failed module only | Keep unaffected modules usable |
| 401 session expired | Sign-in path with safe return URL | Clear client private cache; no infinite redirect |
| 403 forbidden | Explicit permissions page/inline callout | No leak of protected content; no faux 404 for staff permission denial unless policy |
| 404 resource missing | Helpful back navigation | Customer ownership violations return non-disclosing result |
| 409 stale/stock conflict | Describe changed value and request review | Never retry financial mutation blindly |
| 422 validation | Per-field error near control; summary focus for long forms | Correct field association and screen-reader feedback |
| 429 throttled | Calm retry guidance; backoff | No account enumeration |
| 5xx/network/offline | Safe retry, no duplicate transaction claims | Payment uncertainty = Pending/recheck first |
| Mutation success | Short toast + visible updated state | Toast alone not only confirmation |

Use concise, actionable copy. Examples: “This size is currently unavailable”; “The price changed. Review the updated total before paying”; “Payment is still being confirmed. Do not submit another payment yet.” Never surface stack traces, raw provider responses or sensitive identifiers.

### 6.2 Forms

- Use React Hook Form with shared Zod contracts where feasible, but **API validates independently**.
- Label always visible above field; optional/helper guidance below; errors immediately below relevant input, on blur/submit rather than noisy per-keystroke alerts.
- Compact admin inputs typically 36–40 CSS px high and standard storefront controls 40–44 px, with touch-target accommodations at least 24×24 CSS px WCAG minimum and preferably ~44×44 for touch comfort. Never reduce clickable accessibility to achieve density.
- Single-column on narrow screens; two columns only for related short fields at adequate width. Long descriptions/full address remain full-width.
- Show save/loading/dirty state; avoid losing edits on navigation. Unsaved change confirmation for product editor, settings and staff changes.
- Password fields offer show/hide, caps-lock indication if feasible, password-manager compatibility, and privacy-safe errors.
- Money inputs display EGP and decimal precision; never use floating-point UI arithmetic as settlement authority; server-confirmed quote is source of truth.
- Physical stock adjustments require reason; destructive/staff/financial actions may require secondary confirmation; never use native browser `confirm` as default.

### 6.3 Tables, lists and filtering

- Admin list pages use one prominent heading, one primary action, lightweight filters, paged compact table, unobtrusive row actions. Do not stack multiple enormous cards above the table.
- **P0 common columns:** Products: image/name/SKU variants/category/status/updated/actions; Inventory: SKU/product/on hand/reserved/ATS/alert/actions; Orders: ID/date/customer masked/total/payment/fulfillment/actions; Staff: name/email/status/role or permission summary/actions.
- On desktop: fixed/controlled columns, truncation with accessible full value, text-aligned numeric values and tabular numerals, sortable headers only when server support exists. Row height target ~44–52 px at standard density; actions 32–36 px visually with sufficient hit area.
- At narrower widths: prioritize 3–5 columns, allow explicit horizontally scrollable **table region only**, or convert to stacked item cards; never scroll entire viewport horizontally.
- Server pagination with page size 20 default [PROPOSED], capped at API level; URL-backed filters/sort/search and controlled debounce (~300 ms [PROPOSED]) for non-financial searches. Reset page to 1 when filters change.
- Bulk actions are **not** included unless authorized by PRD; no checkboxes without working business actions.
- Row action dropdown anchored and keyboard navigable; destructive actions separated and confirmed.
- Empty/new dataset shows create action only where permission exists; read-only staff see explanatory no-data state.

### 6.4 Drawers, dialogs, menus and toasts

- **Dialog:** focused, irreversible, high-impact decision or short form; max-width tuned to content, not full-screen desktop.
- **Drawer/sheet:** mobile filter/navigation, quick edit or inspection; full-height only if content needs it, focus trapped and restored after close.
- **Popover/select:** fit viewport, avoid large touch-insensitive options, safe scroll with maximum height.
- Confirmations name entity and consequence, display current authoritative state; disable duplicate submissions while pending, but allow safe cancellation where possible.
- Toasts are transitory supplements; persistent failed-operation states stay on page.
- Motion uses brief purposeful transitions (~120–220 ms proposed), respects `prefers-reduced-motion` and never delays essential actions.

### 6.5 State and status vocabulary

Separate **product state** (draft/published/archived), **stock state** (available/low/out), **payment state** (unpaid/pending/paid/failed/refunded as approved), **fulfillment state** (unfulfilled/processing/shipped/delivered and valid transitions), and **return/refund state** in P1. Status labels always include text; color is secondary. Final codes/transitions are owned by architecture/API. “Revenue” in P0 admin always explicitly labeled **Sandbox**.

## 7. Design system and visual direction

### 7.1 Visual identity

**Recommended identity:** premium neutral commerce, confident dark ink, restrained blue primary accent, warm light backgrounds, minimal shadow, readable data. Avoid oversized gradients, arbitrary glows, heavy glassmorphism, and overloaded KPI cards. Neither app should mimic a specific retailer's protected branding.

### 7.2 Proposed semantic tokens (subject to design approval and contrast verification)

| Token | Light candidate | Dark candidate | Usage |
|---|---|---|---|
| `--background` | `#F8FAFC` | `#0B1220` | App canvas |
| `--surface` | `#FFFFFF` | `#121C2C` | Panels/cards |
| `--surface-muted` | `#F1F5F9` | `#1B293B` | Secondary surface |
| `--foreground` | `#0F172A` | `#F8FAFC` | Primary text |
| `--muted-foreground` | `#475569` | `#CBD5E1` | Secondary text |
| `--primary` | `#1D4ED8` | `#60A5FA` | Primary CTA/selection |
| `--primary-foreground` | `#FFFFFF` | `#06152E` | Contrast on primary |
| `--border` | `#E2E8F0` | `#334155` | Dividers/controls |
| `--success` | `#15803D` | `#4ADE80` | Positive/complete |
| `--warning` | `#A16207` | `#FACC15` | Attention/pending |
| `--danger` | `#B91C1C` | `#F87171` | Error/destructive |
| `--focus-ring` | `#2563EB` | `#93C5FD` | Focus indication |

Colors are not guaranteed to pass all contrast pairings until audited. Map to shadcn semantic variables (`background`, `foreground`, `primary`, `muted`, `destructive`, etc.) and create explicit foreground pair tokens. Dark mode may be V1 if implementation cost threatens P0; light mode must be complete first.

**Type:** Inter or suitable licensed sans-serif with system fallback. Numeric outputs use tabular figures. Proposed sizes: display 36–44, storefront section 24–30, page title 24–28, admin section 18–22, body 14–16, metadata 12–13 CSS px. Minimum legible supporting text typically 12–13 px; do not force 10 px dense dashboards.

**Spacing:** 4px base; 4/8/12/16/20/24/32/40/48. Page max widths: storefront content ~1280px, admin variable ~1440px, but tune to breakpoint and table needs. Radius: controls 8–10px, cards 12–16px, dialog 12–16px. Shadows subtle only for elevation. Borders separate content without heavy panels.

**Layout:** storefront feature card ratios consistent; image source dimensions stable to avoid layout shift. Admin sidebar ~224–248px desktop and collapsible to ~64–72px only with labels available via tooltips and accessible names. Admin content horizontal padding 16/24/32 responsive. Charts never exceed their viewport or dominate all first-screen content.

### 7.3 Component inventory and usage

| Component | Variants / behavior | MVP owner |
|---|---|---|
| Buttons | primary, secondary, outline, ghost, destructive; loading, disabled, icon | Shared UI |
| Inputs | text/email/password/number/search; validation and helper states | Shared UI |
| Select/Combobox | keyboard list; async only for large taxonomy; no giant controls | Shared UI |
| Dialog/Sheet | destructive confirmation, edit, mobile nav/filter | Shared UI |
| DataTable | server pagination/sort/filter, mobile alternate | Admin |
| StatusBadge | semantic label + severity from approved transition catalog | Shared UI |
| Skeleton/EmptyState/ErrorPanel | reusable states with actionable retry | Shared UI |
| ProductCard | media, title, price, badge, quick navigation, no false stock claims | Storefront |
| ProductGallery | image thumbnails, zoom/lightbox if accessible, media fallback | Storefront |
| VariantSelector | labeled, no impossible combinations, inventory updates | Storefront |
| CartLine | image, configured SKU, quantity, current cost, remove | Storefront |
| CheckoutSummary | authoritative totals, shipping/tax, pending states | Storefront |
| OrderTimeline | ordered dated events; payment vs fulfillment separate | Both apps |
| FormSection/UnsavedGuard | staged editors, summary errors, save state | Admin |
| KPI Tile | compact metric, timeframe, sandbox label, accessible text | Admin |
| ChartWrapper | accessible textual summary, reduced motion, bounded height | P1 Analytics / minimal P0 if justified |
| PermissionMatrix | understandable atomic grants, effective permissions | Admin |
| AuditEventList | actor/action/resource/time without sensitive payload | Admin |

**Shared UI boundary:** `packages/ui` owns low-level presentation and tokens, not payment rules or privileged authorization. Feature-specific components remain in `apps/storefront` or `apps/admin`; DTO/view models from `packages/types` and validated via `packages/validation` where appropriate.

## 8. Responsive specification

| Width / context | Storefront | Admin |
|---|---|---|
| ~360px small mobile | Logo, cart, nav, search reveal; 1–2 product grid columns depending card min-width; stacked checkout | Nav sheet, 1-column metrics, action toolbar wraps cleanly; lists become cards |
| ~390–600px mobile | 2 cards if each ≥160px otherwise 1; cart summary follows items; sticky CTA only without covering content | Table cards with prioritized data; edit modal becomes sheet if needed |
| ~768px tablet | 2–3 product columns, mobile filters drawer; checkout single/two columns as usable | Collapsible nav, 2 metric columns, controlled compact tables |
| ~1024px laptop | Search visible, 3–4 product columns, filter sidebar; checkout summary rail | Persistent sidebar, table density tuned, 2–4 KPIs |
| ≥1440px desktop | Max-width content, 4–5 cards without giant stretching; two-column checkout | Max-width restrained page, 4 KPIs, bounded charts/table |

**Layout invariants:** `min-width:0` on flex/grid children; responsive media aspect ratios; no fixed widths wider than viewport; global `overflow-x:hidden` must **not** conceal bugs; use container-limited scroll intentionally for true tables. Dropdowns and dialogs must remain within viewport and support scrolling content. Check at 360/768/1440px plus 320px resilience and zoom 200%/400% reflow as applicable. Test both LTR and potential future RTL readiness for icons/content ordering, without committing Arabic UI in P0.

## 9. Accessibility standard

- Aim for **WCAG 2.2 AA** and usable keyboard/screen reader flows; supplement automated axe checks with manual audits.
- Landmarks (`header`, `main`, `nav`, `footer`), single meaningful `h1`, correct nested headings and skip-to-main links.
- Visible focus indicator meeting 2.2 criteria; predictable tab order; focus restored after dialogs and logical focus after route transitions.
- Inputs have programmatic labels; helper/error text linked by `aria-describedby`; errors summarized on long forms.
- All product images have useful alt text; purely decorative images use empty alt; icon-only controls have accessible names.
- Product variant availability expressed in text/disabled state, not color only; checkout cost breakdown screen-reader-readable.
- Accessible sortable table column headers, pagination status, row actions and mobile card equivalents.
- Live announcements for cart add/quantity correction and verification feedback must avoid chatty repetitions.
- Respect reduced motion; avoid seizure-risk effects; interactive content does not require hover.
- Content retains functionality at 200% text enlargement and required reflow zoom; tap areas meet WCAG target-size exception rules at minimum.
- Charts (P1) include textual summary/table alternative; no information encoded solely as color.

## 10. Data fetching, state boundaries and performance UX

### 10.1 State ownership

| Data type | Owner | Mechanism | Invalidation trigger |
|---|---|---|---|
| Product listings/filters | URL + server API data | Next.js server rendering/caching where suitable, TanStack Query for client interactions | Catalog publish/edit, filter URL change |
| Product detail/SKU stock | API | Route-scoped query | Variant selection or confirmed inventory update; short freshness window |
| Cart server state | API; guest temp state in browser | TanStack Query + small Zustand guest cart/UI state | Add/remove/update, login merge, checkout |
| Checkout quote/payment | API only | Explicit action queries/mutations; no client arithmetic authority | Address/item change, quote expiry, payment state update |
| Customer profile/addresses/orders | Authenticated API | Scoped TanStack Query keys by session/user | Relevant profile/order mutation; logout clears cache |
| Admin lists | API, page and filter specific | Route-scoped paginated queries | Successful module mutation |
| Permission grants | API | Session-scoped capabilities query only in protected admin shell; detail on demand | Grant/revoke/session change; 403 forces refresh |
| Transient UI | Client | Component state or Zustand only when cross-component | Local events |

**Rule:** Do not fetch all admin endpoints when `/admin` opens. Sidebar navigation must not mount live data components. The dashboard queries only its selected summary aggregate; the Products page queries product data; Inventory page queries stock; Reports only when active. Avoid unbounded prefetching. An authorization check is not a license to fetch forbidden datasets.

### 10.2 Query policy

- Query keys must include app surface, authenticated principal/session boundary where safe, resource, URL params, page and filters. Prevent cross-user cache bleed.
- Use TanStack Query deduplication, appropriate stale times, conservative refetch-on-focus; no poll loops by default. For checkout payment pending state, bounded active-visibility polling with backoff and explicit timeout/recheck; prevent multiple submissions.
- API supports bounded pagination and efficient projections. Do not fetch full order histories to compute admin KPIs on client.
- Fetch only data actually needed by active route and visible panel; detail drawers fetch after open; large dropdown reference datasets lazy-load when opened.
- SSR / Next.js server components can load public SEO catalog data; authenticated customer/admin resources require careful per-user caching or `no-store` as appropriate. Do not cache private data in a shared edge/public cache.
- Invalidation must be narrow: adjusting inventory invalidates affected SKU and relevant low-stock summary, not all application queries. Mutations wait for backend response before displaying final status.
- Never call backend from UI packages or bypass the API. Network request wrappers share typed API client and sanitized error codes.
- Product images optimized (`next/image` or approved equivalent), responsive `sizes`, predictable aspect ratio; avoid loading full galleries before needed. Fonts loaded with display swap or equivalent strategy.
- Defer P1 analytics graphs until visible; Recharts only on relevant route. Avoid animation and huge client bundles on primary commerce path.
- Keep UI interactive even when secondary widgets fail. Show bounded skeletons, retry controls, and pagination transitions without layout jumps.

### 10.3 Proposed observable experience budgets [to validate during architecture]

- P0 route load: no unrelated module requests; automated network assertions for Overview, Products, Inventory, Orders.
- Catalog/search: initial product page bounded size (proposal 20–24), server-side filtering and sorting, debounced query changes.
- Checkout: one authoritative re-quote whenever address/quantity/eligibility changes; submit blocked until resolved quote accepted.
- API/query performance metrics require baseline test rig; do not invent fixed p95 promises.
- Lighthouse mobile ≥85 as proposed PRD KPI and zero horizontal overflow 360/768/1440.
- Request telemetry: route, logical query operation, count, duration, failure category, cache-hit ratio where available; avoid PII leakage.

## 11. Error, security and privacy experience

- Authentication UI never stores bearer tokens in local storage; session strategy uses secure cookies per architecture.
- Customer PII appears only in own routes, and admins see masked/minimum fields they are authorized to view. No secrets, card data, full tokens or hashes on screens/logs.
- Payment entry in MVP is sandbox/mock: clearly marked **Test payment — no real charge**. Avoid brand/payment-provider misrepresentation.
- Sensitive admin mutation forms require explicit authorization and re-auth/step-up only if approved in security architecture.
- Staff permission changes should show what changes and the affected account; revoked users lose access after enforcement, not merely after navigation update.
- Logout clears principal-specific caches, guest/cart merge private state where appropriate, and stale screens. Browser back must not reveal old protected content.
- Asset uploads validate extension/MIME/size on client for helpful UX and again on backend; show upload progress/retry and moderation/safety handling as decided in architecture.
- External links use secure semantics and proper context. Error telemetry avoids raw email/order address payloads.

## 12. Content, localization, SEO and trust

- Initial UI content language **English [PROPOSED]**; architecture should avoid hard-coded plural/currency assumptions, ready for Arabic/RTL V1 or later.
- EGP display uses consistent locale policy decided with financial formatting; amount precision is display only, never financial truth.
- Product URL slugs descriptive and unique; canonical URLs, metadata, structured product data only when data is accurate, sitemap and robots behavior by publish state. No SEO indexing for checkout, private accounts or admin.
- Product detail shows brand, SKU/variant, descriptive title, photos, current price, stock state and material specifications. Do not fabricate scarcity counts, ratings or discount percentages.
- Plain-language policies: shipping/returns/privacy/terms/help content must be accurate to actual implemented features and legal review; don't advertise P1 returns automation as enabled in P0.
- Trust cues come from working order tracking, clear sandbox messaging and consistent error handling, not fake review/social proof widgets.

## 13. Acceptance tests and traceability

| UX test ID | Scenario / required result | PRD link | Release |
|---|---|---|---|
| UX-01 | Home → category → product → cart via keyboard and pointer; responsive | CH catalog/cart P0 | P0 |
| UX-02 | Category/search filters encoded in URL and stable after refresh/back; zero results clear filters | CH catalog/search P0 | P0 |
| UX-03 | Changing variant updates allowed combinations, price and stock text; impossible SKU unavailable | CH product/variant P0 | P0 |
| UX-04 | Guest checkout gates auth; safe return; merged cart corrections shown | CH identity/cart/checkout P0 | P0 |
| UX-05 | Email unverified order blocked and resend flow accessible | CH auth P0 | P0 |
| UX-06 | Changed checkout quote requires explicit review; no client-supplied totals trusted | CH checkout/payment P0 | P0 |
| UX-07 | Double pay click / refresh no duplicate; pending is never success | CH payment/idempotency P0 | P0 |
| UX-08 | Order list/detail limited to owner; historical snapshot stable | CH orders/customer ownership P0 | P0 |
| UX-09 | Product create/draft/publish/archive dialogs respect permissions and validation | CH catalog/admin P0 | P0 |
| UX-10 | Inventory conflicts show reload and reason; no blind overwrite | CH inventory P0 | P0 |
| UX-11 | Unpaid order cannot be fulfilled; correct timeline after transition | CH fulfillment P0 | P0 |
| UX-12 | Last Super Admin protections + revocation reflected after API denial | CH-SEC-002/003 | P0 |
| UX-13 | Overview initial load never fetches product list, inventory table, customers or payments datasets | NFR-PERF-02 / CH-DASH-001 | P0 |
| UX-14 | Only active admin route fetches its module; sidebar triggers no queries | NFR-PERF-02 | P0 |
| UX-15 | Loading, empty, recoverable error, 401, 403, 404, 409, 422, 429 states verified | NFR-UX-01 / NFR-REL-01 | P0 |
| UX-16 | No page-wide horizontal overflow at 360/768/1440; modal/dropdown fit at zoom | NFR-RESP-01 | P0 |
| UX-17 | axe audit + manual keyboard/focus/dialog/form/target checks on critical flows | NFR-A11Y-01 | P0 |
| UX-18 | Repeated filtered list loads deduped; query cache cleared on logout | NFR-PERF-02 / NFR-SEC-01 | P0 |
| UX-19 | Refund approval/execution shows correct partial eligible amounts, pending result safe | CH refunds P1 | P1 |
| UX-20 | Analytics exports and trends fetch on their route, report retains meaning without chart | CH-AN-001 | P1 |

**Evidence expectations:** UI screenshots at 360, 768, 1440 (normal/empty/error); Playwright browser traces and route request logs; accessibility audit exports and manual checks; test IDs mapped to test files in `07-implementation-plan.md`. No screenshot substitute for persisted-backend state checks.

## 14. Handoff to architecture / database / API

### Decisions architecture must resolve before coding

1. Whether storefront/admin are deployed on distinct origins and cookie/session/CSRF domain model.
2. Route rendering/caching strategy for public SEO pages vs authenticated pages; shared API client contracts and authentication refresh.
3. Canonical business statuses, payment pending/retry reconciliation semantics, idempotency scope, stock reservation lifecycle/expiry [15 minutes proposed].
4. Quote schema: line subtotal, shipping, tax (inclusion/exclusion), discounts if enabled, grand total, EGP rounding policy and expiry. Financial review required before authoritative code.
5. Product category hierarchy, brand/variant specification taxonomy and media object-storage workflow.
6. Auth verification and password recovery UI-to-API contract, anti-enumeration/rate-limit semantics.
7. Permission schema and privilege granularity; staff deactivation and last-Super-Admin protections.
8. Inventory adjustment semantics, stock movements, concurrency conflict response and order fulfillment action payloads.
9. Query pagination, filter/sort API surface, projections, stale-time policy and network observability instrumentation.
10. Product/SEO slug policy, public price visibility, out-of-stock display and checkout delivery zone validation.

### UX deliverables necessary before implementation tasks

- Approved route inventory and navigation diagrams.
- Wireframes or Figma mockups for Home, Catalog, Product, Cart, Checkout, Order detail, Admin Overview, Products, Product Editor, Inventory, Orders, Staff.
- Responsive versions for mobile/tablet/desktop, including dropdowns and dense admin tables.
- Shared light theme token reference with tested contrast pairs and component states.
- Interaction prototypes for checkout repricing/payment pending, stock conflict and staff grant confirmations.
- Copy glossary of statuses/errors and accessible validation examples.

## 15. UX risks and mitigations

| ID | Risk | Impact | Mitigation | Owner |
|---|---|---|---|---|
| UX-R01 | Dense admin tables overflow mobile or zoom | High | Card alternative, prioritized columns, bounded table scroll and viewport tests | UX/Frontend |
| UX-R02 | Too-large buttons/dropdowns and poor alignment | Medium | Component size tokens, 36–40px admin control guidance, visual QA | UX/Frontend |
| UX-R03 | Every admin endpoint fetches on dashboard mount | High | Page-owned query contracts, mount isolation and network test UX-13/14 | Frontend/API |
| UX-R04 | Payment UI implies success too early | Critical | Pending/recheck state based only on backend and reconciliation | Product/Backend/UX |
| UX-R05 | Stock/price stale at checkout | Critical | Fresh authoritative quote and explicit conflict review | Backend/UX |
| UX-R06 | Staff actions available outside granted scope | Critical | API RBAC/ownership checks plus permission-aware interface | Security/Backend |
| UX-R07 | Admin screens overload users with detail | High | Progressive disclosure, restrained cards, detail screens/drawers | UX |
| UX-R08 | Styling changes cause regressions and low contrast | Medium | Token governance, visual regression and accessibility testing | UI/QA |
| UX-R09 | Product media performance reduces checkout conversion | Medium | Responsive optimized images, gallery lazy-loading and budgets | Frontend |
| UX-R10 | P1 controls visually suggest MVP support | Medium | P0 feature flags only for real features; deferred menu excluded | Product/Frontend |
| UX-R11 | English-only UI assumptions block future Arabic/RTL | Medium | Semantic layout, no text-as-image, i18n-ready copy keys | UX/Frontend |

## 16. UX definition of ready and approval gate

**Ready for architecture** when: approved route/page inventory, release separation, primary flows and exceptional states, component size/density rules, a11y/responsiveness requirements, clear route-level data ownership, and flagged open architecture/finance dependencies are acknowledged.

**Ready for frontend implementation** additionally requires: approved wireframes/tokens for relevant tasks, backend/API contracts, accessible component variants, status/validation copy, exact CH-ID traceability and executable acceptance criteria. No code is authorized merely by creating this document.

**Approval record:** Product owner approved UX baseline on 2026-10-18. The PRD is approved as product baseline; the proposed 15-minute stock hold, exact rounding/tax/shipping behavior, session model, and payment reconciliation remain subject to explicit financial and architecture gates and MUST NOT be silently treated as implemented decisions.

**Next BMAD document after UX approval:** `04-architecture.md` (modular-monolith system components, boundaries, sessions, REST contracts, concurrency, infrastructure, workers, security and ADRs).

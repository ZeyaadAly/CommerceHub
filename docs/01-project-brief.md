# CommerceHub — Project Brief

**Document ID:** CH-BMAD-01  
**Filename:** `01-project-brief.md`  
**Version:** 1.0 — Baseline for PRD  
**Date:** 2026-10-18  
**Status:** Draft for stakeholder approval (implementation not authorized)  
**Product:** CommerceHub — Multi-category E-commerce Platform  
**Workflow:** BMAD — Analysis → Planning → Design → Implementation → Testing → Deployment

---

## 1. Executive Summary

CommerceHub is a portfolio-grade, production-oriented **multi-category e-commerce platform** for electronics, fashion, home goods, accessories, and other physical products. It will provide two separate applications—a customer storefront and a protected administration dashboard—served by one shared NestJS REST API and one PostgreSQL database.

The customer experience will cover discovery through post-purchase service; the administration experience will support the operational and financial lifecycle of commerce, with role-based permissions and auditable staff actions. The project prioritizes correctness, security, accessibility, maintainability, performance, and a polished interface over premature feature breadth.

CommerceHub will start with a usable **MVP**, expand into a business-capable **V1**, and reserve more complex capabilities for **Future** releases. The MVP will use mock/sandbox payment processing; live payment acceptance is a separate gated decision requiring verification of providers available to Egyptian merchants, integration testing, and operational readiness.

## 2. Problem and Opportunity

### Customer problems
- Product discovery can be slow when catalogs lack useful categories, search, filters, and informative product pages.
- Inconsistent price, inventory, and checkout behavior can lead to confusion and failed purchases.
- Customers need clear order history, fulfillment status, and support after purchase.

### Operator problems
- Product, stock, order, payment, refund, and customer data become error-prone when managed separately.
- Staff require distinct authorization boundaries; broad admin access increases operational risk.
- Commerce requires auditable handling of state transitions and financial events.

### Opportunity
Deliver an end-to-end reference implementation showing coherent customer experiences and real-world administrative workflows backed by a consistent domain model and secure APIs.

## 3. Product Vision and Value Proposition

**Vision:** Make a diverse product catalog easy to shop and straightforward to operate, with reliable transactions and secure administration.

**Value proposition:** One integrated commerce system for customers, admins, and super admins—with modular architecture, centralized business rules, accurate inventory and money handling, and modern responsive interfaces.

**Portfolio objective:** Demonstrate professional full-stack engineering from BMAD artifacts through tests and deployment, including commerce edge cases and measurable quality gates.

## 4. Goals and Non-Goals

### Goals
1. Build separate customer and admin Next.js applications backed by one NestJS REST API.
2. Support a practical multi-category catalog with category-specific attributes and variants (e.g., apparel size/color and electronics configuration).
3. Implement a secure customer purchase flow and reliable inventory/order lifecycle.
4. Enforce least-privilege staff permissions server-side, with security-sensitive action auditing.
5. Model payments, financial history, refunds, and stock changes without trusting client claims.
6. Achieve strong UX, accessibility, automated testing, observability, and reproducible deployment.
7. Make architectural and domain decisions explicit in the later BMAD documents before coding.

### Non-goals for MVP
- Multi-vendor marketplace or seller payouts.
- Multi-warehouse logistics and advanced warehouse management.
- International/multi-currency settlement and complex cross-border tax engines.
- Native mobile apps.
- Real payment-card storage or PCI-sensitive card processing.
- AI personalization or algorithmic recommendations.
- Full ERP/accounting integration.

## 5. Audience, Actors, and Permission Model

| Actor | Primary needs | Access principle |
|---|---|---|
| Guest | Browse products, view details, prepare cart | Public catalog only; checkout/auth rules defined in PRD |
| Customer | Register/login, checkout, review orders, manage profile and addresses | Own resources only |
| Admin | Execute assigned catalog, inventory, order, and support operations | Explicit granular permissions, least privilege |
| Super Admin | Manage admins, roles, permissions, platform settings, audits | Broad privileged access with high-impact safeguards and logging |
| System/worker | Reconcile events, process queued jobs and notifications | Dedicated narrowly scoped service identity |

**Authorization invariant:** Frontend visibility is UX only; the backend authorizes every protected resource/action. No admin gets automatic unrestricted access by virtue of being an admin.

## 6. Business Model and Catalog Scope

- **Store model:** One merchant-operated, multi-category retail store selling physical products; not a marketplace.
- **Initial sample categories:** Electronics, Fashion, Home & Living, Accessories. These are seed-data examples, not hard-coded limits.
- **Product structure:** Products have categories, brands, descriptions, images, publish status, and sellable variants/SKUs. Attributes differ across categories; variant dimensions are configurable by product type.
- **Pricing:** Initial operational currency is **EGP**. Money is stored exactly (PostgreSQL `NUMERIC`) with explicit currency, and order line items retain historical snapshots.
- **Stock:** Managed per sellable SKU/variant; stock availability and reservation/commit behavior are backend-owned.
- **Order fulfillment:** Physical shipment model; shipping zones, fees, carriers and service-level specifics are decisions for the PRD/architecture.
- **Payments:** Provider adapter abstraction; MVP mock/sandbox only. Supported Egyptian live gateway(s) will be evaluated separately.
- **Tax:** Configurable tax handling, not assumed to be zero; applicable rules and whether displayed prices include tax must be defined before live launch.

## 7. Release Boundaries

### 7.1 MVP — End-to-End Purchase and Basic Operations

**Customer storefront**
- Responsive homepage, catalog, categories, search, sorting, and essential filters.
- Product details with images, selectable variants, current availability, and price.
- Customer registration, sign-in/out, verified-account/password-recovery foundations as specified in PRD.
- Account profile, shipping addresses, cart (authenticated persistence; guest-cart policy TBD).
- Checkout with server-validated totals, shipping selection and mock/sandbox payment outcome.
- Order confirmation, customer order list/detail and basic status tracking.

**Admin dashboard**
- Protected staff login and separate application shell.
- Super Admin-managed staff accounts and permission assignments (minimal workable RBAC).
- Product/category/brand/variant CRUD, image handling, publication controls.
- Inventory stock adjustments with a movement ledger and low-stock indicators.
- Order queue/details, valid status transitions and basic fulfillment information.
- Simple overview KPIs and audit logging for high-impact mutations.

**Shared platform**
- Modular monolith NestJS API, PostgreSQL schema with Prisma migrations, OpenAPI documentation.
- Validation, error handling, secure sessions, authorization, transactional ordering/stock changes.
- Payment-attempt records and idempotent mock/sandbox payment operations; no raw card data.
- Automated critical-path tests and baseline CI/deployment environments.

**MVP completion signal:** A customer can order a stock-tracked variant using sandbox payment; the admin can manage fulfillment; stock, order history and payment records remain consistent; permissions are enforced and key actions auditable.

### 7.2 V1 — Commercial Depth and Operational Maturity

**Customer-facing**
- Wishlist, verified-purchase reviews/ratings, coupon/promotional pricing.
- Order cancellation rules, return requests, refund status visibility.
- Transactional notifications, improved search/filter depth, richer delivery tracking.

**Administration and finance**
- Return approvals, partial/full refunds, duplicate-refund prevention.
- Detailed payment attempts, transactions, reconciliation and verified webhook processing for a selected provider (subject to readiness).
- Promotions/coupons/redemptions, advanced inventory reservations/alerts.
- Customer support views, sales analytics, product performance, and exportable reports.
- Expanded role management, permissions, and audit review workflows.

**Platform**
- Operational dashboards, observability, queue-backed notifications/jobs, performance hardening, backup/restore exercises, and launch runbooks.

**V1 completion signal:** Authorized staff can manage a return/refund with a traceable and idempotent financial record; marketing and analytics use consistent backend-derived data; operational procedures are documented and tested.

### 7.3 Future — Explicitly Deferred

- AI-assisted recommendations and personalization.
- Loyalty points, referrals, gift cards, and advanced merchandising.
- Multi-warehouse allocation and advanced shipping integrations.
- Multi-currency checkout, internationalization and region-specific tax engines.
- Marketplace/seller portals and vendor settlements.
- Native apps and advanced forecasting/fraud detection.

**Release rule:** A feature appearing in this brief is not considered implemented. Movement between releases requires approved PRD updates, dependency evaluation and test coverage.

## 8. Core End-to-End Workflows

1. **Discover:** Visitor browses categories, filters/searches and chooses a product variant.
2. **Cart:** Customer updates quantities; display totals are advisory until backend recalculation.
3. **Checkout:** API validates identity, address, SKU availability, server-side pricing, shipping/taxes/discounts and creates a consistent order/payment attempt.
4. **Payment:** Sandbox provider result is recorded idempotently; payment and order transitions follow explicit state machines.
5. **Fulfill:** Authorized admin sees paid/fulfillable orders, records shipment/fulfillment steps, and updates status.
6. **Post-purchase:** Customer checks history and delivery status. Cancellation/returns/refunds expand in V1.
7. **Manage catalog/inventory:** Authorized staff publishes products and logs stock movements; all changes follow backend checks.
8. **Govern:** Super Admin manages staff access and reviews high-impact audit events.

## 9. Foundational Business Rules and Invariants

### Identity and security
- Only authenticated and authorized users can access private resources; object ownership applies to customer data.
- Use secure HTTP-only cookies for session/auth tokens, secure password hashing with Argon2id, and explicit session expiry/revocation.
- Protect state-changing cookie-authenticated requests against CSRF, and enforce appropriate CORS, rate limits, email verification and recovery safeguards.
- Enforce RBAC and granular permissions on API routes/services; changes to staff permissions must be auditable.
- Secrets live in protected configuration; never appear in source control, logs or client bundles.

### Catalog, pricing, and stock
- Only published, active sellable variants can be purchased.
- Never accept client-supplied prices, discount amounts, stock numbers, totals or payment success as authoritative.
- Capture order-time SKU/variant identity, product title, unit price, quantity, discount, tax, shipping allocation as applicable, and currency; subsequent catalog edits must not rewrite historical purchases.
- Prices and charges have explicit rounding rules; calculations use decimal-safe arithmetic, never JavaScript binary floats for monetary authority.
- Inventory reservations/commits and order creation are atomic where needed; prevent overselling under concurrent checkouts.
- Every stock change must have an auditable movement reason; reservations must have lifecycle and expiry policies defined in architecture.

### Orders, payments, and refunds
- Use explicit finite state transitions, immutable financial facts where feasible, and actor/timestamp history.
- Changes involving orders, stock and payments must be transactional or reconciled via durable idempotent mechanisms across external boundaries.
- Idempotency keys are required for operations that can be repeated (checkout/payment/refund); webhook payloads must be authenticated and deduplicated.
- The payment provider adapter is the only integration boundary; no raw payment-card data is stored.
- A refund must never exceed eligible captured value after prior refunds; avoid duplicate or unapproved refunds.
- Failed/abandoned checkout must not permanently consume sellable stock.
- Financial and audit records follow retention and correction policies, not casual destructive deletion.

### Multi-category modeling
- Categories and attributes are configurable; adding new categories must not require new frontend applications or per-category database tables by default.
- Each purchasable variant has a unique SKU and an independently controlled price/availability policy, with explicit rules for products without multiple choices.
- Product and variant data exposed publicly must not leak internal purchase costs or administrative metadata.

## 10. UX and Quality Principles

- **Storefront:** modern premium commerce visuals; clear hierarchy, fast browsing, readable pricing, effective empty/loading/error states, mobile-first checkout.
- **Admin:** compact SaaS-style layout; legible dense tables/charts, appropriate button and dropdown sizes, consistent alignment, keyboard usability.
- **Performance:** only fetch data required for the active page; avoid dashboard-wide endpoint fan-out and needless rerenders.
- **Responsive:** no horizontal overflow at 360px mobile, 768px tablet and 1440px desktop reference widths; also test additional widths.
- **Accessibility:** keyboard operability, meaningful labels, focus management, contrast and semantic structures; target WCAG 2.2 AA where practical.
- **Design system:** shared tokens and appropriate reusable primitives without coupling business workflows between the separate applications.

## 11. High-Level Technical Direction

```text
commercehub/
├── apps/
│   ├── storefront/      # Next.js customer experience
│   ├── admin/           # Next.js administration
│   └── api/             # NestJS REST API
├── packages/
│   ├── ui/              # Design primitives and tokens
│   ├── types/           # Cross-app contracts
│   ├── validation/      # Shared safe schemas where appropriate
│   └── api-client/      # Typed API access
├── docs/                # BMAD artifacts, ADRs, runbooks
└── infrastructure/      # Docker, workflows, deployment config
```

- TypeScript throughout; Next.js App Router for both UIs; Tailwind CSS, shadcn/ui, Radix, Zustand, TanStack Query, React Hook Form and Zod.
- NestJS modular monolith, REST/OpenAPI, Prisma ORM, one centralized PostgreSQL database via Supabase.
- Only NestJS accesses the database; browser and frontends communicate through authenticated API contracts.
- Redis/BullMQ for suitable caching/background work (introduced when release requirements warrant); avoid splitting into microservices prematurely.
- Product images in object storage; use access controls and safe upload validation.
- Vercel for frontends; a separate appropriate service for the long-running NestJS API, Redis and worker(s).
- GitHub Actions, Docker, Vitest/Jest, Supertest, React Testing Library, Playwright, structured logs and environment isolation.
- Versions and deployment provider selections will be verified for current support during architecture and implementation planning.

## 12. Success Criteria and Acceptance Gates

The following are **proposed measurable targets**, not claims of current achievement. Final SLOs, traffic assumptions, and device/browser matrices will be established in the PRD and test plan.

| Area | Proposed acceptance criterion | Verification |
|---|---|---|
| Core journey | Register/login → find variant → cart → sandbox checkout → order view → admin fulfillment works | Playwright E2E on staging |
| Auth boundaries | All sampled protected APIs reject anonymous/unauthorized calls; customer cannot read another customer's order | Negative API integration and E2E tests |
| Financial consistency | Totals use exact decimal arithmetic; order snapshots stay stable; repeated payment/refund attempts do not double charge/refund | Unit, transactional and idempotency tests |
| Inventory | Concurrent purchase attempts do not oversell; rejected/expired attempts release reservations | Concurrency/integration tests |
| Staff governance | Admin without a required permission is denied; Super Admin's staff changes are audited | Permission matrix tests and audit assertions |
| Critical API quality | >= 90% automated branch coverage on high-risk money, stock and authorization service logic (proposed) | Coverage reports |
| Accessibility | No critical or serious automated accessibility findings on key storefront/admin flows; manual keyboard checks pass | axe/Playwright + manual review |
| Layout | No unexpected horizontal overflow at 360/768/1440px on priority pages | Responsive screenshot/layout tests |
| Performance | Mobile key-page Lighthouse performance >= 85 on repeatable staging runs (proposed; network profile fixed in plan) | CI or recorded Lighthouse audits |
| Operational readiness | CI green, migrations reproducible, no known critical/high vulnerabilities, sanitized logs, documented rollback and restore process | Release checklist and security review |
| Documentation | Seven BMAD artifacts aligned with implementation, plus Swagger/OpenAPI and handoff docs | Review gate |

**Portfolio acceptance:** Demonstrable deployed apps, sanitized demo accounts/data, architecture diagram, meaningful tests, readable documentation, and a reproducible walkthrough of a purchase and admin management flow.

## 13. Assumptions and Constraints

| ID | Assumption / constraint | Validation point |
|---|---|---|
| A-01 | Single merchant, single store, physical goods only initially | PRD approval |
| A-02 | EGP is the initial checkout and accounting currency | PRD / financial design |
| A-03 | Initial target market is Egypt; shipping, tax, privacy and refund obligations need local verification before live sales | PRD / launch checklist |
| A-04 | No real customer or payment-card data needed for portfolio demos | Test-data policy |
| A-05 | One developer may implement incrementally with Codex assistance and design/review checkpoints | Implementation plan |
| A-06 | Guest browsing allowed; guest checkout, promotions and review eligibility remain PRD decisions | PRD |
| A-07 | Email delivery, shipping carriers and live gateway are provider integrations, not prerequisites for sandbox MVP | PRD / architecture |
| A-08 | Limited budget favors managed PostgreSQL and pragmatic hosting but does not relax security requirements | Architecture |
| A-09 | Admin and storefront deploy independently but share versioned API contracts | Architecture / CI |
| A-10 | No payment provider is approved until Egyptian business eligibility, webhook/security behavior, fees, refunds, and sandbox access are verified | Payment ADR |

## 14. Risks, Mitigations, and Owners

| Risk | Likelihood / impact | Mitigation | Owner |
|---|---|---|---|
| Scope expansion across too many modules | High / High | Lock MVP, defer V1/Future, require change control | Product owner |
| Inventory overselling from concurrent checkout | Medium / High | Transactions, reservation policy, concurrency tests | Backend |
| Incorrect financial totals or duplicate payment/refund | Medium / Critical | NUMERIC/decimal math, ledger/history, idempotency, reconciliation tests | Backend |
| Broken access control across staff/customer APIs | Medium / Critical | Default-deny RBAC, object-level auth, negative tests, audits | Security/backend |
| Unsupported Egyptian payment provider | Medium / High | Sandbox-first adapter, verify providers before integration | Product/architecture |
| Payment/webhook discrepancies | Medium / High | Signed webhook verification, durable event dedupe, retry/reconciliation | Backend |
| UI inconsistency and overflow | High / Medium | UX specification, design tokens, responsive/a11y test gates | Frontend |
| Backend/API/worker hosting mismatch | Medium / High | Validate long-running process, Redis and worker hosting in architecture | DevOps |
| Demo secrets or personal data exposure | Medium / High | Secret scanning, anonymized seed data, least-privilege environments | DevOps/security |
| Complexity of categories and SKU modeling | Medium / Medium | Explicit attribute/variant rules and representative seed cases | Architecture/data |
| Migration and data recovery failures | Medium / High | Versioned migrations, staging rehearsal, backup/restore test | Data/DevOps |

## 15. Dependencies and Decisions Pending

**Decisions to resolve in `02-prd.md`:**
1. Checkout policy (account required vs guest checkout), cart merge rules and email verification gates.
2. Precise MVP category list, product attribute schema, variant policy and sample dataset.
3. Shipping fee/zone rules, taxes, discounts and cancellation cutoff rules.
4. MVP order/payment/inventory state machines and reservation expiration semantics.
5. Pricing display rules and exact rounding, including tax/discount ordering.
6. Admin roles/permission catalog and safeguards for privileged actions.
7. KPI definitions, target users, operational volumes and MVP page inventory.

**Decisions to resolve in architecture/database/API docs:**
- Authentication session strategy, CSRF protection, token rotation and audit event schema.
- Concurrency transaction/isolation patterns, stock reservation and checkout idempotency.
- Payment provider adapter and verified Egyptian provider evaluation.
- Category attribute and variant schemas, soft archive versus retention rules.
- Async job boundaries, event/outbox needs, uploads, deployment topology and observability.

## 16. BMAD Deliverables and Approval Gates

| Order | Artifact | Primary outcome | Gate |
|---|---|---|---|
| 01 | `01-project-brief.md` | Vision, boundaries, constraints, success criteria | Product scope approved |
| 02 | `02-prd.md` | Prioritized functional/nonfunctional requirements and acceptance criteria | Requirements approved |
| 03 | `03-ux-specification.md` | Page maps, journeys, interaction and design standards | UX approved |
| 04 | `04-architecture.md` | System modules, security, operations and architecture decisions | Architecture approved |
| 05 | `05-database-design.md` | Entities, constraints, relationships, indexes and transactions | Data design approved |
| 06 | `06-api-design.md` | Versioned endpoints, DTOs, permissions, errors and idempotency | API contracts approved |
| 07 | `07-implementation-plan.md` | Small task IDs, dependencies, acceptance criteria, tests, rollout | Implementation sequence approved |

**Implementation policy:** Do not start coding, creating schemas or deploying production services until the relevant planning decisions and work items are approved. Maintain ADRs and update documentation when approved decisions change.

## 17. Immediate Next Step

Review and approve this brief as the scope baseline. Then draft `02-prd.md`, turning the MVP capabilities into testable user stories, requirements with priorities (P0/P1/P2), explicit acceptance criteria, business workflows, edge cases and a clear release matrix. The PRD must resolve or explicitly track every open decision above.

---

### Approval Record

- **Prepared:** 2026-10-18
- **Product owner approval:** Pending
- **Scope baseline:** Pending approval
- **Coding authorization:** Not granted

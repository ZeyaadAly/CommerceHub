# Storefront instructions

Extend [root instructions](../../AGENTS.md). This directory initially contains guidance only; its existence is not an application scaffold or implementation approval.

Sources: [UX §§4.1/5/8–13/16](../../docs/03-ux-specification.md), [architecture §13](../../docs/04-architecture.md), [API §§4–7](../../docs/06-api-design.md), [audit](../../docs/implementation/baseline-audit.md).

## Rendering and data ownership

- Use Next.js App Router route segments with scoped loading/error boundaries. Prefer Server Components for public discoverable catalog/metadata; add Client Components only for interaction and browser state. Keep server-only imports out of client bundles.
- Both server and browser components access business data through the shared API client. Never import Prisma, connect to Supabase tables or receive database/provider secrets. Forward credentials only through the approved SEC-01 transport; do not invent a BFF topology.
- Use request-scoped/no-store handling for authenticated pages; never share customer data through public SSR/edge caches or hydration. Public catalog caching must follow approved publication/price invalidation behavior.
- TanStack Query owns interactive API state where suitable; include principal, resource and URL filters in safe query keys. Avoid redundant SSR/client fetches, waterfalls, unrelated prefetch and refetch loops. Cancel stale requests; clear private caches on logout/session change.
- Zustand is for justified guest/transient UI state, not authoritative carts, orders, prices or permissions. Do not implement temporary guest-cart/merge behavior until BA-02 scope is resolved. Full cart-page ownership is BA-09.

## Catalog and purchase interactions

- Encode search/filter/sort/pagination in URLs; use bounded server filters and deterministic ordering. Published product/category pages need accurate titles, descriptions and canonical/structured metadata; private checkout/account routes must not be indexed.
- Product cards use semantic links, useful alt text, readable EGP labels and keyboard access. Variant selectors have labels and explicit unavailable combinations; selected SKU, price and availability come from API.
- Optimize responsive images with stable geometry and correct sizes; lazy-load nonessential gallery media. Avoid needless client code, rerenders and whole-catalog downloads.
- Show API cart validation/stock corrections, quantity bounds and unavailable lines. Backend alone calculates final payable amounts, tax, shipping and discounts; client estimates never authorize payment. Do not convert decimal money into floating-point settlement calculations.
- Require the approved account/verification gates. Address and profile APIs need explicit ownership/contracts before UI integration (BA-08/14). Show revised quotes for explicit reconfirmation; do not silently accept repricing.
- Use one stable idempotency identity for retries of a logical checkout/payment operation through the client contract. Disable duplicate submission for UX, but rely on API idempotency for correctness. Pending/unknown payment is not success; fetch authoritative status with bounded visibility-aware polling and backoff.
- Confirmation/history render persisted order, amount and address snapshots. Browser redirect parameters never establish paid state. Keep cancellation/returns/refunds/coupons/wishlist/reviews in their approved release.

## UX and evidence

Use shared UI/tokens and React Hook Form/Zod for accessible forms; backend validation remains mandatory. Include scoped loading, empty, error, forbidden/not-found, success and uncertain-result states with actionable recovery. Maintain focus, live announcements, keyboard navigation, reduced motion and viewport-safe layouts.

Verify route filters/back navigation, variant selection, login/session cache isolation, quote changes, failed/pending/retried checkout and owner-only history. Use component tests plus real API-backed Playwright flows where implemented; check axe/manual keyboard and 360/768/1440 overflow. Record image/request behavior and exact commands/results. Approved wireframes/tokens/copy and relevant API contracts are prerequisites (BA-23), not established by this file.

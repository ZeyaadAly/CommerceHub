# Administration application instructions

Extend [root instructions](../../AGENTS.md). Guidance-only directory until separately authorized scaffolding.

Sources: [UX §§4.3/5/6–11/13](../../docs/03-ux-specification.md), [architecture §§6/13](../../docs/04-architecture.md), [API §§8–9](../../docs/06-api-design.md), [audit](../../docs/implementation/baseline-audit.md).

## Authorization and boundaries

- Use a separate Next.js App Router staff surface and approved ADMIN-audience session flow. Never reuse customer credentials as staff authorization or invent unresolved staff-login/invitation transport (BA-14).
- Navigation/buttons reflect API effective capabilities, but every protected action and resource is authorized by backend guards/services. A Super Admin label or client boolean grants nothing. Backend enforces protected management rights, grant scope, session revocation and last-active-Super-Admin protection.
- Exact permission keys and delegation conflict across baselines (BA-04); stop affected role/grant implementation until SEC-01 resolves them. Do not translate catalog.write into invented unrestricted grants.
- Business data comes through shared typed API client only; neither Server Components nor browser code access DB/Prisma/provider secrets. Protect private SSR/hydration/cache boundaries and clear principal-specific data on logout or revocation.
- Render explicit 401/403 handling and access-denied screens without protected data. Treat deep links like navigation: no forbidden data fetch before permissions resolve. Denials must be enforced by API regardless of UI.

## Dashboard UX and fetching

- Shared tokens govern restrained SaaS layouts. Use compact, legible tables and aligned controls; UX suggests 36–40px admin inputs/buttons with accessible hit targets. Do not shrink touch/focus targets merely to reduce density.
- Desktop navigation collapses accessibly; mobile uses a keyboard-operable sheet. Use prioritized columns/cards or a bounded table scroll region; no page-wide horizontal overflow. Dialogs and dropdowns fit viewport/zoom, trap/restore focus and have labels.
- Use server-side bounded pagination/filtering/sorting with stable URL state. Open drawers/lists lazily; preserve form input after validation failure and warn about unsaved edits.
- Shell fetches session/capabilities only. Overview fetches its scoped aggregate; products, inventory, orders and other modules fetch only on their active route. Never mount every dashboard endpoint from sidebar/layout. Use deduplicated TanStack Query data, cancellation and narrow invalidation after committed mutations.
- Backend defines metrics, date ranges, Cairo reporting semantics and permission-filtered aggregates (BA-10). Label P0 amounts Sandbox; never compute revenue from a downloaded full order list. Load bounded charts only on their relevant route, with textual alternatives.
- Confirm destructive/high-impact actions by naming entity and consequence. Show server versions/conflicts; do not blindly overwrite stale inventory or state. Require stock reason, show persisted result and audit reference where available. A toast alone is insufficient evidence.
- State transitions, unpaid void, media lifecycle and low-stock configuration are unresolved in BA-03/11–13. Do not invent endpoints or operator exception actions to fill UI gaps. No UI switch can mark a payment paid.

## Verification

Check role-restricted navigation and direct API denial, session revocation, grant escalation/last-admin guard, invalid/stale state handling, redacted audit views and sandbox KPI semantics. Assert initial overview has no product/inventory/customer/payment-list fan-out, switching routes requests only owned data, and private caches do not cross sessions. Combine component tests, API-backed Playwright, axe/manual keyboard/dialog checks and 360/768/1440 layout checks. Record actual outcomes; keep P1 finance/marketing/advanced audit and P2 placeholders out of MVP unless explicitly approved.

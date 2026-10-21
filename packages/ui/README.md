# Shared presentation system — CH-10/T

The package owns light-theme tokens and accessible presentation primitives. No fetching, authentication, authorization, business state, pricing or persistence belongs here. The owner approved D1–D4 on 2026-10-21 for this bounded slice; implementation remains REVIEW until human acceptance. Feature-page UX is not approved by this milestone.

## Theme consumption

Both applications import Tailwind once, then `@commercehub/ui/styles/theme.css` and explicitly scan `packages/ui/src`. The package exports source CSS separately from compiled JavaScript so Next.js and isolated test builds use the same canonical values. No Next.js dependency or app import enters the package.

- `src/styles/tokens.css`: **the only palette authority**. Change `--primary`, `--primary-hover` and `--primary-pressed` here to recolor primary controls everywhere; update paired foregrounds and recheck contrast. Other state, typography, sizing, spacing, radius, width, focus, motion and elevation variables live here too.
- `src/styles/theme.css`: Tailwind v4 `@theme inline` maps semantic utilities such as `bg-primary`, `hover:bg-primary-hover`, `text-foreground`, `border-control-border` and `ring-focus-ring` to canonical variables. Default palette utilities are removed from this theme; no duplicated hex configuration.
- `src/styles/components.css`: component layout/states use only semantic variables. `transparent` represents an unpainted surface; forced-colors system keywords deliberately delegate colors to the user's OS. Neither is a fixed component palette. Neutral translucent overlay/shadow values are centralized in tokens.

Future approved themes can override the semantic properties without changing component source. This package implements **light only**, with no theme toggle or validated dark palette. A token override is not approval of its contrast. Desktop compact/default controls are 36/40px; touch variants/coarse pointers have 44px targets.

## Public primitives

Import from `@commercehub/ui` (63 intentional runtime exports; types are erased): Button/IconButton, Input/Textarea/FormField, Radix Select/DropdownMenu/Checkbox/Switch, Dialog/AlertDialog/Sheet, Card/Badge/Tabs, Table primitives/Pagination, Skeleton/EmptyState/ErrorPanel, Toast, SkipLink/NavigationLink/Breadcrumb/Tooltip. Root/trigger/content/title/description pieces are exported for composition. Keep import boundaries small as consumers grow; do not bundle future charts or domain composites through this entrypoint.

Buttons default to `type="button"`; loading preserves dimensions/name and disables activation. IconButton requires `label`. FormField's render function supplies an ID, descriptions, invalid and required state for native controls; custom controls must adapt their required semantics at the correct Radix root. Controlled state and domain error copy remain caller-owned.

Always provide Dialog/Sheet/AlertDialog titles and descriptions; include an AlertDialogCancel so Radix initially focuses the safe action. Radix owns containment, dismissal and restoration. Toast defaults to background/polite announcements and supplements persistent inline feedback. ErrorPanel is assertive; use it for errors requiring attention, not routine empty states. Badge severity is supplied by callers and never maps domain states internally.

Table preserves native semantics inside a labeled focusable scroll region. A narrowly documented lint exception permits that region's tab stop for cross-browser keyboard scrolling; other accessibility rules remain enabled. Apps own column definitions, density/composition, sort/filter state and data requests. Pagination accepts controlled current/total page numbers and a callback, with no page-size policy or fetching. Feature navigation trees and privileged capabilities remain app/API concerns.

## Tests and examples

From the repository root:

```powershell
pnpm.cmd build:packages
pnpm.cmd test:ui
pnpm.cmd --filter @commercehub/ui exec playwright install chromium
pnpm.cmd test:ui:browser
pnpm.cmd --filter @commercehub/ui dev:fixture
```

The loopback-only Vite fixture under `test/browser` renders two synthetic retail/admin compositions, never production routes. Existing Next.js placeholders keep their content and consume the shared CSS; they do not acquire feature workflows. The fixture is excluded from the package's shipped files and runtime build. Browser output/screenshots/traces go under ignored `.verification/ui-browser-results`. CI installs its own pinned Chromium and runs browser tests unconditionally after the existing suites.

React Testing Library/Vitest checks behavior, node:test checks token/boundary contracts, and Playwright/axe checks real styles, focus, overlays, scrolling, responsive layouts and per-state central overrides. Human screen-reader, browser-native zoom and device coverage require separate recorded review; automated axe success does not certify WCAG conformance. See [implementation evidence](../../docs/verification/CH-10-T.md).

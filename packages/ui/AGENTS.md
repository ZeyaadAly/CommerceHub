# Shared UI instructions

Extend [root instructions](../../AGENTS.md). Sources: [UX §§6–9/13/16](../../docs/03-ux-specification.md), [architecture §13](../../docs/04-architecture.md).

- Own reusable accessible primitives, semantic tokens and presentation states. Keep app workflows/composites in their applications; do not implement pricing, stock, payment, authentication or permission decisions here.
- Use approved Tailwind/shadcn/ui/Radix patterns with consistent variants and storefront/admin density. Proposed color pairs and dimensions require contrast/visual review; they are not automatically validated tokens.
- Provide typed props, controlled behavior where appropriate, stable semantic markup and visible focus. Forms need labels, associated helper/errors and understandable disabled/loading states. Dialogs/menus support keyboard, focus trap/restoration, reduced motion and viewport-safe scrolling.
- Support responsive layouts and appropriate touch targets without unintended page overflow. Use status text alongside color; include loading, empty, error and success primitives. Avoid embedding app-specific fetches into components.
- Keep browser entrypoints safe: no API app/Prisma/server secrets, global customer caches or hidden module queries. Reuse safe public types only where needed; no circular package imports or importing apps back into this package.
- Validate changed behavior with relevant component/interaction and accessibility tests, responsive examples and manual keyboard/focus/contrast review. Do not add a component test that merely repeats trivial implementation. Report checks actually run; UI snapshots alone do not establish backend behavior.

This directory contains instructions only until separately authorized tooling/UI work. BA-23 wireframe/token/contrast readiness remains open; no design-system implementation is created by this file.

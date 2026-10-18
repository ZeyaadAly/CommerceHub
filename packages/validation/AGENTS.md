# Shared validation instructions

Extend [root instructions](../../AGENTS.md). Sources: [API §§2–4/12–13](../../docs/06-api-design.md), [architecture §§3/5](../../docs/04-architecture.md).

- Own safe Zod wire schemas for requests/responses, approved scalar formats, errors and enums. Align schema-inferred types, API DTO adapters/OpenAPI and API-client consumers; avoid competing definitions.
- Keep schemas transport-safe and browser-safe: no NestJS decorators, Prisma imports, DB lookups, secrets, credentials in examples or runtime coupling to apps. Prevent circular imports with types/client/UI packages.
- Use strict allowlisted write fields, documented length/quantity/query bounds and explicit nullable/optional semantics. Validate decimal money strings rather than coercing to floating-point amounts. FIN-01 must settle scales/ranges before freezing monetary validation.
- Client schemas assist UX; backend independently validates and authorizes every request. Schema parsing alone cannot prove ownership, permissions, live availability, tax legality or provider authenticity.
- Distinguish inbound DTOs, public responses and backend domain commands. Sensitive registration/recovery errors must preserve non-enumeration. Provide safe field/code errors without leaking database or provider details.
- Respect versioned contracts: a stricter bound, new required field or changed enum/meaning can be breaking. Coordinate API/OpenAPI, public types, client and both app consumers, with explicit reviewed migration notes.
- Stop affected definitions on BA-03/04/08/11–15 contract gaps; do not invent fields, routes or policies as validation defaults.
- When implemented, run schema boundary/negative tests and consumer/OpenAPI drift checks, including unknown privileged fields, malformed decimals, optional/null distinctions and invalid pagination. Record actual results; no dependencies or schemas are created in this documentation task.

# Shared types instructions

Extend [root instructions](../../AGENTS.md). Sources: [architecture §§3/5/13](../../docs/04-architecture.md), [API §§2–3/9–10](../../docs/06-api-design.md).

- Own published public wire/domain view types, safe DTO projections and approved stable enums. Keep staff/customer/public projections explicit; never expose credentials, token digests, unrestricted PII or provider secrets.
- No runtime dependency on NestJS modules, Prisma models/clients, database schema internals or application services. Prefer type-only imports/exports for compile-time contracts; runtime schemas belong in validation.
- Keep declared types aligned with canonical wire schemas and OpenAPI; infer or generate where the approved tooling supports it rather than maintaining contradictory copies. Do not choose a generator or install tooling in this documentation story.
- Money stays a decimal string plus currency; timestamps are API ISO instants, not native persistence values. Do not define financial computations, stock transitions or authorization here.
- Enum/state/permission disagreements BA-03/04 must be resolved through reviewed mappings before freezing types. Do not union incompatible spellings merely to hide a contract conflict.
- Additive fields/enums are compatible only if consumers safely tolerate them. Breaking required fields/status meanings/serialization require reviewed API/version migration and affected client updates.
- Keep dependencies acyclic and independent of consuming apps. Verify strict typecheck and consumer/contract compatibility when tooling exists; report absent scripts as NOT RUN.

Guidance-only directory; no public type implementation or contract approval is claimed.

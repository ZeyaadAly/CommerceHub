# Shared wire validation

Canonical runtime owner: `@commercehub/validation`, pinned Zod 4.6.7 (already resolved in the repository lockfile). [Official Zod requirements](https://zod.dev/) support strict TypeScript 5.5+; repository TypeScript remains 5.9.3. [Schema reference](https://zod.dev/api) documents UUIDs, UTC datetime validation, object projection and inferred types.

- `uuidSchema`, `isoInstantSchema`: API design §§1.1/2.2 UUID and UTC ISO instant strings. No native Date transport or automatic timezone conversion.
- `apiMetaSchema`, `apiErrorSchema`: API §§2.2/12 wire shapes. Error code remains an open string; no example code/status table becomes a business enum. Remote message strings are not inherently safe for display.
- `createResponseSchema(data)`, `createCollectionSchema(item, bounds)`: single/collection envelopes. Nested data must have an explicit safe public projection. Unknown envelope fields are stripped; endpoint write schemas must reject unknown fields.
- `createPaginationSchemas({maxPageSize,maxCursorLength})`: strict request fields `pageSize?`, `cursor?`; result `{nextCursor,hasMore,pageSize}`. Positive integer numbers or canonical decimal query strings; no empty/null/boolean/exponent coercion. No default limit, opaque cursor interpretation or signing. Endpoint bounds remain caller-provided until approved.
- `createQueryTextSchema(maxLength)`: NFC/trim, length and control-character checks. This is transport validation, not HTML sanitization or SQL escaping.
- `createSortSchema(values)`: explicit endpoint-supplied allowed sort values; no global sort convention.
- `noContentSchema`: validates an explicit 204/undefined result.
- `validate(schema,input)`: discriminated success/data or fixed `INVALID_INPUT`, without raw inputs/custom diagnostic messages. Direct schema.parse errors are Zod diagnostics; never log them on untrusted/sensitive inputs.

Named inferred types are exported and re-exported from `@commercehub/types`. Validation has no dependency on types/client/apps. Backend validation/ownership/authorization remains mandatory. No money, session, role, permission, inventory, payment or product policy is implemented. OpenAPI endpoint generation and drift proof await actual endpoint contracts/API milestone.

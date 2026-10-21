# Shared wire types

Type-only entrypoint `@commercehub/types`: `HealthResponse`, `Uuid`, `IsoInstant`, `ApiMeta`, `ApiError`, `ApiResponse<T>`, `CollectionResponse<T>`, `PaginationRequest`, `PaginationResult`, `QueryText` re-export canonical schema-inferred types from validation. Use `import type`. No duplicate wire interfaces or runtime exports.

`WithId<T, TId>`, `WithTimestamps<T>` provide status-independent DTO composition; `SortValue<T>` preserves an endpoint's reviewed string-literal sort union. `Parser<T>` is the structural synchronous parsing contract accepted by the client. `Query`/`QueryValue` describe scalar query transport; array conventions are deliberately absent.

Dependency: types → validation (type-only, erased JavaScript). These are wire types, not persistence models or branded proof that untrusted strings have been validated. Use canonical schemas at runtime. No money/state/permission enums are frozen here.

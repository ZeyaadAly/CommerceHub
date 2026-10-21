# Shared HTTP client

Framework-independent entrypoints: `@commercehub/api-client`, `/browser`, `/server`. Each exposes `createApiClient`, `ApiClientError`, `serializeQuery` and the same type-only options. They share one secret-free implementation. Server entrypoint is request-scoped transport, not permission to forward incoming cookies/headers. No environment reads, global client, session store or token refresh.

```ts
import { createApiClient } from '@commercehub/api-client/browser';
import { createResponseSchema, uuidSchema } from '@commercehub/validation';

const api = createApiClient({
  baseUrl: 'https://api.example.test/api/v1/', // explicit approved origin/prefix
  credentials: 'omit', // example only; auth transport remains SEC-01 gated
  timeoutMs: 2000, // example caller-selected technical deadline
  maxResponseBytes: 4096, // example caller-selected transport budget
});
// No request occurs at construction/import time.
const responseSchema = createResponseSchema(uuidSchema);
// Call api.request('reviewed/resource', { responseSchema }) only at an authorized use site.
```

`request(path,options)` returns the response schema's inferred output. `method` defaults GET. Optional scalar `query`, request-scoped `headers`, and `signal`; a JSON `body` requires `requestSchema`, and GET/HEAD bodies are rejected. Response schema is mandatory; use `noContentSchema` for 204. No implicit envelope unwrapping. `serializeQuery` uses URLSearchParams, omits null/undefined and rejects nonfinite/compound values; arrays need a later approved convention.

Configuration requires an HTTPS base URL ending in `/` (HTTP only for explicit loopback development), credentials mode, positive finite timeout and response byte budget. Credentials in URLs/query/hash are rejected. Relative ASCII resource paths exclude traversal, encoded separators, query/hash and absolute URLs; use query serialization for values. This bounded path grammar covers current static/UUID resource segments, not future arbitrary slug formats. Redirects fail, private cache mode is no-store. Explicit credentials modes do not establish approved CORS, cookie or CSRF policy.

Each operation has one attempt; timeout and AbortSignal cover fetch and body reading, with reader/listener/timer cleanup. Response JSON must have a JSON media type, valid UTF-8, valid JSON, fit the byte budget and satisfy its schema. No raw unvalidated generic response cast. `ApiClientError` retains only fixed kind/message and HTTP status where available: configuration, validation, network, http, invalid-response, aborted or timeout. Server bodies/messages/codes/headers and exception causes are deliberately not copied. Cancellation/network errors do not prove business failure; reconcile later through approved status contracts before retrying mutations. No retries or refresh calls occur for any method.

Authorization/Cookie/Proxy-Authorization/Host forwarding is rejected. Reviewed CSRF headers can be passed per request, but negotiation is not implemented. Do not pass secrets as other custom headers or query values. Only the approved configured API prefix receives requests. Native fetch enforces browser CORS; the library cannot grant backend permissions or protect against a caller that supplies a malicious custom fetch/parser. No credentials, database imports, React/Next imports, logs, money calculations or browser storage.

Dependency is api-client → types (erased); types → validation (erased); validation → Zod. Existing ESM builds are retained. `import` and `require` exports use the same synchronous ESM output; the pinned Node 24 runtime supports require(ESM), tested with the CommonJS API runtime. Older Node versions are not claimed. Apps declare workspace dependencies; actual config compilation tests verify both Next.js consumers and safe NestJS-facing types without implementing app features.

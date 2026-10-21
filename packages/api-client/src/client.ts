import type { Parser, Query } from '@commercehub/types';

export type ClientErrorKind =
  'configuration' | 'validation' | 'http' | 'network' | 'invalid-response' | 'aborted' | 'timeout';

/** Safe transport classification, never evidence of a business operation's outcome. */
export class ApiClientError extends Error {
  constructor(
    public readonly kind: ClientErrorKind,
    public readonly status?: number,
  ) {
    super(`API request failed: ${kind}`);
    this.name = 'ApiClientError';
  }
}

export interface ClientOptions {
  /** Explicit approved API prefix, e.g. https://api.example.test/api/v1/. */
  baseUrl: string;
  credentials: RequestCredentials;
  timeoutMs: number;
  maxResponseBytes: number;
  fetch?: typeof globalThis.fetch;
}

export type RequestOptions<TInput, TOutput> = {
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  responseSchema: Parser<TOutput>;
  query?: Query;
  headers?: HeadersInit;
  signal?: AbortSignal;
} & ({ body?: never; requestSchema?: never } | { body: TInput; requestSchema: Parser<TInput> });

export function serializeQuery(query: Query): string {
  const result = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (
      !['string', 'number', 'boolean'].includes(typeof value) ||
      (typeof value === 'number' && !Number.isFinite(value))
    ) {
      throw new ApiClientError('validation');
    }
    result.set(key, String(value));
  }
  return result.toString();
}

function parse<T>(schema: Parser<T>, value: unknown, kind: 'validation' | 'invalid-response'): T {
  try {
    return schema.parse(value);
  } catch {
    throw new ApiClientError(kind);
  }
}

async function readJson(
  response: Response,
  maxBytes: number,
  signal: AbortSignal,
): Promise<unknown> {
  const mediaType = response.headers.get('content-type')?.split(';')[0]?.trim();
  if (
    !mediaType ||
    !/^application\/(?:[a-z0-9!#$&^_.+-]+\+)?json$/i.test(mediaType) ||
    !response.body
  ) {
    if (response.body) response.body.cancel().catch(() => undefined);
    throw new ApiClientError('invalid-response');
  }
  const reader = response.body.getReader();
  const onAbort = () => {
    void reader.cancel().catch(() => undefined);
  };
  signal.addEventListener('abort', onAbort, { once: true });
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > maxBytes) throw new ApiClientError('invalid-response');
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
    const value: unknown = JSON.parse(text);
    return value;
  } catch {
    void reader.cancel().catch(() => undefined);
    throw new ApiClientError('invalid-response');
  } finally {
    signal.removeEventListener('abort', onAbort);
    reader.releaseLock();
  }
}

export function createApiClient(options: ClientOptions) {
  let base: URL;
  try {
    base = new URL(options.baseUrl);
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
    if (
      (base.protocol !== 'https:' && !(base.protocol === 'http:' && loopback)) ||
      base.username ||
      base.password ||
      base.search ||
      base.hash ||
      !base.pathname.endsWith('/') ||
      !['omit', 'same-origin', 'include'].includes(options.credentials) ||
      !Number.isSafeInteger(options.timeoutMs) ||
      options.timeoutMs < 1 ||
      options.timeoutMs > 2_147_483_647 ||
      !Number.isSafeInteger(options.maxResponseBytes) ||
      options.maxResponseBytes < 1
    ) {
      throw new Error();
    }
  } catch {
    throw new ApiClientError('configuration');
  }
  // Snapshot configuration: no shared mutable defaults, cookies, tokens or caches.
  const { credentials, timeoutMs, maxResponseBytes } = options;
  const transport = options.fetch ?? globalThis.fetch;
  const baseHref = base.href;

  return {
    async request<TInput = never, TOutput = unknown>(
      path: string,
      request: RequestOptions<TInput, TOutput>,
    ): Promise<TOutput> {
      // Paths are relative static/resource segments; query values use URLSearchParams.
      if (!/^[a-z0-9_-]+(?:\/[a-z0-9_-]+)*$/i.test(path)) throw new ApiClientError('configuration');
      const url = new URL(path, baseHref);
      if (request.query) url.search = serializeQuery(request.query);
      const method = request.method ?? 'GET';
      if (!['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method))
        throw new ApiClientError('configuration');
      let body: string | undefined;
      let headers: Headers;
      try {
        headers = new Headers(request.headers);
        // Session origin/CSRF policy is not implemented here. Servers must use a
        // separately reviewed request-scoped adapter before forwarding any secret.
        for (const name of ['authorization', 'cookie', 'proxy-authorization', 'host']) {
          if (headers.has(name)) throw new Error();
        }
        headers.set('Accept', 'application/json');
        if (request.requestSchema) {
          if (method === 'GET' || method === 'HEAD') throw new Error();
          body = JSON.stringify(parse(request.requestSchema, request.body, 'validation'));
          if (body === undefined) throw new Error();
          headers.set('Content-Type', 'application/json');
        } else if (request.body !== undefined) throw new Error();
      } catch {
        throw new ApiClientError('validation');
      }
      if (request.signal?.aborted) throw new ApiClientError('aborted');
      const controller = new AbortController();
      let rejectCancellation: (error: ApiClientError) => void = () => undefined;
      const cancelled = new Promise<never>((_, reject) => {
        rejectCancellation = reject;
      });
      const abort = (kind: 'aborted' | 'timeout') => {
        rejectCancellation(new ApiClientError(kind));
        controller.abort();
      };
      const onAbort = () => abort('aborted');
      request.signal?.addEventListener('abort', onAbort, { once: true });
      const timer = setTimeout(() => abort('timeout'), timeoutMs);
      const perform = async () => {
        let response: Response;
        try {
          response = await transport(url, {
            method,
            headers,
            credentials,
            signal: controller.signal,
            redirect: 'error',
            cache: 'no-store',
            ...(body === undefined ? {} : { body }),
          });
        } catch {
          throw new ApiClientError('network');
        }
        if (controller.signal.aborted) {
          if (response.body) response.body.cancel().catch(() => undefined);
          throw new ApiClientError('aborted');
        }
        if (!response.ok) {
          if (response.body) response.body.cancel().catch(() => undefined);
          // Never retain raw server messages, headers, URLs, error bodies or causes.
          throw new ApiClientError('http', response.status);
        }
        const data =
          response.status === 204
            ? undefined
            : await readJson(response, maxResponseBytes, controller.signal);
        return parse(request.responseSchema, data, 'invalid-response');
      };
      try {
        return await Promise.race([perform(), cancelled]);
      } finally {
        clearTimeout(timer);
        request.signal?.removeEventListener('abort', onAbort);
      }
    },
  };
}

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';
import * as validation from '../packages/validation/dist/index.js';
import * as client from '../packages/api-client/dist/index.js';

const root = path.resolve(import.meta.dirname, '..');
const uuid = '11111111-1111-4111-8111-111111111111';
const secret = 'synthetic-sensitive-marker';
const envelope = { data: uuid, meta: { requestId: 'request_fixture' } };
const responseSchema = validation.createResponseSchema(validation.uuidSchema);
const defaults = {
  baseUrl: 'https://api.example.test/api/v1/',
  credentials: 'omit',
  timeoutMs: 1000,
  maxResponseBytes: 4096,
};
const make = (fetch, extra = {}) => client.createApiClient({ ...defaults, fetch, ...extra });
const json = (value = envelope, init) => Response.json(value, init);
const request = { responseSchema };

test('pinned Node CommonJS API runtime can load the ESM schemas without a second build', () => {
  const require = createRequire(path.join(root, 'apps/api/package.json'));
  const schemas = require('@commercehub/validation');
  assert.equal(schemas.uuidSchema.parse(uuid), uuid);
});

test('shared sources have no server-only framework/secret/storage imports or environment reads', () => {
  for (const name of ['types', 'validation', 'api-client']) {
    const dir = path.join(root, `packages/${name}/src`);
    for (const file of readdirSync(dir).filter((value) => value.endsWith('.ts'))) {
      const text = readFileSync(path.join(dir, file), 'utf8');
      const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
      function inspect(node) {
        if (
          (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
          node.moduleSpecifier
        ) {
          assert.doesNotMatch(
            node.moduleSpecifier.text,
            /^(node:|react(?:\/|$)|next(?:\/|$)|server-only|@nestjs\/|@prisma\/|@supabase\/|pg$)|apps\//,
          );
        }
        ts.forEachChild(node, inspect);
      }
      inspect(source);
      assert.doesNotMatch(text, /process\.env|localStorage|sessionStorage|console\./);
    }
  }
});
function error(kind, status) {
  return (value) => {
    assert.ok(value instanceof client.ApiClientError);
    assert.equal(value.kind, kind);
    assert.equal(value.status, status);
    assert.ok(!JSON.stringify(value).includes(secret));
    assert.ok(!String(value).includes(secret));
    assert.equal(value.cause, undefined);
    return true;
  };
}

test('public exports are intentional; types are erased; imports are inert', async () => {
  assert.deepEqual(Object.keys(client).sort(), [
    'ApiClientError',
    'createApiClient',
    'serializeQuery',
  ]);
  assert.deepEqual(
    Object.keys(validation).sort(),
    [
      'apiErrorSchema',
      'apiMetaSchema',
      'createCollectionSchema',
      'createPaginationSchemas',
      'createQueryTextSchema',
      'createResponseSchema',
      'createSortSchema',
      'healthResponseSchema',
      'isoInstantSchema',
      'noContentSchema',
      'uuidSchema',
      'validate',
    ].sort(),
  );
  assert.deepEqual(Object.keys(await import('../packages/types/dist/index.js')), []);
  assert.doesNotMatch(
    readFileSync(path.join(root, 'packages/types/dist/index.js'), 'utf8'),
    /import |require\(/,
  );
  for (const entry of ['browser', 'server']) {
    const manifest = JSON.parse(
      readFileSync(path.join(root, 'packages/api-client/package.json'), 'utf8'),
    );
    const module = await import(
      new URL(`../packages/api-client/${manifest.exports[`./${entry}`].import}`, import.meta.url)
    );
    assert.equal(module.createApiClient, client.createApiClient);
  }
});

test('approved UUID and UTC instant transports reject malformed/non-UTC/native values', () => {
  assert.equal(validation.uuidSchema.parse(uuid), uuid);
  for (const value of ['', 'not-uuid', 1, null])
    assert.equal(validation.uuidSchema.safeParse(value).success, false);
  for (const value of ['2026-10-21T08:00:00Z', '2026-10-21T08:00:00.123Z'])
    assert.equal(validation.isoInstantSchema.parse(value), value);
  for (const value of [
    '2026-02-30T08:00:00Z',
    '2026-10-21',
    '2026-10-21T08:00:00+02:00',
    new Date(),
  ]) {
    assert.equal(validation.isoInstantSchema.safeParse(value).success, false);
  }
});

test('pagination uses caller-specified bounds, no guessed defaults, rejects ambiguous coercions and unknown fields', () => {
  const schemas = validation.createPaginationSchemas({ maxPageSize: 3, maxCursorLength: 8 });
  assert.deepEqual(schemas.request.parse({}), {});
  assert.deepEqual(schemas.request.parse({ pageSize: '3', cursor: 'opaque' }), {
    pageSize: 3,
    cursor: 'opaque',
  });
  for (const pageSize of [
    0,
    -1,
    4,
    1.5,
    '',
    ' ',
    '01',
    '1e0',
    '0x1',
    'Infinity',
    true,
    null,
    ['1'],
  ]) {
    assert.equal(schemas.request.safeParse({ pageSize }).success, false, String(pageSize));
  }
  for (const value of [{ privileged: true }, { cursor: '' }, { cursor: '123456789' }])
    assert.equal(schemas.request.safeParse(value).success, false);
  assert.equal(
    schemas.page.safeParse({ nextCursor: null, hasMore: false, pageSize: 3 }).success,
    true,
  );
  assert.equal(schemas.page.safeParse({ hasMore: false, pageSize: 3 }).success, false);
  assert.throws(() => validation.createPaginationSchemas({ maxPageSize: 0, maxCursorLength: 8 }));
});

test('query text normalization, control rejection and endpoint-provided sort allowlists', () => {
  const schema = validation.createQueryTextSchema(3);
  assert.equal(schema.parse(' e\u0301 '), 'é');
  for (const value of ['abcd', 'a\u0000b', 'a\nb', 1, null])
    assert.equal(schema.safeParse(value).success, false);
  const sort = validation.createSortSchema(['newest', 'name']);
  assert.equal(sort.parse('newest'), 'newest');
  assert.equal(sort.safeParse('price').success, false);
});

test('canonical envelopes strip unapproved response fields and validate nested data', () => {
  assert.deepEqual(responseSchema.parse({ ...envelope, internal: secret }), envelope);
  assert.equal(responseSchema.safeParse({ data: secret }).success, false);
  const collection = validation.createCollectionSchema(validation.uuidSchema, {
    maxPageSize: 3,
    maxCursorLength: 8,
  });
  assert.equal(
    collection.safeParse({
      data: [uuid],
      page: { nextCursor: null, hasMore: false, pageSize: 1 },
      meta: envelope.meta,
    }).success,
    true,
  );
  assert.equal(
    collection.safeParse({
      data: [secret],
      page: { nextCursor: null, hasMore: false, pageSize: 1 },
      meta: envelope.meta,
    }).success,
    false,
  );
  assert.equal(
    validation.apiErrorSchema.safeParse({
      error: {
        code: 'EXAMPLE',
        message: 'Safe fixture',
        retryable: false,
        details: [{ field: 'id', code: 'INVALID' }],
      },
      meta: envelope.meta,
    }).success,
    true,
  );
});

test('validation helper retains no submitted values or custom diagnostic messages', () => {
  assert.deepEqual(validation.validate(validation.uuidSchema, uuid), { success: true, data: uuid });
  assert.deepEqual(
    validation.validate(
      {
        parse() {
          throw new Error(secret);
        },
      },
      secret,
    ),
    { success: false, error: 'INVALID_INPUT' },
  );
});

test('query serialization encodes scalars without interpreting URLs or inventing array conventions', () => {
  assert.equal(
    client.serializeQuery({
      q: 'a & مصر',
      pageSize: 2,
      active: false,
      omitted: undefined,
      nil: null,
    }),
    'q=a+%26+%D9%85%D8%B5%D8%B1&pageSize=2&active=false',
  );
  for (const value of [Infinity, NaN, [], {}])
    assert.throws(() => client.serializeQuery({ value }), error('validation'));
});

test('success uses the configured prefix and strict response projection', async () => {
  let calls = 0;
  const api = make(async (url, init) => {
    calls++;
    assert.equal(String(url), 'https://api.example.test/api/v1/catalog/items?q=a+b');
    assert.equal(init.redirect, 'error');
    assert.equal(init.cache, 'no-store');
    assert.equal(init.headers.get('accept'), 'application/json');
    return json({ ...envelope, privateField: secret });
  });
  assert.deepEqual(
    await api.request('catalog/items', { ...request, query: { q: 'a b' } }),
    envelope,
  );
  assert.equal(calls, 1);
});

test('204 requires a schema accepting no content', async () => {
  const api = make(async () => new Response(null, { status: 204 }));
  assert.equal(
    await api.request('items', { responseSchema: validation.noContentSchema }),
    undefined,
  );
  await assert.rejects(api.request('items', request), error('invalid-response'));
});

for (const [name, response] of [
  ['non-JSON', () => new Response(secret)],
  [
    'malformed JSON',
    () => new Response(`{${secret}`, { headers: { 'content-type': 'application/json' } }),
  ],
  ['empty JSON', () => new Response('', { headers: { 'content-type': 'application/json' } })],
  ['wrong schema', () => json({ data: secret })],
  [
    'invalid UTF-8',
    () => new Response(new Uint8Array([0xff]), { headers: { 'content-type': 'application/json' } }),
  ],
  ['oversize JSON', () => json({ data: secret.repeat(500) })],
])
  test(`safe rejection: ${name}`, async () => {
    await assert.rejects(
      make(async () => response()).request('items', request),
      error('invalid-response'),
    );
  });

for (const status of [400, 401, 403, 404, 409, 422, 429, 500, 503]) {
  test(`HTTP ${status} is normalized without remote body/header disclosure`, async () => {
    await assert.rejects(
      make(
        async () => new Response(secret, { status, headers: { 'X-Request-ID': secret } }),
      ).request('items', request),
      error('http', status),
    );
  });
}

test('network exceptions are sanitized and never retried', async () => {
  let calls = 0;
  await assert.rejects(
    make(async () => {
      calls++;
      throw new Error(secret);
    }).request('items', request),
    error('network'),
  );
  assert.equal(calls, 1);
});

for (const method of ['POST', 'PATCH', 'DELETE'])
  test(`${method} validates input and never retries or refreshes`, async () => {
    let calls = 0;
    const api = make(async (_, init) => {
      calls++;
      assert.equal(init.method, method);
      assert.equal(init.body, JSON.stringify({ pageSize: 2 }));
      assert.equal(init.headers.get('content-type'), 'application/json');
      return json({}, { status: 503 });
    });
    const requestSchema = validation.createPaginationSchemas({
      maxPageSize: 3,
      maxCursorLength: 8,
    }).request;
    await assert.rejects(
      api.request('items', { ...request, method, body: { pageSize: 2 }, requestSchema }),
      error('http', 503),
    );
    assert.equal(calls, 1);
    await assert.rejects(
      api.request('items', { ...request, method, body: { pageSize: 4 }, requestSchema }),
      error('validation'),
    );
    assert.equal(calls, 1);
  });

test('pre-cancelled requests perform zero network calls and expose no abort reason', async () => {
  let calls = 0;
  await assert.rejects(
    make(async () => {
      calls++;
      return json();
    }).request('items', { ...request, signal: AbortSignal.abort(secret) }),
    error('aborted'),
  );
  assert.equal(calls, 0);
});

test('in-flight cancellation terminates even a non-cooperative fetch', async () => {
  const controller = new AbortController();
  let signal;
  const api = make((_, init) => {
    signal = init.signal;
    return new Promise(() => {});
  });
  const pending = api.request('items', { ...request, signal: controller.signal });
  controller.abort(secret);
  await assert.rejects(pending, error('aborted'));
  assert.equal(signal.aborted, true);
});

test('timeout is finite even when fetch ignores its signal', async () => {
  await assert.rejects(
    make(() => new Promise(() => {}), { timeoutMs: 15 }).request('items', request),
    error('timeout'),
  );
});

test('timeout covers stalled response bodies and cancels the reader', async () => {
  let cancelled = false;
  const body = new ReadableStream({
    cancel() {
      cancelled = true;
    },
  });
  await assert.rejects(
    make(async () => new Response(body, { headers: { 'content-type': 'application/json' } }), {
      timeoutMs: 15,
    }).request('items', request),
    error('timeout'),
  );
  assert.equal(cancelled, true);
});

test('credentials are explicit, instance-isolated snapshots; headers never become global state', async () => {
  for (const credentials of ['omit', 'same-origin', 'include']) {
    const config = {
      ...defaults,
      credentials,
      fetch: async (_, init) => {
        assert.equal(init.credentials, credentials);
        assert.equal(init.headers.get('X-Fixture'), 'one');
        return json();
      },
    };
    const api = client.createApiClient(config);
    config.credentials = 'other';
    await api.request('items', { ...request, headers: { 'X-Fixture': 'one' } });
  }
});

test('origin/path/header/configuration denial occurs before fetch', async () => {
  let calls = 0;
  const fetch = async () => {
    calls++;
    return json();
  };
  for (const baseUrl of [
    'https://user:password@example.test/api/v1/',
    'http://example.test/api/v1/',
    'https://api.example.test/api/v1/?x=1',
    'https://api.example.test/api/v1',
  ]) {
    assert.throws(() => make(fetch, { baseUrl }), error('configuration'));
  }
  for (const extra of [
    { timeoutMs: 0 },
    { timeoutMs: Infinity },
    { maxResponseBytes: 0 },
    { credentials: undefined },
  ])
    assert.throws(() => make(fetch, extra), error('configuration'));
  const api = make(fetch);
  for (const path of [
    '//evil.test',
    'https://evil.test',
    '../items',
    '%2e%2e/items',
    'items?secret=x',
    'items#x',
    'items\\evil',
  ])
    await assert.rejects(api.request(path, request), error('configuration'));
  for (const name of ['Cookie', 'Authorization', 'Host', 'Proxy-Authorization'])
    await assert.rejects(
      api.request('items', { ...request, headers: { [name]: secret } }),
      error('validation'),
    );
  await assert.rejects(
    api.request('items', { ...request, body: {}, requestSchema: { parse: (value) => value } }),
    error('validation'),
  );
  assert.equal(calls, 0);
});

for (const app of ['storefront', 'admin', 'api'])
  test(`${app} compiles actual package imports and rejects invalid contracts`, () => {
    const filename = path.join(
      root,
      `apps/${app}/${app === 'api' ? 'src/' : ''}contracts-fixture.ts`,
    );
    const content = `import type { ApiResponse, Uuid, WithId } from '@commercehub/types';
import { uuidSchema, createResponseSchema } from '@commercehub/validation';
const schema = createResponseSchema(uuidSchema);
const value: ApiResponse<Uuid> = schema.parse({});
const identified: WithId<{name:string}> = {name:'fixture',id:value.data};
// @ts-expect-error UUID transport is a string
const invalid: Uuid = 1;
// @ts-expect-error response metadata is required
const missing: ApiResponse<Uuid> = {data:'id'};
export {identified};
${
  app === 'api'
    ? ''
    : `import { createApiClient } from '@commercehub/api-client/browser';
const client = createApiClient({baseUrl:'https://api.example.test/api/v1/',credentials:'omit',timeoutMs:100,maxResponseBytes:1024});
const output: Promise<ApiResponse<Uuid>> = client.request('items',{responseSchema:schema});
// @ts-expect-error response schema is required
client.request('items',{});
// @ts-expect-error body requires a request schema
client.request('items',{method:'POST',body:{},responseSchema:schema});
export {output};`
}`;
    const config = ts.getParsedCommandLineOfConfigFile(
      path.join(root, `apps/${app}/tsconfig.json`),
      {},
      { ...ts.sys, onUnRecoverableConfigFileDiagnostic: assert.fail },
    );
    const host = ts.createCompilerHost(config.options);
    const original = host.getSourceFile;
    host.getSourceFile = (file, language, ...args) =>
      path.resolve(file) === filename
        ? ts.createSourceFile(file, content, language)
        : original.call(host, file, language, ...args);
    const program = ts.createProgram(
      [filename],
      { ...config.options, noEmit: true, incremental: false },
      host,
    );
    assert.deepEqual(
      ts
        .getPreEmitDiagnostics(program)
        .map((item) => ts.flattenDiagnosticMessageText(item.messageText, '\n')),
      [],
    );
  });

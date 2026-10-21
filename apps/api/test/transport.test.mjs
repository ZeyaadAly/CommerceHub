import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { after, before, test } from 'node:test';

const require = createRequire(import.meta.url);
const common = require('@nestjs/common');
const { Test } = require('@nestjs/testing');
const supertest = require('supertest');
const SwaggerParser = require('@apidevtools/swagger-parser');
const shared = require('@commercehub/validation');
const { AppModule } = require('../dist/app.module.js');
const { createApplication } = require('../dist/application.js');
const { configureTransport, readBodyLimit } = require('../dist/common/http/configure.js');
const { generateOpenApi } = require('../dist/common/openapi/document.js');
const { resourceResponse } = require('../dist/common/http/response.js');
const { SchemaValidationPipe } = require('../dist/common/pipes/schema-validation.pipe.js');
const uuid = '11111111-1111-4111-8111-111111111111';
const secret = 'synthetic-sensitive-marker';
const pagination = shared.createPaginationSchemas({ maxPageSize: 3, maxCursorLength: 8 }).request;
const paginationResponse = shared.createResponseSchema(pagination);
const uuidResponse = shared.createResponseSchema(shared.uuidSchema);

// Fixture routes are declared only in this test source, never imported by production.
class FixtureController {
  body(value, request) {
    return resourceResponse(value, paginationResponse, request);
  }
  query(value, request) {
    return resourceResponse(value, paginationResponse, request);
  }
  id(value, request) {
    return resourceResponse(value, uuidResponse, request);
  }
  expected() {
    throw new common.ForbiddenException({ message: secret, sql: secret });
  }
  badRequest() {
    throw new common.BadRequestException(secret);
  }
  unexpected() {
    throw new Error(secret, { cause: new Error(secret) });
  }
  unreviewedStatus() {
    throw new common.HttpException(secret, 409);
  }
  output(request) {
    return resourceResponse(secret, uuidResponse, request);
  }
  missingSchema(value) {
    return value;
  }
  noContent() {
    return undefined;
  }
}
common.Controller('__transport-test')(FixtureController);
for (const [name, method, route] of [
  ['body', 'Post', 'body'],
  ['query', 'Get', 'query'],
  ['id', 'Get', 'id/:id'],
  ['expected', 'Get', 'expected'],
  ['badRequest', 'Get', 'bad-request'],
  ['unexpected', 'Get', 'unexpected'],
  ['unreviewedStatus', 'Get', 'unreviewed-status'],
  ['output', 'Get', 'output'],
  ['missingSchema', 'Post', 'missing-schema'],
  ['noContent', 'Post', 'no-content'],
]) {
  const descriptor = Object.getOwnPropertyDescriptor(FixtureController.prototype, name);
  common[method](route)(FixtureController.prototype, name, descriptor);
  Reflect.defineMetadata('design:paramtypes', [], FixtureController.prototype, name);
}
for (const [name, decorator, options] of [
  ['body', 'Body', { schema: pagination }],
  ['query', 'Query', { schema: pagination }],
]) {
  common[decorator](options)(FixtureController.prototype, name, 0);
  common.Req()(FixtureController.prototype, name, 1);
  Reflect.defineMetadata('design:paramtypes', [Object, Object], FixtureController.prototype, name);
}
common.Param('id', { schema: shared.uuidSchema })(FixtureController.prototype, 'id', 0);
common.Req()(FixtureController.prototype, 'id', 1);
Reflect.defineMetadata('design:paramtypes', [String, Object], FixtureController.prototype, 'id');
common.Req()(FixtureController.prototype, 'output', 0);
Reflect.defineMetadata('design:paramtypes', [Object], FixtureController.prototype, 'output');
common.Body()(FixtureController.prototype, 'missingSchema', 0);
Reflect.defineMetadata('design:paramtypes', [Object], FixtureController.prototype, 'missingSchema');
common.HttpCode(204)(
  FixtureController.prototype,
  'noContent',
  Object.getOwnPropertyDescriptor(FixtureController.prototype, 'noContent'),
);
class FixtureModule {}
common.Module({ controllers: [FixtureController] })(FixtureModule);

let app;
let production;
let http;
const diagnostics = [];
before(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule, FixtureModule] }).compile();
  app = module.createNestApplication({ bodyParser: false, logger: false });
  configureTransport(app, 256, (event) => diagnostics.push(event));
  await app.listen(0, '127.0.0.1');
  http = supertest(app.getHttpServer());
  production = await createApplication({ NODE_ENV: 'production', SWAGGER_UI: 'true' });
  await production.listen(0, '127.0.0.1');
});
after(async () => {
  await app?.close();
  await production?.close();
});

function safeError(response, status, code) {
  assert.equal(response.status, status);
  assert.equal(response.body.error.code, code);
  assert.equal(response.body.error.retryable, false);
  assert.equal(shared.apiErrorSchema.safeParse(response.body).success, true);
  assert.match(response.body.meta.requestId, /^[0-9a-f-]{36}$/);
  assert.equal(response.headers['x-request-id'], response.body.meta.requestId);
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.ok(!JSON.stringify(response.body).includes(secret));
  assert.equal(response.body.stack, undefined);
}

test('health compatibility remains unversioned, exact and dependency-free', async () => {
  const response = await http.get('/health').expect(200);
  assert.deepEqual(response.body, { status: 'ok' });
  assert.deepEqual(shared.healthResponseSchema.parse(response.body), response.body);
  await http
    .head('/health')
    .expect(200)
    .expect((response) => assert.equal(response.text, undefined));
  safeError(await http.post('/health'), 404, 'RESOURCE_NOT_FOUND');
});

test('URI v1 routes work; absent/unimplemented versions and health aliases fail safely', async () => {
  const response = await http.get(`/api/v1/__transport-test/id/${uuid}`).expect(200);
  assert.equal(uuidResponse.safeParse(response.body).success, true);
  for (const route of [
    '/__transport-test/query',
    '/api/__transport-test/query',
    '/api/v2/__transport-test/query',
    '/api/v1/health',
    '/api/health',
  ]) {
    safeError(await http.get(route), 404, 'RESOURCE_NOT_FOUND');
  }
});

test('body and query schemas return only validated canonical projections', async () => {
  for (const response of [
    await http.post('/api/v1/__transport-test/body').send({ pageSize: 2, cursor: 'opaque' }),
    await http.get('/api/v1/__transport-test/query?pageSize=2&cursor=opaque'),
  ]) {
    assert.ok([200, 201].includes(response.status));
    assert.deepEqual(response.body.data, { pageSize: 2, cursor: 'opaque' });
    assert.equal(response.headers['x-request-id'], response.body.meta.requestId);
  }
});

for (const body of [
  { pageSize: 0 },
  { pageSize: 4 },
  { pageSize: true },
  { pageSize: '' },
  { pageSize: [] },
  { pageSize: '1e0' },
  { [secret]: secret },
]) {
  test(`invalid/unknown body fields fail without raw values: ${JSON.stringify(body)}`, async () => {
    const response = await http.post('/api/v1/__transport-test/body').send(body);
    safeError(response, 422, 'VALIDATION_FAILED');
    assert.ok(
      response.body.error.details.every((detail) => ['pageSize', 'body'].includes(detail.field)),
    );
  });
}

test('repeated, nested, oversized and unknown query parameters are not silently coerced', async () => {
  for (const query of [
    'pageSize=1&pageSize=2',
    'pageSize[x]=1',
    'pageSize=4',
    `${secret}=${secret}`,
    `cursor=${secret}`,
  ]) {
    const response = await http.get(`/api/v1/__transport-test/query?${query}`);
    safeError(response, 422, 'VALIDATION_FAILED');
    assert.ok(
      response.body.error.details.every((detail) =>
        ['query', 'pageSize', 'cursor'].includes(detail.field),
      ),
    );
  }
});

test('invalid path UUID gives only the known field, never the supplied value', async () => {
  const response = await http.get(`/api/v1/__transport-test/id/${secret}`);
  safeError(response, 422, 'VALIDATION_FAILED');
  assert.deepEqual(response.body.error.details, [{ field: 'id', code: 'VALIDATION_FAILED' }]);
});

test('missing request schema and invalid output are sanitized programmer failures', async () => {
  for (const response of [
    await http.post('/api/v1/__transport-test/missing-schema').send({ input: secret }),
    await http.get('/api/v1/__transport-test/output'),
  ]) {
    safeError(response, 500, 'INTERNAL_ERROR');
  }
});

test('malformed and primitive JSON is 400, arrays are schema-rejected 422', async () => {
  for (const body of [`{"value":"${secret}"`, 'true', 'null']) {
    safeError(
      await http
        .post('/api/v1/__transport-test/body')
        .set('Content-Type', 'application/json')
        .send(body),
      400,
      'MALFORMED_JSON',
    );
  }
  safeError(await http.post('/api/v1/__transport-test/body').send([]), 422, 'VALIDATION_FAILED');
});

test('oversized JSON and unsupported media/encoding stay bounded and safe', async () => {
  safeError(
    await http.post('/api/v1/__transport-test/body').send({ cursor: secret.repeat(100) }),
    413,
    'VALIDATION_FAILED',
  );
  for (const response of [
    await http
      .post('/api/v1/__transport-test/body')
      .set('Content-Type', 'application/xml')
      .send(secret),
    await http.post('/api/v1/__transport-test/body').type('form').send({ value: secret }),
    await http
      .post('/api/v1/__transport-test/body')
      .set('Content-Encoding', 'gzip')
      .send({ value: secret }),
  ])
    safeError(response, 415, 'UNSUPPORTED_MEDIA_TYPE');
});

test('expected exceptions preserve reviewed status/code while payloads and unknown mappings do not leak', async () => {
  safeError(await http.get('/api/v1/__transport-test/expected'), 403, 'PERMISSION_DENIED');
  safeError(await http.get('/api/v1/__transport-test/bad-request'), 400, 'MALFORMED_JSON');
  safeError(await http.get('/api/v1/__transport-test/unreviewed-status'), 500, 'INTERNAL_ERROR');
  safeError(await http.get('/api/v1/__transport-test/unexpected'), 500, 'INTERNAL_ERROR');
});

test('unknown paths/methods do not echo URLs or query strings', async () => {
  for (const response of [
    await http.get(`/missing/${secret}?token=${secret}`),
    await http.patch('/health'),
    await http.options('/health'),
  ]) {
    safeError(response, 404, 'RESOURCE_NOT_FOUND');
  }
});

test('204 is not wrapped into a success envelope', async () => {
  const response = await http.post('/api/v1/__transport-test/no-content').expect(204);
  assert.equal(response.text, '');
});

test('incoming IDs/credentials/PII and raw exceptions never enter public errors or diagnostics', async () => {
  const start = diagnostics.length;
  const response = await http
    .get(`/api/v1/__transport-test/unexpected?private=${secret}`)
    .set('X-Request-ID', secret)
    .set('Authorization', `Bearer ${secret}`)
    .set('Cookie', `session=${secret}`);
  safeError(response, 500, 'INTERNAL_ERROR');
  const events = diagnostics.slice(start);
  assert.equal(events.length, 1);
  assert.equal(events[0].requestId, response.body.meta.requestId);
  assert.equal(events[0].route, '/api/v1/__transport-test/unexpected');
  assert.ok(!JSON.stringify(events).includes(secret));
  assert.deepEqual(Object.keys(events[0]).sort(), [
    'durationMs',
    'event',
    'method',
    'requestId',
    'route',
    'status',
  ]);
});

test('CORS, cookies and publicly enabled documentation are absent, even in production fixtures', async () => {
  const request = supertest(production.getHttpServer());
  const health = await request
    .get('/health')
    .set('Origin', 'https://unapproved.example.test')
    .expect(200);
  for (const header of [
    'access-control-allow-origin',
    'access-control-allow-credentials',
    'set-cookie',
    'x-powered-by',
  ])
    assert.equal(health.headers[header], undefined);
  for (const route of [
    '/docs',
    '/docs-json',
    '/swagger',
    '/openapi.json',
    '/api/v1/docs',
    '/api/v1/__transport-test/query',
    '/api/v1/catalog',
    '/api/v1/auth/login',
    '/api/v1/admin',
  ])
    safeError(await request.get(route), 404, 'RESOURCE_NOT_FOUND');
});

test('technical body budget configuration is finite and errors retain field names only', async () => {
  assert.equal(readBodyLimit({}), 102400);
  assert.equal(readBodyLimit({ API_BODY_LIMIT_BYTES: '256' }), 256);
  for (const value of ['', '0', '-1', '1e3', '01', '1.5', '1048577', secret]) {
    assert.throws(
      () => readBodyLimit({ API_BODY_LIMIT_BYTES: value }),
      (error) => {
        assert.equal(error.message, 'Invalid API configuration: API_BODY_LIMIT_BYTES.');
        assert.ok(!error.message.includes(secret));
        return true;
      },
    );
  }
  await assert.rejects(
    createApplication({ API_BODY_LIMIT_BYTES: secret }),
    /Invalid API configuration: API_BODY_LIMIT_BYTES/,
  );
});

test('validation details are bounded and dynamic/custom issue paths/messages are discarded', async () => {
  const pipe = new SchemaValidationPipe();
  const schema = {
    '~standard': {
      version: 1,
      vendor: 'fixture',
      validate: () => ({ issues: [{ path: [secret], message: secret }] }),
    },
  };
  await assert.rejects(pipe.transform(secret, { type: 'body', schema }), (error) => {
    assert.deepEqual(error.details, [{ field: 'body', code: 'VALIDATION_FAILED' }]);
    return true;
  });
  const fields = Array.from({ length: 20 }, (_, index) => `field${index}`);
  const manyIssues = {
    shape: Object.fromEntries(fields.map((field) => [field, {}])),
    '~standard': {
      version: 1,
      vendor: 'fixture',
      validate: () => ({ issues: fields.map((field) => ({ path: [field], message: secret })) }),
    },
  };
  await assert.rejects(pipe.transform(secret, { type: 'body', schema: manyIssues }), (error) => {
    assert.deepEqual(
      error.details,
      fields.slice(0, 16).map((field) => ({ field, code: 'VALIDATION_FAILED' })),
    );
    assert.ok(!JSON.stringify(error.details).includes(secret));
    return true;
  });
});

test('OpenAPI is locally valid 3.1 and advertises only implemented production health', async () => {
  const document = generateOpenApi(production);
  assert.equal(document.openapi, '3.1.0');
  assert.deepEqual(JSON.parse(JSON.stringify(document.servers)), [{ url: '/api/v1' }]);
  assert.deepEqual(Object.keys(document.paths), ['/health']);
  assert.deepEqual(document.paths['/health'].servers, [{ url: '/' }]);
  assert.deepEqual(Object.keys(document.paths['/health']).sort(), ['get', 'servers']);
  assert.deepEqual(Object.keys(document.components.securitySchemes ?? {}), []);
  await SwaggerParser.validate(structuredClone(document), { resolve: { external: false } });
  const invalid = structuredClone(document);
  invalid.openapi = 'not-a-version';
  await assert.rejects(SwaggerParser.validate(invalid, { resolve: { external: false } }));
});

test('OpenAPI response schemas derive from canonical runtime contracts', async () => {
  const document = generateOpenApi(production);
  const operation = document.paths['/health'].get;
  assert.deepEqual(
    operation.responses['200'].content['application/json'].schema,
    shared.healthResponseSchema['~standard'].jsonSchema.output({ target: 'openapi-3.0' }),
  );
  assert.deepEqual(
    operation.responses.default.content['application/json'].schema,
    shared.apiErrorSchema['~standard'].jsonSchema.output({ target: 'openapi-3.0' }),
  );
  assert.equal(shared.apiErrorSchema.safeParse((await http.get('/missing')).body).success, true);
});

test('fixture documentation preserves versioned routes and actual body/query/path schemas', async () => {
  const document = generateOpenApi(app);
  assert.ok(document.paths['/__transport-test/body'].post.requestBody);
  const query = document.paths['/__transport-test/query'].get.parameters;
  assert.deepEqual(query.map((item) => item.name).sort(), ['cursor', 'pageSize']);
  assert.equal(document.paths['/__transport-test/id/{id}'].get.parameters[0].schema.format, 'uuid');
  assert.ok(!Object.keys(document.paths).some((route) => route.startsWith('/api/v1/')));
  await SwaggerParser.validate(structuredClone(document), { resolve: { external: false } });
});

test('production module source imports no fixture, database initialization or auth/commerce handler', () => {
  const root = path.resolve(import.meta.dirname, '..');
  for (const file of ['src/application.ts', 'src/app.module.ts']) {
    assert.doesNotMatch(
      readFileSync(path.join(root, file), 'utf8'),
      /test\/|Prisma|connectivity|AuthModule|CatalogModule|PaymentModule/,
    );
  }
});

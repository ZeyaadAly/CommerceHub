import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const api = fileURLToPath(new URL('../', import.meta.url));
const root = path.resolve(api, '../..');
const require = createRequire(new URL('../package.json', import.meta.url));
const { getDMMF } = require('@prisma/internals');
const { normalizeUserEmail } = require('./dist/identity/user-email.js');
const schema = readFileSync(path.join(api, 'prisma/schema.prisma'), 'utf8');
const parsed = (await getDMMF({ datamodel: schema })).datamodel;
const baseline = execFileSync(
  'git',
  ['show', 'c6b96f26d3db947619ac4d1a71b3b01e912c21ff:apps/api/prisma/schema.prisma'],
  { cwd: root, encoding: 'utf8' },
);
const expected = [
  ['id', 'id', 'String', 'Uuid', [], true, null],
  ['email', 'email', 'String', 'VarChar', ['320'], true, null],
  ['emailNormalized', 'email_normalized', 'String', 'VarChar', ['320'], true, null],
  ['emailVerifiedAt', 'email_verified_at', 'DateTime', 'Timestamptz', ['6'], false, null],
  ['displayName', 'display_name', 'String', 'VarChar', ['160'], true, null],
  ['phoneE164', 'phone_e164', 'String', 'VarChar', ['20'], false, null],
  ['status', 'status', 'String', 'VarChar', ['20'], true, null],
  ['createdAt', 'created_at', 'DateTime', 'Timestamptz', ['6'], true, { name: 'now', args: [] }],
  ['updatedAt', 'updated_at', 'DateTime', 'Timestamptz', ['6'], true, { name: 'now', args: [] }],
  ['deactivatedAt', 'deactivated_at', 'DateTime', 'Timestamptz', ['6'], false, null],
  ['version', 'version', 'Int', 'Integer', [], true, 1],
];
function assertUser(datamodel) {
  const user = datamodel.models.find((model) => model.name === 'User');
  assert.equal(user.dbName, 'users');
  assert.deepEqual(
    user.fields.map((f) => [
      f.name,
      f.dbName ?? f.name,
      f.type,
      ...f.nativeType,
      f.isRequired,
      f.hasDefaultValue ? f.default : null,
    ]),
    expected,
  );
  assert.ok(user.fields.every((f) => f.kind === 'scalar' && !f.isUpdatedAt && !f.isList));
}
test('Prisma parser proves exactly User plus unchanged category model inventory and eleven user columns', () => {
  assert.deepEqual(
    parsed.models.map((m) => m.name),
    ['Category', 'CategoryClosure', 'User'],
  );
  assert.deepEqual(parsed.enums, []);
  assertUser(parsed);
});
test('User has only approved primary/global-email unique indexes; no phone uniqueness or authority fields', () => {
  assert.deepEqual(
    parsed.indexes
      .filter((i) => i.model === 'User')
      .map((i) => [i.dbName, i.type, i.fields.map((f) => f.name)]),
    [
      ['users_pkey', 'id', ['id']],
      ['users_email_normalized_key', 'unique', ['emailNormalized']],
    ],
  );
});
test('both category models remain byte-equivalent after line-ending normalization and parser-equivalent', async () => {
  const original = (await getDMMF({ datamodel: baseline })).datamodel;
  assert.deepEqual(
    parsed.models.filter((m) => m.name !== 'User'),
    original.models,
  );
  assert.deepEqual(
    parsed.indexes.filter((i) => i.model !== 'User'),
    original.indexes,
  );
  for (const name of ['Category', 'CategoryClosure']) {
    const block = (text) =>
      text.replace(/\r\n/g, '\n').match(new RegExp(`model ${name} \\{[\\s\\S]*?^\\}`, 'm'))[0];
    assert.equal(block(schema), block(baseline));
  }
});
test('actual parser rejects invalid User type and valid nullable/default drift fails contract checks', async () => {
  await assert.rejects(
    getDMMF({ datamodel: schema.replace(/(\n\s*email\s+)String/, '$1MissingType') }),
  );
  const changed = (
    await getDMMF({
      datamodel: schema.replace(
        /(\n\s*version\s+Int\s+@default\()1/,
        (_match, prefix) => `${prefix}0`,
      ),
    })
  ).datamodel;
  assert.throws(() => assertUser(changed));
  const required = (
    await getDMMF({ datamodel: schema.replace(/(emailVerifiedAt\s+DateTime)\?/, '$1') })
  ).datamodel;
  assert.throws(() => assertUser(required));
});
test('manifest precisely defers all mandatory SQL/service enforcement and records status/version contracts', () => {
  const manifest = JSON.parse(
    readFileSync(
      path.join(root, 'docs/architecture/decisions/CH-02-M-ID-1-sql-manifest.json'),
      'utf8',
    ),
  );
  assert.deepEqual(manifest.allowedStatuses, ['ACTIVE', 'SUSPENDED', 'DEACTIVATED']);
  assert.equal(manifest.initialVersion, 1);
  assert.equal(manifest.maximumVersion, 2147483647);
  assert.equal(manifest.status, 'DESIGNED — NOT IMPLEMENTED');
  assert.deepEqual(
    manifest.obligations.map((o) => o.id),
    [
      'email-canonical',
      'email-collation',
      'email-unique',
      'status',
      'deactivation',
      'phone',
      'display-name',
      'version',
      'expected-version',
      'timestamps-immutable',
      'verified-replacement',
      'privileges-history',
    ],
  );
  for (const item of manifest.obligations) {
    assert.equal(item.status, 'DESIGNED — NOT IMPLEMENTED');
    assert.ok(item.invariant && item.mechanism && item.owner && item.tests.length);
  }
});

for (const input of [
  'Alice@Example.TEST',
  'a.b+Tag@example.test',
  'x@example',
  "a!#$%&'*+-/=?^_`{|}~@example.test",
  'x@xn--opaque-label.test',
]) {
  test(`email accepts approved grammar: ${input}`, () => {
    const result = normalizeUserEmail(input);
    assert.equal(result.email.split('@')[0], input.split('@')[0]);
    assert.equal(result.email.split('@')[1], input.split('@')[1].toLowerCase());
    assert.equal(result.emailNormalized, input.toLowerCase());
  });
}
test('case variants share identity, while provider dots and plus aliases remain distinct', () => {
  assert.equal(
    normalizeUserEmail('ALICE@EXAMPLE.TEST').emailNormalized,
    normalizeUserEmail('alice@example.test').emailNormalized,
  );
  assert.notEqual(
    normalizeUserEmail('a.b@example.test').emailNormalized,
    normalizeUserEmail('ab@example.test').emailNormalized,
  );
  assert.notEqual(
    normalizeUserEmail('a+tag@example.test').emailNormalized,
    normalizeUserEmail('a@example.test').emailNormalized,
  );
});
test('accepts exact local, domain-label and 254-octet address boundaries without truncation', () => {
  const input = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(61)}`;
  assert.equal(input.length, 254);
  assert.equal(normalizeUserEmail(input).emailNormalized, input);
});
for (const input of [
  null,
  123,
  '',
  'a',
  '@example.test',
  'a@',
  'a@@example.test',
  ' a@example.test',
  'a@example.test ',
  'a@example.test\n',
  'a\u0000@example.test',
  'أحمد@example.test',
  'a@مثال.test',
  'İ@example.test',
  'a\u00a0@example.test',
  '"a"@example.test',
  'Name <a@example.test>',
  'a@[127.0.0.1]',
  '.a@example.test',
  'a.@example.test',
  'a..b@example.test',
  'a@-example.test',
  'a@example-.test',
  'a@example..test',
  'a@example.test.',
  'a@exa_mple.test',
  `${'a'.repeat(65)}@example.test`,
  `a@${'b'.repeat(64)}.test`,
  `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(62)}`,
]) {
  test(`email rejects invalid input: ${JSON.stringify(input).slice(0, 45)}`, () => {
    assert.throws(
      () => normalizeUserEmail(input),
      (error) => {
        assert.ok(error instanceof TypeError);
        assert.equal(error.message, 'Invalid user email');
        return true;
      },
    );
  });
}

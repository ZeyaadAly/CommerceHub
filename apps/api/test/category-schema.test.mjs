import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const api = fileURLToPath(new URL('../', import.meta.url));
const root = path.resolve(api, '../..');
const require = createRequire(new URL('../package.json', import.meta.url));
const { getDMMF, getConfig } = require('@prisma/internals');
const schemaPath = path.join(api, 'prisma/schema.prisma');
const schema = readFileSync(schemaPath, 'utf8');
const parsed = (await getDMMF({ datamodel: schema })).datamodel;
const canonicalFields = {
  Category: [
    ['id', 'id', 'String', 'Uuid', [], true, null],
    ['parentId', 'parent_id', 'String', 'Uuid', [], false, null],
    ['slug', 'slug', 'String', 'VarChar', ['150'], true, null],
    ['name', 'name', 'String', 'VarChar', ['160'], true, null],
    ['description', 'description', 'String', 'Text', [], false, null],
    ['sortOrder', 'sort_order', 'Int', 'Integer', [], true, 0],
    ['status', 'status', 'String', 'Text', [], true, null],
    ['createdAt', 'created_at', 'DateTime', 'Timestamptz', ['6'], true, { name: 'now', args: [] }],
    ['updatedAt', 'updated_at', 'DateTime', 'Timestamptz', ['6'], true, { name: 'now', args: [] }],
    ['archivedAt', 'archived_at', 'DateTime', 'Timestamptz', ['6'], false, null],
  ],
  CategoryClosure: [
    ['ancestorId', 'ancestor_id', 'String', 'Uuid', [], true, null],
    ['descendantId', 'descendant_id', 'String', 'Uuid', [], true, null],
    ['depth', 'depth', 'Int', 'Integer', [], true, null],
  ],
};
function verifyFields(datamodel) {
  assert.deepEqual(
    datamodel.models.map((m) => [m.name, m.dbName]),
    [
      ['Category', 'categories'],
      ['CategoryClosure', 'category_closure'],
    ],
  );
  assert.deepEqual(datamodel.enums, []);
  for (const model of datamodel.models) {
    assert.deepEqual(
      model.fields
        .filter((f) => f.kind === 'scalar')
        .map((f) => [
          f.name,
          f.dbName ?? f.name,
          f.type,
          ...f.nativeType,
          f.isRequired,
          f.hasDefaultValue ? f.default : null,
        ]),
      canonicalFields[model.name],
    );
    assert.ok(model.fields.every((f) => !f.isUpdatedAt && !f.isGenerated));
  }
}
test('Prisma parser proves exactly two mapped models, native columns, nullability and defaults', () => {
  verifyFields(parsed);
});
test('Prisma parser proves exact PK, unique and ordered index inventory', () => {
  assert.deepEqual(
    parsed.indexes.map((i) => [i.dbName, i.model, i.type, i.fields.map((f) => f.name)]),
    [
      ['categories_pkey', 'Category', 'id', ['id']],
      ['categories_slug_key', 'Category', 'unique', ['slug']],
      ['categories_parent_sort_id_idx', 'Category', 'normal', ['parentId', 'sortOrder', 'id']],
      ['category_closure_pkey', 'CategoryClosure', 'id', ['ancestorId', 'descendantId']],
      [
        'category_closure_descendant_ancestor_idx',
        'CategoryClosure',
        'normal',
        ['descendantId', 'ancestorId'],
      ],
    ],
  );
});
test('Prisma parser resolves self and closure relations with RESTRICT both ways', () => {
  const relations = parsed.models.flatMap((m) =>
    m.fields.filter((f) => f.kind === 'object').map((f) => ({ model: m.name, ...f })),
  );
  assert.equal(relations.length, 6);
  assert.deepEqual(
    relations
      .filter((f) => f.relationFromFields.length)
      .map((f) => [
        f.model,
        f.name,
        f.type,
        f.relationName,
        f.relationFromFields,
        f.relationToFields,
        f.relationOnDelete,
        f.relationOnUpdate,
      ]),
    [
      [
        'Category',
        'parent',
        'Category',
        'CategoryHierarchy',
        ['parentId'],
        ['id'],
        'Restrict',
        'Restrict',
      ],
      [
        'CategoryClosure',
        'ancestor',
        'Category',
        'CategoryAncestor',
        ['ancestorId'],
        ['id'],
        'Restrict',
        'Restrict',
      ],
      [
        'CategoryClosure',
        'descendant',
        'Category',
        'CategoryDescendant',
        ['descendantId'],
        ['id'],
        'Restrict',
        'Restrict',
      ],
    ],
  );
});
test('invalid FK is rejected by actual Prisma parser; valid mapping drift fails contract assertions', async () => {
  await assert.rejects(
    getDMMF({ datamodel: schema.replace('references: [id]', 'references: [absent]') }),
  );
  const changed = (
    await getDMMF({ datamodel: schema.replace('@db.VarChar(150)', '@db.VarChar(151)') })
  ).datamodel;
  assert.throws(() => verifyFields(changed));
});
test('offline datasource uses real FK mode and has no URL, generator or migration directory', async () => {
  const config = await getConfig({ datamodel: schema, ignoreEnvVarErrors: false });
  assert.equal(config.datasources[0].provider, 'postgresql');
  // getConfig omits relationMode in this pinned release; the parser validated it.
  assert.match(schema, /relationMode\s*=\s*"foreignKeys"/);
  assert.deepEqual(config.generators, []);
  assert.equal(existsSync(path.join(api, 'prisma/migrations')), false);
  const tooling = (await import('../prisma.config.mjs')).default;
  assert.equal(tooling.datasource, undefined);
  assert.equal(tooling.migrations, undefined);
});
test('real CLI validates and checks format without credentials while network access is denied', () => {
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) =>
        !/^(?:DATABASE|DIRECT_URL|SHADOW_DATABASE|SUPABASE|PG|PRISMA|NODE_OPTIONS)/i.test(key),
    ),
  );
  env.CHECKPOINT_DISABLE = '1';
  env.PRISMA_HIDE_UPDATE_MESSAGE = '1';
  const cli = path.join(path.dirname(require.resolve('prisma/package.json')), 'build/index.js');
  const guard = path.join(api, 'test/offline-network-guard.cjs');
  for (const args of [['validate'], ['format', '--check']]) {
    const output = execFileSync(process.execPath, ['--require', guard, cli, ...args], {
      cwd: api,
      env,
      encoding: 'utf8',
      timeout: 30000,
    });
    assert.match(output, /valid|formatted|style/i);
  }
});
test('every mandatory SQL obligation is designed only, with owner and future proof cases', () => {
  const manifest = JSON.parse(
    readFileSync(
      path.join(root, 'docs/architecture/decisions/CH-02-M-CAT-1-sql-manifest.json'),
      'utf8',
    ),
  );
  assert.equal(manifest.decision, 'CH-02/M-CAT-1');
  assert.deepEqual(
    manifest.obligations.map((o) => o.id),
    [
      'status',
      'slug',
      'parent-self',
      'archive',
      'depth',
      'self-depth',
      'immutable',
      'updated-at',
      'closure-exact',
      'mutation',
      'locks',
      'privileges',
    ],
  );
  assert.equal(manifest.status, 'DESIGNED — NOT IMPLEMENTED');
  for (const item of manifest.obligations) {
    assert.equal(item.status, 'DESIGNED — NOT IMPLEMENTED');
    assert.ok(item.owner && item.invariant && item.mechanism && item.tests.length);
  }
});
test('browser workspace dependency graphs and source imports cannot include Prisma/database tooling', () => {
  for (const location of [
    'apps/admin',
    'apps/storefront',
    'packages/api-client',
    'packages/types',
    'packages/validation',
    'packages/ui',
  ]) {
    const manifest = JSON.parse(readFileSync(path.join(root, location, 'package.json'), 'utf8'));
    const dependencies = {
      ...manifest.dependencies,
      ...manifest.devDependencies,
      ...manifest.peerDependencies,
    };
    assert.ok(
      Object.keys(dependencies).every((name) => !/prisma|^pg$|^postgres$|supabase/i.test(name)),
    );
    const visit = (directory) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (/^(?:node_modules|dist|\.next|coverage)$/.test(entry.name)) continue;
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(file);
        else if (/\.[cm]?[jt]sx?$/.test(file)) {
          assert.doesNotMatch(
            readFileSync(file, 'utf8'),
            /(?:from\s*|require\s*\(|import\s*\()\s*['"](?:@prisma\/|prisma(?:\/|['"])|pg['"]|postgres['"]|@supabase\/)/,
          );
        }
      }
    };
    visit(path.join(root, location));
  }
});

const { normalizeCategorySlug } = require('./dist/catalog/category-slug.js');
for (const [input, expected] of [
  ['electronics', 'electronics'],
  ['Home-AND-Living', 'home-and-living'],
  ['a1-b2', 'a1-b2'],
  ['a'.repeat(150), 'a'.repeat(150)],
]) {
  test(`slug canonicalization accepts ${input.slice(0, 25)}`, () =>
    assert.equal(normalizeCategorySlug(input), expected));
}
for (const input of [
  '',
  'a b',
  ' a',
  'a ',
  '-a',
  'a-',
  'a--b',
  'a.b',
  'أجهزة',
  'a'.repeat(151),
  'a\n',
  'a\r\n',
  null,
  123,
  'İ',
  'Ａ',
]) {
  test(`slug rejects ${JSON.stringify(input).slice(0, 35)}`, () =>
    assert.throws(() => normalizeCategorySlug(input), TypeError));
}

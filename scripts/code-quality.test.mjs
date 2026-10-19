import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { ESLint } from 'eslint';
import * as prettier from 'prettier';

const root = path.resolve(import.meta.dirname, '..');
const eslint = new ESLint({ cwd: root });

test('typed lint rejects floating promises, any, unsafe backend imports and unused suppressions', async () => {
  const cases = [
    [
      'apps/api/src/main.ts',
      'Promise.resolve();\nexport {};\n',
      '@typescript-eslint/no-floating-promises',
    ],
    [
      'packages/types/src/index.ts',
      'export const value: any = 1;\n',
      '@typescript-eslint/no-explicit-any',
    ],
    [
      'apps/storefront/app/page.tsx',
      "import '@prisma/client';\nexport {};\n",
      'no-restricted-imports',
    ],
    ['packages/types/src/index.ts', '// eslint-disable-next-line no-alert\nexport {};\n', null],
  ];
  for (const [filePath, code, ruleId] of cases) {
    const [result] = await eslint.lintText(code, { filePath: path.join(root, filePath) });
    assert.ok(result.errorCount > 0, filePath);
    assert.ok(
      result.messages.some((message) => message.ruleId === ruleId),
      JSON.stringify(result.messages),
    );
  }
});

test('framework rules and globals are scoped; generated files and approved documents stay excluded', async () => {
  const frontend = await eslint.calculateConfigForFile(
    path.join(root, 'apps/storefront/app/page.tsx'),
  );
  const api = await eslint.calculateConfigForFile(path.join(root, 'apps/api/src/main.ts'));
  const types = await eslint.calculateConfigForFile(path.join(root, 'packages/types/src/index.ts'));
  assert.ok(frontend.rules['react-hooks/rules-of-hooks']);
  assert.ok(frontend.rules['@next/next/no-async-client-component']);
  assert.equal(api.rules['react-hooks/rules-of-hooks'], undefined);
  assert.equal(types.rules['react-hooks/rules-of-hooks'], undefined);
  assert.equal(types.languageOptions.globals?.process, undefined);
  assert.ok(api.languageOptions.globals.process !== undefined);
  for (const file of [
    'apps/admin/.next/types/routes.d.ts',
    'apps/api/dist/main.js',
    'apps/admin/next-env.d.ts',
    '.verification/generated.mjs',
  ]) {
    assert.equal(await eslint.isPathIgnored(path.join(root, file)), true, file);
  }
  for (const file of ['apps/api/src/main.ts', 'packages/ui/src/index.ts', 'scripts/smoke.mjs']) {
    assert.equal(await eslint.isPathIgnored(path.join(root, file)), false, file);
  }
  for (const file of [
    'AGENTS.md',
    'apps/admin/AGENTS.md',
    'docs/02-prd.md',
    'docs/implementation/story-tracker.md',
    'pnpm-lock.yaml',
    '.env.example',
  ]) {
    const info = await prettier.getFileInfo(path.join(root, file), {
      ignorePath: path.join(root, '.prettierignore'),
    });
    assert.equal(info.ignored, true, file);
  }
});

test('real pre-commit blocks invalid TS and preserves partial staging and unrelated edits on success', () => {
  const parent = path.join(root, '.verification');
  mkdirSync(parent, { recursive: true });
  const fixture = mkdtempSync(path.join(parent, 'CH-P0-004-hooks-'));
  const nodeModules = path.join(fixture, 'node_modules');
  const run = (command, args) =>
    spawnSync(command, args, {
      cwd: fixture,
      encoding: 'utf8',
      timeout: 120_000,
      env: {
        ...process.env,
        PATH: `${path.join(root, 'node_modules/.bin')}${path.delimiter}${process.env.PATH}`,
      },
    });
  const git = (...args) => run('git', args);
  const tool = (file, args) => run(process.execPath, [path.join(root, file), ...args]);
  const succeeds = (result) => assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const write = (file, text) => {
    mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
    writeFileSync(path.join(fixture, file), text);
  };
  try {
    symlinkSync(path.join(root, 'node_modules'), nodeModules, 'junction');
    for (const file of [
      'eslint.config.mjs',
      'prettier.config.mjs',
      '.prettierignore',
      'lint-staged.config.mjs',
      'tsconfig.base.json',
      'packages/types/tsconfig.json',
    ]) {
      mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
      copyFileSync(path.join(root, file), path.join(fixture, file));
    }
    write('package.json', '{"name":"commercehub-hook-fixture","private":true}\n');
    write('.gitignore', 'node_modules/\n');
    write('unrelated.md', 'Keep original content.\n');
    const source = 'packages/types/src/staged sample.ts';
    write(source, "export const status = 'baseline';\n");
    succeeds(git('init', '--quiet'));
    succeeds(git('config', 'user.name', 'CommerceHub Hook Fixture'));
    succeeds(git('config', 'user.email', 'fixture@example.invalid'));
    succeeds(git('config', 'core.autocrlf', 'false'));
    succeeds(git('add', '--', source, 'unrelated.md'));
    succeeds(git('commit', '--quiet', '-m', 'fixture baseline'));
    succeeds(tool('node_modules/husky/bin.js', []));
    copyFileSync(path.join(root, '.husky/pre-commit'), path.join(fixture, '.husky/pre-commit'));
    assert.equal(git('config', '--local', '--get', 'core.hooksPath').stdout.trim(), '.husky/_');
    const head = git('rev-parse', 'HEAD').stdout.trim();

    write(source, 'const unused = 1;\nexport {};\n');
    const lintFailure = tool('node_modules/eslint/bin/eslint.js', [source, '--max-warnings=0']);
    assert.equal(lintFailure.status, 1, `${lintFailure.stdout}\n${lintFailure.stderr}`);
    assert.ok(lintFailure.stdout.includes('@typescript-eslint/no-unused-vars'));
    succeeds(git('add', '--', source));
    const blocked = git('commit', '--quiet', '-m', 'must be blocked');
    assert.notEqual(blocked.status, 0);
    assert.ok(`${blocked.stdout}\n${blocked.stderr}`.includes('@typescript-eslint/no-unused-vars'));
    assert.equal(git('rev-parse', 'HEAD').stdout.trim(), head);

    write(source, 'export const status="ready"\n');
    const formatFailure = tool('node_modules/prettier/bin/prettier.cjs', ['--check', source]);
    assert.equal(formatFailure.status, 1, `${formatFailure.stdout}\n${formatFailure.stderr}`);
    succeeds(git('add', '--', source));
    write(source, 'export const status="ready"\n// Preserve this unstaged comment.\n');
    const unrelated = '  unrelated edit must remain unformatted   \n';
    write('unrelated.md', unrelated);
    succeeds(git('commit', '--quiet', '-m', 'valid staged source'));
    assert.notEqual(git('rev-parse', 'HEAD').stdout.trim(), head);
    assert.equal(git('show', `HEAD:${source}`).stdout, "export const status = 'ready';\n");
    assert.ok(
      readFileSync(path.join(fixture, source), 'utf8').includes('Preserve this unstaged comment.'),
    );
    assert.equal(readFileSync(path.join(fixture, 'unrelated.md'), 'utf8'), unrelated);
    assert.ok(git('diff', '--', source).stdout.includes('Preserve this unstaged comment.'));
    assert.equal(git('diff', '--cached', '--name-only').stdout.trim(), '');
  } finally {
    // Only the directory this test created may be removed; unlink the dependency junction first.
    assert.ok(fixture.startsWith(`${parent}${path.sep}CH-P0-004-hooks-`));
    unlinkSync(nodeModules);
    rmSync(fixture, { recursive: true });
  }
});

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const workspaces = ['apps/storefront', 'apps/admin', 'apps/api',
  'packages/ui', 'packages/types', 'packages/validation', 'packages/api-client'];

function sources(directory) {
  return readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const file = `${directory}/${entry.name}`;
    if (['node_modules', 'dist', '.next'].includes(entry.name)) return [];
    return entry.isDirectory() ? sources(file) : /\.(?:ts|tsx|mjs)$/.test(file) ? [file] : [];
  });
}

test('all seven workspaces inherit strict compiler settings', () => {
  for (const workspace of workspaces) {
    const file = path.join(root, workspace, 'tsconfig.json');
    const config = ts.readConfigFile(file, ts.sys.readFile);
    assert.equal(config.error, undefined);
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(file));
    assert.equal(parsed.errors.length, 0);
    assert.equal(parsed.options.strict, true, workspace);
    assert.equal(parsed.options.noUncheckedIndexedAccess, true, workspace);
    assert.equal(parsed.options.exactOptionalPropertyTypes, true, workspace);
  }
});

test('strict compiler rejects implicit any, null and unchecked indexing', () => {
  const filename = path.join(root, 'strict-negative-fixture.ts');
  const content = 'export {}; function f(value) { return value; } const value: string = null; const item: string = ["x"][8];';
  const options = { ...json('tsconfig.base.json').compilerOptions, target: ts.ScriptTarget.ES2022,
    noEmit: true, types: [] };
  const host = ts.createCompilerHost(options);
  const original = host.getSourceFile;
  host.getSourceFile = (file, language, ...args) => path.resolve(file) === filename
    ? ts.createSourceFile(file, content, language) : original.call(host, file, language, ...args);
  const program = ts.createProgram([filename], options, host);
  const codes = ts.getPreEmitDiagnostics(program).map((diagnostic) => diagnostic.code);
  assert.ok(codes.includes(7006), 'implicit any must fail');
  assert.ok(codes.filter((code) => code === 2322).length >= 2, 'null and indexing must fail');
});

test('workspace graph and source imports respect app/package boundaries', () => {
  const names = new Map(workspaces.map((workspace) => [json(`${workspace}/package.json`).name, workspace]));
  const graph = new Map();
  for (const workspace of workspaces) {
    const manifest = json(`${workspace}/package.json`);
    const deps = { ...manifest.dependencies, ...manifest.devDependencies };
    const edges = Object.keys(deps).filter((name) => names.has(name));
    graph.set(manifest.name, edges);
    for (const name of edges) {
      assert.ok(!names.get(name).startsWith('apps/'), `${workspace} imports an app`);
      assert.equal(deps[name], 'workspace:*');
    }
    if (workspace.startsWith('packages/')) {
      assert.ok(!Object.keys(deps).some((name) => /nestjs|prisma|supabase/.test(name)));
    }
    for (const file of sources(workspace)) {
      const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
      function visit(node) {
        let specifier;
        if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
          specifier = node.moduleSpecifier.text;
        } else if (ts.isCallExpression(node) &&
          (node.expression.kind === ts.SyntaxKind.ImportKeyword || node.expression.getText(source) === 'require')) {
          assert.ok(node.arguments[0] && ts.isStringLiteral(node.arguments[0]), `${file}: computed import`);
          specifier = node.arguments[0].text;
        }
        if (specifier) {
          if (specifier.startsWith('.')) {
            const resolved = path.resolve(root, path.dirname(file), specifier);
            assert.ok(resolved.startsWith(path.join(root, workspace) + path.sep), `${file}: cross-boundary import`);
          } else {
            const name = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
            if (!specifier.startsWith('node:')) assert.ok(name in deps || name in json('package.json').devDependencies, `${file}: undeclared ${name}`);
            if (workspace !== 'apps/api') assert.ok(!/nestjs|prisma|supabase/.test(specifier), file);
          }
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
  }
  function visit(name, ancestors = []) {
    assert.ok(!ancestors.includes(name), `cycle: ${[...ancestors, name].join(' -> ')}`);
    for (const next of graph.get(name)) visit(next, [...ancestors, name]);
  }
  for (const name of graph.keys()) visit(name);
});

test('shared package builds expose resolvable inert modules', () => {
  for (const workspace of workspaces.filter((item) => item.startsWith('packages/'))) {
    const manifest = json(`${workspace}/package.json`);
    const result = spawnSync(process.execPath, ['--input-type=module', '-e',
      `const value = await import('${manifest.name}'); if (Object.keys(value).length) process.exit(1);`],
    { cwd: path.join(root, workspace), encoding: 'utf8' });
    assert.equal(result.status, 0, `${workspace}: run pnpm build first\n${result.stderr}`);
    assert.ok(read(`${workspace}/dist/index.d.ts`).includes('export {}'));
  }
});

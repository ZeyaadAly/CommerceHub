import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const locations = ['apps/storefront', 'apps/admin', 'apps/api', 'packages/ui', 'packages/types', 'packages/validation', 'packages/api-client'];
const workspaces = locations.map((location) => ({
  location,
  manifest: JSON.parse(readFileSync(join(root, location, 'package.json'), 'utf8')),
}));
const byName = new Map(workspaces.map((workspace) => [workspace.manifest.name, workspace]));

test('workspace dependency graph is complete, acyclic and never points back into apps', () => {
  assert.equal(byName.size, 7);
  const active = new Set();
  const complete = new Set();
  function visit(workspace) {
    const { name } = workspace.manifest;
    assert.ok(!active.has(name), `Circular dependency at ${name}`);
    if (complete.has(name)) return;
    active.add(name);
    const dependencies = { ...workspace.manifest.dependencies, ...workspace.manifest.devDependencies, ...workspace.manifest.peerDependencies };
    for (const [dependency, version] of Object.entries(dependencies)) {
      if (!dependency.startsWith('@commercehub/')) continue;
      assert.match(version, /^workspace:/, `Local dependency ${dependency} must use workspace protocol`);
      const target = byName.get(dependency);
      assert.ok(target, `Missing workspace ${dependency}`);
      assert.ok(target.location.startsWith('packages/'), 'Apps cannot be package dependencies');
      visit(target);
    }
    active.delete(name);
    complete.add(name);
  }
  for (const workspace of workspaces) visit(workspace);
});

test('each actual workspace inherits strict TypeScript options and shared builds expose valid files', () => {
  for (const { location, manifest } of workspaces) {
    const config = ts.getParsedCommandLineOfConfigFile(join(root, location, 'tsconfig.json'), {}, {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic(diagnostic) {
        assert.fail(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      },
    });
    assert.ok(config);
    assert.equal(config.errors.length, 0, location);
    assert.equal(config.options.strict, true, location);
    assert.equal(config.options.noUncheckedIndexedAccess, true, location);
    assert.equal(config.options.exactOptionalPropertyTypes, true, location);
    if (location.startsWith('packages/')) {
      for (const target of Object.values(manifest.exports['.'])) {
        assert.ok(existsSync(join(root, location, target)), `Build artifact missing: ${location}/${target}`);
      }
    }
  }
});

function sourceFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

test('real source imports respect app/package boundaries and placeholders make no network calls', () => {
  for (const { location, manifest } of workspaces) {
    const workspaceRoot = join(root, location);
    for (const file of [...sourceFiles(join(workspaceRoot, 'src')), ...sourceFiles(join(workspaceRoot, 'app'))]) {
      const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
      const frontend = location === 'apps/storefront' || location === 'apps/admin';
      function inspect(node) {
        const specifier = (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) ? node.moduleSpecifier
          : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword ? node.arguments[0] : undefined;
        if (specifier && ts.isStringLiteral(specifier)) {
          const imported = specifier.text;
          if (frontend || location.startsWith('packages/')) {
            assert.doesNotMatch(imported, /^(@nestjs\/|@prisma\/|prisma(?:\/|$)|@supabase\/|pg(?:\/|$)|postgres(?:\/|$))/, file);
          }
          if (imported.startsWith('.')) {
            const resolved = resolve(dirname(file), imported);
            const local = relative(workspaceRoot, resolved);
            assert.ok(local !== '..' && !local.startsWith(`..${sep}`), `Cross-workspace relative import: ${file}`);
          }
          if (imported.startsWith('@commercehub/')) {
            assert.ok(manifest.dependencies?.[imported] || manifest.devDependencies?.[imported], `Undeclared import ${imported}`);
          }
        }
        if (frontend && ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
          assert.notEqual(node.expression.text, 'fetch', `Placeholder must not call APIs: ${file}`);
        }
        ts.forEachChild(node, inspect);
      }
      inspect(source);
    }
  }
});

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { parseDocument } from 'yaml';
import { detectSecrets, scanRepository } from './secret-scan.mjs';

const root = path.resolve(import.meta.dirname, '..');

test('workflow parses and retains the unprivileged, unconditional required-check contract', () => {
  const source = readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8');
  const document = parseDocument(source, { uniqueKeys: true });
  assert.deepEqual(document.errors, []);
  const ci = document.toJS();
  assert.deepEqual(Object.keys(ci.on).sort(), ['pull_request', 'workflow_dispatch']);
  assert.deepEqual(ci.on.pull_request, { branches: ['main'] });
  assert.deepEqual(ci.permissions, { contents: 'read' });
  assert.equal(ci.concurrency['cancel-in-progress'], true);
  assert.match(ci.concurrency.group, /github.workflow.*pull_request.number.*github.ref/);
  assert.deepEqual(Object.keys(ci.jobs), ['quality']);
  const job = ci.jobs.quality;
  assert.equal(job.name, 'commercehub-quality');
  assert.equal(job['runs-on'], 'ubuntu-latest');
  assert.equal(job['timeout-minutes'], 20);
  assert.equal(job.if, undefined);
  assert.equal(job.environment, undefined);
  assert.equal(job.permissions, undefined);
  const actions = job.steps.filter((step) => step.uses);
  assert.deepEqual(
    actions.map((step) => step.uses),
    [
      'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1',
      'actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1',
      'pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413',
    ],
  );
  assert.equal(actions[0].with['persist-credentials'], false);
  assert.equal(actions[0].with['fetch-depth'], 0);
  assert.equal(actions[1].with['node-version-file'], '.node-version');
  assert.equal(actions[2].with.version, '11.28.6');
  assert.equal(actions[2].with.run_install, false);
  assert.equal(actions[2].with.cache, true);
  assert.equal(actions[2].with.cache_dependency_path, 'pnpm-lock.yaml');
  assert.doesNotMatch(source, /secrets\.|continue-on-error|pull_request_target|workflow_run|--fix/);
  const commands = job.steps.filter((step) => step.run).map((step) => step.run);
  for (const command of [
    'node scripts/secret-scan.mjs',
    'pnpm install --frozen-lockfile',
    'pnpm test:ci',
    'pnpm format:check',
    'pnpm lint',
    'pnpm typecheck',
    'pnpm build',
    'pnpm test',
    'pnpm test:quality',
    'pnpm audit --audit-level high',
  ])
    assert.ok(commands.includes(command), command);
  assert.ok(commands.indexOf('pnpm build') < commands.indexOf('pnpm test'));
});

test('bounded secret signatures detect synthetic keys without returning their values', () => {
  const synthetic = 'gh' + 'p_' + 'A'.repeat(36);
  assert.deepEqual(detectSecrets(synthetic), ['github-token']);
  assert.deepEqual(detectSecrets('AK' + 'IA' + 'A'.repeat(16)), ['aws-access-key']);
  assert.deepEqual(detectSecrets('-----BEGIN ' + 'PRIVATE KEY-----'), ['private-key']);
  assert.deepEqual(detectSecrets('replace-with-a-local-placeholder'), []);
  assert.ok(!JSON.stringify(detectSecrets(synthetic)).includes(synthetic));
});

test('Git-range secret scan detects changed content, excludes deleted secrets, and fails invalid ranges', () => {
  const fixture = mkdtempSync(path.join(os.tmpdir(), 'commercehub-ci-scan-'));
  const git = (...args) => execFileSync('git', args, { cwd: fixture, encoding: 'utf8' });
  try {
    git('init', '--quiet');
    git('config', 'user.name', 'CommerceHub CI Fixture');
    git('config', 'user.email', 'fixture@example.invalid');
    writeFileSync(path.join(fixture, 'safe.txt'), 'safe\n');
    git('add', '--', 'safe.txt');
    git('commit', '--quiet', '-m', 'fixture baseline');
    const base = git('rev-parse', 'HEAD').trim();
    writeFileSync(path.join(fixture, 'filename with spaces.txt'), 'gh' + 'p_' + 'A'.repeat(36));
    git('add', '--', 'filename with spaces.txt');
    git('commit', '--quiet', '-m', 'synthetic credential fixture');
    const result = scanRepository({ root: fixture, base });
    assert.deepEqual(result.findings, [{ file: 'filename with spaces.txt', rule: 'github-token' }]);
    assert.ok(!JSON.stringify(result).includes('A'.repeat(36)));
    git('rm', '--', 'filename with spaces.txt');
    git('commit', '--quiet', '-m', 'remove synthetic fixture');
    assert.deepEqual(scanRepository({ root: fixture, base }).findings, []);
    assert.throws(() => scanRepository({ root: fixture, base: 'invalid' }));
  } finally {
    assert.ok(fixture.startsWith(path.join(os.tmpdir(), 'commercehub-ci-scan-')));
    rmSync(fixture, { recursive: true });
  }
});

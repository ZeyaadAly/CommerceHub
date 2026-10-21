import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseDocument } from 'yaml';

const root = path.resolve(import.meta.dirname, '..');
const chain = [
  '@next/eslint-plugin-next@16.4.2',
  'fast-glob@3.3.1',
  'micromatch@4.0.8',
  'braces@3.0.3',
];
const auditPath = '.>@next/eslint-plugin-next>fast-glob>micromatch>braces';
const levels = ['info', 'low', 'moderate', 'high', 'critical'];
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const requireThat = (condition, message) => {
  if (!condition) throw new Error(message);
};
const same = (actual, expected, label) => {
  try {
    assert.deepEqual(actual, expected);
  } catch {
    throw new Error(label);
  }
};

export function validatePolicy(policy, now = new Date()) {
  requireThat(object(policy), 'Missing/invalid exception policy');
  same(Object.keys(policy).sort(), ['exceptions', 'schemaVersion'], 'Unsupported policy schema');
  requireThat(
    policy.schemaVersion === 1 &&
      Array.isArray(policy.exceptions) &&
      policy.exceptions.length === 1,
    'Exactly one approved exception required',
  );
  const entry = policy.exceptions[0];
  const exact = {
    advisory: 'GHSA-vfj7-8cjw-p6xm',
    package: 'braces',
    version: '3.0.3',
    chain,
    auditPath,
    maximumSeverity: 'high',
    owner: 'ZeyaadAly',
    approvedOn: '2026-10-19',
    expiresAt: '2026-11-02T00:00:00Z',
    reviewOn: '2026-10-26',
    reference: 'docs/verification/CH-P0-005-advisory-review.md',
    runtimeExposure: 'development-only; no production dependency path',
    automaticRenewal: false,
  };
  requireThat(object(entry), 'Invalid exception record');
  same(
    Object.keys(entry).sort(),
    [...Object.keys(exact), 'reason', 'riskClassification'].sort(),
    'Invalid exception fields',
  );
  for (const [key, value] of Object.entries(exact))
    same(entry[key], value, `Unauthorized policy ${key}`);
  for (const key of ['reason', 'riskClassification'])
    requireThat(typeof entry[key] === 'string' && entry[key].trim().length >= 20, `Missing ${key}`);
  const start = Date.parse(`${entry.approvedOn}T00:00:00Z`);
  const expiry = Date.parse(entry.expiresAt);
  requireThat(
    Number.isFinite(now.getTime()) && now.getTime() >= start && now.getTime() < expiry,
    'Approval not yet valid or expired',
  );
  requireThat(expiry - start <= 14 * 86400000, 'Approval exceeds 14 days');
  return entry;
}

export function readEvidence(repository = root) {
  const policy = JSON.parse(
    readFileSync(path.join(repository, 'security/dependency-exceptions.json'), 'utf8'),
  );
  const document = parseDocument(readFileSync(path.join(repository, 'pnpm-lock.yaml'), 'utf8'), {
    uniqueKeys: true,
  });
  requireThat(document.errors.length === 0, 'Malformed lockfile');
  const manifests = {
    '.': JSON.parse(readFileSync(path.join(repository, 'package.json'), 'utf8')),
  };
  for (const parent of ['apps', 'packages']) {
    for (const entry of readdirSync(path.join(repository, parent), { withFileTypes: true })) {
      if (entry.isDirectory())
        manifests[`${parent}/${entry.name}`] = JSON.parse(
          readFileSync(path.join(repository, parent, entry.name, 'package.json'), 'utf8'),
        );
    }
  }
  return { policy, lock: document.toJS(), manifests };
}

// Walk every production and development root, including optional edges and peer-qualified snapshots.
// Frozen install corroborates these manifest/specifier checks; audit dev flags alone never authorize exposure.
export function validateExposure(lock, manifests) {
  requireThat(
    object(lock) &&
      lock.lockfileVersion === '9.0' &&
      object(lock.importers) &&
      object(lock.snapshots) &&
      object(lock.packages),
    'Missing/unsupported lockfile evidence',
  );
  requireThat(object(manifests), 'Missing production-exposure evidence');
  same(
    Object.keys(manifests).sort(),
    Object.keys(lock.importers).sort(),
    'Workspace/lock importer mismatch',
  );
  const found = [];
  const relevant = new Set(Object.keys(lock.snapshots).filter((key) => key.startsWith('braces@')));
  let changed = true;
  while (changed) {
    changed = false;
    for (const [key, snapshot] of Object.entries(lock.snapshots)) {
      for (const [name, ref] of Object.entries({
        ...snapshot.dependencies,
        ...snapshot.optionalDependencies,
      })) {
        if (relevant.has(`${name}@${ref}`) && !relevant.has(key)) {
          relevant.add(key);
          changed = true;
        }
      }
    }
  }
  const assessed = new Set();
  let visits = 0;
  function walk(name, version, route, production, seen, importerContext) {
    requireThat(++visits < 100000, 'Dependency graph exceeds assessment bound');
    if (version.startsWith('link:')) {
      // Relative links belong to the declaring workspace, not the original app.
      // Preserve route separately so exposure/approved ancestry checks stay strict.
      const importer = path.posix.normalize(path.posix.join(importerContext, version.slice(5)));
      requireThat(lock.importers[importer], 'Unknown workspace link');
      requireThat(manifests[importer]?.name === name, 'Workspace link identity mismatch');
      const marker = `workspace:${importer}`;
      if (seen.has(marker)) return;
      const next = new Set([...seen, marker]);
      for (const group of ['dependencies', 'optionalDependencies'])
        for (const [child, edge] of Object.entries(lock.importers[importer][group] ?? {}))
          walk(child, edge.version, route, production, next, importer);
      return;
    }
    requireThat(
      typeof version === 'string' && /^\d+\.\d+\.\d+/.test(version),
      'Unassessable dependency reference',
    );
    const key = `${name}@${version}`;
    const identity = `${name}@${version.split('(')[0]}`;
    requireThat(
      object(lock.snapshots[key]) && object(lock.packages[identity]),
      'Missing expected package/snapshot',
    );
    const assessmentKey = `${production}:${key}`;
    if (!relevant.has(key) && assessed.has(assessmentKey)) return;
    assessed.add(assessmentKey);
    const current = [...route, identity];
    if (name === 'braces') {
      requireThat(!production, 'Production dependency exposure');
      same(current, ['.', ...chain], 'Changed braces dependency ancestry');
      found.push(current);
    }
    if (seen.has(key)) return;
    const next = new Set([...seen, key]);
    for (const group of ['dependencies', 'optionalDependencies']) {
      const edges = lock.snapshots[key][group] ?? {};
      requireThat(object(edges), 'Invalid snapshot edges');
      for (const [child, ref] of Object.entries(edges))
        walk(child, ref, current, production, next, importerContext);
    }
  }
  for (const [importer, manifest] of Object.entries(manifests)) {
    for (const group of ['dependencies', 'optionalDependencies', 'devDependencies']) {
      const declared = manifest[group] ?? {};
      const locked = lock.importers[importer][group] ?? {};
      same(
        Object.keys(declared).sort(),
        Object.keys(locked).sort(),
        'Manifest/lock dependency mismatch',
      );
      for (const [name, specifier] of Object.entries(declared)) {
        requireThat(
          locked[name].specifier === specifier && typeof locked[name].version === 'string',
          'Inconsistent lockfile specifier',
        );
        walk(
          name,
          locked[name].version,
          [importer],
          group !== 'devDependencies',
          new Set(),
          importer,
        );
      }
    }
  }
  same(found, [['.', ...chain]], 'Missing or ambiguous approved development chain');
  return true;
}

export function runCommand(command, args, { runner = spawnSync, cwd = root } = {}) {
  const result = runner(command, args, {
    cwd,
    encoding: 'utf8',
    timeout: 120000,
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
  });
  requireThat(
    !result.error && !result.signal && Number.isInteger(result.status),
    'Audit scanner execution failed',
  );
  requireThat(result.status === 0 || result.status === 1, 'Unexpected audit scanner exit code');
  requireThat(
    typeof result.stdout === 'string' && !result.stderr?.trim(),
    'Audit scanner missing output or emitted errors',
  );
  return { status: result.status, stdout: result.stdout };
}

export function evaluateAudit(result, evidence, now = new Date()) {
  const entry = validatePolicy(evidence?.policy, now);
  validateExposure(evidence.lock, evidence.manifests);
  requireThat(result && [0, 1].includes(result.status), 'Unexpected audit exit code');
  const audit = JSON.parse(result.stdout);
  requireThat(object(audit), 'Unsupported audit schema');
  same(Object.keys(audit).sort(), ['advisories', 'metadata'], 'Unsupported audit top-level schema');
  requireThat(
    object(audit.advisories) && object(audit.metadata?.vulnerabilities),
    'Unsupported audit schema',
  );
  const counts = Object.fromEntries(levels.map((level) => [level, 0]));
  same(
    Object.keys(audit.metadata.vulnerabilities).sort(),
    [...levels].sort(),
    'Unsupported vulnerability counters',
  );
  const identities = new Set();
  const high = [];
  for (const record of Object.values(audit.advisories)) {
    requireThat(
      object(record) &&
        levels.includes(record.severity) &&
        /^GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/.test(record.github_advisory_id) &&
        typeof record.module_name === 'string' &&
        Array.isArray(record.findings) &&
        record.findings.length > 0,
      'Ambiguous advisory identity/schema',
    );
    requireThat(!identities.has(record.github_advisory_id), 'Duplicate advisory identity');
    identities.add(record.github_advisory_id);
    counts[record.severity]++;
    for (const finding of record.findings)
      requireThat(
        typeof finding.version === 'string' &&
          Array.isArray(finding.paths) &&
          finding.paths.length > 0 &&
          finding.paths.every((p) => typeof p === 'string') &&
          typeof finding.dev === 'boolean',
        'Unsupported finding schema',
      );
    if (['high', 'critical'].includes(record.severity)) high.push(record);
  }
  same(audit.metadata.vulnerabilities, counts, 'Audit counts inconsistent with advisory records');
  requireThat(result.status === (high.length ? 1 : 0), 'Audit exit inconsistent with findings');
  requireThat(high.length <= 1, 'Additional high/critical advisory');
  if (high.length) {
    const record = high[0];
    requireThat(
      record.github_advisory_id === entry.advisory &&
        record.module_name === entry.package &&
        record.severity === 'high' &&
        record.patched_versions === null &&
        record.patched_versions_unpublished === true &&
        record.vulnerable_versions === '<=3.0.3',
      'Changed advisory identity/severity/patch status',
    );
    same(
      record.findings,
      [
        {
          version: entry.version,
          paths: [entry.auditPath],
          dev: true,
          optional: false,
          bundled: false,
        },
      ],
      'Changed finding version/path/exposure',
    );
  }
  return {
    accepted: high.length === 1,
    rawExit: result.status,
    lowerFindings: counts.info + counts.low + counts.moderate,
    entry,
  };
}

export function validateArtifacts(repository = root) {
  const affected =
    /(?:^|[/\\])(?:braces|micromatch|fast-glob|@next[/\\]eslint-plugin-next)(?:@|[/\\]|$)/;
  let inspected = 0;
  for (const app of ['admin', 'storefront']) {
    const build = path.join(repository, 'apps', app, '.next');
    requireThat(
      readFileSync(path.join(build, 'BUILD_ID'), 'utf8').trim().length > 0,
      'Missing frontend build evidence',
    );
    let traces = 0;
    const visit = (directory) => {
      for (const file of readdirSync(directory, { withFileTypes: true })) {
        requireThat(++inspected < 10000, 'Artifact assessment exceeds bound');
        const filename = path.join(directory, file.name);
        requireThat(!affected.test(filename), 'Affected runtime artifact path');
        if (file.isDirectory()) visit(filename);
        else if (file.name.endsWith('.nft.json')) {
          const trace = JSON.parse(readFileSync(filename, 'utf8'));
          requireThat(
            trace.version === 1 && Array.isArray(trace.files) && trace.files.length < 10000,
            'Unsupported build trace',
          );
          traces++;
          for (const reference of trace.files) {
            requireThat(typeof reference === 'string', 'Invalid trace reference');
            const resolved = realpathSync(path.resolve(directory, reference));
            requireThat(!affected.test(resolved), 'Affected dependency in runtime trace');
          }
        }
      }
    };
    visit(path.join(build, 'server'));
    visit(path.join(build, 'static'));
    requireThat(traces > 0, 'Missing frontend runtime traces');
  }
  const api = path.join(repository, 'apps/api/dist');
  const emitted = readdirSync(api).filter((name) => name.endsWith('.js'));
  requireThat(emitted.length > 0, 'Missing API build evidence');
  for (const name of emitted)
    requireThat(
      !/['"](?:braces|micromatch|fast-glob|@next\/eslint-plugin-next)(?:\/|['"])/.test(
        readFileSync(path.join(api, name), 'utf8'),
      ),
      'Affected API runtime import',
    );
  return inspected;
}

export function main() {
  const evidence = readEvidence();
  // Fixed arguments only. Windows cmd is required for the .cmd launcher; no input is interpolated.
  const result =
    process.platform === 'win32'
      ? runCommand(process.env.ComSpec || 'cmd.exe', [
          '/d',
          '/s',
          '/c',
          'pnpm.cmd audit --audit-level high --json',
        ])
      : runCommand('pnpm', ['audit', '--audit-level', 'high', '--json']);
  const summary = evaluateAudit(result, evidence);
  const artifacts = validateArtifacts();
  console.log(
    `Dependency security review: full audit exit ${summary.rawExit}; lower findings ${summary.lowerFindings}`,
  );
  if (summary.accepted)
    console.log(
      `Accepted temporary risk: ${summary.entry.advisory}\nPackage: braces@3.0.3\nExposure: verified root development dependency; no production graph path\nOwner: ${summary.entry.owner}\nExpiry: ${summary.entry.expiresAt}\nReview due: ${summary.entry.reviewOn}\nStatus: TEMPORARILY ACCEPTED — NOT REMEDIATED`,
    );
  console.log(
    `Additional high/critical findings: 0. Inspected ${artifacts} local artifact entries/traces; this is not deployed-artifact attestation.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    console.error(`Dependency security gate FAILED: ${error.message}`);
    process.exitCode = 1;
  }
}

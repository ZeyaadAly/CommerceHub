import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  evaluateAudit,
  readEvidence,
  runCommand,
  validateExposure,
  validateArtifacts,
} from './check-dependency-audit.mjs';

const now = new Date('2026-10-19T12:00:00Z');
const source = readEvidence();
const names = ['@next/eslint-plugin-next', 'fast-glob', 'micromatch', 'braces'];
const versions = ['16.4.2', '3.3.1', '4.0.8', '3.0.3'];

test('artifact assessment rejects missing builds, missing traces and affected runtime references', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'commercehub-audit-artifacts-'));
  try {
    assert.throws(() => validateArtifacts(directory));
    for (const app of ['admin', 'storefront']) {
      const build = path.join(directory, 'apps', app, '.next');
      mkdirSync(path.join(build, 'server'), { recursive: true });
      mkdirSync(path.join(build, 'static'));
      writeFileSync(path.join(build, 'BUILD_ID'), 'synthetic');
      writeFileSync(path.join(build, 'server/entry.js'), '');
      writeFileSync(
        path.join(build, 'server/entry.nft.json'),
        JSON.stringify({ version: 1, files: ['entry.js'] }),
      );
    }
    mkdirSync(path.join(directory, 'apps/api/dist'), { recursive: true });
    writeFileSync(path.join(directory, 'apps/api/dist/main.js'), '');
    assert.ok(validateArtifacts(directory) > 0);
    const server = path.join(directory, 'apps/admin/.next/server');
    mkdirSync(path.join(server, 'braces'));
    writeFileSync(path.join(server, 'braces/index.js'), '');
    writeFileSync(
      path.join(server, 'entry.nft.json'),
      JSON.stringify({ version: 1, files: ['braces/index.js'] }),
    );
    assert.throws(() => validateArtifacts(directory));
  } finally {
    assert.ok(directory.startsWith(path.join(os.tmpdir(), 'commercehub-audit-artifacts-')));
    rmSync(directory, { recursive: true });
  }
});

export function fixture() {
  const evidence = {
    policy: structuredClone(source.policy),
    manifests: { '.': { devDependencies: { [names[0]]: versions[0] } } },
    lock: {
      lockfileVersion: '9.0',
      importers: {
        '.': { devDependencies: { [names[0]]: { specifier: versions[0], version: versions[0] } } },
      },
      packages: {},
      snapshots: {},
    },
  };
  names.forEach((name, index) => {
    evidence.lock.packages[`${name}@${versions[index]}`] = {};
    evidence.lock.snapshots[`${name}@${versions[index]}`] =
      index < 3 ? { dependencies: { [names[index + 1]]: versions[index + 1] } } : {};
  });
  const audit = {
    advisories: {
      1240992: {
        github_advisory_id: 'GHSA-vfj7-8cjw-p6xm',
        module_name: 'braces',
        severity: 'high',
        vulnerable_versions: '<=3.0.3',
        patched_versions: null,
        patched_versions_unpublished: true,
        findings: [
          {
            version: '3.0.3',
            paths: ['.>@next/eslint-plugin-next>fast-glob>micromatch>braces'],
            dev: true,
            optional: false,
            bundled: false,
          },
        ],
      },
    },
    metadata: { vulnerabilities: { info: 0, low: 0, moderate: 0, high: 1, critical: 0 } },
  };
  return { evidence, audit, status: 1, now: new Date(now) };
}
function evaluate(state) {
  return evaluateAudit(
    { status: state.status, stdout: state.stdout ?? JSON.stringify(state.audit) },
    state.evidence,
    state.now,
  );
}
function additional(state, severity) {
  state.audit.advisories.other = {
    ...structuredClone(state.audit.advisories['1240992']),
    github_advisory_id: 'GHSA-abcd-efgh-ijkl',
    severity,
  };
  state.audit.metadata.vulnerabilities[severity]++;
}

test('positive: exactly approved identity, chain, development scope and valid clock', () => {
  assert.equal(evaluate(fixture()).accepted, true);
});
test('positive: no high/critical findings', () => {
  const state = fixture();
  state.audit.advisories = {};
  state.audit.metadata.vulnerabilities.high = 0;
  state.status = 0;
  assert.equal(evaluate(state).accepted, false);
});
for (const severity of ['info', 'low', 'moderate'])
  test(`positive: ${severity} finding remains visible below threshold`, () => {
    const state = fixture();
    additional(state, severity);
    assert.equal(evaluate(state).lowerFindings, 1);
  });
test('positive: actual repository lock and all production roots are assessable', () => {
  assert.equal(validateExposure(source.lock, source.manifests), true);
});

const negatives = {
  'expired approval': (s) => {
    s.now = new Date('2026-11-03T00:00:00Z');
  },
  'missing expiry': (s) => {
    delete s.evidence.policy.exceptions[0].expiresAt;
  },
  'invalid expiry': (s) => {
    s.evidence.policy.exceptions[0].expiresAt = 'invalid';
  },
  'more than fourteen days': (s) => {
    s.evidence.policy.exceptions[0].expiresAt = '2026-11-03T00:00:00Z';
  },
  'changed advisory': (s) => {
    s.audit.advisories['1240992'].github_advisory_id = 'GHSA-abcd-efgh-ijkl';
  },
  'changed package': (s) => {
    s.audit.advisories['1240992'].module_name = 'other';
  },
  'changed version': (s) => {
    s.audit.advisories['1240992'].findings[0].version = '3.0.2';
  },
  'changed reported chain': (s) => {
    s.audit.advisories['1240992'].findings[0].paths = ['.>other>braces'];
  },
  'new production dependency edge': (s) => {
    s.evidence.manifests['.'].dependencies = { braces: '3.0.3' };
    s.evidence.lock.importers['.'].dependencies = {
      braces: { specifier: '3.0.3', version: '3.0.3' },
    };
  },
  'additional high': (s) => additional(s, 'high'),
  'transitive production dependency edge': (s) => {
    s.evidence.manifests['.'].dependencies = { 'fast-glob': '3.3.1' };
    s.evidence.lock.importers['.'].dependencies = {
      'fast-glob': { specifier: '3.3.1', version: '3.3.1' },
    };
  },
  'additional critical': (s) => additional(s, 'critical'),
  'duplicate ambiguous record': (s) => {
    s.audit.advisories.duplicate = structuredClone(s.audit.advisories['1240992']);
    s.audit.metadata.vulnerabilities.high++;
  },
  'malformed JSON': (s) => {
    s.stdout = '{';
  },
  'unsupported audit schema': (s) => {
    s.audit = { vulnerabilities: [] };
  },
  'network error JSON': (s) => {
    s.audit = { error: { code: 'ECONNRESET' } };
  },
  'unexpected exit code': (s) => {
    s.status = 2;
  },
  'missing policy': (s) => {
    delete s.evidence.policy;
  },
  'invalid policy structure': (s) => {
    s.evidence.policy = [];
  },
  'missing lockfile': (s) => {
    delete s.evidence.lock;
  },
  'inconsistent lockfile': (s) => {
    s.evidence.lock.importers['.'].devDependencies[names[0]].specifier = '*';
  },
  'missing production evidence': (s) => {
    delete s.evidence.manifests;
  },
  'mixed vulnerable package trees': (s) => {
    additional(s, 'high');
    s.audit.advisories.other.findings[0].paths = ['apps/api>other'];
  },
  'unauthorized wildcard': (s) => {
    s.evidence.policy.exceptions[0].version = '*';
  },
  'clock exactly at expiry': (s) => {
    s.now = new Date('2026-11-02T00:00:00Z');
  },
  'clock after expiry': (s) => {
    s.now = new Date('2026-11-02T00:00:00.001Z');
  },
  'invalid approval timestamp': (s) => {
    s.evidence.policy.exceptions[0].approvedOn = '2026-02-30';
  },
  'invalid runtime clock': (s) => {
    s.now = new Date('invalid');
  },
  'clock before approval': (s) => {
    s.now = new Date('2026-10-18T23:59:59Z');
  },
  'missing owner': (s) => {
    delete s.evidence.policy.exceptions[0].owner;
  },
  'missing reason': (s) => {
    s.evidence.policy.exceptions[0].reason = '';
  },
  'duplicate policy records': (s) => {
    s.evidence.policy.exceptions.push(structuredClone(s.evidence.policy.exceptions[0]));
  },
  'array-shaped object instead of exception array': (s) => {
    s.evidence.policy.exceptions = { 0: s.evidence.policy.exceptions[0], length: 1 };
  },
  'missing snapshot': (s) => {
    delete s.evidence.lock.snapshots['braces@3.0.3'];
  },
  'missing package entry': (s) => {
    delete s.evidence.lock.packages['braces@3.0.3'];
  },
  'changed locked ancestry': (s) => {
    s.evidence.lock.snapshots['fast-glob@3.3.1'].dependencies.braces = '3.0.3';
  },
  'audit counters hide additional findings': (s) => {
    additional(s, 'high');
    s.audit.metadata.vulnerabilities.high--;
  },
  'critical reclassification': (s) => {
    s.audit.advisories['1240992'].severity = 'critical';
    s.audit.metadata.vulnerabilities.high = 0;
    s.audit.metadata.vulnerabilities.critical = 1;
  },
  'available patch': (s) => {
    s.audit.advisories['1240992'].patched_versions = '>=3.0.4';
  },
  'production audit flag': (s) => {
    s.audit.advisories['1240992'].findings[0].dev = false;
  },
  'multiple paths': (s) => {
    s.audit.advisories['1240992'].findings[0].paths.push('apps/api>braces');
  },
  'unexpected audit success': (s) => {
    s.status = 0;
  },
  'empty schema cannot appear clean': (s) => {
    s.audit = {};
    s.status = 0;
  },
};
for (const [name, mutate] of Object.entries(negatives))
  test(`reject: ${name}`, () => {
    const state = fixture();
    mutate(state);
    assert.throws(() => evaluate(state));
  });

for (const [name, result] of Object.entries({
  'command not found': { error: { code: 'ENOENT' }, status: null },
  'network stderr': { status: 1, stdout: '{}', stderr: 'registry unavailable' },
  'unexpected exit': { status: 7, stdout: '{}' },
  timeout: { signal: 'SIGTERM', status: null, stdout: '{}' },
}))
  test(`runner rejects ${name}`, () =>
    assert.throws(() => runCommand('synthetic', [], { runner: () => result })));

test('actual runner preserves stdout and expected exit; missing executable fails closed', () => {
  assert.deepEqual(
    runCommand(process.execPath, ['-e', 'process.stdout.write("{}");process.exitCode=1']),
    { status: 1, stdout: '{}' },
  );
  assert.throws(() => runCommand('commercehub-nonexistent-audit-executable', []));
  assert.throws(() => runCommand(process.execPath, ['-e', 'process.exitCode=9']));
  assert.equal(spawnSync(process.execPath, ['-e', 'process.exitCode=0']).status, 0);
});
test('missing on-disk policy fails rather than using a fallback', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'commercehub-audit-'));
  try {
    assert.throws(() => readEvidence(directory));
  } finally {
    assert.ok(directory.startsWith(path.join(os.tmpdir(), 'commercehub-audit-')));
    rmSync(directory, { recursive: true });
  }
});

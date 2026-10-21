import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash, createHmac, pbkdf2Sync } from 'node:crypto';
import { once } from 'node:events';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { TLSSocket, createSecureContext, rootCertificates } from 'node:tls';

const require = createRequire(import.meta.url);
const {
  authenticateOnly,
  validateTarget,
  validateManifest,
  cleanProcessEnvironment,
} = require('../apps/api/dist/connectivity.js');
const root = path.resolve(import.meta.dirname, '..');
const { consumeAttempt } = require('../apps/api/dist/verify-connectivity.js');
const work = mkdtempSync(path.join(os.tmpdir(), 'ch006-offline-tls-'));
const openssl =
  process.platform === 'win32' && existsSync('C:/Program Files/Git/usr/bin/openssl.exe')
    ? 'C:/Program Files/Git/usr/bin/openssl.exe'
    : 'openssl';
const generation = spawnSync(
  openssl,
  [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-keyout',
    path.join(work, 'key.pem'),
    '-out',
    path.join(work, 'cert.pem'),
    '-days',
    '1',
    '-subj',
    '/CN=localhost',
    '-addext',
    'subjectAltName=DNS:localhost',
  ],
  { stdio: 'pipe', timeout: 15000 },
);
assert.equal(generation.status, 0, 'Offline TLS fixture generation requires existing OpenSSL');
const key = readFileSync(path.join(work, 'key.pem'));
const ca = readFileSync(path.join(work, 'cert.pem'), 'utf8');
const secureContext = createSecureContext({ key, cert: ca });
test.after(() => rmSync(work, { recursive: true, force: true }));

const int = (n) => {
  const b = Buffer.alloc(4);
  b.writeInt32BE(n);
  return b;
};
const message = (type, body) => Buffer.concat([Buffer.from(type), int(body.length + 4), body]);
const auth = (n, body = Buffer.alloc(0)) => message('R', Buffer.concat([int(n), body]));
const hmac = (key, value) => createHmac('sha256', key).update(value).digest();

async function fixture(t, mode = 'scram', user = 'synthetic_user') {
  const frames = [];
  const sockets = new Set();
  let terminated = false;
  let connections = 0;
  const server = createServer((raw) => {
    connections++;
    sockets.add(raw);
    raw.on('error', () => {});
    if (mode === 'stall') return;
    raw.once('data', (ssl) => {
      assert.deepEqual(ssl, Buffer.concat([int(8), int(80877103)]));
      frames.push('SSLRequest');
      if (mode === 'no-tls') {
        raw.end('N');
        return;
      }
      raw.write('S');
      if (mode === 'tls-stall') return;
      const socket = new TLSSocket(raw, { isServer: true, secureContext });
      sockets.add(socket);
      socket.on('error', () => {});
      let bytes = Buffer.alloc(0),
        startup = false,
        phase = 0,
        first,
        serverFirst;
      socket.on('data', (data) => {
        bytes = Buffer.concat([bytes, data]);
        while (bytes.length >= (startup ? 5 : 4)) {
          const size = startup ? bytes.readInt32BE(1) + 1 : bytes.readInt32BE(0);
          if (bytes.length < size) return;
          const frame = bytes.subarray(0, size);
          bytes = bytes.subarray(size);
          if (!startup) {
            assert.equal(frame.readInt32BE(4), 196608);
            assert.deepEqual(frame.subarray(8).toString().split('\0').filter(Boolean), [
              'user',
              user,
              'database',
              'synthetic_db',
              'client_encoding',
              'UTF8',
            ]);
            startup = true;
            frames.push('Startup');
            if (mode === 'auth-stall') continue;
            if (mode === 'trust') {
              socket.write(auth(0));
              continue;
            }
            if (mode === 'reject') {
              socket.end(
                message('E', Buffer.from('SFATAL\0C28P01\0Msynthetic-sensitive-marker\0\0')),
              );
            } else if (mode === 'cleartext' || mode === 'invalid-password') socket.write(auth(3));
            else socket.write(auth(10, Buffer.from('SCRAM-SHA-256\0\0')));
          } else {
            const type = frame.subarray(0, 1).toString();
            frames.push(type);
            // Every client application frame is inspected, never just connect()'s outcome.
            assert.ok(
              ['p', 'X'].includes(type),
              'Forbidden Query/Parse/Bind/Execute/COPY/replication frame',
            );
            if (type === 'X') {
              terminated = true;
              socket.end();
              continue;
            }
            const body = frame.subarray(5);
            if (mode === 'invalid-password') {
              assert.equal(body.toString(), 'synthetic-invalid-password\0');
              socket.end(
                message('E', Buffer.from('SFATAL\0C28P01\0Msynthetic-sensitive-marker\0\0')),
              );
              continue;
            }
            if (mode === 'cleartext') {
              assert.equal(body.toString(), 'synthetic-password\0');
              socket.write(auth(0));
            } else if (phase++ === 0) {
              const end = body.indexOf(0);
              assert.equal(body.subarray(0, end).toString(), 'SCRAM-SHA-256');
              first = body
                .subarray(end + 5)
                .toString()
                .slice(3);
              const nonce = first
                .split(',')
                .find((x) => x.startsWith('r='))
                .slice(2);
              if (mode === 'premature-ok') {
                socket.write(auth(0));
                continue;
              }
              serverFirst = `r=${nonce}server,s=c3ludGhldGljLXNhbHQ=,i=4096`;
              socket.write(auth(11, Buffer.from(serverFirst)));
            } else {
              const final = body.toString(),
                withoutProof = final.slice(0, final.lastIndexOf(',p='));
              const salted = pbkdf2Sync(
                'synthetic-password',
                Buffer.from('synthetic-salt'),
                4096,
                32,
                'sha256',
              );
              const text = `${first},${serverFirst},${withoutProof}`;
              const clientKey = hmac(salted, 'Client Key');
              const signature = hmac(createHash('sha256').update(clientKey).digest(), text);
              assert.equal(
                final.split(',p=')[1],
                Buffer.from(clientKey.map((b, i) => b ^ signature[i])).toString('base64'),
              );
              const proof =
                mode === 'bad-proof' ? Buffer.alloc(32) : hmac(hmac(salted, 'Server Key'), text);
              socket.write(auth(12, Buffer.from(`v=${proof.toString('base64')}`)));
              socket.write(auth(0));
              // Deliberately no ReadyForQuery: client must terminate at AuthenticationOk.
            }
          }
        }
      });
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    for (const s of sockets) s.destroy();
    await new Promise((r) => server.close(r));
  });
  return {
    input: {
      host: 'localhost',
      port: server.address().port,
      database: 'synthetic_db',
      user,
      password: 'synthetic-password',
      ca,
    },
    frames,
    terminated: () => terminated,
    connections: () => connections,
  };
}

test('SCRAM authentication sends only SSLRequest, Startup, two auth responses and Terminate', async (t) => {
  const f = await fixture(t);
  assert.equal((await authenticateOnly(f.input, 2000)).status, 'PASS');
  assert.deepEqual(f.frames, ['SSLRequest', 'Startup', 'p', 'p', 'X']);
  assert.ok(f.terminated());
});
test('TLS protected password authentication also immediately terminates without SQL', async (t) => {
  const f = await fixture(t, 'cleartext');
  assert.equal((await authenticateOnly(f.input, 2000)).status, 'PASS');
  assert.deepEqual(f.frames, ['SSLRequest', 'Startup', 'p', 'X']);
});

test('failed synthetic authentication makes one connection without retry or target fallback', async (t) => {
  const f = await fixture(t, 'reject');
  const result = await authenticateOnly(f.input, 350);
  assert.deepEqual(result, { status: 'BLOCKED', code: 'CONNECTION' });
  await new Promise((resolve) => setTimeout(resolve, 400));
  assert.equal(f.connections(), 1);
  assert.deepEqual(f.frames, ['SSLRequest', 'Startup']);
});

for (const mode of ['scram', 'cleartext', 'reject', 'bad-proof']) {
  test(`Session Pooler routing username: ${mode}, authentication frames only`, async (t) => {
    const f = await fixture(t, mode, 'synthetic_user.synthetic-ref');
    const result = await authenticateOnly(f.input, 2000);
    assert.equal(result.status, ['scram', 'cleartext'].includes(mode) ? 'PASS' : 'BLOCKED');
    assert.ok(!JSON.stringify(result).includes('synthetic'));
    if (result.status === 'PASS') {
      assert.deepEqual(
        f.frames,
        mode === 'scram'
          ? ['SSLRequest', 'Startup', 'p', 'p', 'X']
          : ['SSLRequest', 'Startup', 'p', 'X'],
      );
      assert.ok(f.terminated());
    }
  });
}

test('Session Pooler exact approval and project routing are required offline', () => {
  const base = {
    organizationId: 'synthetic-org',
    projectRef: 'synthetic-ref',
    projectName: 'commercehub',
    environment: 'persistent-development',
    mode: 'session',
    host: 'synthetic.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'synthetic_user.synthetic-ref',
    custodyReviewed: true,
  };
  const digest = createHash('sha256').update('synthetic-org:synthetic-ref').digest('hex');
  const approval = { host: base.host, user: base.user };
  assert.equal(validateManifest(base, digest, approval), true);
  assert.equal(validateManifest(base, digest), false);
  assert.equal(validateTarget(base), false);
  for (const patch of [
    { organizationId: 'other-org' },
    { projectRef: 'other-ref' },
    { projectName: 'Expense Tracker' },
    { environment: 'production' },
    { environment: 'staging' },
    { mode: 'transaction' },
    { mode: 'direct' },
    { port: 6543 },
    { port: '5432' },
    { host: '*.pooler.supabase.com' },
    { host: 'other.pooler.supabase.com' },
    { host: 'arbitrary.invalid' },
    { user: 'synthetic_user' },
    { user: 'other_user.synthetic-ref' },
    { user: 'synthetic_user.other-ref' },
    { custodyReviewed: false },
    { ssl: { rejectUnauthorized: false } },
    { connectionString: 'synthetic' },
  ])
    assert.equal(validateManifest({ ...base, ...patch }, digest, approval), false);
  assert.equal(
    validateManifest(base, digest, { ...approval, host: '*.pooler.supabase.com' }),
    false,
  );
  assert.equal(
    validateManifest({ ...base, user: 'synthetic_user.other-ref' }, digest, {
      ...approval,
      user: 'synthetic_user.other-ref',
    }),
    false,
  );
});

test('production target authority accepts only the exact owner-approved pooler tuple offline', () => {
  const base = {
    organizationId: 'cjtfuyrqxgkqnyjdpirx',
    projectRef: 'uktducdwfzakyoolysvt',
    projectName: 'commercehub',
    environment: 'persistent-development',
    mode: 'session',
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.uktducdwfzakyoolysvt',
    custodyReviewed: true,
  };
  assert.equal(validateTarget(base), true);
  for (const patch of [
    { host: 'aws-0-eu-central-1.pooler.supabase.com' },
    { host: 'aws-2-eu-central-1.pooler.supabase.com' },
    { host: 'aws-1-us-east-1.pooler.supabase.com' },
    { host: '*.pooler.supabase.com' },
    { host: 'arbitrary.invalid' },
    { host: base.host + '.attacker.invalid' },
    { host: base.host.toUpperCase() },
    { user: 'postgres' },
    { user: 'other.uktducdwfzakyoolysvt' },
    { user: 'postgres.other-project' },
    { user: base.user + '.other' },
    { organizationId: 'other-org' },
    { projectRef: 'other-project' },
    { projectName: 'Expense Tracker' },
    { environment: 'production' },
    { environment: 'staging' },
    { environment: 'disposable-test' },
    { mode: 'transaction' },
    { mode: 'direct' },
    { port: 6543 },
    { port: '5432' },
    { database: 'other' },
    { custodyReviewed: false },
    { connectionString: 'synthetic' },
    { ssl: { rejectUnauthorized: false } },
  ])
    assert.equal(validateTarget({ ...base, ...patch }), false);
  assert.equal(
    validateTarget({
      ...base,
      mode: 'direct',
      host: 'db.uktducdwfzakyoolysvt.supabase.co',
      user: 'synthetic_user',
    }),
    true,
  );
});
for (const mode of [
  'reject',
  'bad-proof',
  'premature-ok',
  'no-tls',
  'stall',
  'tls-stall',
  'auth-stall',
  'trust',
]) {
  test(`${mode} fails closed, cleans up and exposes no server/credential error text`, async (t) => {
    const f = await fixture(t, mode);
    const result = await authenticateOnly(f.input, 350);
    assert.equal(result.status, 'BLOCKED');
    assert.ok(!JSON.stringify(result).includes('synthetic'));
    assert.ok(!f.frames.some((x) => ['Q', 'P', 'B', 'E'].includes(x)));
  });
}
test('invalid synthetic password is rejected offline without raw authentication diagnostics', async (t) => {
  const f = await fixture(t, 'invalid-password');
  const result = await authenticateOnly(
    { ...f.input, password: 'synthetic-invalid-password' },
    1000,
  );
  assert.equal(result.status, 'BLOCKED');
  assert.ok(!JSON.stringify(result).includes('synthetic'));
  assert.deepEqual(f.frames, ['SSLRequest', 'Startup', 'p']);
});
test('real TLS rejects a certificate hostname mismatch before Startup', async (t) => {
  const f = await fixture(t);
  assert.equal((await authenticateOnly({ ...f.input, host: '127.0.0.1' }, 1000)).status, 'BLOCKED');
  assert.deepEqual(f.frames, ['SSLRequest']);
});
test('real TLS rejects untrusted CA before Startup', async (t) => {
  const f = await fixture(t);
  assert.equal(
    (await authenticateOnly({ ...f.input, ca: 'invalid-synthetic-ca' }, 1000)).status,
    'BLOCKED',
  );
  assert.deepEqual(f.frames, ['SSLRequest']);
});

test('Session Pooler username cannot bypass hostname or valid unrelated CA rejection', async (t) => {
  for (const override of [{ host: '127.0.0.1' }, { ca: rootCertificates[0] }]) {
    const f = await fixture(t, 'scram', 'synthetic_user.synthetic-ref');
    assert.equal((await authenticateOnly({ ...f.input, ...override }, 1000)).status, 'BLOCKED');
    assert.deepEqual(f.frames, ['SSLRequest']);
  }
});
test('target guard rejects every synthetic forbidden target without network access', () => {
  const base = {
    organizationId: 'synthetic-org',
    projectRef: 'synthetic-ref',
    projectName: 'commercehub',
    environment: 'persistent-development',
    mode: 'direct',
    host: 'db.synthetic-ref.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'synthetic_user',
    custodyReviewed: true,
  };
  const digest = createHash('sha256').update('synthetic-org:synthetic-ref').digest('hex');
  assert.equal(validateManifest(base, digest), true);
  assert.equal(validateTarget(base), false);
  for (const value of [
    null,
    {},
    { ...base, projectName: 'Expense Tracker' },
    { ...base, environment: 'production' },
    { ...base, environment: 'staging' },
    { ...base, environment: 'disposable-test' },
    { ...base, mode: 'transaction' },
    { ...base, host: '*.supabase.co' },
    { ...base, user: '' },
    { ...base, port: 6543 },
    { ...base, custodyReviewed: false },
    { ...base, connectionString: 'synthetic' },
  ]) {
    assert.equal(validateManifest(value, digest), false);
  }
});
test('ambiguous driver/TLS environment is rejected rather than inherited', () => {
  assert.equal(cleanProcessEnvironment({ PATH: 'synthetic' }), true);
  for (const key of [
    'PGHOST',
    'pGhOsT',
    'node_debug',
    'PGOPTIONS',
    'PGPASSWORD',
    'DATABASE_URL',
    'DIRECT_URL',
    'POSTGRES_URL',
    'POSTGRESQL_URL',
    'SESSION_POOLER_URL',
    'TRANSACTION_POOLER_URL',
    'POOLER_URL',
    'SUPABASE_DB_URL',
    'SSL_CERT_FILE',
    'SSL_CERT_DIR',
    'NODE_OPTIONS',
    'NODE_TLS_REJECT_UNAUTHORIZED',
    'NODE_EXTRA_CA_CERTS',
  ]) {
    assert.equal(cleanProcessEnvironment({ [key]: 'synthetic' }), false);
  }
});
test('CLI without explicit invocation cannot connect and emits only a redacted result', () => {
  const r = spawnSync(process.execPath, ['apps/api/dist/verify-connectivity.js'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(r.status, 1);
  assert.deepEqual(JSON.parse(r.stdout), { status: 'BLOCKED', code: 'LOCAL_CUSTODY_OR_TARGET' });
  assert.equal(r.stderr, '');
});

test('exclusive local attempt ledger prevents repeat and concurrent claims', async () => {
  const file = path.join(work, 'attempt-ledger');
  const claims = await Promise.allSettled(
    Array.from({ length: 8 }, () => Promise.resolve().then(() => consumeAttempt(file))),
  );
  assert.equal(claims.filter((x) => x.status === 'fulfilled').length, 1);
  assert.equal(claims.filter((x) => x.status === 'rejected').length, 7);
  assert.throws(() => consumeAttempt(file));
});

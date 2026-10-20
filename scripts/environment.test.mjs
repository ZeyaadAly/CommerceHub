import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';

const root = path.resolve(import.meta.dirname, '..');
const api = path.join(root, 'apps/api');
const require = createRequire(import.meta.url);
const { readApiConfig, ApiConfigurationError } = require('../apps/api/dist/config.js');
const cleanEnv = () => {
  const env = { ...process.env };
  delete env.PORT;
  delete env.NODE_ENV;
  return env;
};

test('optional API configuration preserves deterministic development/test defaults', () => {
  assert.deepEqual(readApiConfig({}), { port: 3002 });
  for (const NODE_ENV of ['development', 'test']) {
    assert.deepEqual(readApiConfig({ NODE_ENV }), { port: 3002 });
  }
});

test('valid explicit API configuration works in every supported mode', () => {
  for (const NODE_ENV of ['development', 'test', 'production']) {
    for (const PORT of ['1', '3002', '65535']) {
      assert.deepEqual(readApiConfig({ NODE_ENV, PORT }), { port: Number(PORT) });
    }
  }
});

test('missing required production port fails without falling back to development', () => {
  assert.throws(() => readApiConfig({ NODE_ENV: 'production' }), {
    name: 'Error',
    message: 'Missing API configuration: PORT.',
  });
});

test('malformed ports and unsupported modes fail with field-only errors', () => {
  for (const PORT of ['', '0', '65536', '-1', '1.5', '3e3', '03002', ' 3002', '3002 ', 'NaN']) {
    assert.throws(() => readApiConfig({ PORT }), ApiConfigurationError);
  }
  for (const NODE_ENV of ['', 'staging', 'unknown']) {
    assert.throws(() => readApiConfig({ NODE_ENV }), ApiConfigurationError);
  }
});

test('invalid configuration never includes supplied values or unrelated secrets in errors', () => {
  const marker = 'synthetic-sensitive-marker';
  for (const key of ['PORT', 'NODE_ENV']) {
    assert.throws(
      () => readApiConfig({ [key]: marker, UNRELATED_TEST_SECRET: marker }),
      (error) => {
        assert.equal(error.message, `Invalid API configuration: ${key}.`);
        assert.ok(!error.stack.includes(marker));
        return true;
      },
    );
  }
});

test('unknown future integration values are unused and cannot select a production endpoint', () => {
  assert.deepEqual(readApiConfig({ UNIMPLEMENTED_TEST_ENDPOINT: 'https://example.invalid' }), {
    port: 3002,
  });
});

test('native optional env file loading uses API working directory and shell wins', () => {
  const fixture = mkdtempSync(path.join(os.tmpdir(), 'commercehub-006-env-'));
  const script = `console.log(JSON.stringify(require(${JSON.stringify(path.join(api, 'dist/config.js'))}).readApiConfig(process.env)))`;
  const run = (env) =>
    spawnSync(process.execPath, ['--env-file-if-exists=.env', '-e', script], {
      cwd: fixture,
      env: { ...cleanEnv(), ...env },
      encoding: 'utf8',
      timeout: 10_000,
    });
  try {
    const absent = run({});
    assert.equal(absent.status, 0);
    assert.deepEqual(JSON.parse(absent.stdout), { port: 3002 });
    writeFileSync(path.join(fixture, '.env'), 'PORT=31002\nNODE_ENV=test\n');
    const fromFile = run({});
    assert.equal(fromFile.status, 0);
    assert.deepEqual(JSON.parse(fromFile.stdout), { port: 31002 });
    const fromShell = run({ PORT: '32002' });
    assert.equal(fromShell.status, 0);
    assert.deepEqual(JSON.parse(fromShell.stdout), { port: 32002 });
  } finally {
    assert.ok(fixture.startsWith(path.join(os.tmpdir(), 'commercehub-006-env-')));
    rmSync(fixture, { recursive: true });
  }
});

test('actual API startup exits nonzero for invalid/missing configuration without disclosure', () => {
  for (const override of [
    { PORT: 'synthetic-sensitive-marker' },
    { NODE_ENV: 'synthetic-sensitive-marker' },
    { NODE_ENV: 'production' },
  ]) {
    const result = spawnSync(process.execPath, ['dist/main.js'], {
      cwd: api,
      env: { ...cleanEnv(), ...override },
      encoding: 'utf8',
      timeout: 10_000,
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /(?:Invalid|Missing) API configuration: (?:PORT|NODE_ENV)\./);
    assert.doesNotMatch(result.stdout + result.stderr, /synthetic-sensitive-marker/);
    assert.doesNotMatch(result.stdout, /Nest application successfully started/);
  }
});

test('actual API preserves health and 404 behavior; occupied port fails without retry fallback', async () => {
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const { port } = reservation.address();
  await new Promise((resolve, reject) =>
    reservation.close((error) => (error ? reject(error) : resolve())),
  );
  const env = { ...cleanEnv(), NODE_ENV: 'test', PORT: String(port) };
  const child = spawn(process.execPath, ['dist/main.js'], {
    cwd: api,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk;
  });
  child.stderr.on('data', (chunk) => {
    output += chunk;
  });
  const closed = once(child, 'close');
  try {
    const url = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      assert.equal(child.exitCode, null, output);
      try {
        const response = await fetch(`${url}/health`, { signal: AbortSignal.timeout(500) });
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), { status: 'ok' });
        ready = true;
        break;
      } catch {
        await delay(100);
      }
    }
    assert.ok(ready, output);
    for (const [route, method] of [
      ['/missing', 'GET'],
      ['/health', 'POST'],
    ]) {
      const response = await fetch(url + route, { method, signal: AbortSignal.timeout(2000) });
      assert.equal(response.status, 404);
    }
    const conflict = spawnSync(process.execPath, ['dist/main.js'], {
      cwd: api,
      env,
      encoding: 'utf8',
      timeout: 10_000,
    });
    assert.equal(conflict.status, 1);
    assert.match(conflict.stderr, /API bootstrap failed\./);
  } finally {
    child.kill();
    await closed;
  }
});

test('frontend placeholders expose no public URL contract or backend configuration', () => {
  for (const app of ['storefront', 'admin']) {
    const config = readFileSync(path.join(root, `apps/${app}/next.config.ts`), 'utf8');
    const page = readFileSync(path.join(root, `apps/${app}/app/page.tsx`), 'utf8');
    assert.doesNotMatch(config + page, /process\.env|NEXT_PUBLIC_|apps\/api/);
    assert.doesNotMatch(config, /\benv\s*:/);
  }
  // Invalid-public-URL validation is N/A: no URL consumer exists. Do not invent one.
});

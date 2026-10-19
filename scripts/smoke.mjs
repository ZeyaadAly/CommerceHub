import assert from 'node:assert/strict';
const results = [];
const request = (url, options = {}) =>
  fetch(url, {
    ...options,
    signal: AbortSignal.timeout(120_000),
  });

for (const [port, title] of [
  [3000, 'CommerceHub storefront'],
  [3001, 'CommerceHub administration'],
]) {
  const response = await request(`http://127.0.0.1:${port}/`);
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.ok(body.includes(title));
  assert.ok(body.includes('<main'));
  results.push({ port, path: '/', status: response.status, placeholder: true });
}

const health = await request('http://127.0.0.1:3002/health');
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), { status: 'ok' });
results.push({ port: 3002, path: '/health', status: 200 });

for (const [route, method] of [
  ['/missing', 'GET'],
  ['/health', 'POST'],
]) {
  const response = await request(`http://127.0.0.1:3002${route}`, { method });
  assert.equal(response.status, 404);
  results.push({ port: 3002, path: route, method, status: response.status });
}

console.log(JSON.stringify(results, null, 2));

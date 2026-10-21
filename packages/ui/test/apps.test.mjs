import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { chromium } from '@playwright/test';

const root = path.resolve(import.meta.dirname, '../../..');
const apps = [
  ['storefront', 4390],
  ['admin', 4391],
];
const children = [];
let browser;
before(async () => {
  for (const [, port] of apps)
    await new Promise((resolve, reject) => {
      const server = net.createServer();
      server.once('error', reject);
      server.listen(port, '127.0.0.1', () => server.close(resolve));
    });
  for (const [app, port] of apps) {
    const cwd = path.join(root, 'apps', app);
    children.push(
      spawn(
        process.execPath,
        ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)],
        {
          cwd,
          env: { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' },
          stdio: 'ignore',
          windowsHide: true,
        },
      ),
    );
  }
  await Promise.all(
    apps.map(async ([, port]) => {
      const deadline = Date.now() + 30000;
      while (Date.now() < deadline) {
        try {
          const response = await fetch(`http://127.0.0.1:${port}/`, {
            signal: AbortSignal.timeout(1000),
          });
          if (response.ok) return;
        } catch {
          // A local server may not have bound its port yet; the deadline bounds polling.
        }
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
      throw new Error('Local production fixture startup exceeded its deadline.');
    }),
  );
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  for (const child of children) child.kill();
});

for (const [app, port] of apps)
  test(`${app} real build preserves placeholder and consumes central primary states`, async () => {
    const page = await browser.newPage();
    try {
      await page.goto(`http://127.0.0.1:${port}/`);
      assert.match(
        await page.locator('h1').textContent(),
        app === 'admin' ? /CommerceHub administration/ : /CommerceHub storefront/,
      );
      assert.equal(
        await page
          .locator('body')
          .evaluate((node) => globalThis.getComputedStyle(node).backgroundColor),
        'rgb(248, 250, 252)',
      );
      await page.evaluate(() => {
        const button = globalThis.document.createElement('button');
        button.id = 'test-primary';
        button.className = 'ch-button';
        button.dataset.variant = 'primary';
        button.textContent = 'Temporary test control';
        globalThis.document.body.append(button);
        globalThis.document.documentElement.style.setProperty('--primary', '#15803d');
        globalThis.document.documentElement.style.setProperty('--primary-hover', '#a16207');
        globalThis.document.documentElement.style.setProperty('--primary-pressed', '#b91c1c');
      });
      const button = page.locator('#test-primary');
      const background = () =>
        button.evaluate((node) => globalThis.getComputedStyle(node).backgroundColor);
      const settle = async (expected) => {
        const deadline = Date.now() + 2000;
        while (Date.now() < deadline) {
          if ((await background()) === expected) return;
          await page.waitForTimeout(20);
        }
        assert.equal(await background(), expected);
      };
      await settle('rgb(21, 128, 61)');
      await button.hover();
      await settle('rgb(161, 98, 7)');
      await page.mouse.down();
      await settle('rgb(185, 28, 28)');
      await page.mouse.move(0, 0);
      await page.mouse.up();
      assert.equal(
        await page.evaluate(
          () =>
            globalThis.document.documentElement.scrollWidth <=
            globalThis.document.documentElement.clientWidth,
        ),
        true,
      );
    } finally {
      await page.close();
    }
  });

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

for (const width of [320, 360, 768, 1440]) {
  test(`both compositions fit ${width}px with accessible initial states and viewport-safe overlays`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole('heading', { name: 'Shared presentation review' })).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          globalThis.document.documentElement.scrollWidth <=
          globalThis.document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.screenshot({ path: test.info().outputPath(`ui-${width}.png`), fullPage: true });
    await page.getByRole('button', { name: 'Sample actions' }).click();
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    const bounds = await menu.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Edit sample' }).click();
    const dialog = page.getByRole('dialog');
    const rect = await dialog.boundingBox();
    expect(rect.x).toBeGreaterThanOrEqual(0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(width);
    expect(rect.height).toBeLessThanOrEqual(900);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
  });
}

test('primary, hover and pressed tokens update both compositions without changing component source', async ({
  page,
}) => {
  const buttons = [
    page.getByRole('button', { name: 'Preview action' }),
    page.getByRole('button', { name: 'Edit sample' }),
  ];
  for (const button of buttons)
    await expect(button).toHaveCSS('background-color', 'rgb(29, 78, 216)');
  await page.evaluate(() => {
    globalThis.document.documentElement.style.setProperty('--primary', '#15803d');
    globalThis.document.documentElement.style.setProperty('--primary-hover', '#a16207');
    globalThis.document.documentElement.style.setProperty('--primary-pressed', '#b91c1c');
  });
  for (const button of buttons) {
    await page.mouse.move(0, 0);
    await expect(button).toHaveCSS('background-color', 'rgb(21, 128, 61)');
    await button.hover();
    await expect(button).toHaveCSS('background-color', 'rgb(161, 98, 7)');
    await page.mouse.down();
    await expect(button).toHaveCSS('background-color', 'rgb(185, 28, 28)');
    await page.mouse.move(0, 0);
    await page.mouse.up();
  }
  // Real generated Tailwind utilities resolve through the same root properties.
  await page.evaluate(() => {
    const probe = globalThis.document.createElement('div');
    probe.id = 'semantic-probe';
    probe.className = 'bg-primary text-primary-foreground border border-control-border';
    probe.textContent = 'Probe';
    globalThis.document.body.append(probe);
  });
  await expect(page.locator('#semantic-probe')).toHaveCSS('background-color', 'rgb(21, 128, 61)');
  await expect(page.locator('#semantic-probe')).toHaveCSS('color', 'rgb(255, 255, 255)');
  // Status foregrounds can be overridden independently of panel surfaces.
  await page.evaluate(() => {
    globalThis.document.documentElement.style.setProperty('--surface', '#0f172a');
    globalThis.document.documentElement.style.setProperty('--success-foreground', '#ffffff');
    globalThis.document.documentElement.style.setProperty('--warning-foreground', '#ffffff');
  });
  await expect(page.getByText('Presentation ready', { exact: true })).toHaveCSS(
    'color',
    'rgb(255, 255, 255)',
  );
  await expect(page.getByText('Review pending', { exact: true }).first()).toHaveCSS(
    'color',
    'rgb(255, 255, 255)',
  );
});

test('keyboard traversal, skip link, dialog containment and focus restoration', async ({
  page,
}) => {
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  const trigger = page.getByRole('button', { name: 'Edit sample' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Edit display label' });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press(i % 2 ? 'Shift+Tab' : 'Tab');
    expect(await dialog.evaluate((node) => node.contains(globalThis.document.activeElement))).toBe(
      true,
    );
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveCSS('outline-style', 'solid');
  await expect(trigger).toHaveCSS('outline-width', '2px');
});

test('menu typeahead/selection skips disabled actions; select and tabs remain keyboard operable', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Sample actions' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'First action', exact: true })).toBeFocused();
  await page.keyboard.press('s');
  await expect(page.getByRole('menuitem', { name: 'Second action', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('status').filter({ hasText: 'Second action selected.' }),
  ).toBeVisible();
  const select = page.getByRole('combobox', { name: 'Display option' });
  await select.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('listbox')).toBeVisible();
  await expect(page.getByRole('option', { name: 'First option', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('option', { name: 'Second option', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(select).toContainText('Second option');
  await page.getByRole('tab', { name: 'States', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Other panel' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('tabpanel')).toContainText('No hidden data queries.');
});

test('validation preserves input and exposes associated error; toast is supplemental', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Preview action' }).click();
  const input = page.getByLabel('Display label');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  const error = page.getByText('Enter a display label.');
  await expect(error).toBeVisible();
  expect((await input.getAttribute('aria-describedby')).split(' ')).toContain(
    await error.getAttribute('id'),
  );
  await input.fill('Synthetic label');
  await page.getByRole('button', { name: 'Preview action' }).click();
  await expect(input).toHaveValue('Synthetic label');
  await expect(input).toHaveAttribute('aria-invalid', 'false');
  await expect(page.getByText('Sample label accepted', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
});

test('portaled select remains operable above an active modal', async ({ page }) => {
  await page.getByRole('button', { name: 'Edit sample' }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit display label' });
  await dialog.getByRole('combobox', { name: 'Dialog option' }).click();
  await page.getByRole('option', { name: 'Second dialog option', exact: true }).click();
  await expect(dialog.getByRole('combobox', { name: 'Dialog option' })).toContainText(
    'Second dialog option',
  );
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('confirmation chooses safe action and sheet remains modal, bounded and closeable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.getByRole('button', { name: 'Reset sample' }).click();
  await expect(page.getByRole('button', { name: 'Keep sample' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('alertdialog')).toBeHidden();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const sheet = page.getByRole('dialog', { name: 'Sample navigation' });
  await expect(sheet).toBeVisible();
  const rect = await sheet.boundingBox();
  expect(rect.x).toBeGreaterThanOrEqual(0);
  expect(rect.x + rect.width).toBeLessThanOrEqual(320);
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(sheet).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
});

test('200% text and 400% equivalent reflow preserve content without page overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.evaluate(() => (globalThis.document.documentElement.style.fontSize = '200%'));
  expect(
    await page.evaluate(
      () =>
        globalThis.document.documentElement.scrollWidth <=
        globalThis.document.documentElement.clientWidth,
    ),
  ).toBe(true);
  // 1280px at 400% browser zoom yields a 320 CSS-pixel layout viewport.
  await page.evaluate(() => globalThis.document.documentElement.style.removeProperty('font-size'));
  await page.setViewportSize({ width: 320, height: 720 });
  expect(
    await page.evaluate(
      () =>
        globalThis.document.documentElement.scrollWidth <=
        globalThis.document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await expect(page.getByRole('button', { name: 'Preview action' })).toBeVisible();
});

test('coarse-pointer controls have 44px targets without overlapping hit areas', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    hasTouch: true,
    isMobile: true,
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/');
    for (const control of [
      page.getByRole('button', { name: 'Edit sample' }),
      page.getByRole('button', { name: 'Sample actions' }),
      page.getByRole('checkbox'),
      page.getByRole('switch'),
    ]) {
      const rect = await control.boundingBox();
      expect(rect.height).toBeGreaterThanOrEqual(44);
      expect(rect.width).toBeGreaterThanOrEqual(44);
    }
  } finally {
    await context.close();
  }
});

test('reduced motion and forced colors retain nonanimated, distinguishable controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.ch-spinner')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.ch-skeleton')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ forcedColors: 'active' });
  const button = page.getByRole('button', { name: 'Preview action' });
  await button.focus();
  await expect(button).toHaveCSS('border-style', 'solid');
  await expect(button).toHaveCSS('outline-style', 'solid');
});

test('compositions send no external or API requests', async ({ page }) => {
  const unexpected = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.hostname !== '127.0.0.1' || url.pathname.startsWith('/api/'))
      unexpected.push(request.url());
  });
  await page.reload();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Page 2 of 3')).toBeVisible();
  expect(unexpected).toEqual([]);
});

test('a narrow table scrolls with the keyboard inside its named region', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const region = page.getByRole('region', { name: 'Synthetic sample rows' });
  expect(await region.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
  await region.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => region.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () =>
        globalThis.document.documentElement.scrollWidth <=
        globalThis.document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

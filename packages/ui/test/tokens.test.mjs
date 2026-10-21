import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
const root = path.resolve(import.meta.dirname, '../../..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const tokens = read('packages/ui/src/styles/tokens.css');
const theme = read('packages/ui/src/styles/theme.css');
const variables = Object.fromEntries(
  [...tokens.matchAll(/(--[\w-]+):\s*(#[a-f\d]{6})\s*;/gi)].map((m) => [m[1], m[2]]),
);
function luminance(color) {
  return color
    .slice(1)
    .match(/../g)
    .map((hex) => parseInt(hex, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}
const ratio = (a, b) => {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
test('both apps consume one package-exported theme with shared Tailwind source detection', () => {
  for (const app of ['admin', 'storefront']) {
    const css = read(`apps/${app}/app/globals.css`);
    assert.match(css, /@import '@commercehub\/ui\/styles\/theme.css'/);
    assert.match(css, /@source .*packages\/ui\/src/);
    assert.doesNotMatch(css, /#(?:[a-f\d]{3})\b|--primary\s*:/i);
  }
  const manifest = JSON.parse(read('packages/ui/package.json'));
  assert.equal(manifest.exports['./styles/theme.css'], './src/styles/theme.css');
  assert.match(theme, /@import '\.\/tokens.css'/);
});
test('semantic Tailwind color mappings reference canonical properties, including independently changeable states', () => {
  assert.match(theme, /@theme inline/);
  for (const name of [
    'background',
    'foreground',
    'surface',
    'surface-muted',
    'primary',
    'primary-foreground',
    'primary-hover',
    'primary-pressed',
    'success-foreground',
    'warning-foreground',
    'danger-foreground',
    'control-border',
    'focus-ring',
    'danger',
  ])
    assert.ok(theme.includes(`--color-${name}: var(--${name})`), name);
  assert.equal(variables['--primary'], '#1d4ed8');
  assert.equal(variables['--primary-hover'], '#1e40af');
  assert.equal(variables['--primary-pressed'], '#1e3a8a');
});
test('component sources and shared component CSS contain no fixed palette or literal colors', () => {
  const visit = (folder) =>
    readdirSync(path.join(root, folder), { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? visit(`${folder}/${e.name}`) : [`${folder}/${e.name}`],
    );
  for (const file of [
    ...visit('packages/ui/src/components'),
    'packages/ui/src/styles/components.css',
  ]) {
    const text = read(file);
    assert.doesNotMatch(text, /#(?:[a-f\d]{3,8})\b|\b(?:rgb|rgba|hsl|hsla)\(/i, file);
    assert.doesNotMatch(
      text,
      /\b(?:bg|text|border|ring|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d+)?\b/,
      file,
    );
    assert.doesNotMatch(
      text,
      /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(|localStorage|sessionStorage/,
      file,
    );
  }
});
test('all approved text and non-text pairs pass unrounded contrast thresholds', () => {
  assert.equal(ratio('#000000', '#ffffff'), 21);
  assert.equal(ratio('#ffffff', '#ffffff'), 1);
  for (const [fg, bg, target] of [
    ['foreground', 'background', 4.5],
    ['muted-foreground', 'surface-muted', 4.5],
    ['primary-foreground', 'primary', 4.5],
    ['primary-foreground', 'primary-hover', 4.5],
    ['primary-foreground', 'primary-pressed', 4.5],
    ['success', 'surface', 4.5],
    ['warning', 'surface', 4.5],
    ['danger', 'surface', 4.5],
    ['control-border', 'background', 3],
    ['control-border', 'surface', 3],
    ['focus-ring', 'background', 3],
    ['focus-ring', 'surface', 3],
  ])
    assert.ok(ratio(variables[`--${fg}`], variables[`--${bg}`]) >= target, `${fg}/${bg}`);
  assert.ok(
    ratio(variables['--border'], variables['--surface']) < 3,
    'decorative border is not sufficient for control identity',
  );
});
test('all required geometry, focus and motion foundations are centrally defined', () => {
  for (const name of [
    'font-family',
    'type-body',
    'leading-body',
    'space-unit',
    'radius-control',
    'shadow-overlay',
    'width-storefront',
    'width-admin',
    'control-compact',
    'control-default',
    'control-touch',
    'motion-fast',
    'motion-normal',
    'focus-width',
    'focus-gap',
  ])
    assert.ok(tokens.includes(`--${name}:`), name);
  const css = read('packages/ui/src/styles/components.css');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /forced-colors: active/);
  assert.doesNotMatch(css, /overflow-x:\s*hidden/);
});
test('test-only compositions are absent from production app entrypoints', () => {
  for (const app of ['admin', 'storefront'])
    for (const file of ['page.tsx', 'layout.tsx'])
      assert.doesNotMatch(read(`apps/${app}/app/${file}`), /test\/|Compositions|fixture/);
});

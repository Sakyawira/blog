import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const COMPONENT = readFileSync(
  new URL('../src/components/WhaleMark.astro', import.meta.url),
  'utf8',
);
const ARTWORK = readFileSync(
  new URL('../public/openmoji-spouting-whale.svg', import.meta.url),
  'utf8',
);
const PARAMETER_COUNTS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

function pathsIn(markup) {
  return Array.from(markup.matchAll(/\bd="([^"]+)"/g), (match) => match[1]);
}

test('the badge uses one inline artwork instead of a separate image and themed overlay', () => {
  assert.equal((COMPONENT.match(/<svg\b/g) ?? []).length, 1);
  assert.doesNotMatch(COMPONENT, /<img\b/);
  assert.doesNotMatch(COMPONENT, /whale-mark__light-spout/);
  assert.doesNotMatch(COMPONENT, /\bid="(?:emoji|color|line)"/);
});

test('all three spouts share theme-aware colors and are not hidden in dark mode', () => {
  assert.equal(
    (COMPONENT.match(/class="whale-mark__spout whale-mark__spout--(?:left|right|center)"/g) ?? [])
      .length,
    3,
  );
  assert.match(COMPONENT, /\.whale-mark__spout\s*\{\s*fill:\s*var\(--background\)/);
  assert.match(COMPONENT, /background-color:\s*var\(--foreground\)/);
  assert.doesNotMatch(COMPONENT, /display:\s*none/);
  assert.doesNotMatch(COMPONENT, /:global\(\.dark\)/);
});

test('the staggered animations remain opt-in to no-preference motion settings', () => {
  const mediaStart = COMPONENT.indexOf('@media (prefers-reduced-motion: no-preference)');
  assert.ok(mediaStart >= 0);
  assert.doesNotMatch(COMPONENT.slice(0, mediaStart), /\banimation\s*:/);
  const motionStyles = COMPONENT.slice(mediaStart);
  assert.match(motionStyles, /animation:\s*whale-mark-spout-reveal 3\.2s ease-in-out infinite/);
  assert.match(
    motionStyles,
    /animation:\s*whale-mark-spout-reveal 3\.2s ease-in-out 180ms infinite/,
  );
  assert.match(
    motionStyles,
    /animation:\s*whale-mark-spout-reveal 3\.2s ease-in-out 360ms infinite/,
  );
});

test('the inline mark retains the existing OpenMoji geometry with its incomplete tail repaired', () => {
  const expected = pathsIn(ARTWORK).map((path) =>
    path.replace('-0.0145-0.0983-0.0137-0.14453 0z', 'z'),
  );
  assert.deepEqual(pathsIn(COMPONENT), expected);
});

test('every SVG path contains complete command parameter groups', () => {
  for (const [index, path] of pathsIn(COMPONENT).entries()) {
    const tokens = path.match(/[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g) ?? [];
    let command;
    let count = 0;
    function checkGroup() {
      if (!command) return;
      const required = PARAMETER_COUNTS[command.toUpperCase()];
      assert.notEqual(required, undefined, `Path ${index} has an unsupported command`);
      assert.equal(
        required === 0 ? count : count % required,
        0,
        `Path ${index} has incomplete parameters for ${command}`,
      );
    }
    for (const token of tokens) {
      if (/^[A-Za-z]$/.test(token)) {
        checkGroup();
        command = token;
        count = 0;
      } else {
        assert.ok(Number.isFinite(Number(token)), `Path ${index} has a non-finite coordinate`);
        count += 1;
      }
    }
    checkGroup();
  }
});

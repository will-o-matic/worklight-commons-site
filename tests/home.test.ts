import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { page } from './helpers.ts';

const html = () => page('/');
const css = readFileSync(join(import.meta.dirname, '..', 'src', 'styles', 'global.css'), 'utf8');

test('hero carries the mission', () => {
  assert.match(html(), /<h1[^>]*>Built together\. Made to make life a little better\.<\/h1>/);
  assert.ok(html().includes('collective of creators who build apps and systems to make the world a little better'));
});

test('decorative quilt is hidden from assistive tech', () => {
  assert.match(html(), /<div class="quilt" aria-hidden="true"/);
});

test('values section has three values', () => {
  const h = html();
  assert.ok(h.includes('Many hands, one quilt.'));
  for (const v of ['Useful first', 'Made with care', 'Respectful']) assert.ok(h.includes(v), `missing value ${v}`);
});

test('projects section lists Knit and the placeholder patch', () => {
  const h = html();
  assert.match(h, /id="projects"/);
  assert.ok(h.includes('href="https://knitlifemanager.com"'));
  assert.ok(h.includes('Knit Life Manager'));
  assert.ok(h.includes('Makes managing complex households and lives easier.'));
  assert.ok(h.includes('More on the way'));
});

test('contact band links to the mailbox', () => {
  const h = html();
  assert.ok(h.includes('Say hello.'));
  assert.match(h, /<a class="pill" href="mailto:info@worklightcommons\.com"/);
});

// Review Focus 1: long email must wrap on 360px phones
test('pill and patch links can wrap long words', () => {
  assert.match(css, /\.pill\s*\{[^}]*overflow-wrap:\s*anywhere/);
  assert.match(css, /\.patch a\s*\{[^}]*overflow-wrap:\s*anywhere/);
  assert.match(css, /\.site-footer a\s*\{[^}]*overflow-wrap:\s*anywhere/);
});

// Review Focus 2: focus ring visible on colored and dark surfaces
test('focus ring adapts to patch and dark backgrounds', () => {
  assert.match(css, /\.patch :focus-visible\s*\{[^}]*outline-color:\s*currentColor/);
  assert.match(css, /\.on-dark :focus-visible\s*\{[^}]*outline-color:\s*var\(--mustard\)/);
  assert.match(html(), /class="contact on-dark"/);
});

test('patch link hugs its text so the focus ring frames only the link', () => {
  assert.match(css, /\.patch a\s*\{[^}]*align-self:\s*flex-start/);
});

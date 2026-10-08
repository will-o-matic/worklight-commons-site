import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, page, readDist, distExists } from './helpers.ts';

const home = () => page('/');

test('document basics', () => {
  const html = home();
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<title>[^<]*Worklight Commons[^<]*<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
});

test('header nav links use trailing slashes / anchors', () => {
  const html = home();
  for (const href of ['/#projects', '/support/', '/privacy/']) {
    assert.ok(html.includes(`href="${href}"`), `missing nav link ${href}`);
  }
  assert.ok(html.includes('href="#main"'), 'missing skip link');
});

test('footer has legal name, current year, and email', () => {
  const html = home();
  assert.ok(html.includes(`© ${new Date().getFullYear()} Worklight Commons LLC`));
  assert.ok(html.includes('href="mailto:info@worklightcommons.com"'));
});

test('canonical and og:image are absolute production URLs', () => {
  const html = home();
  assert.match(html, /<link rel="canonical" href="https:\/\/worklightcommons\.com\/"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/worklightcommons\.com\/og-image\.png"/);
  assert.match(html, /<meta property="og:url" content="https:\/\/worklightcommons\.com\/"/);
});

test('fonts are self-hosted, no third-party font requests', () => {
  assert.ok(!home().includes('fonts.googleapis.com'));
  const assets = readdirSync(join(DIST, '_astro'));
  assert.ok(assets.some((f) => f.endsWith('.woff2')), 'no self-hosted woff2 in dist/_astro');
});

test('no client JavaScript is shipped', () => {
  assert.ok(!home().includes('<script'), 'index.html contains a <script>');
});

test('CNAME and favicon are published', () => {
  assert.equal(readDist('CNAME').trim(), 'worklightcommons.com');
  assert.ok(distExists('favicon.svg'));
  assert.ok(home().includes('<link rel="icon" href="/favicon.svg" type="image/svg+xml"'));
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, distExists } from './helpers.ts';

test('routes are emitted as directory pages plus root 404.html', () => {
  assert.ok(distExists('support/index.html'));
  assert.ok(distExists('privacy/index.html'));
  assert.ok(distExists('404.html'), 'GitHub Pages needs a root 404.html');
});

// Review Focus 5: encoded subject on the support mailto
test('support page offers email with an encoded subject', () => {
  const h = page('/support/');
  assert.match(h, /<title>Support · Worklight Commons<\/title>/);
  assert.ok(h.includes('href="mailto:info@worklightcommons.com?subject=Support%20request"'));
  for (const s of ['What to include', 'Which app', 'within a few business days']) {
    assert.ok(h.includes(s), `support page missing "${s}"`);
  }
  assert.ok(h.includes('href="https://knitlifemanager.com"'), 'support page should link to Knit');
  assert.match(h, /aria-current="page"[^>]*>\s*Support/);
});

test('privacy page covers this website only', () => {
  const h = page('/privacy/');
  assert.match(h, /<title>Privacy · Worklight Commons<\/title>/);
  for (const s of [
    'Last updated',
    'cookies',
    'analytics',
    'GitHub Pages',
    'href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"',
    'own privacy policy',
    'mailto:info@worklightcommons.com',
  ]) {
    assert.ok(h.includes(s), `privacy page missing "${s}"`);
  }
});

test('prose column aligns with the header instead of centering', () => {
  for (const route of ['/support/', '/privacy/']) {
    const h = page(route);
    assert.ok(!/class="wrap prose"/.test(h), `${route} centers its prose column`);
    assert.match(h, /<div class="wrap"><div class="prose">/);
  }
});

test('404 quilt uses standard-size squares', () => {
  assert.match(page('404'), /<div class="quilt" aria-hidden="true" style="--quilt-count:10"/);
});

test('404 page links home', () => {
  const h = page('404');
  assert.ok(h.includes('This patch is missing'));
  assert.match(h, /<a class="pill" href="\/"/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import sharp from 'sharp';
import { DIST, page } from './helpers.ts';

test('og-image.png is published at 1200×630', async () => {
  const meta = await sharp(join(DIST, 'og-image.png')).metadata();
  assert.equal(meta.format, 'png');
  assert.equal(meta.width, 1200);
  assert.equal(meta.height, 630);
});

test('every page points og:image at the absolute production URL', () => {
  for (const route of ['/', '/support/', '/privacy/']) {
    assert.ok(
      page(route).includes('<meta property="og:image" content="https://worklightcommons.com/og-image.png"'),
      `${route} og:image`,
    );
  }
});

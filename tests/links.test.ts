import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { DIST, readDist, distExists } from './helpers.ts';

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [],
  );
}

const pages = htmlFiles(DIST).map((f) => relative(DIST, f));

test('site has the four expected pages', () => {
  assert.equal(pages.length, 4, `found: ${pages.join(', ')}`);
});

for (const file of pages) {
  test(`internal links in ${file} resolve without redirects`, () => {
    const html = readDist(file);
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (/^(https?:|mailto:)/.test(href) || href.startsWith('#')) continue;
      const path = href.split('#')[0];
      if (/\.[a-z0-9]+$/i.test(path)) {
        assert.ok(distExists(path.replace(/^\//, '')), `${file}: asset ${href} missing`);
        continue;
      }
      assert.ok(path.endsWith('/'), `${file}: ${href} lacks trailing slash (would redirect on GitHub Pages)`);
      const target = join(path.replace(/^\//, ''), 'index.html');
      assert.ok(distExists(target), `${file}: ${href} → ${target} missing`);
    }
  });
}

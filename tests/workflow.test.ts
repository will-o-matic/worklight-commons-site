import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const yml = readFileSync(join(import.meta.dirname, '..', '.github', 'workflows', 'deploy.yml'), 'utf8');

test('deploys only from main via Astro + Pages actions', () => {
  assert.match(yml, /push:\s*\n\s*branches: \[main\]/);
  assert.match(yml, /workflow_dispatch:/);
  assert.ok(yml.includes('uses: withastro/action@v6'));
  assert.ok(yml.includes('uses: actions/deploy-pages@v5'));
  assert.match(yml, /build:\s*\n\s*if: github\.event_name != 'pull_request'/);
});

test('deploy job has Pages permissions and a non-cancelling concurrency group', () => {
  assert.ok(yml.includes('pages: write'));
  assert.ok(yml.includes('id-token: write'));
  assert.match(yml, /group: pages\s*\n\s*cancel-in-progress: false/);
});

test('pull requests run tests and type-check', () => {
  assert.match(yml, /pull_request:\s*\n\s*branches: \[main\]/);
  assert.ok(yml.includes('run: npm test'));
  assert.ok(yml.includes('run: npm run check'));
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TONES, contrastRatio } from '../src/data/tones.ts';
import { projects } from '../src/data/projects.ts';

test('contrastRatio matches known values', () => {
  assert.equal(Math.round(contrastRatio('#000000', '#ffffff') * 10) / 10, 21);
  assert.equal(contrastRatio('#777777', '#777777'), 1);
  assert.equal(contrastRatio('#ffffff', '#000000'), contrastRatio('#000000', '#ffffff'));
});

test('every patch tone meets WCAG AA for normal text', () => {
  for (const [name, { bg, fg }] of Object.entries(TONES)) {
    const ratio = contrastRatio(bg, fg);
    assert.ok(ratio >= 4.5, `${name}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
  }
});

test('projects are well-formed', () => {
  assert.ok(projects.length >= 1);
  for (const p of projects) {
    assert.ok(p.name && p.blurb && p.status, `empty field in ${JSON.stringify(p)}`);
    assert.equal(new URL(p.url).protocol, 'https:', `${p.name} url must be https`);
    assert.ok(p.tone in TONES, `${p.name} has unknown tone ${p.tone}`);
  }
});

test('Knit Life Manager is listed first', () => {
  assert.equal(projects[0].name, 'Knit Life Manager');
  assert.equal(projects[0].url, 'https://knitlifemanager.com');
});

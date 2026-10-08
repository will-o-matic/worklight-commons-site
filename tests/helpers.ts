import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const DIST = join(import.meta.dirname, '..', 'dist');

export function readDist(rel: string): string {
  return readFileSync(join(DIST, rel), 'utf8');
}

export function distExists(rel: string): boolean {
  return existsSync(join(DIST, rel));
}

/** '/' → index.html, '404' → 404.html, '/support/' → support/index.html */
export function page(route: string): string {
  if (route === '/') return readDist('index.html');
  if (route === '404') return readDist('404.html');
  return readDist(join(route.replace(/^\/|\/$/g, ''), 'index.html'));
}

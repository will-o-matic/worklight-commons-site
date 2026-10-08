import type { Tone } from './tones.ts';

export interface Project {
  name: string;
  url: string;
  blurb: string;
  status: string;
  tone: Tone;
}

export const projects: Project[] = [
  {
    name: 'Knit Life Manager',
    url: 'https://knitlifemanager.com',
    blurb: 'Makes managing complex households and lives easier.',
    status: 'Web app · live',
    tone: 'sage',
  },
];

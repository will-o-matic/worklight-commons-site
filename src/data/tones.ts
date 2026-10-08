export type Tone = 'sage' | 'mustard' | 'terracotta' | 'slate';

export interface ToneColors {
  bg: string;
  fg: string;
}

/** Patch backgrounds, darkened where needed so text meets WCAG AA. */
export const TONES: Record<Tone, ToneColors> = {
  sage: { bg: '#4e7356', fg: '#fbf7ef' },
  mustard: { bg: '#e3a83b', fg: '#23302a' },
  terracotta: { bg: '#a94a2a', fg: '#fbf7ef' },
  slate: { bg: '#4f6d7a', fg: '#fbf7ef' },
};

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #rrggbb colors (1–21). */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

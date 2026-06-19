import { describe, it, expect } from 'vitest';
import en from './en.json';
import uk from './uk.json';

type Tree = Record<string, unknown>;

/** Dot-paths of every leaf key, e.g. "WhatIDo.cards.web.title". */
function flattenKeys(obj: Tree, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object' && !Array.isArray(value)
      ? flattenKeys(value as Tree, path)
      : [path];
  });
}

/** Dot-paths whose value is an empty / blank string. */
function blankLeaves(obj: Tree, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return blankLeaves(value as Tree, path);
    }
    return typeof value === 'string' && value.trim().length === 0 ? [path] : [];
  });
}

describe('i18n message parity (en ↔ uk)', () => {
  const enKeys = flattenKeys(en as Tree).sort();
  const ukKeys = flattenKeys(uk as Tree).sort();

  it('has identical key sets in both locales', () => {
    const missingInUk = enKeys.filter((k) => !ukKeys.includes(k));
    const missingInEn = ukKeys.filter((k) => !enKeys.includes(k));
    expect(
      missingInUk,
      'keys present in en.json but missing in uk.json',
    ).toEqual([]);
    expect(
      missingInEn,
      'keys present in uk.json but missing in en.json',
    ).toEqual([]);
  });

  it('has no blank message values', () => {
    expect(blankLeaves(en as Tree), 'blank values in en.json').toEqual([]);
    expect(blankLeaves(uk as Tree), 'blank values in uk.json').toEqual([]);
  });
});

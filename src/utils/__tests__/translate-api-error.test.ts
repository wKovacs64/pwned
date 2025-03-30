import { describe, it, expect } from 'vitest';
import { translateApiError } from '../translate-api-error.js';

describe('util: getErrorMessage', () => {
  it('returns a custom error message if input matches "hibp-api-key"', () => {
    const orig = 'something something hibp-api-key and stuff';
    expect(translateApiError(orig)).not.toBe(orig);
  });

  it("returns the original message if it doesn't need interpreted", () => {
    const orig = 'stuff broke';
    expect(translateApiError(orig)).toBe(orig);
  });
});

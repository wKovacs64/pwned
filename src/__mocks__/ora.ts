/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { Ora } from 'ora';

// This mock is only here because I can't figure out how to make jest work with
// ora now that it's pure ESM. ¯\(°_o)/¯

function createMockOra(): Partial<Ora> {
  const mockOra = {} as Ora;
  return {
    start: () => mockOra,
    stop: () => mockOra,
    succeed: () => mockOra,
    warn: () => mockOra,
    fail: () => mockOra,
  };
}

export default createMockOra;

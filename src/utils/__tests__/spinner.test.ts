import { spinnerFns } from '../../../test/fixtures.js';
import { spinner } from '../spinner.js';

describe('util: spinner', () => {
  it('returns an object with all the expected methods', () => {
    expect(spinner).toEqual(
      expect.objectContaining(
        spinnerFns.reduce(
          (obj, fn) => ({
            ...obj,
            [fn]: expect.any(Function) as unknown,
          }),
          {},
        ),
      ),
    );
  });
});

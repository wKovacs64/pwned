import { spinnerFns } from '../../test/fixtures';
import spinner from './spinner';

describe('util: spinner', () => {
  it('returns an object with all the expected methods', () => {
    expect(spinner).toEqual(
      expect.objectContaining(
        spinnerFns.reduce(
          (obj, fn) => ({
            ...obj,
            [fn]: expect.any(Function),
          }),
          {},
        ),
      ),
    );
  });
});

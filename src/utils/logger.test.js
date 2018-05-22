/* eslint-disable no-console */
import { loggerFns, OBJ, MESSAGE } from '../../test/fixtures';
import logger from './logger';

describe('util: logger', () => {
  it('returns an object with all the expected methods', () => {
    expect(logger).toEqual(
      expect.objectContaining(
        loggerFns.reduce(
          (obj, fn) => ({
            ...obj,
            [fn]: expect.any(Function),
          }),
          {},
        ),
      ),
    );
  });

  it('calls the corresponding console functions with the same arguments', () => {
    const args = [MESSAGE, OBJ];
    loggerFns.forEach(fn => {
      const orig = console[fn];
      console[fn] = jest.fn();
      expect(console[fn]).toHaveBeenCalledTimes(0);
      logger[fn](...args);
      expect(console[fn]).toHaveBeenCalledTimes(1);
      expect(console[fn]).toHaveBeenCalledWith(...args);
      console[fn] = orig;
    });
  });
});

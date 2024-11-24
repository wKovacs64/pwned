import { vi, type MockInstance } from 'vitest';
import { loggerFns } from '../../../test/fixtures.js';
import { logger, type Logger, type LoggerFunction } from '../logger.js';

type IndexableConsole = typeof console & Record<string, LoggerFunction | MockInstance>;
type IndexableLogger = Logger & Record<string, LoggerFunction>;

const indexableConsole = console as IndexableConsole;
const indexableLogger = logger as IndexableLogger;

describe('util: logger', () => {
  it('returns an object with all the expected methods', () => {
    expect(logger).toEqual(
      expect.objectContaining(
        loggerFns.reduce(
          (obj, fn) => ({
            ...obj,
            [fn]: expect.any(Function) as unknown,
          }),
          {},
        ),
      ),
    );
  });

  it('calls the corresponding console functions with the same arguments', () => {
    const args = ['Wubba lubba dub dub!', { param: 'value' }];
    loggerFns.forEach((fn) => {
      const orig = indexableConsole[fn];
      indexableConsole[fn] = vi.fn();
      expect(indexableConsole[fn]).toHaveBeenCalledTimes(0);
      indexableLogger[fn](...args);
      expect(indexableConsole[fn]).toHaveBeenCalledTimes(1);
      expect(indexableConsole[fn]).toHaveBeenCalledWith(...args);
      indexableConsole[fn] = orig;
    });
  });
});

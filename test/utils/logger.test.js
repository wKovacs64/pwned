import logger from '../../src/utils/logger';
import { OBJ, MESSAGE } from '../testData';

/**
 * WARNING:
 *
 * Test output is lost temporarily while console functions are stubbed, so check
 * here first if tests fail and there's no output containing the failed
 * assertion.
 */

describe('util: logger', () => {
  afterEach(() => {
    // Restore any console functions that were mocked
    if (typeof console.error.mockRestore === 'function') {
      console.error.mockRestore();
    }
    if (typeof console.info.mockRestore === 'function') {
      console.info.mockRestore();
    }
    if (typeof console.log.mockRestore === 'function') {
      console.log.mockRestore();
    }
    if (typeof console.warn.mockRestore === 'function') {
      console.warn.mockRestore();
    }
  });

  it('should have an "error" function which calls console.error', () => {
    expect(logger).toHaveProperty('error');
    expect(typeof logger.error).toBe('function');
    console.error = jest.fn();
    expect(console.error.mock.calls.length).toBe(0);
    logger.error(MESSAGE, OBJ);
    expect(console.error.mock.calls.length).toBe(1);
  });

  it('should have an "info" function which calls console.info', () => {
    expect(logger).toHaveProperty('info');
    expect(typeof logger.info).toBe('function');
    console.info = jest.fn();
    expect(console.info.mock.calls.length).toBe(0);
    logger.info(MESSAGE, OBJ);
    expect(console.info.mock.calls.length).toBe(1);
  });

  it('should have an "log" function which calls console.log', () => {
    expect(logger).toHaveProperty('log');
    expect(typeof logger.log).toBe('function');
    console.log = jest.fn();
    expect(console.log.mock.calls.length).toBe(0);
    logger.log(MESSAGE, OBJ);
    expect(console.log.mock.calls.length).toBe(1);
  });

  it('should have an "warn" function which calls console.warn', () => {
    expect(logger).toHaveProperty('warn');
    expect(typeof logger.warn).toBe('function');
    console.warn = jest.fn();
    expect(console.warn.mock.calls.length).toBe(0);
    logger.warn(MESSAGE, OBJ);
    expect(console.warn.mock.calls.length).toBe(1);
  });
});

/* eslint-disable no-console */

/**
 * Default console logging wrapper to facilitate mocking/suppressing output
 * during tests.
 */
export default {
  error: (...args) => {
    console.error(...args);
  },
  info: (...args) => {
    console.info(...args);
  },
  log: (...args) => {
    console.log(...args);
  },
  warn: (...args) => {
    console.warn(...args);
  },
};

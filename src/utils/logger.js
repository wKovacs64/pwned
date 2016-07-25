/**
 * Default console logging wrapper to facilitate mocking/suppressing output
 * during tests.
 */
export default {
  error: (...args) => {
    console.error.apply(console, Array.prototype.slice.call(args));
  },
  info: (...args) => {
    console.info.apply(console, Array.prototype.slice.call(args));
  },
  log: (...args) => {
    console.log.apply(console, Array.prototype.slice.call(args));
  },
  warn: (...args) => {
    console.warn.apply(console, Array.prototype.slice.call(args));
  }
};

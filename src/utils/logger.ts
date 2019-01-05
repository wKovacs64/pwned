/* eslint-disable no-console */
export type LoggerFunction = (message?: any, ...args: any[]) => void;

export interface Logger {
  error: LoggerFunction;
  info: LoggerFunction;
  log: LoggerFunction;
  warn: LoggerFunction;
}

/**
 * Default console logging wrapper to facilitate mocking/suppressing output
 * during tests.
 */
const logger: Logger = {
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

export default logger;

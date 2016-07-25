import {polyfill} from 'es6-promise';
polyfill();

export const data = {
  accountError: 'foo',
  accountFound: 'bar',
  accountNotFound: 'baz',
  breach: {
    foo: 'bar'
  },
  none: ''
};

export const loggerMock = {
  error: () => {
  },
  info: () => {
  },
  log: () => {
  },
  warn: () => {
  }
};

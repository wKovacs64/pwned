import {polyfill} from 'es6-promise';
polyfill();

export const data = {
  accountError: 'foo',
  accountFound: 'bar',
  accountNotFound: 'baz',
  breach: {
    foo: 'bar'
  },
  email: 'foo@bar.baz',
  message: 'Wubba lubba dub dub!',
  none: ' ',
  obj: {
    foo: 'bar'
  }
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

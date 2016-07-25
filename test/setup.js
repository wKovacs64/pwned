import {polyfill} from 'es6-promise';
polyfill();

export const data = {
  breach: {
    foo: 'bar'
  },
  error: 'foo',
  found: 'bar',
  notFound: 'baz',
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

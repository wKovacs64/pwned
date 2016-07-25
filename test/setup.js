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
  emptyArray: [],
  message: 'Wubba lubba dub dub!',
  none: ' ',
  obj: {
    foo: 'bar'
  },
  objArray: [
    {foo: 'bar'}
  ]
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

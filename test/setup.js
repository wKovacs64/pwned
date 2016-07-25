import {polyfill} from 'es6-promise';
polyfill();

export const data = {
  email: 'foo@bar.baz',
  emptyArray: [],
  error: 'foo',
  found: 'bar',
  message: 'Wubba lubba dub dub!',
  notFound: 'baz',
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

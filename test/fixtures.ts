import { Breach, Paste } from 'hibp';

export const spinnerFns = ['start', 'stop', 'succeed', 'warn', 'fail'];
export const loggerFns = ['info', 'log', 'warn', 'error'];

export const DATA_CLASSES = ['foo', 'bar'];
export const BREACH: Breach = {
  Name: 'breach',
  Title: 'Breach',
  Domain: 'foo.bar',
  BreachDate: '2019-01-01',
  AddedDate: '2019-02-02',
  ModifiedDate: '2019-03-03',
  PwnCount: 42,
  Description: 'fake breach',
  LogoPath: '/foo.png',
  DataClasses: ['foo', 'bar'],
  IsVerified: true,
  IsFabricated: false,
  IsSensitive: false,
  IsSpamList: false,
  IsRetired: false,
};
export const BREACHES = [BREACH];
export const PASTE: Paste = {
  Id: 'paste',
  Date: '2019-01-01',
  EmailCount: 42,
  Source: 'never reveal your sources',
  Title: 'Paste',
};
export const PASTES = [PASTE];

export const EMAIL = 'foo@bar.baz';
export const EMPTY_ARRAY = [];
export const ERROR = 'foo';
export const ERROR_MSG = 'Set sail for fail!';
export const FOUND = 'bar';
export const NOT_FOUND = 'baz';
export const NONE = ' ';

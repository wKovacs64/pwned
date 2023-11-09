import { stripIndents } from 'common-tags';
import type { Breach, Paste } from 'hibp';

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
  DataClasses: ['foo', 'bar'],
  IsVerified: true,
  IsFabricated: false,
  IsSensitive: false,
  IsSpamList: false,
  IsRetired: false,
  IsMalware: false,
  IsSubscriptionFree: true,
  LogoPath: '/foo.png',
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

export const PASSWORD_HASHES = stripIndents`
  003D68EB55068C33ACE09247EE4C639306B:3
  1E4C9B93F3F0682250B6CF8331B7EE68FD8:3303003
  01330C689E5D64F660D6947A93AD634EF8F:1
`;

export const EMAIL = 'foo@bar.baz';
export const EMPTY_ARRAY = [];
export const ERROR = 'foo';
export const ERROR_MSG = 'Set sail for fail!';
export const FOUND = 'bar';
export const FOUND_PW = 'password';
export const NOT_FOUND = 'baz';
export const NOT_FOUND_PW = 'a better password';
export const NONE = ' ';

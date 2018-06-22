import * as hibp from 'hibp';
import {
  spinnerFns,
  loggerFns,
  FOUND,
  OBJ,
  NOT_FOUND,
  ERROR,
  ERROR_MSG,
  NONE,
} from '../../test/fixtures';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import { handler as ba } from './ba';

jest.mock('../utils/logger');
jest.mock('../utils/spinner');

describe('command: ba', () => {
  beforeAll(() => {
    hibp.breachedAccount.mockImplementation(async account => {
      if (account === FOUND) {
        return OBJ;
      }
      if (account === NOT_FOUND) {
        return null;
      }
      if (account === ERROR) {
        throw new Error(ERROR_MSG);
      }
      throw new Error('Unexpected input!');
    });
  });

  describe('normal output (default)', () => {
    it('calls spinner.start', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await ba({
        account: NOT_FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: false,
      });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('with data: calls spinner.stop and logger.log', async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      await ba({
        account: FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: false,
      });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: only calls spinner.succeed', async () => {
      expect(spinner.succeed).toHaveBeenCalledTimes(0);
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await ba({
        account: NOT_FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: false,
      });
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls spinner.fail', async () => {
      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await ba({
        account: ERROR,
        domainFilter: NONE,
        truncate: false,
        raw: false,
      });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe('raw mode', () => {
    it('does not call spinner.start', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await ba({
        account: NOT_FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: true,
      });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('with data: only calls logger.log', async () => {
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await ba({
        account: FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: true,
      });
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: does not call any spinner or logger methods', async () => {
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await ba({
        account: NOT_FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: true,
      });
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls logger.error', async () => {
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await ba({
        account: ERROR,
        domainFilter: NONE,
        truncate: false,
        raw: true,
      });
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

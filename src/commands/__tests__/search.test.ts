import { vi, type SpyInstance } from 'vitest';
import { rest } from 'msw';
import { server } from '../../../test/server.js';
import {
  spinnerFns,
  loggerFns,
  FOUND,
  NOT_FOUND,
  ERROR,
  ERROR_MSG,
  NONE,
} from '../../../test/fixtures.js';
import { logger as mockLogger, type Logger } from '../../utils/logger.js';
import { spinner as mockSpinner } from '../../utils/spinner.js';
import { handler as search } from '../search.js';

vi.mock('../../utils/logger');
vi.mock('../../utils/spinner');

const logger = mockLogger as Logger & Record<string, SpyInstance>;
const spinner = mockSpinner as typeof mockSpinner & Record<string, SpyInstance>;

describe('command: search', () => {
  describe('normal output (default)', () => {
    it('calls spinner.start', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await search({
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
      await search({
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
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await search({
        account: NOT_FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: false,
      });
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls spinner.fail', async () => {
      server.use(
        rest.get('*', () => {
          throw new Error(ERROR_MSG);
        }),
      );

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await search({
        account: ERROR,
        domainFilter: NONE,
        truncate: false,
        raw: false,
      });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe('raw mode', () => {
    it('does not call spinner.start', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await search({
        account: NOT_FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: true,
      });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('with data: only calls logger.log', async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await search({
        account: FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: true,
      });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: does not call any spinner or logger methods', async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await search({
        account: NOT_FOUND,
        domainFilter: NONE,
        truncate: false,
        raw: true,
      });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls logger.error', async () => {
      server.use(
        rest.get('*', () => {
          throw new Error(ERROR_MSG);
        }),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await search({
        account: ERROR,
        domainFilter: NONE,
        truncate: false,
        raw: true,
      });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

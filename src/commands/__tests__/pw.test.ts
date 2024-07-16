import { vi, type MockInstance } from 'vitest';
import { http } from 'msw';
import { server } from '../../../test/server.js';
import {
  spinnerFns,
  loggerFns,
  FOUND_PW,
  NOT_FOUND_PW,
  ERROR,
  ERROR_MSG,
} from '../../../test/fixtures.js';
import { logger as mockLogger, type Logger } from '../../utils/logger.js';
import { spinner as mockSpinner } from '../../utils/spinner.js';
import { handler as pw } from '../pw.js';

vi.mock('../../utils/logger');
vi.mock('../../utils/spinner');

const logger = mockLogger as Logger & Record<string, MockInstance>;
const spinner = mockSpinner as typeof mockSpinner & Record<string, MockInstance>;

describe('command: pw', () => {
  describe('normal output (default)', () => {
    it('calls spinner.start', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND_PW, raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('with data: only calls spinner.warn', async () => {
      expect(spinner.warn).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND_PW, raw: false });
      expect(spinner.warn).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('without data: only calls spinner.succeed', async () => {
      expect(spinner.succeed).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await pw({ password: NOT_FOUND_PW, raw: false });
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls spinner.fail', async () => {
      server.use(
        http.get('*', () => {
          throw new Error(ERROR_MSG);
        }),
      );

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await pw({ password: ERROR, raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe('raw mode', () => {
    it('does not call spinner.start', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND_PW, raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('with data: only calls logger.log', async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND_PW, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: only calls logger.log', async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await pw({ password: NOT_FOUND_PW, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('on error: only calls logger.error', async () => {
      server.use(
        http.get('*', () => {
          throw new Error(ERROR_MSG);
        }),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await pw({ password: ERROR, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

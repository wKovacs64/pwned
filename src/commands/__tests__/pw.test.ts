import { jest } from '@jest/globals';
import { server, rest } from '../../mocks/server';
import {
  spinnerFns,
  loggerFns,
  FOUND_PW,
  PASSWORD_HASHES,
  NOT_FOUND_PW,
  ERROR,
  ERROR_MSG,
} from '../../../test/fixtures';
import {
  logger as mockLogger,
  spinner as mockSpinner,
  Logger,
  LoggerFunction,
} from '../../utils';
import { handler as pw } from '../pw';

jest.mock('../../utils');

const logger = mockLogger as Logger & {
  [key: string]: jest.Mocked<LoggerFunction>;
};

const spinner = mockSpinner as typeof mockSpinner & {
  [key: string]: jest.Mock;
};

describe('command: pw', () => {
  describe('normal output (default)', () => {
    it('calls spinner.start', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.text(PASSWORD_HASHES))),
      );

      expect(spinner.start).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND_PW, raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('with data: only calls spinner.warn', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.text(PASSWORD_HASHES))),
      );

      expect(spinner.warn).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND_PW, raw: false });
      expect(spinner.warn).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('without data: only calls spinner.succeed', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.text(PASSWORD_HASHES))),
      );

      expect(spinner.succeed).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await pw({ password: NOT_FOUND_PW, raw: false });
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls spinner.fail', async () => {
      server.use(rest.get('*', (_, res) => res.networkError(ERROR_MSG)));

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await pw({ password: ERROR, raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe('raw mode', () => {
    it('does not call spinner.start', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.text(PASSWORD_HASHES))),
      );

      expect(spinner.start).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND_PW, raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('with data: only calls logger.log', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.text(PASSWORD_HASHES))),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND_PW, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: only calls logger.log', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.text(PASSWORD_HASHES))),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await pw({ password: NOT_FOUND_PW, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('on error: only calls logger.error', async () => {
      server.use(rest.get('*', (_, res) => res.networkError(ERROR_MSG)));

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await pw({ password: ERROR, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

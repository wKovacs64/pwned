import { jest } from '@jest/globals';
import { server, rest } from '../../../test/server';
import {
  spinnerFns,
  loggerFns,
  FOUND,
  BREACH,
  NOT_FOUND,
  ERROR,
  ERROR_MSG,
} from '../../../test/fixtures';
import {
  logger as mockLogger,
  spinner as mockSpinner,
  Logger,
  LoggerFunction,
} from '../../utils';
import { handler as breach } from '../breach';

jest.mock('../../utils');

const logger = mockLogger as Logger & {
  [key: string]: jest.Mocked<LoggerFunction>;
};

const spinner = mockSpinner as typeof mockSpinner & {
  [key: string]: jest.Mock;
};

describe('command: breach', () => {
  describe('normal output (default)', () => {
    it('calls spinner.start', async () => {
      server.use(rest.get('*', (_, res, ctx) => res.once(ctx.json(BREACH))));

      expect(spinner.start).toHaveBeenCalledTimes(0);
      await breach({ name: FOUND, raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('with data: calls spinner.stop and logger.log', async () => {
      server.use(rest.get('*', (_, res, ctx) => res.once(ctx.json(BREACH))));

      expect(spinner.stop).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      await breach({ name: FOUND, raw: false });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: only calls spinner.succeed', async () => {
      server.use(rest.get('*', (_, res, ctx) => res.once(ctx.status(404))));

      expect(spinner.succeed).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await breach({ name: NOT_FOUND, raw: false });
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls spinner.fail', async () => {
      server.use(rest.get('*', (_, res) => res.networkError(ERROR_MSG)));

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await breach({ name: ERROR, raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe('raw mode', () => {
    it('does not call spinner.start', async () => {
      server.use(rest.get('*', (_, res, ctx) => res.once(ctx.json(BREACH))));

      expect(spinner.start).toHaveBeenCalledTimes(0);
      await breach({ name: FOUND, raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('with data: only calls logger.log', async () => {
      server.use(rest.get('*', (_, res, ctx) => res.once(ctx.json(BREACH))));

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await breach({ name: FOUND, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: does not call any spinner or logger methods', async () => {
      server.use(rest.get('*', (_, res, ctx) => res.once(ctx.status(404))));

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await breach({ name: NOT_FOUND, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls logger.error', async () => {
      server.use(rest.get('*', (_, res) => res.networkError(ERROR_MSG)));

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await breach({ name: ERROR, raw: true });
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

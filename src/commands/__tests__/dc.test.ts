import { jest } from '@jest/globals';
import { server, rest } from '../../mocks/server';
import {
  spinnerFns,
  loggerFns,
  DATA_CLASSES,
  EMPTY_ARRAY,
  ERROR_MSG,
} from '../../../test/fixtures';
import {
  logger as mockLogger,
  spinner as mockSpinner,
  Logger,
  LoggerFunction,
} from '../../utils';
import { handler as dc } from '../dc';

jest.mock('../../utils');

const logger = mockLogger as Logger & {
  [key: string]: jest.Mocked<LoggerFunction>;
};
const spinner = mockSpinner as typeof mockSpinner & {
  [key: string]: jest.Mock;
};

describe('command: dc', () => {
  describe('normal output (default)', () => {
    it('calls spinner.start', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.json(DATA_CLASSES))),
      );

      expect(spinner.start).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('with data: calls spinner.stop and logger.log', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.json(DATA_CLASSES))),
      );

      expect(spinner.stop).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: only calls spinner.fail', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.json(EMPTY_ARRAY))),
      );

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await dc({ raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls spinner.fail', async () => {
      server.use(rest.get('*', (_, res) => res.networkError(ERROR_MSG)));

      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await dc({ raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe('raw mode', () => {
    it('does not call spinner.start', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.json(DATA_CLASSES))),
      );

      expect(spinner.start).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('with data: only calls logger.log', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.json(DATA_CLASSES))),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: does not call any spinner or logger methods', async () => {
      server.use(
        rest.get('*', (_, res, ctx) => res.once(ctx.json(EMPTY_ARRAY))),
      );

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
    });

    it('on error: only calls logger.error', async () => {
      server.use(rest.get('*', (_, res) => res.networkError(ERROR_MSG)));

      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

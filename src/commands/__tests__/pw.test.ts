import * as hibp from 'hibp';
import {
  spinnerFns,
  loggerFns,
  FOUND,
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
import { handler as pw } from '../pw';

jest.mock('hibp');
jest.mock('../../utils');

const mockHibp = hibp as jest.Mocked<typeof hibp>;
const logger = mockLogger as Logger & {
  [key: string]: jest.Mocked<LoggerFunction>;
};
const spinner = mockSpinner as typeof mockSpinner & {
  [key: string]: jest.Mock;
};

describe('command: pw', () => {
  beforeAll(() => {
    mockHibp.pwnedPassword.mockImplementation(async (password) => {
      if (password === FOUND) {
        return 3;
      }
      if (password === NOT_FOUND) {
        return 0;
      }
      if (password === ERROR) {
        throw new Error(ERROR_MSG);
      }
      throw new Error('Unexpected input!');
    });
  });

  describe('normal output (default)', () => {
    it('calls spinner.start', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND, raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('with data: only calls spinner.warn', async () => {
      expect(spinner.warn).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND, raw: false });
      expect(spinner.warn).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('without data: only calls spinner.succeed', async () => {
      expect(spinner.succeed).toHaveBeenCalledTimes(0);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await pw({ password: NOT_FOUND, raw: false });
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls spinner.fail', async () => {
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
      await pw({ password: FOUND, raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('with data: only calls logger.log', async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      await pw({ password: FOUND, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: only calls logger.log', async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      loggerFns.forEach((fn) => expect(logger[fn]).toHaveBeenCalledTimes(0));
      await pw({ password: NOT_FOUND, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('on error: only calls logger.error', async () => {
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      await pw({ password: ERROR, raw: true });
      spinnerFns.forEach((fn) => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

import * as origHibp from 'hibp';
import {
  spinnerFns,
  loggerFns,
  DATA_CLASSES,
  EMPTY_ARRAY,
  ERROR_MSG,
} from '../../../test/fixtures';
import mockLogger, { Logger, LoggerFunction } from '../../utils/logger';
import mockSpinner from '../../utils/spinner';
import { handler as dc } from '../dc';

jest.mock('../../utils/logger');
jest.mock('../../utils/spinner');

const hibp = origHibp as jest.Mocked<typeof origHibp>;
const logger = mockLogger as Logger & {
  [key: string]: jest.Mocked<LoggerFunction>;
};
const spinner = mockSpinner as typeof mockSpinner & {
  [key: string]: jest.Mock;
};

describe('command: dc', () => {
  describe('normal output (default)', () => {
    it('calls spinner.start', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('with data: calls spinner.stop and logger.log', async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      expect(logger.log).toHaveBeenCalledTimes(0);
      hibp.dataClasses.mockImplementationOnce(async () => DATA_CLASSES);
      await dc({ raw: false });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: only calls spinner.fail', async () => {
      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
      hibp.dataClasses.mockImplementationOnce(() =>
        Promise.resolve(EMPTY_ARRAY),
      );
      await dc({ raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });

    it('on error: only calls spinner.fail', async () => {
      expect(spinner.fail).toHaveBeenCalledTimes(0);
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
      hibp.dataClasses.mockImplementationOnce(() =>
        Promise.reject(new Error(ERROR_MSG)),
      );
      await dc({ raw: false });
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      loggerFns.forEach(fn => expect(logger[fn]).toHaveBeenCalledTimes(0));
    });
  });

  describe('raw mode', () => {
    it('does not call spinner.start', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('with data: only calls logger.log', async () => {
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(0);
      hibp.dataClasses.mockImplementationOnce(async () => DATA_CLASSES);
      await dc({ raw: true });
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('without data: does not call any spinner or logger methods', async () => {
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      hibp.dataClasses.mockImplementationOnce(() =>
        Promise.resolve(EMPTY_ARRAY),
      );
      await dc({ raw: true });
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
    });

    it('on error: only calls logger.error', async () => {
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(0);
      hibp.dataClasses.mockImplementationOnce(() =>
        Promise.reject(new Error(ERROR_MSG)),
      );
      await dc({ raw: true });
      spinnerFns.forEach(fn => expect(spinner[fn]).toHaveBeenCalledTimes(0));
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

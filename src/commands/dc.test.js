import * as hibp from 'hibp';
import { OBJ_ARRAY, EMPTY_ARRAY, ERROR_MSG } from '../../test/fixtures';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import { handler as dc } from './dc';

jest.mock('../utils/logger');
jest.mock('../utils/spinner');

describe('command: dc', () => {
  describe('found', () => {
    beforeAll(() => {
      hibp.dataClasses.mockImplementation(async () => OBJ_ARRAY);
    });

    it('should call spinner.start (found && !raw)', async () => {
      expect(spinner.start).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('should not call spinner.start (found && raw)', async () => {
      await dc({ raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('should call spinner.stop (found && !raw)', async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });

    it('should not call spinner.stop (found && raw)', async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });

    it('should call logger.log (found && !raw)', async () => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('should call logger.log (found && raw)', async () => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  describe('not found', () => {
    beforeAll(() => {
      hibp.dataClasses.mockImplementation(() => Promise.resolve(EMPTY_ARRAY));
    });

    it('should call spinner.start (notFound && !raw)', async () => {
      await dc({ raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('should not call spinner.start (notFound && raw)', async () => {
      await dc({ raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('should call spinner.stop (notFound && !raw)', async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });

    it('should not call spinner.stop (notFound && raw)', async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });

    it('should call logger.log (notFound && !raw)', async () => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('should not call logger.log (notFound && raw)', async () => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      expect(logger.log).toHaveBeenCalledTimes(0);
    });
  });

  describe('error', () => {
    beforeAll(() => {
      hibp.dataClasses.mockImplementation(() =>
        Promise.reject(new Error(ERROR_MSG)),
      );
    });

    it('should call spinner.start (error && !raw)', async () => {
      await dc({ raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('should not call spinner.start (error && raw)', async () => {
      await dc({ raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('should call spinner.stop (error && !raw)', async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });

    it('should not call spinner.stop (error && raw)', async () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      await dc({ raw: true });
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });

    it('should call logger.error (error)', async () => {
      expect(logger.error).toHaveBeenCalledTimes(0);
      await dc({ raw: false });
      expect(logger.log).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

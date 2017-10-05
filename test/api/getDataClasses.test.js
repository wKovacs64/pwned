import * as hibp from 'hibp';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import getDataClasses from '../../src/api/getDataClasses';
import { OBJ_ARRAY, EMPTY_ARRAY, ERROR_MSG } from '../testData';

jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/spinner');

describe('api: getDataClasses', () => {
  beforeEach(() => {
    // global clearMocks Jest config option doesn't work on nested mocks
    logger.log.mockClear();
    logger.error.mockClear();
    spinner.start.mockClear();
    spinner.stop.mockClear();
  });

  describe('found', () => {
    beforeAll(() => {
      hibp.dataClasses = () => Promise.resolve(OBJ_ARRAY);
    });

    it('should call spinner.start (found && !raw)', () => {
      getDataClasses(false);
      expect(spinner.start.mock.calls.length).toBe(1);
    });

    it('should not call spinner.start (found && raw)', () => {
      getDataClasses(true);
      expect(spinner.start.mock.calls.length).toBe(0);
    });

    it('should call spinner.stop (found && !raw)', () => {
      expect(spinner.stop.mock.calls.length).toBe(0);
      return getDataClasses(false).then(() => {
        expect(spinner.stop.mock.calls.length).toBe(1);
      });
    });

    it('should not call spinner.stop (found && raw)', () => {
      expect(spinner.stop.mock.calls.length).toBe(0);
      return getDataClasses(true).then(() => {
        expect(spinner.stop.mock.calls.length).toBe(0);
      });
    });

    it('should call logger.log (found && !raw)', () => {
      expect(logger.log.mock.calls.length).toBe(0);
      return getDataClasses(false).then(() => {
        expect(logger.log.mock.calls.length).toBe(1);
      });
    });

    it('should call logger.log (found && raw)', () => {
      expect(logger.log.mock.calls.length).toBe(0);
      return getDataClasses(true).then(() => {
        expect(logger.log.mock.calls.length).toBe(1);
      });
    });
  });

  describe('not found', () => {
    beforeAll(() => {
      hibp.dataClasses = () => Promise.resolve(EMPTY_ARRAY);
    });

    it('should call spinner.start (notFound && !raw)', () => {
      getDataClasses(false);
      expect(spinner.start.mock.calls.length).toBe(1);
    });

    it('should not call spinner.start (notFound && raw)', () => {
      getDataClasses(true);
      expect(spinner.start.mock.calls.length).toBe(0);
    });

    it('should call spinner.stop (notFound && !raw)', () => {
      expect(spinner.stop.mock.calls.length).toBe(0);
      return getDataClasses(false).then(() => {
        expect(spinner.stop.mock.calls.length).toBe(1);
      });
    });

    it('should not call spinner.stop (notFound && raw)', () => {
      expect(spinner.stop.mock.calls.length).toBe(0);
      return getDataClasses(true).then(() => {
        expect(spinner.stop.mock.calls.length).toBe(0);
      });
    });

    it('should call logger.log (notFound && !raw)', () => {
      expect(logger.log.mock.calls.length).toBe(0);
      return getDataClasses(false).then(() => {
        expect(logger.log.mock.calls.length).toBe(1);
      });
    });

    it('should not call logger.log (notFound && raw)', () => {
      expect(logger.log.mock.calls.length).toBe(0);
      return getDataClasses(true).then(() => {
        expect(logger.log.mock.calls.length).toBe(0);
      });
    });
  });

  describe('error', () => {
    beforeAll(() => {
      hibp.dataClasses = () => Promise.reject(new Error(ERROR_MSG));
    });

    it('should call spinner.start (error && !raw)', () => {
      getDataClasses(false);
      expect(spinner.start.mock.calls.length).toBe(1);
    });

    it('should not call spinner.start (error && raw)', () => {
      getDataClasses(true);
      expect(spinner.start.mock.calls.length).toBe(0);
    });

    it('should call spinner.stop (error && !raw)', () => {
      expect(spinner.stop.mock.calls.length).toBe(0);
      return getDataClasses(false).then(() => {
        expect(spinner.stop.mock.calls.length).toBe(1);
      });
    });

    it('should not call spinner.stop (error && raw)', () => {
      expect(spinner.stop.mock.calls.length).toBe(0);
      return getDataClasses(true).then(() => {
        expect(spinner.stop.mock.calls.length).toBe(0);
      });
    });

    it('should call logger.error (error)', () => {
      expect(logger.error.mock.calls.length).toBe(0);
      return getDataClasses(false).then(() => {
        expect(logger.log.mock.calls.length).toBe(0);
        expect(logger.error.mock.calls.length).toBe(1);
      });
    });
  });
});

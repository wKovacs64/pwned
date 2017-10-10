import * as hibp from 'hibp';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import getPastes from '../../src/api/getPastes';
import { FOUND, OBJ_ARRAY, NOT_FOUND, ERROR, ERROR_MSG } from '../testData';

jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/spinner');

describe('api: getPastes', () => {
  beforeAll(() => {
    hibp.pasteAccount = (email) => {
      if (email === FOUND) {
        return Promise.resolve(OBJ_ARRAY);
      } else if (email === NOT_FOUND) {
        return Promise.resolve(null);
      } else if (email === ERROR) {
        return Promise.reject(new Error(ERROR_MSG));
      }
    };
  });

  beforeEach(() => {
    // global clearMocks Jest config option doesn't work on nested mocks
    logger.log.mockClear();
    logger.error.mockClear();
    spinner.start.mockClear();
    spinner.stop.mockClear();
  });

  it('should call spinner.start (!raw)', () => {
    getPastes(FOUND, false);
    expect(spinner.start).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.start (raw)', () => {
    getPastes(FOUND, true);
    expect(spinner.start).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return getPastes(FOUND, false).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return getPastes(FOUND, true).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return getPastes(FOUND, false).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return getPastes(FOUND, true).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return getPastes(NOT_FOUND, false).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return getPastes(NOT_FOUND, true).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(0);
    });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return getPastes(ERROR, false).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return getPastes(ERROR, true).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error).toHaveBeenCalledTimes(0);
    return getPastes(ERROR, false).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

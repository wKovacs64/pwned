import * as hibp from 'hibp';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import getBreaches from '../../src/api/getBreaches';
import {
  FOUND,
  OBJ_ARRAY,
  NOT_FOUND,
  EMPTY_ARRAY,
  ERROR,
  ERROR_MSG,
} from '../testData';

jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/spinner');

describe('api: getBreaches', () => {
  beforeAll(() => {
    hibp.breaches = (options = {}) => {
      if (options.domain === FOUND) {
        return Promise.resolve(OBJ_ARRAY);
      } else if (options.domain === NOT_FOUND) {
        return Promise.resolve(EMPTY_ARRAY);
      } else if (options.domain === ERROR) {
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
    getBreaches(FOUND, false);
    expect(spinner.start).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.start (raw)', () => {
    getBreaches(FOUND, true);
    expect(spinner.start).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return getBreaches(FOUND, false).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return getBreaches(FOUND, true).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return getBreaches(FOUND, false).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return getBreaches(FOUND, true).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return getBreaches(NOT_FOUND, false).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return getBreaches(NOT_FOUND, true).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(0);
    });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return getBreaches(ERROR, false).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return getBreaches(ERROR, true).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error).toHaveBeenCalledTimes(0);
    return getBreaches(ERROR, false).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

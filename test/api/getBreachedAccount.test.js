import * as hibp from 'hibp';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import getBreachedAccount from '../../src/api/getBreachedAccount';
import { FOUND, OBJ, NOT_FOUND, ERROR, ERROR_MSG, NONE } from '../testData';

jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/spinner');

describe('api: getBreachedAccount', () => {
  beforeAll(() => {
    hibp.breachedAccount = (account) => {
      if (account === FOUND) {
        return Promise.resolve(OBJ);
      } else if (account === NOT_FOUND) {
        return Promise.resolve(null);
      } else if (account === ERROR) {
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
    getBreachedAccount(NOT_FOUND, NONE, false, false);
    expect(spinner.start.mock.calls.length).toBe(1);
  });

  it('should not call spinner.start (raw)', () => {
    getBreachedAccount(NOT_FOUND, NONE, false, true);
    expect(spinner.start.mock.calls.length).toBe(0);
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop.mock.calls.length).toBe(0);
    return getBreachedAccount(NOT_FOUND, NONE, false, false).then(() => {
      expect(spinner.stop.mock.calls.length).toBe(1);
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop.mock.calls.length).toBe(0);
    return getBreachedAccount(NOT_FOUND, NONE, false, true).then(() => {
      expect(spinner.stop.mock.calls.length).toBe(0);
    });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log.mock.calls.length).toBe(0);
    return getBreachedAccount(FOUND, NONE, false, false).then(() => {
      expect(logger.log.mock.calls.length).toBe(1);
    });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log.mock.calls.length).toBe(0);
    return getBreachedAccount(FOUND, NONE, false, true).then(() => {
      expect(logger.log.mock.calls.length).toBe(1);
    });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log.mock.calls.length).toBe(0);
    return getBreachedAccount(NOT_FOUND, NONE, false, false).then(() => {
      expect(logger.log.mock.calls.length).toBe(1);
    });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(logger.log.mock.calls.length).toBe(0);
    return getBreachedAccount(NOT_FOUND, NONE, false, true).then(() => {
      expect(logger.log.mock.calls.length).toBe(0);
    });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop.mock.calls.length).toBe(0);
    return getBreachedAccount(ERROR, NONE, false, false).then(() => {
      expect(spinner.stop.mock.calls.length).toBe(1);
    });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop.mock.calls.length).toBe(0);
    return getBreachedAccount(ERROR, NONE, false, true).then(() => {
      expect(spinner.stop.mock.calls.length).toBe(0);
    });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error.mock.calls.length).toBe(0);
    return getBreachedAccount(ERROR, NONE, false, false).then(() => {
      expect(logger.log.mock.calls.length).toBe(0);
      expect(logger.error.mock.calls.length).toBe(1);
    });
  });
});

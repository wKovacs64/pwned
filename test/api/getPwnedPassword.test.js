import * as hibp from 'hibp';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import getPwnedPassword from '../../src/api/getPwnedPassword';
import { FOUND, NOT_FOUND, ERROR, ERROR_MSG } from '../testData';

jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/spinner');

describe('api: getPwnedPassword', () => {
  beforeAll(() => {
    hibp.pwnedPassword = (password) => {
      if (password === FOUND) {
        return Promise.resolve(true);
      } else if (password === NOT_FOUND) {
        return Promise.resolve(false);
      } else if (password === ERROR) {
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
    getPwnedPassword(NOT_FOUND, false, false);
    expect(spinner.start.mock.calls.length).toBe(1);
  });

  it('should not call spinner.start (raw)', () => {
    getPwnedPassword(NOT_FOUND, false, true);
    expect(spinner.start.mock.calls.length).toBe(0);
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop.mock.calls.length).toBe(0);
    return getPwnedPassword(NOT_FOUND, false, false).then(() => {
      expect(spinner.stop.mock.calls.length).toBe(1);
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop.mock.calls.length).toBe(0);
    return getPwnedPassword(NOT_FOUND, false, true).then(() => {
      expect(spinner.stop.mock.calls.length).toBe(0);
    });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log.mock.calls.length).toBe(0);
    return getPwnedPassword(FOUND, false, false).then(() => {
      expect(logger.log.mock.calls.length).toBe(1);
    });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log.mock.calls.length).toBe(0);
    return getPwnedPassword(FOUND, false, true).then(() => {
      expect(logger.log.mock.calls.length).toBe(1);
    });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log.mock.calls.length).toBe(0);
    return getPwnedPassword(NOT_FOUND, false, false).then(() => {
      expect(logger.log.mock.calls.length).toBe(1);
    });
  });

  it('should call logger.log (notFound && raw)', () => {
    expect(logger.log.mock.calls.length).toBe(0);
    return getPwnedPassword(NOT_FOUND, false, true).then(() => {
      expect(logger.log.mock.calls.length).toBe(1);
    });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop.mock.calls.length).toBe(0);
    return getPwnedPassword(ERROR, false, false).then(() => {
      expect(spinner.stop.mock.calls.length).toBe(1);
    });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop.mock.calls.length).toBe(0);
    return getPwnedPassword(ERROR, false, true).then(() => {
      expect(spinner.stop.mock.calls.length).toBe(0);
    });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error.mock.calls.length).toBe(0);
    return getPwnedPassword(ERROR, false, false).then(() => {
      expect(logger.log.mock.calls.length).toBe(0);
      expect(logger.error.mock.calls.length).toBe(1);
    });
  });
});

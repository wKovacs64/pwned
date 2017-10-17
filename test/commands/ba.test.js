import * as hibp from 'hibp';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import { handler as ba } from '../../src/commands/ba';
import { FOUND, OBJ, NOT_FOUND, ERROR, ERROR_MSG, NONE } from '../testData';

jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/spinner');

describe('command: ba', () => {
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
    ba({ account: NOT_FOUND, domainFilter: NONE, truncate: false, raw: false });
    expect(spinner.start).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.start (raw)', () => {
    ba({ account: NOT_FOUND, domainFilter: NONE, truncate: false, raw: true });
    expect(spinner.start).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return ba({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return ba({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: true,
    }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return ba({
      account: FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return ba({
      account: FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: true,
    }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return ba({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call logger.log (notFound && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return ba({
      account: NOT_FOUND,
      domainFilter: NONE,
      truncate: false,
      raw: true,
    }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(0);
    });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return ba({
      account: ERROR,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return ba({
      account: ERROR,
      domainFilter: NONE,
      truncate: false,
      raw: true,
    }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error).toHaveBeenCalledTimes(0);
    return ba({
      account: ERROR,
      domainFilter: NONE,
      truncate: false,
      raw: false,
    }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

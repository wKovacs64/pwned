import * as hibp from 'hibp';
import { FOUND, OBJ, NOT_FOUND, ERROR, ERROR_MSG, NONE } from '../../testData';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import { handler as ba } from './ba';

jest.mock('../utils/logger');
jest.mock('../utils/spinner');

describe('command: ba', () => {
  beforeAll(() => {
    hibp.breachedAccount = async (account) => {
      if (account === FOUND) {
        return OBJ;
      } else if (account === NOT_FOUND) {
        return null;
      } else if (account === ERROR) {
        throw new Error(ERROR_MSG);
      }
      throw new Error('Unexpected input!');
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

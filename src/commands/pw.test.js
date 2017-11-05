import * as hibp from 'hibp';
import { FOUND, NOT_FOUND, ERROR, ERROR_MSG } from '../../testData';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import { handler as pw } from './pw';

jest.mock('../utils/logger');
jest.mock('../utils/spinner');

describe('command: pw', () => {
  beforeAll(() => {
    hibp.pwnedPassword = async password => {
      if (password === FOUND) {
        return true;
      } else if (password === NOT_FOUND) {
        return false;
      } else if (password === ERROR) {
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
    pw({ password: NOT_FOUND, sha1: false, raw: false });
    expect(spinner.start).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.start (raw)', () => {
    pw({ password: NOT_FOUND, sha1: false, raw: true });
    expect(spinner.start).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pw({ password: NOT_FOUND, sha1: false, raw: false }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pw({ password: NOT_FOUND, sha1: false, raw: true }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return pw({ password: FOUND, sha1: false, raw: false }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return pw({ password: FOUND, sha1: false, raw: true }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return pw({ password: NOT_FOUND, sha1: false, raw: false }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (notFound && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return pw({ password: NOT_FOUND, sha1: false, raw: true }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pw({ password: ERROR, sha1: false, raw: false }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pw({ password: ERROR, sha1: false, raw: true }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error).toHaveBeenCalledTimes(0);
    return pw({ password: ERROR, sha1: false, raw: false }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

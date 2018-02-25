import * as hibp from 'hibp';
import { FOUND, NOT_FOUND, SUFFIXES, ERROR, ERROR_MSG } from '../../testData';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import { handler as pwr } from './pwr';

jest.mock('../utils/logger');
jest.mock('../utils/spinner');

describe('command: pwr', () => {
  beforeAll(() => {
    hibp.pwnedPasswordRange.mockImplementation(async prefix => {
      if (prefix !== ERROR) {
        return SUFFIXES;
      } else if (prefix === ERROR) {
        throw new Error(ERROR_MSG);
      }
      throw new Error('Unexpected input!');
    });
  });

  it('should call spinner.start (!raw)', () => {
    pwr({ password: FOUND, raw: false });
    expect(spinner.start).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.start (raw)', () => {
    pwr({ password: FOUND, raw: true });
    expect(spinner.start).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pwr({ password: FOUND, raw: false }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pwr({ password: FOUND, raw: true }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.log (found && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return pwr({ password: FOUND, raw: false }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (found && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return pwr({ password: FOUND, raw: true }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (notFound && !raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return pwr({ password: NOT_FOUND, raw: false }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logger.log (notFound && raw)', () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    return pwr({ password: NOT_FOUND, raw: true }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });

  it('should call spinner.stop (error && !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pwr({ prefix: ERROR, raw: false }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (error && raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pwr({ prefix: ERROR, raw: true }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  it('should call logger.error (error)', () => {
    expect(logger.error).toHaveBeenCalledTimes(0);
    return pwr({ prefix: ERROR, raw: false }).then(() => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});

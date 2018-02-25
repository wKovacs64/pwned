import { stripIndents } from 'common-tags';
import * as hibp from 'hibp';
import { PREFIX, ERROR, ERROR_MSG } from '../../testData';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import { handler as pwr } from './pwr';

jest.mock('../utils/logger');
jest.mock('../utils/spinner');

describe('command: pwr', () => {
  beforeAll(() => {
    hibp.pwnedPasswordRange.mockImplementation(async prefix => {
      if (prefix === PREFIX) {
        return stripIndents`
          0018A45C4D1DEF81644B54AB7F969B88D65:1
          00D4F6E8FA6EECAD2A3AA415EEC418D38EC:2
          011053FD0102E94D6AE2F8B83D76FAF94F6:1
          012A7CA357541F0AC487871FEEC1891C49C:2
          0136E006E24E7D152139815FB0FC6A50B15:2
        `;
      } else if (prefix === ERROR) {
        throw new Error(ERROR_MSG);
      }
      throw new Error('Unexpected input!');
    });
  });

  it('should call spinner.start (!raw)', () => {
    pwr({ prefix: PREFIX, raw: false });
    expect(spinner.start).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.start (raw)', () => {
    pwr({ prefix: PREFIX, raw: true });
    expect(spinner.start).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (non-error results, !raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pwr({ prefix: PREFIX, raw: false }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call spinner.stop (non-error results, raw)', () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    return pwr({ prefix: PREFIX, raw: true }).then(() => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
    });
  });

  // it('should call logger.log (found && !raw)', () => {
  //   expect(logger.log).toHaveBeenCalledTimes(0);
  //   return pwr({ prefix: PREFIX, raw: false }).then(() => {
  //     expect(logger.log).toHaveBeenCalledTimes(1);
  //   });
  // });

  // it('should call logger.log (found && raw)', () => {
  //   expect(logger.log).toHaveBeenCalledTimes(0);
  //   return pwr({ prefix: PREFIX, raw: true }).then(() => {
  //     expect(logger.log).toHaveBeenCalledTimes(1);
  //   });
  // });

  // it('should call logger.log (notFound && !raw)', () => {
  //   expect(logger.log).toHaveBeenCalledTimes(0);
  //   return pwr({ prefix: PREFIX, raw: false }).then(() => {
  //     expect(logger.log).toHaveBeenCalledTimes(1);
  //   });
  // });

  // it('should call logger.log (notFound && raw)', () => {
  //   expect(logger.log).toHaveBeenCalledTimes(0);
  //   return pwr({ prefix: PREFIX, raw: true }).then(() => {
  //     expect(logger.log).toHaveBeenCalledTimes(1);
  //   });
  // });

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

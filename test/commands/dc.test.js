import * as hibp from 'hibp';
import logger from '../../src/utils/logger';
import spinner from '../../src/utils/spinner';
import { handler as dc } from '../../src/commands/dc';
import { OBJ_ARRAY, EMPTY_ARRAY, ERROR_MSG } from '../testData';

jest.mock('../../src/utils/logger');
jest.mock('../../src/utils/spinner');

describe('command: dc', () => {
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
      dc({ raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('should not call spinner.start (found && raw)', () => {
      dc({ raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('should call spinner.stop (found && !raw)', () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      return dc({ raw: false }).then(() => {
        expect(spinner.stop).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call spinner.stop (found && raw)', () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      return dc({ raw: true }).then(() => {
        expect(spinner.stop).toHaveBeenCalledTimes(0);
      });
    });

    it('should call logger.log (found && !raw)', () => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      return dc({ raw: false }).then(() => {
        expect(logger.log).toHaveBeenCalledTimes(1);
      });
    });

    it('should call logger.log (found && raw)', () => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      return dc({ raw: true }).then(() => {
        expect(logger.log).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('not found', () => {
    beforeAll(() => {
      hibp.dataClasses = () => Promise.resolve(EMPTY_ARRAY);
    });

    it('should call spinner.start (notFound && !raw)', () => {
      dc({ raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('should not call spinner.start (notFound && raw)', () => {
      dc({ raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('should call spinner.stop (notFound && !raw)', () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      return dc({ raw: false }).then(() => {
        expect(spinner.stop).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call spinner.stop (notFound && raw)', () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      return dc({ raw: true }).then(() => {
        expect(spinner.stop).toHaveBeenCalledTimes(0);
      });
    });

    it('should call logger.log (notFound && !raw)', () => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      return dc({ raw: false }).then(() => {
        expect(logger.log).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call logger.log (notFound && raw)', () => {
      expect(logger.log).toHaveBeenCalledTimes(0);
      return dc({ raw: true }).then(() => {
        expect(logger.log).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('error', () => {
    beforeAll(() => {
      hibp.dataClasses = () => Promise.reject(new Error(ERROR_MSG));
    });

    it('should call spinner.start (error && !raw)', () => {
      dc({ raw: false });
      expect(spinner.start).toHaveBeenCalledTimes(1);
    });

    it('should not call spinner.start (error && raw)', () => {
      dc({ raw: true });
      expect(spinner.start).toHaveBeenCalledTimes(0);
    });

    it('should call spinner.stop (error && !raw)', () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      return dc({ raw: false }).then(() => {
        expect(spinner.stop).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call spinner.stop (error && raw)', () => {
      expect(spinner.stop).toHaveBeenCalledTimes(0);
      return dc({ raw: true }).then(() => {
        expect(spinner.stop).toHaveBeenCalledTimes(0);
      });
    });

    it('should call logger.error (error)', () => {
      expect(logger.error).toHaveBeenCalledTimes(0);
      return dc({ raw: false }).then(() => {
        expect(logger.log).toHaveBeenCalledTimes(0);
        expect(logger.error).toHaveBeenCalledTimes(1);
      });
    });
  });
});

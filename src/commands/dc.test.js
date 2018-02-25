import * as hibp from 'hibp';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { OBJ_ARRAY, EMPTY_ARRAY, ERROR_MSG } from 'fixtures';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import { handler as dc } from './dc';

jest.mock('../utils/logger');
jest.mock('../utils/spinner');

describe('command: dc', () => {
  describe('found', () => {
    beforeAll(() => {
      hibp.dataClasses.mockImplementation(async () => OBJ_ARRAY);
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
      hibp.dataClasses.mockImplementation(() => Promise.resolve(EMPTY_ARRAY));
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
      hibp.dataClasses.mockImplementation(() =>
        Promise.reject(new Error(ERROR_MSG)),
      );
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

import * as hibp from 'hibp';
import {
  FOUND,
  OBJ_ARRAY,
  NOT_FOUND,
  ERROR,
  ERROR_MSG,
} from '../../test/fixtures';
import logger from '../utils/logger';
import spinner from '../utils/spinner';
import { handler as pa } from './pa';

jest.mock('../utils/logger');
jest.mock('../utils/spinner');

describe('command: pa', () => {
  beforeAll(() => {
    hibp.pasteAccount.mockImplementation(async email => {
      if (email === FOUND) {
        return OBJ_ARRAY;
      } else if (email === NOT_FOUND) {
        return null;
      } else if (email === ERROR) {
        throw new Error(ERROR_MSG);
      }
      throw new Error('Unexpected input!');
    });
  });

  it('should call spinner.start (!raw)', async () => {
    expect(spinner.start).toHaveBeenCalledTimes(0);
    await pa({ email: FOUND, raw: false });
    expect(spinner.start).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.start (raw)', async () => {
    await pa({ email: FOUND, raw: true });
    expect(spinner.start).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (non-error results, !raw)', async () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    await pa({ email: FOUND, raw: false });
    expect(spinner.stop).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.stop (non-error results, raw)', async () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    await pa({ email: FOUND, raw: true });
    expect(spinner.stop).toHaveBeenCalledTimes(0);
  });

  it('should call logger.log (found && !raw)', async () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    await pa({ email: FOUND, raw: false });
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it('should call logger.log (found && raw)', async () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    await pa({ email: FOUND, raw: true });
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it('should call logger.log (notFound && !raw)', async () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    await pa({ email: NOT_FOUND, raw: false });
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it('should not call logger.log (notFound && raw)', async () => {
    expect(logger.log).toHaveBeenCalledTimes(0);
    await pa({ email: NOT_FOUND, raw: true });
    expect(logger.log).toHaveBeenCalledTimes(0);
  });

  it('should call spinner.stop (error && !raw)', async () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    await pa({ email: ERROR, raw: false });
    expect(spinner.stop).toHaveBeenCalledTimes(1);
  });

  it('should not call spinner.stop (error && raw)', async () => {
    expect(spinner.stop).toHaveBeenCalledTimes(0);
    await pa({ email: ERROR, raw: true });
    expect(spinner.stop).toHaveBeenCalledTimes(0);
  });

  it('should call logger.error (error)', async () => {
    expect(logger.error).toHaveBeenCalledTimes(0);
    await pa({ email: ERROR, raw: false });
    expect(logger.log).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
